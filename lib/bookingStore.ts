// Simple in-memory store for the active booking flow.
// Same pattern as assessmentStore.ts — transient, not persisted.

type State = {
  serviceId?: string;
  name?: string;
  phone?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  completedAt?: string;
};

const state: State = {};

export function setServiceId(id: string) {
  state.serviceId = id;
}
export function setName(n: string) {
  state.name = n;
}
export function setPhone(p: string) {
  state.phone = p;
}
export function setPreferredDate(d: string) {
  state.preferredDate = d;
}
export function setPreferredTime(t: string) {
  state.preferredTime = t;
}
export function setNotes(n: string) {
  state.notes = n;
}
export function setCompletedAt(t: string) {
  state.completedAt = t;
}
export function getState(): State {
  return state;
}
export function reset() {
  delete state.serviceId;
  delete state.name;
  delete state.phone;
  delete state.preferredDate;
  delete state.preferredTime;
  delete state.notes;
  delete state.completedAt;
}
