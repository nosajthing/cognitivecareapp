# CognitiveCare Implementation Plan

## Context

Hackathon 项目：在 3-4 小时内构建一个认知健康早筛 React Native APP。核心目标是展示 AI 语音认知筛查 → 报告生成 → 长期趋势管理的完整闭环。用户选定了 Soft Organic 设计方向（Newsreader + DM Sans，暖色调）和 Expo + Firebase + OpenAI 技术栈。

**Design spec**: `docs/superpowers/specs/2026-04-02-cognitivecare-design.md`

---

## Phase 1: Project Scaffolding (~20 min)

### Step 1.1: Initialize Expo project
```bash
npx create-expo-app@latest cognitivecareapp --template blank-typescript
```
- Set up Expo Router for file-based navigation
- Configure TypeScript

### Step 1.2: Install core dependencies
```bash
npx expo install expo-router expo-av expo-image-picker
npx expo install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
npm install react-native-chart-kit react-native-svg
npm install openai
```

### Step 1.3: Project structure
```
app/
  _layout.tsx          # Root layout with Expo Router tabs
  (tabs)/
    _layout.tsx        # Tab navigation (首页/报告/趋势/我的)
    index.tsx          # Home screen
    reports.tsx        # Reports list
    trends.tsx         # Trends chart
    profile.tsx        # Profile/settings
  (auth)/
    login.tsx          # Login screen
  assessment/
    _layout.tsx        # Assessment flow layout
    intro.tsx          # Test intro/instructions
    semantic-fluency.tsx    # Test 1: 语义流畅性
    word-recall.tsx         # Test 2: 词汇回忆
    attention.tsx           # Test 3: 注意力
    complete.tsx            # Loading/analyzing
    report.tsx              # AI report display

lib/
  firebase.ts          # Firebase config & init
  openai.ts            # OpenAI API helpers
  types.ts             # TypeScript types
  theme.ts             # Design tokens (Soft Organic)
  useAudio.ts          # Audio recording hook

components/
  ScoreCircle.tsx      # Circular score display
  DimensionBar.tsx     # Score dimension progress bar
  ActionRow.tsx        # Home action list item
  WordTag.tsx          # Recognized word tag
  Timer.tsx            # Countdown timer
  Waveform.tsx         # Audio waveform visualization
```

### Step 1.4: Design tokens (`lib/theme.ts`)
Implement the Soft Organic color palette, typography, and spacing system from spec.

---

## Phase 2: Auth & Navigation (~20 min)

### Step 2.1: Firebase setup
- Create Firebase project (or use existing)
- Add `google-services.json` / `GoogleService-Info.plist`
- Initialize Firebase Auth + Firestore in `lib/firebase.ts`

### Step 2.2: Auth flow
- `app/(auth)/login.tsx`: Email/password login (simple for hackathon)
- Auth state listener → redirect to tabs or auth

### Step 2.3: Tab navigation
- `app/(tabs)/_layout.tsx`: Bottom tab bar with 4 tabs
- Use SVG icons, Soft Organic styling (dashed separators, warm colors)

---

## Phase 3: Home Screen (~20 min)

### Step 3.1: `app/(tabs)/index.tsx`
- Greeting with time-of-day logic
- Score circle component (last assessment score)
- Risk badge
- Action rows: Start Assessment, View Reports, Daily Training
- Fetch latest assessment from Firestore

---

## Phase 4: Cognitive Assessment Flow (~60 min) — CRITICAL PATH

### Step 4.1: Assessment intro (`app/assessment/intro.tsx`)
- Overview of 3 tests with estimated time
- Start button → navigates to first test

### Step 4.2: Semantic Fluency Test (`app/assessment/semantic-fluency.tsx`)
- 60-second countdown timer
- `expo-av` recording → send audio chunks to OpenAI Whisper
- Real-time display of recognized words as tags
- Stop button / auto-stop at 0
- Store results: words array, duration, duplicates count

