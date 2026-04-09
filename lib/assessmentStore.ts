// Simple in-memory store for the current assessment run.
// Good enough for a hackathon demo; swap for Zustand / Firestore later.

import type { AssessmentReport } from './openai';

type State = {
  transcript?: string;
  report?: AssessmentReport;
  error?: string;
  audioUri?: string;
  prompt?: string;
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
export function getState(): State {
  return state;
}
export function reset() {
  delete state.transcript;
  delete state.report;
  delete state.error;
  delete state.audioUri;
  delete state.prompt;
}
