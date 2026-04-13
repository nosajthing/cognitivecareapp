# Brain Diagnosis Mini-Program — Design Spec

**Date:** 2026-04-12
**Status:** Draft
**Project:** Standalone WeChat mini-program (separate from main HippoCare app)
**Location:** `/brain-diagnosis-miniprogram/` (new folder at repo root)

---

## Context

The hospital needs a viral awareness vehicle for its Alzheimer's early detection screening services. Direct marketing doesn't work for this demographic — young adults (20-35) won't engage with clinical content, but they will share a funny personality quiz. This mini-program uses SBTI-style 自嘲式幽默 to create a viral quiz that's genuinely fun, while subtly building brand awareness for 海马健康 (HippoCare). The conversion strategy is deliberately light-touch: virality first, hospital branding as ambient background.

**Dual-track audience:** Young adults drive sharing; their parents/grandparents are the ultimate screening conversion targets.

---

## Product Design

### Core Concept

**"脑力诊断书"** — A 31-question quiz that "diagnoses" your brain condition with an absurd medical certificate. Looks clinical, reads like a personal attack. Every question is a relatable 精神内耗 scenario with no right answers — just different flavors of being a lovable disaster.

### User Flow (5 screens)

1. **Landing** — "你的大脑得了什么症？" hook, gradient background, "开始测试" CTA
2. **Questions** (31 total, 5 themed sections) — One question per screen, progress bar, 3 answer options per question, auto-advance on tap
3. **Analyzing** (2-3s fake loading) — "正在分析你的脑力数据…" with progress bar animation
4. **Result** — Full diagnosis certificate with: diagnosis name, symptoms, 5-dimension scores, 灵魂标签 pills, 医嘱
5. **Share Card** — Canvas-generated image styled as a medical certificate with mini-program QR code. User saves to camera roll and shares to Moments.

### Question Design

**31 questions in 5 thematic sections:**

| Section | Theme | Questions | Vibe |
|---------|-------|-----------|------|
| Part 1 | 📱 数字废人日常 | Q1–Q6 | Phone addiction, notification amnesia, impulse buying |
| Part 2 | 💼 职场/学业废物语录 | Q7–Q12 | Meeting brain-death, self-discipline theater, decision fatigue |
| Part 3 | 🚪 出门即社恐 | Q13–Q18 | Forgot pants, elevator crisis, photo amnesia |
| Part 4 | 🌙 精神内耗深夜档 | Q19–Q24 | 3am cringe replay, "are you okay?", battery at negative |
| Part 5 | 🎭 社交废墟 & 灵魂拷问 | Q25–Q31 | Shower comeback, group chat paranoia, brain user manual |

**Dimension distribution:** Memory ×8, Attention ×7, Executive ×7, Language ×6, Emotional ×4

**Question format:** Each question has a scenario + emoji header, 3 answer options (A/B/C). All answers are self-deprecating and relatable. No answer is "correct" — they map to different dimension score vectors.

**Tone:** 发疯文学 energy. Dark humor, cringy, self-deprecating. Scenarios include: putting chopsticks in milk tea, boss's nose hair hijacking your attention, showing up to work on Saturday, sending "哈哈哈" to your boss. Each answer is screenshot-worthy as a standalone meme.

### 8 Diagnosis Types

| # | Name | English | Dominant Pattern | Tagline |
|---|------|---------|-----------------|---------|
| 1 | 记忆丢包症 | Memory Packet Loss Syndrome | Low MEM | 信息传输丢失率87% |
| 2 | 注意力蒸发综合征 | Attention Evaporation Syndrome | Low ATT | 注意力像开水一样蒸发 |
| 3 | 精神内耗过热症 | Mental Drain Overheating | High EMO + High ATT | CPU 99%但没有程序在运行 |
| 4 | 决策系统全面瘫痪 | Decision System Paralysis | Low EXEC | 午饭困难已升级为人生困难 |
| 5 | 深夜觉醒型昼伏夜出症 | Nocturnal Awakening Syndrome | Low ATT(day) + High LANG | 白天空壳深夜开机 |
| 6 | 社交NPC化晚期 | Social NPC Terminal Stage | High LANG + Low EMO | 真实人格已下线 AI代管 |
| 7 | 多线程崩溃综合征 | Multi-Thread Crash Syndrome | High EXEC + Low MEM | 八条触手互不通信 |
| 8 | 情绪内存溢出 | Emotional Memory Overflow | High MEM(selective) + High EMO | 感受太多处理不过来 |

