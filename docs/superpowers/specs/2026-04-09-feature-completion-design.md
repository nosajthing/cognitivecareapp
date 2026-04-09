# CognitiveCare Feature Completion — Design Spec

**Date:** 2026-04-09
**Approach:** Lightweight / Hackathon-Ready (Approach A)
**Scope:** 6 modules — Tip System, Training Games, Settings, Services Redesign, Report Sharing, Screening Polish

---

## 1. Inline Tip Card System

### Component: `<TipCard>`
Reusable component placed throughout the app to provide contextual guidance ("sign-posting").

**Props:**
- `tipId: string` — unique identifier for persistence (e.g. `"training_intro"`)
- `icon: string` — MaterialIcons name or emoji
- `titleKey: string` — i18n key for title
- `bodyKey: string` — i18n key for body text

**Behavior:**
- Dismissable via "×" button in top-right corner
- Dismissed state persisted in AsyncStorage under key `@cc/dismissed_tips` (JSON array of tipId strings)
- A small floating "💡" button appears at bottom-right of the screen when any tips on that screen are dismissed; tapping it clears those tipIds from the dismissed list, re-showing the tips
- Gentle green background matching the existing app palette (`colors.primaryContainer` area)

**Tip Placements:**

| Screen | tipId | Content (zh) | Content (en) |
|--------|-------|-------------|-------------|
| Home | `home_welcome` | 每天一次语音评估，帮助追踪您的认知健康趋势 | A daily voice check-in helps track your cognitive health trends |
| Training | `training_intro` | 每日训练帮助保持大脑活力。完成三项练习，持续锻炼认知能力 | Daily training keeps your brain active. Complete 3 exercises to stay sharp |
| Screening | `screening_intro` | 语音评估通过AI分析您的表达，帮助了解记忆、语言和注意力状况 | Voice assessments use AI to analyze your speech patterns for cognitive health signals |
| Services | `services_intro` | 结合AI筛查与专业医疗资源，为您提供从早筛到干预的全流程服务 | Professional services complement AI screening with clinical brain health assessments |
| Reports | `reports_intro` | 这里展示您所有的评估记录和趋势变化，帮助您了解长期认知健康状况 | View all your assessment records and trends to understand your long-term cognitive health |

**New files:** `components/TipCard.tsx`
**New lib:** `lib/tipStore.ts` — simple AsyncStorage get/set for dismissed tip IDs

---

## 2. Training Module — 3 Games

### 2.1 Training Hub (Redesign `app/(tabs)/training.tsx`)

Replace current hardcoded stub with a real training hub:

- Tip card at top
- Daily progress ring showing X/3 completed today
- 3 game cards: Memory (Card Flip), Language (Category Fluency), Attention (Stroop Test)
- Each card shows: icon, name, brief description, "Start" button or "Completed ✓" badge
- Completed state tracked in profileStore as `trainingCompletedToday: string[]` (array of game IDs) with `trainingDate: string` (ISO date string). On app open, if `trainingDate` !== today, clear the array. Simple date comparison, no timers.

### 2.2 Card Flip Memory Game

**Screen:** `app/training/card-flip.tsx`

**Gameplay:**
- 4×3 grid = 12 cards = 6 emoji pairs
- Emoji set: common objects (🍎🌸🐱🌙⭐🎵) — same set for all locales
- Tap to flip a card (flip animation), tap second card to check match
- Matched pairs stay face-up with success color
- Mismatched pairs flip back after 800ms
- Game ends when all pairs found

**Scoring:**
- Track: moves count, time elapsed
- Result screen: "Great Memory!" headline, moves count, time, star rating (3 stars < 12 moves, 2 stars < 18, 1 star otherwise)
- "Play Again" and "Back to Training" buttons

**Difficulty:** Fixed 4×3 grid (simple enough for elderly users, no difficulty scaling needed for hackathon)

### 2.3 Category Fluency Game

**Screen:** `app/training/category-fluency.tsx`

**Gameplay:**
- Show a random category (localized): Animals, Fruits, Vegetables, Colors, Countries, Kitchen Items, etc.
- 60-second countdown timer
- Text input at bottom — user types a word and taps "Add" (or presses enter)
- Words appear as pills/tags above input
- Duplicate detection (case-insensitive) — show brief "already added" feedback
- Timer bar animates down; audio/haptic pulse at 10s remaining