### Step 4.3: Word Recall Test (`app/assessment/word-recall.tsx`)
- Display 10 words one by one (2 sec each)
- Brief delay (show instruction)
- Record user's recall → Whisper → compare with original list
- Store: presented words, recalled words, accuracy

### Step 4.4: Attention Test (`app/assessment/attention.tsx`)
- Prompt: "从100开始，每次减7"
- Record user answers → Whisper → validate each step
- Display progress: 100 → 93 → 86 → 79 → 72 → 65
- Store: answers array, correct count

### Step 4.5: Audio recording hook (`lib/useAudio.ts`)
- Start/stop recording with expo-av
- Convert to format suitable for Whisper API
- Handle permissions

### Step 4.6: OpenAI integration (`lib/openai.ts`)
- `transcribeAudio(uri)`: Send audio to Whisper API, return text
- `analyzeAssessment(testResults)`: Send test data to GPT-4o, return structured report JSON
- Error handling + loading states

---

## Phase 5: AI Report (~30 min)

### Step 5.1: Analysis & report generation (`app/assessment/complete.tsx`)
- Loading screen while AI processes
- Call `analyzeAssessment()` with all test results
- Navigate to report when ready

### Step 5.2: Report screen (`app/assessment/report.tsx`)
- Large score circle (Soft Organic style)
- Risk level badge (olive for low, terracotta for high)
- Dimension bars: memory, language, attention, executive
- AI analysis text block (italic Newsreader)
- Recommendations list
- Save to Firestore
- Share button (basic — copy text or share API)

---

## Phase 6: History & Trends (~20 min)

### Step 6.1: Reports list (`app/(tabs)/reports.tsx`)
- Fetch all assessments from Firestore, sorted by date
- Each row: date, score, risk level
- Tap → navigate to report detail

### Step 6.2: Trends chart (`app/(tabs)/trends.tsx`)
- Line chart showing score over time (react-native-chart-kit)
- Dimension breakdown toggle
- "下次评估建议" reminder

---

## Phase 7: Polish & Demo Prep (~20 min)

### Step 7.1: Error handling
- No mic permission → prompt
- API failure → retry / graceful message
- Empty states for first-time users

### Step 7.2: Demo data
- Seed 2-3 historical assessments for trend chart demo
- Ensure smooth demo flow end-to-end

### Step 7.3: Profile screen (`app/(tabs)/profile.tsx`)
- User name, basic info
- Logout button

---

## Key Files to Create

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout, auth guard |
| `app/(tabs)/_layout.tsx` | Tab navigator |
| `app/(tabs)/index.tsx` | Home screen |
| `app/(tabs)/reports.tsx` | Reports list |
| `app/(tabs)/trends.tsx` | Trends chart |
| `app/(tabs)/profile.tsx` | Profile |
| `app/(auth)/login.tsx` | Login |
| `app/assessment/intro.tsx` | Assessment start |
| `app/assessment/semantic-fluency.tsx` | Test 1 |
| `app/assessment/word-recall.tsx` | Test 2 |
| `app/assessment/attention.tsx` | Test 3 |
| `app/assessment/complete.tsx` | Analysis loading |
| `app/assessment/report.tsx` | Report display |
| `lib/firebase.ts` | Firebase config |
| `lib/openai.ts` | OpenAI helpers |
| `lib/theme.ts` | Design tokens |
| `lib/types.ts` | TypeScript types |
| `lib/useAudio.ts` | Audio hook |
| `components/ScoreCircle.tsx` | Score display |
| `components/DimensionBar.tsx` | Dimension bar |
| `components/ActionRow.tsx` | Action list item |
| `components/WordTag.tsx` | Word tag |
| `components/Timer.tsx` | Countdown |

---

## Verification

1. `npx expo start` → open in Expo Go
2. Register/login with email
3. Start assessment → complete all 3 tests with real voice input
4. Verify AI report generated with correct JSON structure
5. Check report saved to Firestore
6. View in reports list and trends chart
7. Test error states: deny mic permission, disconnect network