Each diagnosis includes: name, English subtitle, symptoms paragraph, 医嘱 (doctor's orders — itself a roast), and 3 灵魂标签 pills.

### Scoring System

1. Each answer (A/B/C) maps to a 5-dimensional score vector: `{MEM, ATT, LANG, EXEC, EMO}`
2. Sum all 31 answer vectors → 5 raw dimension scores
3. Normalize each dimension to 0-100
4. Pattern-match against 8 diagnosis type profiles using cosine similarity (closest match wins)
5. All scoring runs client-side — no server, no AI calls

### Conversion Strategy (Deliberately Subtle)

- **Primary CTA:** Save and share the diagnosis card image
- **QR code on share card:** Points back to the quiz (viral loop), NOT to hospital
- **Result page footer:** Small text link "想了解更多脑健康知识？关注海马健康" → hospital service account
- **No hard sell, no booking buttons, no price display**

### Virality Mechanics

- **Share card image** generated via Canvas API — saved to camera roll, shared to Moments
- **灵魂标签** are standalone memes — people screenshot individual labels
- **Section breaks** as progress milestones ("Part 3 of 5") prevent drop-off
- **Replay value:** "你的主诊断是XX，但你同时疑似YY" encourages retaking
- **Comparison hook (future):** "你和{friend}都是精神内耗过热症！"

---

## Technical Architecture

### Stack

**Native WeChat Mini-Program** — WXML + WXSS + JavaScript/TypeScript

Chosen over Taro/uni-app for: fastest load time, native share card quality, full Canvas API access, direct mini-program linking, no server hosting needed.

### Project Structure

```
brain-diagnosis-miniprogram/
├── app.js                    # App lifecycle
├── app.json                  # Pages config, tab bar, window style
├── app.wxss                  # Global styles
├── project.config.json       # WeChat DevTools config
├── pages/
│   ├── landing/              # Landing page with CTA
│   │   ├── landing.wxml
│   │   ├── landing.wxss
│   │   └── landing.js
│   ├── quiz/                 # Question screens (31 questions, 1 at a time)
│   │   ├── quiz.wxml
│   │   ├── quiz.wxss
│   │   └── quiz.js
│   ├── analyzing/            # Fake loading animation
│   │   ├── analyzing.wxml
│   │   ├── analyzing.wxss
│   │   └── analyzing.js
│   └── result/               # Diagnosis certificate + share card
│       ├── result.wxml
│       ├── result.wxss
│       └── result.js
├── data/
│   ├── questions.js          # 31 questions with answer options & score vectors
│   └── diagnoses.js          # 8 diagnosis types with descriptions, tags, 医嘱
├── utils/
│   ├── scoring.js            # Dimension scoring + type matching algorithm
│   └── canvas.js             # Share card image generation via Canvas API
├── images/                   # Static assets (stamp image, QR placeholder)
└── miniprogram_npm/          # npm dependencies (if any)
```

### Key Technical Decisions

- **No backend server** — All logic runs client-side. Questions, scoring, and results are bundled.
- **Canvas API for share card** — `wx.canvasToTempFilePath` generates the diagnosis certificate image. User saves via `wx.saveImageToPhotosAlbum`.
- **Mini-program QR code** — Static image embedded in the share card, pre-generated from WeChat dashboard.
- **Data persistence** — `wx.setStorageSync` stores last result for "retake" comparison. No user accounts needed.
- **Analytics** — WeChat's built-in analytics for page views, completion rate, share count. Custom events for: quiz start, section completion, result type distribution, share card save.
- **Package size** — Target under 1MB. Questions and diagnoses as JS data, not remote fetch.

### Share Flow

1. User taps "生成诊断书" on result page
2. Canvas API draws the diagnosis certificate image off-screen
3. `wx.canvasToTempFilePath` → temp image file
4. `wx.saveImageToPhotosAlbum` → saved to camera roll
5. User manually shares to Moments/group chats
6. Friends scan QR code on image → opens mini-program → new quiz session

### Hospital Integration

- **Service account link:** Result page footer links to hospital's WeChat service account via `wx.navigateToMiniProgram` (if member portal is a separate mini-program) or `wx.openOfficialAccount` (if using web-view to service account articles)
- **Configurable:** Hospital branding (name, logo, colors) stored in `app.js` config for easy white-labeling

---

## Content (Full Question & Diagnosis Text)

All 31 questions and 8 diagnosis types have been designed and approved during brainstorming. Full Chinese text is available in the brainstorming visual companion files at `.superpowers/brainstorm/`. During implementation, this content will be transcribed into `data/questions.js` and `data/diagnoses.js`.

---

## Verification

1. **WeChat DevTools:** Import project, preview on simulator, verify all 5 screens render correctly
2. **Quiz flow:** Complete all 31 questions, verify section transitions, progress bar accuracy
3. **Scoring:** Test edge cases — all-A answers, all-B, all-C, mixed — verify each maps to a valid diagnosis type
4. **Share card:** Generate canvas image, verify all text renders correctly, save to camera roll
5. **QR code:** Scan QR from share card, verify it opens the mini-program
6. **Analytics:** Verify custom events fire for quiz start, completion, and share
7. **Package size:** Confirm total under 1MB
8. **Hospital link:** Verify footer link navigates to hospital service account/member portal

---

## Scope Boundaries

**In scope:**
- 31-question quiz with 5 themed sections
- 8 diagnosis types with scoring engine
- Canvas-generated share card with QR code
- Basic analytics via WeChat built-in
- Hospital service account link (subtle footer)

**Out of scope (future iterations):**
- Friend comparison ("你们都是XX症")
- Leaderboard / trending diagnoses
- Backend server for aggregate analytics
- A/B testing of questions
- Integration with main HippoCare app data
- Multi-language support (Chinese only for v1)