**Scoring:**
- Count of unique valid words entered
- Result screen: word count, list of all words entered, encouraging message
- Thresholds: 10+ words = excellent, 6-9 = good, <6 = keep practicing

**Categories (i18n):**
- zh: 动物、水果、蔬菜、颜色、国家、厨房用品、交通工具、身体部位
- en: Animals, Fruits, Vegetables, Colors, Countries, Kitchen Items, Vehicles, Body Parts

### 2.4 Stroop Test (Color-Word Match)

**Screen:** `app/training/stroop.tsx`

**Gameplay:**
- 10 rounds per session
- Each round: display a color word (e.g. "RED") rendered in a DIFFERENT color (e.g. blue text)
- 4 color buttons at bottom: Red, Blue, Green, Yellow
- User must tap the DISPLAY COLOR (not what the word says)
- Brief intro/instruction screen before first round explaining the rule
- Correct = green flash + next round; Wrong = red flash + show correct answer briefly, then next
- 5-second timeout per round (auto-wrong if no tap)

**Colors:**
- zh: 红、蓝、绿、黄
- en: RED, BLUE, GREEN, YELLOW
- Display colors: #E53935 (red), #1E88E5 (blue), #43A047 (green), #FDD835 (yellow)

**Scoring:**
- Correct count out of 10
- Average reaction time for correct answers
- Result screen: accuracy percentage, average time, encouraging message

### 2.5 Training Navigation

New route group: `app/training/_layout.tsx` (stack navigator)
- `card-flip.tsx`
- `category-fluency.tsx`
- `stroop.tsx`

Each game navigated to from the training hub via `router.push('/training/card-flip')` etc.

---

## 3. Settings Page

**Screen:** `app/settings.tsx` (modal presentation)

**Trigger:** Settings gear icon in `ScreenHeader` component — add `onPress` to navigate to settings.

**Sections (ScrollView):**

### 3.1 Profile Section
- Display current name, email (read-only for now)
- Edit birth year (same picker as onboarding)
- Edit focus areas (same multi-select as onboarding)

### 3.2 Language
- Toggle switch: English / 中文
- Uses existing `setLocale` from i18n context

### 3.3 Notifications
- Toggle: "Daily Reminder" (UI only — no real push notifications for hackathon)
- Time picker appearance (e.g. "9:00 AM") — visual only, saved to AsyncStorage but no scheduling

### 3.4 About
- App version
- Brief description text

### 3.5 Actions
- "Reset All Data" button (red, with confirmation Alert) — calls existing `resetAll()`
- Uses existing `resetAll` and navigates back to signup

---

## 4. Services Tab Redesign

**File:** `app/(tabs)/services.tsx` — full rewrite

### Layout (top to bottom ScrollView):

#### 4.1 Tip Card
- tipId: `services_intro`
- Content: "结合AI筛查与专业医疗资源，为您提供从早筛到干预的全流程服务"

#### 4.2 Brain Health Screening Section (和睦家脑健康筛查)

**Section header:**
- Title: "脑健康筛查" / "Brain Health Screening"
- Subtitle: "和睦家医疗 × 郭毅教授团队 · EEG + rTMS 技术"

**Package 1: 标准版 — 脑电图无创初筛**
- Price: ~~¥2,500~~ **¥1,880**
- Green gradient header
- Checklist items:
  - 神经内科问诊×2（首诊+复诊）
  - EEG脑电图认知风险评估
  - MoCA蒙特利尔认知评估量表
  - MMSE简易精神状态检查量表
  - PSQI睡眠质量评估
  - 躯体形式障碍筛查(Neuro-11)
- CTA: "预约咨询" → confirmation Alert

**Package 2: 综合版 — 生物标志物与功能影像学综合检查** [推荐 badge]
- Price: ~~¥11,000~~ **¥7,800**
- Dark teal gradient header, "推荐" badge
- "包含标准版全部项目，另加：" label
- Additional checklist items:
  - 血液标志物检测 (P-Tau217, GFAP, NfL)
  - Aβ淀粉样蛋白 (Aβ-42, Aβ-40, ratio)
  - 颅脑MRI (SWI序列、冠状位海马相)
  - 甲状腺功能
  - 肝功能/肾功能
  - 血常规/血糖/血脂/铁蛋白/维生素B12
- CTA: "预约咨询" → confirmation Alert

#### 4.3 Prime Insurance Card (和睦致逸)

