import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useSyncExternalStore } from 'react';
import type { AssessmentReport } from './openai';

export type FocusArea = 'memory' | 'language' | 'attention' | 'sleep' | 'social';

export type UserProfile = {
  name: string;
  email: string;
  birthYear?: number;
  focusAreas: FocusArea[];
  createdAt: string;
};

export type AssessmentRecord = {
  id: string;
  date: string; // ISO
  report: AssessmentReport;
  transcript: string;
};

type AppState = {
  profile: UserProfile | null;
  assessments: AssessmentRecord[];
  hydrated: boolean;
};

const K_PROFILE = '@cc/profile/v1';
const K_ASSESSMENTS = '@cc/assessments/v1';
const K_TRAINING = '@cc/training/v1';

let state: AppState = { profile: null, assessments: [], hydrated: false };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function persist() {
  await AsyncStorage.multiSet([
    [K_PROFILE, JSON.stringify(state.profile)],
    [K_ASSESSMENTS, JSON.stringify(state.assessments)],
  ]);
}

type TrainingState = {
  date: string; // YYYY-MM-DD
  completed: string[]; // game IDs completed today
};

let training: TrainingState = { date: '', completed: [] };

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function ensureToday(): void {
  if (training.date !== todayStr()) {
    training = { date: todayStr(), completed: [] };
  }
}

export async function hydrateTraining(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(K_TRAINING);
    if (raw) training = JSON.parse(raw);
    ensureToday();
  } catch {
    training = { date: todayStr(), completed: [] };
  }
}

export function getTraining(): TrainingState {
  ensureToday();
  return training;
}

export async function completeTraining(gameId: string): Promise<void> {
  ensureToday();
  if (!training.completed.includes(gameId)) {
    training = { ...training, completed: [...training.completed, gameId] };
    await AsyncStorage.setItem(K_TRAINING, JSON.stringify(training));
  }
}

export async function hydrate() {
  if (state.hydrated) return;
  try {
    const [[, p], [, a]] = await AsyncStorage.multiGet([K_PROFILE, K_ASSESSMENTS]);
    const profile = p ? (JSON.parse(p) as UserProfile | null) : null;
    const assessments = a ? (JSON.parse(a) as AssessmentRecord[]) : [];
    state = { profile, assessments, hydrated: true };
  } catch {
    state = { profile: null, assessments: [], hydrated: true };
  }
  emit();
}

// Store API

export function getSnapshot(): AppState {
  return state;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function createProfile(input: { name: string; email: string }) {
  const profile: UserProfile = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    focusAreas: [],
    createdAt: new Date().toISOString(),
  };
  state = { ...state, profile };
  emit();
  await persist();
}

export async function updateProfile(patch: Partial<UserProfile>) {
  if (!state.profile) return;
  const profile = { ...state.profile, ...patch };
  state = { ...state, profile };
  emit();
  await persist();
}

export async function addAssessment(record: Omit<AssessmentRecord, 'id' | 'date'>) {
  const full: AssessmentRecord = {
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    date: new Date().toISOString(),
    ...record,
  };
  state = { ...state, assessments: [full, ...state.assessments] };
  emit();
  await persist();
  return full;
}

export async function resetAll() {
  state = { profile: null, assessments: [], hydrated: true };
  await AsyncStorage.multiRemove([K_PROFILE, K_ASSESSMENTS]);
  emit();
}

export async function seedDemoData(locale: 'en' | 'zh' = 'en') {
  const { getDemoAssessments, DEMO_PROFILES } = await import('./demoData');
  const profile = DEMO_PROFILES[locale] ?? DEMO_PROFILES.en;
  state = { profile, assessments: getDemoAssessments(locale), hydrated: true };
  emit();
  await persist();
}

// React hook
export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// Convenience: hydrate on mount and return whether ready
export function useHydrated(): boolean {
  const [ready, setReady] = useState(state.hydrated);
  useEffect(() => {
    if (!state.hydrated) {
      hydrate().then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);
  return ready;
}

// Derived selectors

export function latestAssessment(s: AppState): AssessmentRecord | undefined {
  return s.assessments[0];
}

export function daysSinceLastAssessment(s: AppState): number | null {
  const latest = latestAssessment(s);
  if (!latest) return null;
  const ms = Date.now() - new Date(latest.date).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function weeklyStreak(s: AppState): number {
  // days in the last 7 days with at least one assessment
  const now = new Date();
  const recentDates = new Set(
    s.assessments
      .map((a) => new Date(a.date))
      .filter((d) => (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) < 7)
      .map((d) => d.toDateString())
  );
  return recentDates.size;
}

export function firstName(profile: UserProfile | null): string {
  if (!profile) return 'there';
  return profile.name.split(' ')[0] || profile.name;
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Good evening';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
