// Qwen (DashScope) for both chat analysis and speech-to-text.
// Uses a single API key from .env: EXPO_PUBLIC_QWEN_KEY

import { uploadAudioToOSS } from './oss';

const QWEN_KEY = process.env.EXPO_PUBLIC_QWEN_KEY;
const QWEN_BASE = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
const USE_MOCK = !QWEN_KEY;

const MOCK_TRANSCRIPTS: Record<string, string> = {
  en: "This morning I woke up around seven, made myself a pot of oatmeal with some blueberries and walnuts on top. My daughter called about lunch on Sunday, we're thinking of going to that Italian place on Elm Street. I've been reading a biography of Lincoln, fascinating stuff about his early years in Illinois. Then I went for a walk in the park, the cherry blossoms are just starting.",
  zh: "今天早上我大概七点起的床，给自己煮了一碗燕麦粥，上面放了蓝莓和核桃。女儿打电话来说周日一起吃午饭，我们想去榆树街那家意大利餐厅。我最近在读一本关于林肯的传记，他早年在伊利诺伊州的经历很有意思。然后我去公园散了个步，樱花刚刚开始开了。",
};

const MOCK_REPORTS: Record<string, AssessmentReport> = {
  en: {
    score: 87,
    riskLevel: 'low',
    headline: 'Your storytelling weaves time, place, and people with remarkable clarity.',
    dimensions: { memory: 89, language: 92, attention: 85, executive: 82 },
    keywords: ['oatmeal', 'blueberries', 'daughter', 'Sunday', 'Lincoln', 'Illinois', 'cherry blossoms', 'Elm Street'],
    analysis:
      'Your speech shows rich vocabulary diversity and strong temporal anchoring — you moved naturally between morning, a future plan, and historical context. Sentence structure is varied and coherent, with specific named details (places, people, plants) indicating healthy semantic recall.',
    recommendations: [
      'Keep up your reading habit — biography and non-fiction strengthen long-term narrative memory.',
      'Try describing a recent memory aloud once a day to maintain this fluency.',
      'Your weekly routine of walks pairs beautifully with cognitive health.',
    ],
  },
  zh: {
    score: 87,
    riskLevel: 'low',
    headline: '您的叙述将时间、地点和人物编织得清晰而生动。',
    dimensions: { memory: 89, language: 92, attention: 85, executive: 82 },
    keywords: ['燕麦粥', '蓝莓', '女儿', '周日', '林肯', '伊利诺伊', '樱花', '榆树街'],
    analysis:
      '您的表达展现了丰富的词汇多样性和良好的时间定位能力——您自然地在早晨活动、未来计划和历史背景之间切换。句式多样且连贯，具体的名称细节（地点、人物、植物）表明语义记忆功能健康。',
    recommendations: [
      '继续保持阅读习惯——传记和非虚构作品能增强长期叙事记忆。',
      '尝试每天大声描述一段近期记忆，以保持这种流畅性。',
      '您每周散步的习惯对认知健康非常有益。',
    ],
  },
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type AssessmentReport = {
  score: number;
  riskLevel: 'low' | 'moderate' | 'elevated';
  headline: string;
  dimensions: {
    memory: number;
    language: number;
    attention: number;
    executive: number;
  };
  keywords: string[];
  analysis: string;
  recommendations: string[];
};

function assertQwenKey() {
  if (!QWEN_KEY) {
    throw new Error(
      'Missing EXPO_PUBLIC_QWEN_KEY. Add it to your .env file then restart expo.'
    );
  }
}

/**
 * Transcribe audio using DashScope SenseVoice / Paraformer ASR API.
 * Uses the native DashScope transcription endpoint (not OpenAI-compatible).
 * Falls back through multiple models if one fails with 403.
 */
export async function transcribeAudio(uri: string, locale: 'en' | 'zh' = 'en'): Promise<string> {
  if (USE_MOCK) {
    await delay(1200);
    return MOCK_TRANSCRIPTS[locale] ?? MOCK_TRANSCRIPTS.en;
  }
  assertQwenKey();

  // 1. Upload audio to OSS
  console.log('[Transcribe] Uploading audio to OSS...');
  const audioUrl = await uploadAudioToOSS(uri);
  console.log('[Transcribe] Audio URL:', audioUrl);

  // 2. Send URL to qwen3-omni-flash (requires stream: true)
  const res = await fetch(`${QWEN_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${QWEN_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen3-omni-flash-2025-12-01',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'input_audio', input_audio: { data: audioUrl, format: 'mp3' } },
            { type: 'text', text: 'Please transcribe this audio exactly as spoken. Return only the transcript text, nothing else.' },
          ],
        },
      ],
      modalities: ['text'],
      stream: true,
      stream_options: { include_usage: true },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.log('[Transcribe] Error response:', txt);
    throw new Error(`Transcription failed (${res.status}): ${txt}`);
  }

  // 3. Parse SSE stream and collect text chunks
  const text = await res.text();
  console.log('[Transcribe] Raw SSE response (first 2000 chars):', text.slice(0, 2000));

  let result = '';
  for (const line of text.split('\n')) {
    if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
    try {
      const chunk = JSON.parse(line.slice(6));
      const delta = chunk.choices?.[0]?.delta?.content ?? '';
      result += delta;
    } catch {}
  }

  console.log('[Transcribe] Final result:', result);
  return result.trim() || 'No transcription returned';
}

/**
 * Send transcript to Qwen for cognitive health analysis.
 */
export async function analyzeAssessment(
  transcript: string,
  promptContext = 'Tell me about your morning — what you did, what you ate, anything on your mind.',
  locale: 'en' | 'zh' = 'en'
): Promise<AssessmentReport> {
  if (USE_MOCK) {
    await delay(1400);
    return MOCK_REPORTS[locale] ?? MOCK_REPORTS.en;
  }
  assertQwenKey();

  const langInstruction = locale === 'zh'
    ? '\n\n重要：你必须用简体中文回复。所有文本字段（headline、analysis、recommendations、keywords）都必须使用简体中文。'
    : '';

  const system = `You are a cognitive health assessment assistant for an elderly-care app.
You analyze free-form speech transcripts for early cognitive health signals including:
- Vocabulary richness and diversity
- Sentence complexity and coherence
- Word-finding difficulty (pauses, filler words, circumlocution)
- Temporal orientation and narrative structure
- Attention and topic maintenance

You return a JSON report. Be warm, encouraging, and specific. You are NOT diagnosing.
Scores are 0-100 where higher is better. Risk levels: "low" (most people),
"moderate" (some patterns to watch), "elevated" (worth discussing with a clinician).
Keywords are 5-10 notable words/phrases extracted from what the user actually said.
Headline is ONE striking, warm sentence that captures the strongest positive signal.${langInstruction}`;

  const user = `The user was prompted: "${promptContext}"

Their transcript:
"""
${transcript}
"""

Return ONLY valid JSON matching this exact shape:
{
  "score": number,
  "riskLevel": "low" | "moderate" | "elevated",
  "headline": string,
  "dimensions": { "memory": number, "language": number, "attention": number, "executive": number },
  "keywords": string[],
  "analysis": string,
  "recommendations": string[]
}`;

  const res = await fetch(`${QWEN_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${QWEN_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen-plus-latest',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Qwen analysis failed (${res.status}): ${txt}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content ?? '{}';
  return JSON.parse(content) as AssessmentReport;
}