- Dark indigo gradient card
- Partners: 万欣和 Prosper Health × 京东安联 Allianz
- Product name: 和睦致逸 / Prime Health Protection
- Two stat boxes: 住院保障 800万, 免赔额低至 ¥2,000
- Tag pills: 特需/国际/VIP部, 既往症可投, 私人健康管家, 绿色通道
- Price: ¥2,999/年 起
- CTA: "了解更多" → modal with expanded benefits:
  - 保障覆盖全球，包含住院医疗、特定门诊、特需部/国际部/VIP部就诊
  - 恶性肿瘤海外就医直付（最高600万）
  - 既往症6个月稳定期可投保
  - 成人免赔额仅¥2,000
  - 私人健康管家一对一服务
  - 权威医疗机构绿色通道
  - CTA: "咨询顾问" → Alert confirmation

#### 4.4 Specialist Booking (horizontal scroll)

Keep specialist cards, update to contextually relevant doctors:
- 郭毅教授 — 脑健康首席专家 (Chief Brain Health Expert)
- 陈医生 — 神经内科 (Neurology)
- 李医生 — 认知康复 (Cognitive Rehabilitation)

Each card: avatar circle, name, specialty, "预约" button → Alert confirmation with "已提交预约请求"

---

## 5. Report Sharing

**File:** `app/assessment/report.tsx` — add share button

**Share button:** Placed in the top-right corner or below the report content, matching app style.

**Share content (text-based via expo-sharing / Share API):**

```
[CognitiveCare 认知评估报告]

日期: 2026-04-09
综合评分: 87/100
风险等级: 低风险

亮点: 从阳台上的喜鹊到妈妈的红烧排骨——每一个细节都清晰而生动。

维度评分:
• 记忆力: 88  • 语言能力: 90
• 注意力: 85  • 执行功能: 84

建议: 观鸟能锻炼视觉注意力和辨识能力——可以考虑买一本观鸟指南来拓展认识。
```

Uses `Share.share()` from React Native (built-in, no extra dependency needed). Content language matches current locale.

---

## 6. Screening Tab Polish

**File:** `app/(tabs)/screening.tsx`

- Remove `opacity: 0.75` from Cognitive Games card
- Remove "Coming Soon" label
- Add `onPress` handler → `router.push('/(tabs)/training')`
- Update card description to: "通过趣味游戏锻炼记忆力、语言和注意力" / "Train memory, language, and attention through fun games"
- Add tip card at top of screening tab

---

## New i18n Keys Required

Approximately 80-100 new translation keys across:
- 5 tip cards (title + body × 2 languages)
- Training hub UI (daily goal, game names, descriptions, start/completed labels)
- Card Flip game (instructions, scoring, result messages)
- Category Fluency game (categories × 8, instructions, scoring, input placeholder)
- Stroop Test (instructions, color names, scoring, result messages)
- Settings (section headers, toggle labels, about text, confirmation messages)
- Services (section headers, package names, all checklist items, CTAs, modal content)
- Report sharing (share button label, report template text)
- Screening (updated cognitive games card text)

---

## New Files Summary

| File | Purpose |
|------|---------|
| `components/TipCard.tsx` | Reusable inline tip card component |
| `lib/tipStore.ts` | AsyncStorage persistence for dismissed tips |
| `app/training/_layout.tsx` | Stack navigator for training games |
| `app/training/card-flip.tsx` | Card Flip memory game |
| `app/training/category-fluency.tsx` | Category Fluency language game |
| `app/training/stroop.tsx` | Stroop Test attention game |
| `app/settings.tsx` | Settings modal screen |

## Modified Files Summary

| File | Changes |
|------|---------|
| `app/(tabs)/training.tsx` | Full rewrite — real training hub with game cards and daily progress |
| `app/(tabs)/services.tsx` | Full rewrite — brain health screening packages + Prime + specialists |
| `app/(tabs)/screening.tsx` | Activate cognitive games card, add tip card |
| `app/(tabs)/index.tsx` | Add tip card |
| `app/(tabs)/reports.tsx` | Add tip card |
| `app/assessment/report.tsx` | Add share button |
| `components/ScreenHeader.tsx` | Wire settings icon onPress |
| `lib/profileStore.ts` | Add `trainingCompletedToday` tracking |
| `lib/i18n.tsx` | Add ~80-100 new translation keys |
