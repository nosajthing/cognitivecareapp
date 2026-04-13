// Rule-based scoring for the 11-item Cognitive Decline Screening Checklist
// (认知功能下降初步筛查问题清单).
//
// This is a deterministic, offline scorer — no AI call, no network. It maps
// the 11 yes/no/sometimes answers into the same `AssessmentReport` shape used
// by the voice and clock assessments so the existing report screen + history
// list can render the result without changes.
//
// Source: clinical reference checklist provided by the product team.

import type { AssessmentReport } from './openai';

export type QuestionAnswer = 'yes' | 'no' | 'sometimes';

export const QUESTION_COUNT = 11;

// Q2 asks "is your old memory still clear?" — answering NO is the symptom.
// All other questions are normal-coded ('yes' = symptom present).
const REVERSE_CODED = new Set<number>([2]);

// Key questions called out in the source scoring guide:
//   Q5/6/7/10  → daily living impact (must prioritize evaluation)
//   Q8         → behavior / personality / mood changes
//   Q11        → smell loss (early Parkinson / Alzheimer marker)
const DAILY_LIVING_QS = [5, 6, 7, 10] as const;
const BEHAVIOR_Q = 8;
const SMELL_Q = 11;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Whether the given 1-indexed question is showing a symptom signal for the
 * given answer. Handles reverse-coding for Q2.
 */
function isSymptomYes(idx1: number, ans: QuestionAnswer): boolean {
  if (REVERSE_CODED.has(idx1)) return ans === 'no';
  return ans === 'yes';
}

export type QuestionnaireFlags = {
  symptomYesCount: number;
  sometimesCount: number;
  daily: boolean;
  behavior: boolean;
  smell: boolean;
};

function computeFlags(answers: QuestionAnswer[]): QuestionnaireFlags {
  let symptomYesCount = 0;
  let sometimesCount = 0;
  for (let i = 0; i < answers.length; i++) {
    const idx1 = i + 1;
    const ans = answers[i];
    if (isSymptomYes(idx1, ans)) symptomYesCount++;
    if (ans === 'sometimes') sometimesCount++;
  }
  const daily = DAILY_LIVING_QS.some((i) => isSymptomYes(i, answers[i - 1]));
  const behavior = isSymptomYes(BEHAVIOR_Q, answers[BEHAVIOR_Q - 1]);
  const smell = isSymptomYes(SMELL_Q, answers[SMELL_Q - 1]);
  return { symptomYesCount, sometimesCount, daily, behavior, smell };
}

function dimScore(qs: number[], answers: QuestionAnswer[]): number {
  let score = 100;
  for (const idx1 of qs) {
    const ans = answers[idx1 - 1];
    if (isSymptomYes(idx1, ans)) score -= 25;
    else if (ans === 'sometimes') score -= 10;
  }
  return clamp(Math.round(score), 0, 100);
}

// Loose t-callback type so callers don't have to import TranslationKeys.
// All keys passed in are added to lib/i18n.tsx in both en and zh dicts.
type TFn = (key: any, vars?: Record<string, string | number>) => string;

export function scoreQuestionnaire(
  answers: QuestionAnswer[],
  t: TFn,
): { report: AssessmentReport; flags: QuestionnaireFlags } {
  const flags = computeFlags(answers);
  const { symptomYesCount, sometimesCount, daily, behavior, smell } = flags;

  // Overall score: start at 100, subtract 8 per symptom-yes, 3 per "sometimes".
  const score = clamp(
    Math.round(100 - symptomYesCount * 8 - sometimesCount * 3),
    0,
    100,
  );

  // Risk level. Daily-living and smell flags are clinically prioritized in
  // the source guide, so they push to elevated even with a single yes.
  let riskLevel: AssessmentReport['riskLevel'];
  if (symptomYesCount >= 3 || daily || smell) {
    riskLevel = 'elevated';
  } else if (symptomYesCount >= 1 || behavior) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'low';
  }

  const dimensions = {
    memory: dimScore([1, 2, 3], answers),
    language: dimScore([4], answers),
    attention: dimScore([5, 9], answers),
    executive: dimScore([6, 7, 10], answers),
  };

  // Headline: one of three risk-level templates.
  const headline =
    riskLevel === 'elevated'
      ? t('qHeadlineElevated')
      : riskLevel === 'moderate'
        ? t('qHeadlineModerate')
        : t('qHeadlineLow');

  // Analysis: count sentence + flag-specific addenda.
  const analysisParts: string[] = [];
  if (symptomYesCount === 0) {
    analysisParts.push(t('qAnalysisLow'));
  } else {
    analysisParts.push(t('qAnalysisYesCount', { count: symptomYesCount }));
  }
  if (daily) analysisParts.push(t('qAnalysisFlagDaily'));
  if (behavior) analysisParts.push(t('qAnalysisFlagBehavior'));
  if (smell) analysisParts.push(t('qAnalysisFlagSmell'));
  const analysis = analysisParts.join(' ');

  // Recommendations (1–4 items, ordered most-actionable first).
  const recommendations: string[] = [];
  if (riskLevel === 'elevated') recommendations.push(t('qRecSeeNeurology'));
  if (daily) recommendations.push(t('qRecDailyLiving'));
  if (behavior) recommendations.push(t('qRecBehavior'));
  if (smell) recommendations.push(t('qRecSmell'));
  recommendations.push(t('qRecObserve'));

  // Keywords: only the flag categories that fired (rendered as pills on the
  // existing report screen). Empty array hides the keywords card entirely.
  const keywords: string[] = [];
  if (daily) keywords.push(t('qFlagDaily'));
  if (behavior) keywords.push(t('qFlagBehavior'));
  if (smell) keywords.push(t('qFlagSmell'));

  const report: AssessmentReport = {
    score,
    riskLevel,
    headline,
    dimensions,
    keywords,
    analysis,
    recommendations,
  };

  return { report, flags };
}

/**
 * Build a stable, human-readable answers string for persistence in
 * `AssessmentRecord.transcript`. Not displayed verbatim — useful for
 * future debugging / re-analysis only.
 */
export function answersToTranscript(answers: QuestionAnswer[]): string {
  return answers.map((a, i) => `q${i + 1}: ${a}`).join('\n');
}
