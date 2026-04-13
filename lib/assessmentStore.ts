// Simple in-memory store for the current assessment run.
// Good enough for a hackathon demo; swap for Zustand / Firestore later.

import type { AssessmentReport } from './openai';

type State = {
  transcript?: string;
  report?: AssessmentReport;
  error?: string;
  audioUri?: string;
  prompt?: string;
  // Clock Drawing Test fields:
  clockImageUri?: string; // local file URI from view-shot capture
  clockImageUrl?: string; // public OSS URL after upload
  // Which assessment produced the current `report`. The report screen reads
  // this to branch its subtitle / transcript visibility for the questionnaire
  // variant. Voice and clock flows can leave it implicit (clockImageUrl is
  // already a sufficient signal for the clock branch).
  kind?: 'voice' | 'clock' | 'questionnaire';
};

const state: State = {};

export function setTranscript(t: string) {
  state.transcript = t;
}
export function setReport(r: AssessmentReport) {
  state.report = r;
}
export function setError(e: string) {
  state.error = e;
}
export function setAudioUri(u: string) {
  state.audioUri = u;
}
export function setPrompt(p: string) {
  state.prompt = p;
}
export function setClockImageUri(u: string) {
  state.clockImageUri = u;
}
export function setClockImageUrl(u: string) {
  state.clockImageUrl = u;
}
export function setKind(k: 'voice' | 'clock' | 'questionnaire' | undefined) {
  state.kind = k;
}
export function getState(): State {
  return state;
}
export function reset() {
  delete state.transcript;
  delete state.report;
  delete state.error;
  delete state.audioUri;
  delete state.prompt;
  delete state.clockImageUri;
  delete state.clockImageUrl;
  delete state.kind;
}
