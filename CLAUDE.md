# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo start          # Start dev server
npx expo start --ios    # iOS simulator
npx expo start --android # Android emulator
npx expo start --web    # Web browser
npx tsc --noEmit        # Type-check (no test runner configured)
```

## Architecture

**Expo 54 + TypeScript + Expo Router 6** mobile app for cognitive health assessment targeting users 55+. Bilingual (English/Chinese).

### Core Workflow
Audio recording → Alibaba Cloud OSS upload → Qwen AI transcription (`qwen3-omni-flash`) → Cognitive analysis (`qwen-plus-latest`) → Scored report with dimensions (memory, language, attention, executive). Falls back to mock data when `EXPO_PUBLIC_QWEN_KEY` is unset.

### Routing (file-based, Expo Router)
- `app/_layout.tsx` — Root layout with auth gate (redirects to signup if no profile)
- `app/(auth)/` — Signup → birth year → focus areas → ready (onboarding flow)
- `app/(tabs)/` — 3 visible tabs: Home, Services, Me. Hidden routes: screening, training, reports (navigated to programmatically)
- `app/assessment/` — Record → Analyzing → Report
- `app/training/` — Cognitive games (stroop, card-flip, category-fluency)
- `app/services/` — Service detail `[id].tsx` → booking confirm → complete

### State Management
Custom stores using `AsyncStorage` + `useSyncExternalStore`:
- **profileStore** (`@cc/profile/v1`, `@cc/assessments/v1`, `@cc/training/v1`) — User profile, assessment records, training completion. `useAppState()` hook, `hydrate()` on startup.
- **assessmentStore** — Transient in-memory state for active assessment flow.
- **bookingStore** — Service booking state for the services booking flow.
- **tipStore** — Tracks dismissed tip cards.
- **servicesData** (`lib/servicesData.ts`) — Static service/package definitions for the services tab.

### API Layer (`lib/openai.ts`, `lib/oss.ts`)
- `transcribeAudio(uri, locale)` — Upload to OSS, then stream SSE from Qwen omni model
- `analyzeAssessment(transcript, promptContext, locale)` — Chat completion returning JSON `AssessmentReport`
- `uploadAudioToOSS(localUri)` — Public bucket PUT, returns URL

### Design System (`lib/theme.ts`)
Material 3 tokens — primary teal `#004d5b`, spacing scale (xs:4 through xxl:48), border radius (sm:8 through full:9999), card/soft shadows. All components use these tokens directly.

### i18n (`lib/i18n.tsx`)
`I18nProvider` context with `useTranslation()` → `{ t, locale, setLocale }`. Locale persisted in AsyncStorage (`@cc/locale`). Includes prompt templates per focus area for AI analysis.

## Environment Variables

See `.env.example`. All prefixed `EXPO_PUBLIC_`:
- `EXPO_PUBLIC_QWEN_KEY` — DashScope API key (required for live AI)
- `EXPO_PUBLIC_OSS_ACCESS_KEY_ID`, `EXPO_PUBLIC_OSS_ACCESS_KEY_SECRET`, `EXPO_PUBLIC_OSS_BUCKET`, `EXPO_PUBLIC_OSS_REGION` — Alibaba Cloud OSS for audio upload

## Conventions

- Reusable components in `/components` (ScreenHeader, AudioWaveform, ScoreRing, OnboardingScaffold, TipCard)
- All user-facing strings go through `t()` from `useTranslation()` — add keys to both `en` and `zh` in `lib/i18n.tsx`
- Demo/mock data in `lib/demoData.ts` with locale-aware variants — update when adding new features
- Assessment types defined in `lib/openai.ts` (`AssessmentReport`, `FocusArea`)
- Profile types defined in `lib/profileStore.ts` (`UserProfile`, `AssessmentRecord`)
