// Qwen (DashScope) for both chat analysis and speech-to-text.
// Uses a single API key from .env: EXPO_PUBLIC_QWEN_KEY

import { uploadAudioToOSS } from './oss';
import type { PatientContext } from './profileStore';

const QWEN_KEY = process.env.EXPO_PUBLIC_QWEN_KEY;
const QWEN_BASE = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
const USE_MOCK = !QWEN_KEY;

// Surface mock/live mode on every JS bundle load so it's obvious in the terminal
// when the app is silently running on canned data (e.g. stale Metro bundle after
// .env was updated without a full expo restart).
// eslint-disable-next-line no-console
console.log(
  USE_MOCK
    ? '[openai] USE_MOCK=true — EXPO_PUBLIC_QWEN_KEY is not set in this bundle. All analysis returns hardcoded demo data. Restart expo with `npx expo start --clear` after editing .env.'
    : '[openai] USE_MOCK=false — live Qwen analysis enabled.'
);

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

const MOCK_CLOCK_REPORTS: Record<string, AssessmentReport> = {
  en: {
    score: 88,
    riskLevel: 'low',
    headline: 'A confidently planned clock — your visuospatial reasoning is in great shape.',
    dimensions: { memory: 90, language: 86, attention: 88, executive: 88 },
    keywords: [
      'Closed circular contour',
      'All 12 numbers present',
      'Even spacing',
      'Clear hour hand',
      'Minute hand toward 2',
      'Symmetric layout',
    ],
    analysis:
      'Your contour is closed and circular without flattening, and all twelve numerals are present and legible (a marker of intact semantic recall). The numbers are evenly spaced without crowding (good visuospatial planning). The hour hand correctly points near the 11 and the minute hand points to the 2 — this matters because the spoken instruction "ten past eleven" tempts many people to draw the minute hand at the 10 instead, so resisting that pull is a real win for executive function and inhibitory control.',
    recommendations: [
      'Keep this drawing as a baseline and try the test again next month — small week-to-week variation is normal.',
      'Pair the clock test with the Stroop training game in HippoCare to keep your inhibitory control sharp.',
      'Mention this as a healthy baseline at your next routine checkup so it can be on file.',
    ],
  },
  zh: {
    score: 88,
    riskLevel: 'low',
    headline: '一幅规划清晰的时钟——您的视觉空间推理能力非常好。',
    dimensions: { memory: 90, language: 86, attention: 88, executive: 88 },
    keywords: ['圆形闭合', '12个数字齐全', '间距均匀', '时针清晰', '分针指向2', '布局对称'],
    analysis:
      '钟面轮廓闭合且呈圆形，没有变扁；十二个数字全部齐全且清晰可读（语义记忆功能良好）。数字间距均匀，没有挤在一侧（视觉空间规划能力良好）。时针正确指向接近11的位置，分针指向2——这一点很关键，因为"11点10分"的口头指令会让很多人下意识把分针画到10的位置，能克服这种拉力是执行功能和抑制控制能力的真实体现。',
    recommendations: [
      '把这次的画作当作基线，下个月再做一次——每周之间小幅波动是正常的。',
      '在 HippoCare 中把画钟测试和 Stroop 训练游戏搭配练习，保持抑制控制能力。',
      '在下次常规体检时提一下这个健康基线，可以作为档案记录。',
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

// ---------------------------------------------------------------------------
// Patient context block — injected into the user message of both AI graders
// when a non-empty PatientContext is provided. The block is purely additive
// and falls back to '' so existing demo / mock flows are unaffected.
// ---------------------------------------------------------------------------

const SEX_LABELS_EN: Record<NonNullable<PatientContext['sex']>, string> = {
  male: 'male',
  female: 'female',
  unspecified: 'not disclosed',
};
const SEX_LABELS_ZH: Record<NonNullable<PatientContext['sex']>, string> = {
  male: '男',
  female: '女',
  unspecified: '未透露',
};

const HAND_LABELS_EN: Record<NonNullable<PatientContext['handedness']>, string> = {
  right: 'right-handed',
  left: 'left-handed',
  ambidextrous: 'ambidextrous',
};
const HAND_LABELS_ZH: Record<NonNullable<PatientContext['handedness']>, string> = {
  right: '右利手',
  left: '左利手',
  ambidextrous: '左右手均可',
};

const FH_LABELS_EN: Record<NonNullable<PatientContext['familyHistoryDementia']>, string> = {
  yes: 'yes — has at least one immediate family member diagnosed with dementia',
  no: 'no known family history of dementia',
  unsure: 'unsure / not known',
};
const FH_LABELS_ZH: Record<NonNullable<PatientContext['familyHistoryDementia']>, string> = {
  yes: '有——至少一位直系亲属曾被确诊为失智症',
  no: '无已知的失智症家族史',
  unsure: '不确定',
};

function isLowEducationYears(years?: number): boolean {
  // MoCA convention: ≤12 years of formal schooling earns the +1 adjustment.
  return typeof years === 'number' && years <= 12;
}

function formatEducationYearsEn(years: number): string {
  if (years <= 0) return 'no formal schooling (0 years)';
  if (years >= 21) return '20+ years of formal schooling';
  return `${years} year${years === 1 ? '' : 's'} of formal schooling`;
}

function formatEducationYearsZh(years: number): string {
  if (years <= 0) return '未受过正规教育（0 年）';
  if (years >= 21) return '20 年以上学校教育';
  return `${years} 年学校教育`;
}

export function buildPatientPromptBlock(
  patient: PatientContext | undefined,
  locale: 'en' | 'zh',
): string {
  if (!patient) return '';
  const lines: string[] = [];
  if (locale === 'zh') {
    if (patient.age != null) lines.push(`- 年龄：${patient.age} 岁`);
    if (patient.sex) lines.push(`- 性别：${SEX_LABELS_ZH[patient.sex]}`);
    if (patient.educationYears != null) {
      const adj = isLowEducationYears(patient.educationYears)
        ? '（≤12 年学校教育，请按 MoCA 惯例在最终分数上 +1 进行调整）'
        : '';
      lines.push(`- 受教育程度：${formatEducationYearsZh(patient.educationYears)}${adj}`);
    }
    if (patient.handedness) lines.push(`- 利手：${HAND_LABELS_ZH[patient.handedness]}`);
    if (patient.familyHistoryDementia)
      lines.push(`- 失智症家族史：${FH_LABELS_ZH[patient.familyHistoryDementia]}`);
    if (lines.length === 0) return '';
    return `\n\n受测者背景信息（请用于校准你的解读，不要在回复中逐字复述）：\n${lines.join('\n')}`;
  }
  if (patient.age != null) lines.push(`- Age: ${patient.age}`);
  if (patient.sex) lines.push(`- Sex: ${SEX_LABELS_EN[patient.sex]}`);
  if (patient.educationYears != null) {
    const adj = isLowEducationYears(patient.educationYears)
      ? ' — apply the standard MoCA +1 education adjustment (≤12 years of formal schooling)'
      : '';
    lines.push(`- Education: ${formatEducationYearsEn(patient.educationYears)}${adj}`);
  }
  if (patient.handedness) lines.push(`- Handedness: ${HAND_LABELS_EN[patient.handedness]}`);
  if (patient.familyHistoryDementia)
    lines.push(`- Family history of dementia: ${FH_LABELS_EN[patient.familyHistoryDementia]}`);
  if (lines.length === 0) return '';
  return `\n\nPatient context (use this to calibrate your interpretation; do not echo it back literally to the user):\n${lines.join('\n')}`;
}

const VOICE_PATIENT_CALIBRATION_EN = `

Patient calibration rules (apply ONLY when patient context is supplied):
- Calibrate vocabulary richness, sentence complexity, and word-finding expectations against the patient's age and education level. Do NOT penalize plain or informal vocabulary in patients with lower education — score them against same-education norms, not against the most articulate possible speaker.
- If the patient's education is ≤12 years of formal schooling, add the standard MoCA +1 education adjustment to the final overall score (cap at 100).
- Family history of dementia, when present, may be mentioned ONCE in the recommendations as a gentle reason to keep a regular baseline. Never mention family history in the analysis field, never use alarming language, and never imply that family history changes the current cognitive findings.`;

const VOICE_PATIENT_CALIBRATION_ZH = `

受测者校准规则（仅在提供受测者背景信息时适用）：
- 请根据受测者的年龄和受教育程度来校准词汇丰富度、句法复杂度以及找词能力的预期。对于受教育程度较低的受测者，不要因其用词朴实或口语化而扣分——应与同等受教育水平的常模比较，而不是与最优表达者比较。
- 如果受教育程度 ≤12 年正规学校教育，请按 MoCA 标准在最终总分上 +1 分进行调整（上限 100 分）。
- 如有失智症家族史，可在 recommendations 中温和地提及一次，建议保持定期基准评估。绝不要在 analysis 字段中提到家族史，不要使用令人担忧的措辞，也不要暗示家族史改变了当前的认知发现。`;

const CLOCK_PATIENT_CALIBRATION_EN = `

Patient calibration rules (apply ONLY when patient context is supplied):
- Treat left-handed drawers' starting-side bias and stroke direction as a normal variant. Do NOT penalize left-handers for crowding on the right side or for any minor asymmetry that is consistent with handedness — do NOT label this as visuospatial neglect.
- Calibrate stroke smoothness and line legibility against age and education. Older patients and patients with little formal schooling may produce shakier or less geometrically perfect strokes that are clinically insignificant — score the cognitive content (numbering, sequencing, hand placement, inhibitory control), not the artistic quality.
- If the patient's education is ≤12 years of formal schooling, add the standard MoCA +1 education adjustment to the final overall score (cap at 100).
- Family history of dementia, when present, may be mentioned ONCE in the recommendations as a gentle reason to keep a regular baseline. Never mention family history in the analysis field, never use alarming language.`;

const CLOCK_PATIENT_CALIBRATION_ZH = `

受测者校准规则（仅在提供受测者背景信息时适用）：
- 对于左利手的受测者，起笔方向偏一侧、笔画方向不同等都属于正常变异。不要因为左利手在右侧拥挤或与利手一致的轻微不对称而扣分——更不要将其判定为视觉空间忽略。
- 请根据年龄和受教育程度来校准笔触平滑度和线条工整度。年龄较大或受教育程度较低的受测者，笔触可能略显抖动或不够精确，这在临床上并无意义——评分应聚焦于认知内容（数字书写、序列排列、指针位置、抑制控制），而不是美术水平。
- 如果受教育程度 ≤12 年正规学校教育，请按 MoCA 标准在最终总分上 +1 分进行调整（上限 100 分）。
- 如有失智症家族史，可在 recommendations 中温和地提及一次，建议保持定期基准评估。绝不要在 analysis 字段中提到家族史，也不要使用令人担忧的措辞。`;

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
  locale: 'en' | 'zh' = 'en',
  patient?: PatientContext
): Promise<AssessmentReport> {
  if (USE_MOCK) {
    await delay(1400);
    return MOCK_REPORTS[locale] ?? MOCK_REPORTS.en;
  }
  assertQwenKey();

  const langInstruction = locale === 'zh'
    ? '\n\n重要：你必须用简体中文回复。所有文本字段（headline、analysis、recommendations、keywords）都必须使用简体中文。'
    : '';

  const patientCalibration = patient
    ? locale === 'zh'
      ? VOICE_PATIENT_CALIBRATION_ZH
      : VOICE_PATIENT_CALIBRATION_EN
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
Headline is ONE striking, warm sentence that captures the strongest positive signal.${patientCalibration}${langInstruction}`;

  const patientBlock = buildPatientPromptBlock(patient, locale);

  const user = `The user was prompted: "${promptContext}"

Their transcript:
"""
${transcript}
"""${patientBlock}

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

/**
 * Score a Clock Drawing Test by sending the captured PNG (already uploaded
 * to OSS) to Qwen's vision model. Returns an AssessmentReport in the same
 * shape as analyzeAssessment so the existing report screen and history list
 * can render it without modification.
 */
export async function analyzeClockDrawing(
  imageUrl: string,
  locale: 'en' | 'zh' = 'en',
  patient?: PatientContext
): Promise<AssessmentReport> {
  if (USE_MOCK) {
    console.log('[analyzeClockDrawing] Returning MOCK report (QWEN key missing)');
    await delay(1400);
    return MOCK_CLOCK_REPORTS[locale] ?? MOCK_CLOCK_REPORTS.en;
  }
  assertQwenKey();
  console.log('[analyzeClockDrawing] Calling Qwen vision on', imageUrl);

  const langInstruction =
    locale === 'zh'
      ? '\n\n重要：你必须用简体中文回复。所有文本字段（headline、analysis、recommendations、keywords）都必须使用简体中文。'
      : '';

  const patientCalibration = patient
    ? locale === 'zh'
      ? CLOCK_PATIENT_CALIBRATION_ZH
      : CLOCK_PATIENT_CALIBRATION_EN
    : '';

  const system = `You are an experienced cognitive-health clinician scoring a Clock Drawing Test (CDT) for an elderly-care app.
You evaluate hand-drawn clocks using clinically validated rubrics — anchor your judgment on the Sunderland 10-point scale and Rouleau qualitative criteria. Score ONLY what is actually drawn in the image. Never assume marks that are not present and never invent details. Do not inflate scores to reassure the patient — clinical honesty is more helpful than false comfort.

Evaluate four facets, mapped into the report's dimensions:
- memory      → recall of clock structure (closed circular contour, presence of all 12 numerals)
- language    → numerical symbols are correct, legible, and free of perseveration or substitution
- attention   → number sequencing, even spacing, no omissions or crowding to one side
- executive   → visuospatial planning, hand placement, hand-length ratio, AND inhibitory control on the 11:10 trap

CRITICAL — the 11:10 inhibitory trap: the patient was instructed to set the hands to "10 past 11". The CORRECT minute-hand position is at the 2 (because "10 minutes past" = 10 minutes × 6° = 60° from the top = the 2 position). A common executive-function failure called "stimulus-bound response" causes patients to point the minute hand at the 10 instead — penalize this heavily in the executive dimension.

SCORING ANCHORS (use these as hard floors — do not drift upward):
- 90-100: Closed circular contour, ALL 12 numerals present and correctly ordered, even spacing, both hands drawn with correct length ratio, hour hand at 11, minute hand at 2. A clean, unambiguous clock.
- 80-89: Minor imperfections only — slightly uneven spacing OR one numeral slightly misplaced OR hand length ratio slightly off. Structure and all 12 numbers still fully intact. Hands still correctly set to 11:10.
- 70-79: Closed circle, but 1-3 numerals missing/misplaced/duplicated, OR hands partially wrong (one hand missing or wrong position), OR noticeable crowding/spacing errors.
- 60-69: Circle present but distorted, 4+ numerals missing or wrong, OR the 11:10 inhibitory trap failed (minute hand on the 10), OR hands missing entirely.
- 40-59: Circle poorly formed or open, most numerals missing/wrong, severe spatial disorganization, or obvious perseveration.
- 0-39: No recognizable clock face, scribble, blank, or unrelated drawing.

Do NOT score above 80 unless the drawing is substantially intact (closed circle AND at least 10 of 12 numerals AND both hands clearly present). When uncertain between two adjacent bands, pick the LOWER band. Do NOT guess or hallucinate missing elements.

Return a JSON report. You are NOT diagnosing — never use words like "diagnosis", "dementia", or "Alzheimer's". Scores are 0-100 where higher is better. Convert any internal Sunderland 0-10 score to this scale (×10).

Risk levels (use these cutoffs — apply mechanically from the score):
- "low"      → score 85-100 (substantially intact clock)
- "moderate" → score 60-84  (clear imperfections worth noting)
- "elevated" → score below 60 (significant impairment in the drawing)

Field guidance:
- headline: ONE plain sentence that honestly describes the drawing's most defining feature — positive if the clock is intact, neutral or concerned if it is not. Do not force a positive framing.
- analysis: 3-5 plain-language sentences naming BOTH what is intact AND what is missing or wrong. Include the clinical reason in parentheses (e.g. "the minute hand points at the 10 instead of the 2 — this is a common executive-function challenge called stimulus-bound response"). Be specific about which numerals and hands you actually see.
- recommendations: exactly 3 actionable next steps. If riskLevel is "moderate" or "elevated", the FIRST recommendation must encourage a professional follow-up screening.
- keywords: 5-10 short clinical observation phrases extracted from what you see in the drawing (e.g. "Closed circle", "12 numbers present", "Even spacing", "Hour hand long", "Minute hand on 10", "Missing 7 and 8").${patientCalibration}${langInstruction}`;

  const patientBlock = buildPatientPromptBlock(patient, locale);

  const user = `This is a Clock Drawing Test. The patient was instructed to draw a clock face with all the numbers and set the hands to 10 past 11 (11:10).${patientBlock}

Examine the drawing carefully and return ONLY valid JSON matching this exact shape:
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
      model: 'qwen-vl-max-latest',
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: user },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Qwen clock analysis failed (${res.status}): ${txt}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content ?? '{}';
  // Vision models sometimes wrap JSON in ```json fences — strip them defensively.
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
  const parsed = JSON.parse(cleaned) as AssessmentReport;
  console.log(
    `[analyzeClockDrawing] Qwen returned score=${parsed.score} risk=${parsed.riskLevel}`
  );
  return parsed;
}
