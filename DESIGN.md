# DESIGN.md — CognitiveCare

> **Canonical design system for the CognitiveCare mobile app.**
> Written in the Google Stitch DESIGN.md extended format.
>
> **The Home tab (`app/(tabs)/index.tsx`) is the canonical baseline.**
> Any deviation from Home's tokens in another screen is a bug unless explicitly listed in the "Hero & Emphasis Exceptions" allowlist in the appendix.
>
> **Rule of thumb for agents:** every value — size, color, padding, radius, shadow — must come from `lib/theme.ts`. No hardcoded hex. No hardcoded `fontSize`. No hardcoded spacing. Only two existing screens are allowed to break this (Home greeting `40px`, OnboardingScaffold hero `32px`), and they are documented as exceptions below.

---

## 1. Visual Theme & Atmosphere

**Product:** CognitiveCare is a bilingual (English / Simplified Chinese) cognitive-health companion for users **55+**. The core loop is a daily voice-based assessment, three cognitive training games, a services/booking tab, and a profile/settings tab.

**Emotional tone:** Warm, reassuring, trustworthy. Clinical enough to feel credible, human enough to feel supportive. Never clinical-cold, never infantilizing, never loud. The app is something a 68-year-old opens in the morning with their coffee — it should feel like a gentle, respectful companion, not a medical device.

**Design philosophy:**

- **Material 3 foundations.** The color system and spacing scale follow Material 3's teal palette from `lib/theme.ts`.
- **Large, generous, breathable.** Users are 55+. Nothing is small, nothing is cramped. Touch targets are ≥44px. Section headers are 22px. Body text is 16px. White space is plentiful.
- **Emoji + label, never icon-only.** Every interactive icon is paired with text. The audience should never have to guess what a symbol means.
- **Card-based hierarchy.** White cards (`surfaceContainerLowest` `#ffffff`) sit on a very light cool-gray background (`background` `#f7f9fb`). Subtle shadows create depth without harsh borders.
- **Progressive disclosure.** Three visible tabs only (Home, Services, Me). Screening, Training, and Reports are reached from within Home, not from the bottom bar.
- **Bilingual-equal.** English and Chinese must be visually indistinguishable in hierarchy and weight. Copy is translated, not transliterated.
- **Accessibility is not a ghetto.** The app isn't styled for "older users" — it's styled the way software should be styled, full stop. No assistive-tech aesthetic.

**One-line brief for agents:** *"A warm, card-based, teal-and-mint Material 3 mobile app for 55+ users that prizes clarity, breathing room, and bilingual parity over density or novelty."*

---

## 2. Color Palette & Roles

All colors live in `lib/theme.ts` under the `colors` export. **Never hardcode hex in a screen file.** Always import from theme.

### Primary — Deep Teal (brand, CTAs, headers)

| Token | Hex | Role |
|---|---|---|
| `primary` | `#004d5b` | Primary CTAs, section headers, active states, brand accents |
| `primaryContainer` | `#006778` | Darker teal, icon containers, filled badges |
| `onPrimary` | `#ffffff` | Text/icons on `primary` |
| `onPrimaryContainer` | `#97e3f6` | Text/icons on `primaryContainer` |
| `primaryFixed` | `#a9edff` | Light cyan for soft highlights, Stroop game card |
| `primaryFixedDim` | `#86d2e5` | Medium cyan, focused tab pill background |
| `onPrimaryFixed` | `#001f26` | Dark text on `primaryFixed` |
| `onPrimaryFixedVariant` | `#004e5c` | Dark text on `primaryFixedDim` |

### Secondary — Mint / Teal-Green (success, progress, completion)

| Token | Hex | Role |
|---|---|---|
| `secondary` | `#0f6a5f` | Progress bar fill, completed states, positive metrics |
| `secondaryContainer` | `#a0eedf` | Light mint, tip cards, success pills, Card Flip game card |
| `onSecondary` | `#ffffff` | Text on `secondary` |
| `onSecondaryContainer` | `#176e63` | Text on `secondaryContainer` — tip card body |
| `secondaryFixed` | `#a3f1e2` | Light mint for assessment list avatars |
| `secondaryFixedDim` | `#87d5c6` | Medium mint, `ScoreRing` track color |
| `onSecondaryFixed` | `#00201c` | Dark text on `secondaryFixed` |
| `onSecondaryFixedVariant` | `#005047` | Dark text on `secondaryFixedDim` |

### Tertiary — Warm Brown / Peach (encouragement, recommendations, streaks)

| Token | Hex | Role |
|---|---|---|
| `tertiary` | `#6d3800` | Streak icon color, recommendation accent |
| `tertiaryContainer` | `#8f4c00` | Darker brown, rarely used directly |
| `onTertiary` | `#ffffff` | Text on `tertiary` |
| `onTertiaryContainer` | `#ffcda8` | Warm beige on dark brown |
| `tertiaryFixed` | `#ffdcc3` | Warm peach, recommendation card, Category Fluency game card |
| `tertiaryFixedDim` | `#ffb77d` | Medium peach |
| `onTertiaryFixed` | `#2f1500` | Dark text on `tertiaryFixed` |
| `onTertiaryFixedVariant` | `#6e3900` | Brown text on `tertiaryFixedDim` |

### Error — Red (destructive actions, elevated risk only)

| Token | Hex | Role |
|---|---|---|
| `error` | `#ba1a1a` | Destructive action text (reset), high-risk badges |
| `errorContainer` | `#ffdad6` | Light pink, elevated risk pill background |
| `onError` | `#ffffff` | Text on `error` |
| `onErrorContainer` | `#93000a` | Text on `errorContainer` |

### Surface & Neutral Scale

| Token | Hex | Role |
|---|---|---|
| `background` / `surface` / `surfaceBright` | `#f7f9fb` | Default screen fill — every `SafeAreaView` sits on this |
| `surfaceContainerLowest` | `#ffffff` | **Card fill.** Every white card on the screen |
| `surfaceContainerLow` | `#f2f4f6` | Empty activity cells, secondary card backgrounds |
| `surfaceContainer` | `#eceef0` | Grouped container backgrounds |
| `surfaceContainerHigh` | `#e6e8ea` | Language toggle pill track (Me tab) |
| `surfaceContainerHighest` / `surfaceVariant` / `surfaceDim` | `#e0e3e5` / `#d8dadc` | Dimmest surfaces, rarely used |
| `onBackground` / `onSurface` | `#191c1e` | Primary text |
| `onSurfaceVariant` | `#3f484b` | Secondary text, row labels |
| `outline` | `#6f797c` | Tertiary text, day labels, disclaimers |
| `outlineVariant` | `#bec8cb` | Dividers, disabled backgrounds, chevron arrows |

### Inverse (defined but **currently unused**)

`inverseSurface: #2d3133`, `inverseOnSurface: #eff1f3`, `inversePrimary: #86d2e5` — reserved for a future dark mode. Do not use today.

### Semantic Role Map

| Semantic role | Token | Example use |
|---|---|---|
| Risk — Low | `secondaryContainer` bg, `onSecondaryContainer` fg | Assessment risk pill |
| Risk — Moderate | `tertiaryFixed` bg, `onTertiaryFixed` fg | Assessment risk pill |
| Risk — Elevated | `errorContainer` bg, `onErrorContainer` fg | Assessment risk pill |
| Activity — completed day | `secondary` filled circle, white text | 7-day activity grid |
| Activity — empty day | `surfaceContainerLow` filled circle, `outlineVariant` dot | 7-day activity grid |
| Activity — today (pending) | `surfaceContainerLowest` fill, `primary` border, `primary` `add` icon | 7-day activity grid |
| Card Flip game | `secondaryContainer` icon background | Home + Training tab |
| Category Fluency game | `tertiaryFixed` icon background | Home + Training tab |
| Stroop game | `primaryFixed` icon background | Home + Training tab |

---

## 3. Typography Rules

### Font families

```ts
fonts = {
  headline: 'System', // iOS SF Pro / Android Roboto / CJK system fallback
  body: 'System',
}
```

Currently **system fonts on all platforms.** The `theme.ts` file notes intent to swap to Manrope (headline) and Public Sans (body) later — this is **out of scope** for the current design system. Do not hardcode those font names in components.

Chinese glyphs fall back to the platform's CJK system font (PingFang SC on iOS, Noto Sans CJK on Android). No special handling required in components.

### Type scale — use these tokens, not raw numbers

All tokens come from `lib/theme.ts` under `type`. Import with `import { type } from '../../lib/theme'` and spread: `<Text style={{ ...type.headlineMd, color: colors.primary }}>`.

| Token | Size | Weight | Line-height | Extra | Use |
|---|---|---|---|---|---|
| `displayLg` | 36 | 800 | 40 | — | Reserved for the very largest hero text. **Currently unused in production.** |
| `headlineLg` | 28 | 700 | 34 | — | Hero CTA title ("Daily Check-In"), assessment report insight title |
| `headlineMd` | **22** | **700** | **28** | — | **Section headers** (Activity, Daily Training, All Assessments, Services sections, Reports sections). The default section-header voice. |
| `headlineSm` | 18 | 700 | 24 | — | `ScreenHeader` title (CognitiveCare, Me, Services, etc.) |
| `titleLg` | 20 | 700 | 26 | — | Card titles, game names, list-item titles, primary button text, streak count |
| `bodyLg` | 16 | 400 | 24 | — | Primary body text, descriptions, greeting subtitle, recommendation body |
| `bodyMd` | 14 | 400 | 20 | — | Row labels (Me tab rows), helper text, disclaimers, figure captions |
| `labelLg` | 13 | 600 | 18 | — | Small badges, pill labels, language toggle, secondary actions |
| `labelMd` | 11 | 700 | 16 | letterSpacing 0.8 | Uppercase micro-labels (day names, "STATUS OVERVIEW", "TODAY" badges) |

### Hierarchy rules (must follow)

1. **Section headers are ALWAYS `type.headlineMd` (22 / 700)** in `colors.primary`, sitting above their section content. This is the single most important typographic rule — see the Me tab inconsistency note in the appendix.
2. **Card titles are `type.titleLg` (20 / 700).** Do not substitute `headlineSm` (18) — that is reserved for `ScreenHeader`.
3. **Body text is `type.bodyLg` (16 / 400)** for anything a user reads. `bodyMd` (14) is for **row labels and captions only**, not primary reading content.
4. **Metadata is `type.labelMd` (11 / 700 uppercase with 0.8 letter-spacing).** Day names, "STATUS OVERVIEW", risk-time subtitles. This is the only place 11px is acceptable.
5. **Never hardcode `fontSize`** in screen files except at the two documented exceptions (Home greeting, OnboardingScaffold hero).
6. **Never override `fontWeight` on top of a spread `type.*` token** without documenting why. When you must, put the override **after** the spread so it wins: `{ ...type.titleLg, fontWeight: '600' }` — not before.

### Documented hardcoded overrides (the only two allowed)

| Location | Value | Why |
|---|---|---|
| Home greeting (`app/(tabs)/index.tsx:108`) | `fontSize: 40, fontWeight: '800', letterSpacing: -0.8, lineHeight: 44` | Signature hero greeting. Sets the visual tone for the whole app. |
| OnboardingScaffold title (`components/OnboardingScaffold.tsx:70`) | `fontSize: 32, fontWeight: '800', letterSpacing: -0.6, lineHeight: 38` | Onboarding hero. One step down from the home greeting because onboarding screens also show a progress bar and subtitle. |

Any **new** hardcoded `fontSize` requires promoting it to a `type.*` token first.

---

## 4. Component Stylings

Every observed component pattern, grounded in the Home baseline.

### `ScreenHeader` (`components/ScreenHeader.tsx`)

- Layout: horizontal row, optional 40×40 rounded logo + title text
- Padding: `24` horizontal, `16` vertical (matches screen padding)
- Title: `type.headlineSm` (18 / 700), `colors.primary`, `letterSpacing: -0.3`
- No shadow, no bottom border — visual separation comes from whitespace and the card rhythm below.
- **Used on every tab screen.** Do not substitute a custom header.

### `ScoreRing` (`components/ScoreRing.tsx`)

- SVG circular progress ring
- Default size `96`, stroke `10`; report screen uses size `120`; screening status uses size `64` stroke `6`; training progress uses size `100` stroke `8`
- Track color: `colors.secondaryFixedDim` (`#87d5c6`)
- Fill color: `colors.secondary` (`#0f6a5f`) — override-able via `barColor` prop
- Center label: `type.headlineMd` in `colors.primary`
- Sublabel: `type.labelMd` in `colors.outline`

### `TipCard` (`components/TipCard.tsx`)

- Background: `colors.secondaryContainer` (`#a0eedf`)
- Padding: `spacing.md` (16)
- Radius: `radius.md` (12)
- Layout: row — emoji icon, flex-1 text column (title + body), close button (18 icon, 0.5 opacity, 8px hitSlop)
- Title: `type.labelLg` (13 / 600), `colors.onSecondaryContainer`
- Body: `type.labelLg` with `fontWeight: '400'` override, `colors.onSecondaryContainer`
- Dismissible via `tipStore`

### `OnboardingScaffold` (`components/OnboardingScaffold.tsx`)

- Header row: back button (40×40, opacity 0 on step 1), progress bar (N equal `4px` height tracks, `radius: 2`, `colors.primary` filled / `colors.outlineVariant` empty), gap `6` between segments
- Header padding: `24` horizontal, `16` vertical, gap `16`
- Content: `24` horizontal, `24` gap, `16` marginTop
- Hero title: **the documented `fontSize: 32 / 800 / letterSpacing -0.6 / lineHeight 38` override** in `colors.primary`
- Subtitle: `type.bodyLg`, `colors.onSurfaceVariant`
- Continue button: full-width, `paddingVertical: 16`, `borderRadius: 20`, `colors.primary` (or `colors.outlineVariant` when disabled), `type.titleLg` white label + 22px arrow-forward icon, `shadow.card` when enabled
- Button container padding: `24` horizontal, `24` bottom

### `AudioWaveform` (`components/AudioWaveform.tsx`)

- Container height: `200`
- 35 bars, 5px wide, 2px gap, 3px radius, `colors.primary` fill
- Idle: 1500ms ease-in/out breathing loop, opacity 0.5–1.0 distance-weighted
- Recording: spring animation (`friction: 8, tension: 100`) on metering
- Status label below bars: small green pulsing dot (`#22c55e`, 800ms fade 0.3→1) + `type.labelLg` "AI Listening"

### Cards

Two-tier card system:

**Hero / emphasis card** (`shadow.card`)
- Shadow: `shadow.card` from theme (`{ offset: 0/12, opacity: 0.06, radius: 32, elevation: 4 }`)
- Background: `colors.surfaceContainerLowest` (`#ffffff`)
- Padding: **24** standard — `28` or `32` reserved for true hero cards (see exceptions appendix)
- Radius: `radius.lg` (20) standard — `24`, `radius.xl` (28), or `radius.xxl` (32) for hero/report
- Used on: Hero CTA, Activity card, assessment list rows, Reports status cards, Report screen sections

**Soft card** (`shadow.soft`)
- Shadow: `shadow.soft` from theme (`{ offset: 0/2, opacity: 0.04, radius: 8, elevation: 2 }`)
- Background: `colors.surfaceContainerLowest`
- Padding: `spacing.md` (16)
- Radius: `radius.lg` (20)
- Used on: Daily Training game list items, Me tab section containers

### Buttons

| Variant | Background | Text | Padding | Radius | Shadow |
|---|---|---|---|---|---|
| **Primary filled** | `colors.primary` | `type.titleLg`, white, often paired with 22px forward-arrow | `paddingVertical: 16`, `paddingHorizontal: 24+` | `20` or `radius.full` | `shadow.card` when enabled |
| **Secondary pill** | `colors.secondaryContainer` | `type.titleLg`, `colors.onSecondaryContainer`, with icon | `paddingHorizontal: 28, paddingVertical: 14` | `20` | none |
| **Ghost / outline** | transparent, `borderWidth: 1`, `borderColor: colors.outlineVariant` | `type.labelLg`, `colors.error` (reset) or `colors.primary` | `paddingVertical: 14` | `radius.lg` | none |
| **Mini pill badge** | `colors.primary` | `type.labelLg`, white | `paddingHorizontal: spacing.md, paddingVertical: spacing.sm` | `radius.full` | none |
| **Disabled** | `colors.outlineVariant` | white, 0.7 opacity | same as enabled | same | no shadow |
| **Pressed** | inherit, `opacity: 0.9` (0.92 on hero CTA, 0.95 on cards) | — | — | — | — |
| **Icon-only circular** | `colors.surfaceContainerLow` or `colors.secondaryContainer` | 22–24px MaterialIcons, `colors.primary` | 40–44×40–44 square, centered | `radius.full` or `radius.lg` | optional `shadow.soft` |

**Rule:** No icon-only button without an adjacent label **unless** it's a universally understood affordance (close × in a modal header, back ← in a stack header, share icon in the report screen action bar). If in doubt, add a label.

### Form fields (Signup pattern)

- Container: `colors.surfaceContainerLowest` background, 1px border in `colors.outlineVariant`, `borderRadius: 16`
- Padding: `paddingHorizontal: 20, paddingVertical: 16`
- Field font: **16** (`type.bodyLg`) — see appendix for the current Signup hardcoded `18` bug
- Label above field: `type.labelMd` uppercased, `colors.onSurfaceVariant`, gap `8` to input
- Placeholder color: `colors.outline`

### List items (Home assessment list, Me rows)

**Home pattern (canonical):**
- Card: `colors.surfaceContainerLowest`, `padding: 20`, `borderRadius: 24`
- Layout: row — 48×48 avatar (`radius: 16`, colored background, `type.titleLg` text) + flex content column + `chevron-right` (24, `colors.outlineVariant`)
- Title in content column: `type.titleLg` in `colors.primary`
- Metadata line: `type.labelMd` in `colors.outline`, `marginTop: 2`, `textTransform: 'none'` (even though `labelMd` is uppercase by default, the risk+time line mixes case)

**Me row pattern (after normalization — see appendix):**
- Inside a `Section` card (`shadow.soft`, `radius.lg`, `surfaceContainerLowest`, `overflow: hidden`)
- Row: `paddingHorizontal: spacing.lg` (24), `paddingVertical: spacing.md` (16), 1px top border in `colors.outlineVariant` except on first row
- Label: `type.bodyLg` (16), `colors.onSurfaceVariant` — *not* `bodyMd` (14)
- Value/control on trailing edge

### Section headers

Two patterns exist — use the Home pattern for all tab content.

**Home pattern (canonical):**
```tsx
<View style={{ gap: 16 }}>
  <Text style={{ ...type.headlineMd, color: colors.primary }}>
    {t('activity')}
  </Text>
  {/* content */}
</View>
```

- Title: `type.headlineMd` (22 / 700), `colors.primary`
- Optional subtitle below: `type.bodyLg` in `colors.onSurfaceVariant`
- Gap to content below: `16` (`spacing.md`) inside the section
- Gap to next section: `32` (`spacing.xl`) at the ScrollView level

**Me tab "SECTION" uppercase micro-label** (the pattern Me currently uses — see appendix for migration plan):
- Currently: `type.labelMd` (11px uppercase) — this is the "way too small" bug the user called out. **Replace with the Home pattern.**

### Tab bar (`app/(tabs)/_layout.tsx`)

- Three visible tabs: Home (home), Services (shopping-basket), Me (person)
- Three hidden routes: Screening, Training, Reports (`href: null`, navigated to programmatically from Home)
- Background: `rgba(247, 249, 251, 0.92)` (semi-transparent `background`)
- Border-top: 1px `colors.secondary` at 0.1 opacity
- Top corners rounded: `24`
- Height: `84` (padding-top `12`, padding-bottom `24`)
- Shadow: `shadow.card` on the top edge (negative offset)
- Tab icon container: 64px min-width, `radius.md` (16), background `rgba(134, 210, 229, 0.28)` (`primaryFixedDim` at 0.28) when focused
- Icon: 24px MaterialIcons, `colors.primary` when focused, `colors.outline` otherwise
- Label: `type.labelMd` uppercase, `marginTop: 4`

### Navigation headers (back / close / action buttons)

- Back button: `arrow-back` 24px, `colors.primary`, 40×40 hit area
- Close button: `close` 24px, `colors.primary`, 40×40 hit area — used on modal/report screens
- Floating action buttons (Share on Report): 44px circular, `colors.surfaceContainerLow` or `colors.secondaryContainer` background, 22px icon

---

## 5. Layout Principles

### Spacing scale (8-based)

```ts
spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 }
```

**Never use raw pixel values for spacing in new code.** Always reference the token: `padding: spacing.lg` not `padding: 24`. (The Home file itself uses raw numbers in places — this is historical and should be normalized over time, but the numbers all map to tokens, so it's not wrong per se.)

### Screen-level layout (the Home baseline)

| Property | Value | Source |
|---|---|---|
| Background | `colors.background` (`#f7f9fb`) | `SafeAreaView` top-level |
| Safe area edges | `['top']` on tabs, `['top', 'bottom']` on auth/modal | — |
| Horizontal padding | **`24`** (`spacing.lg`) | `ScrollView.contentContainerStyle.paddingHorizontal` |
| Top padding | `16` from `ScreenHeader`, no additional ScrollView top | — |
| Bottom padding | **`120`** (clears tab bar + breathing room) | `paddingBottom` |
| Section gap | **`32`** (`spacing.xl`) | `ScrollView.contentContainerStyle.gap` |
| Header component | `ScreenHeader` — always | — |

### Within-section layout

- Gap between a section header and its first content block: **`16`** (`spacing.md`) via a `<View style={{ gap: 16 }}>` wrapper
- Gap between list items inside a section: `16`
- Gap between rows inside a card: `20` (for the Activity card's row grouping) or `16`
- Card padding: **`24`** standard, `28` only for listed emphasis cards

### Grids & carousels

- **7-day activity grid:** `flexDirection: 'row', justifyContent: 'space-between'` — 7 equal cells, each 40×40 circular, column-wrapped in an `alignItems: 'center', gap: 6` container for the day label above.
- **Horizontal carousels (doctor carousel, service cards):** paging `FlatList`, card width = screen width − `2 * spacing.lg`, `snapToInterval` set to card width.
- **Keyword pills (Report screen):** `flexDirection: 'row', flexWrap: 'wrap', gap: 8`.

### Max widths

Mobile-only. No max width constraints. Full-width minus 48px (24px each side).

---

## 6. Depth & Elevation

### Two-tier shadow system

All shadows come from `lib/theme.ts`. **Never hand-roll a shadow style.**

```ts
shadow.card = { shadowColor: '#191c1e', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.06, shadowRadius: 32, elevation: 4 }
shadow.soft = { shadowColor: '#191c1e', shadowOffset: { width: 0, height: 2  }, shadowOpacity: 0.04, shadowRadius: 8,  elevation: 2 }
```

| Tier | Use on | Example |
|---|---|---|
| `shadow.card` | Hero CTAs, Activity card, assessment list rows, Reports status card, Report screen insight/dimensions/recommendations cards, primary button when enabled | Home:135, Home:186 |
| `shadow.soft` | Daily Training game cards, Me tab `Section` containers | Home:298, Me:45 |
| *no shadow* | Background surfaces, tip cards, pill badges, tabs, inline elements | — |

### Surface hierarchy (darkest → lightest)

```
surfaceContainerHighest  (#e0e3e5)  — rarely used
surfaceContainerHigh     (#e6e8ea)  — language toggle pill track
surfaceContainer         (#eceef0)  — grouped neutral backgrounds
surfaceContainerLow      (#f2f4f6)  — empty activity cells
background / surface     (#f7f9fb)  — screen fill ← baseline
surfaceContainerLowest   (#ffffff)  — cards ← cards "pop" because they're whiter than the background
```

The screen is slightly *off* white (`#f7f9fb`) so that cards (pure `#ffffff`) visually lift. Don't put a pure-white card on a pure-white background.

### Border radius scale

```ts
radius = { sm: 8, md: 12, lg: 20, xl: 28, xxl: 32, full: 9999 }
```

| Scale | Use |
|---|---|
| `sm` (8) | Micro tags, language toggle pill background |
| `md` (12) | Tip cards, small chips, game icon containers for ScreenHeader logo |
| `lg` (20) | **Default card radius.** All standard cards. Primary buttons. |
| `xl` (28) | Hero cards (Screening CTA cards after normalization), onboarding containers |
| `xxl` (32) | Top-tier hero cards (Home hero CTA, Reports screen status card, Assessment Report insight/dimensions cards) |
| `full` (9999) | Pills, circular avatars, streak badges, mini action buttons |

**No card radius should exceed `32`.** If you need something more playful, reach for a different component (pill, circle), not a larger radius.

---

## 7. Do's and Don'ts

### DO

- ✅ **Use `theme.color.*` for every color.** No hex literals in screens. No `rgba(...)` except for documented translucent overlays (tab bar background, hero CTA internal chip).
- ✅ **Use `type.*` tokens for every font size.** No `fontSize: 18`, `fontSize: 26`, etc.
- ✅ **Use `spacing.*` / `radius.*` tokens for layout.** Raw numbers are tolerated if they map to a token value, but tokens are preferred.
- ✅ **Make section headers `type.headlineMd` (22 / 700) in `colors.primary`.** This is the single most common consistency bug. Apply everywhere.
- ✅ **Use `paddingHorizontal: 24` and `gap: 32` on every primary scrollable tab screen.** Non-negotiable baseline.
- ✅ **Pair icons with labels.** Icon-only affordances only where they're universally understood (close, back, share).
- ✅ **Keep touch targets ≥44px.** Including the invisible hit area on icons — use `hitSlop` if the visual size is smaller.
- ✅ **Run every user-facing string through `t()` from `useTranslation()`** and add the key to both `en` and `zh` in `lib/i18n.tsx`. Bilingual or don't ship.
- ✅ **Put style overrides AFTER the spread** — `{ ...type.titleLg, fontSize: 16 }` — so the override wins. (There's a latent `fontWeight` bug from doing this backwards; always spread first.)
- ✅ **Use `shadow.card` for elevated cards and `shadow.soft` for everything else.** Two tiers, no middle ground.
- ✅ **Use emoji + label on game cards.** The 24px emoji in a 48×48 rounded container is the Home baseline.
- ✅ **Use `shadow.card` on a primary button only when enabled.** Disabled buttons should be flat `colors.outlineVariant` with no shadow.

### DON'T

- ❌ **Don't hardcode `fontSize`.** Exceptions: Home greeting (40) and OnboardingScaffold hero (32), both already documented.
- ❌ **Don't hardcode hex values in screen files.** If you need a new color, add it to `lib/theme.ts` first.
- ❌ **Don't use `type.labelMd` (11px) for section headers.** It looks cramped and "too small" to 55+ users. Use `type.headlineMd` (22px).
- ❌ **Don't use section gaps below `32`** on primary tab screens. `24` reads as tight. `20` reads as broken.
- ❌ **Don't use `paddingHorizontal: 20`.** The screen-level horizontal padding is `24`, everywhere. (`20` is an in-card horizontal padding that exists in a few legacy places but should be normalized to 24.)
- ❌ **Don't use `borderRadius: 36` or higher on cards.** 32 is the ceiling. Cards over 32 read as bubbly for an adult health app.
- ❌ **Don't substitute `type.headlineSm` (18)** for a section header. That token belongs to `ScreenHeader` only.
- ❌ **Don't substitute `type.bodyMd` (14)** for primary body text. 14 is for row labels and captions only. Primary reading is 16.
- ❌ **Don't put an icon-only button anywhere** a 70-year-old might have to guess its meaning. Always label.
- ❌ **Don't use harsh dark borders.** Depth comes from `shadow.card`, `shadow.soft`, or `outlineVariant` at most. Never `#000` or `colors.primary` as a general border.
- ❌ **Don't crowd the tab bar.** Three visible tabs only. Hidden routes are navigated via Home.
- ❌ **Don't clinicalize copy.** "Cognitive decline screening" is wrong. "Let's check in" is right. Warm, encouraging, reassuring. Never jargon.
- ❌ **Don't ship an English-only string.** The bilingual check is a hard gate.
- ❌ **Don't introduce a new color family without adding it to `theme.ts` first** — and even then, prefer extending an existing family before adding a new one.
- ❌ **Don't mock up a new screen with custom `Text` styles.** Every `<Text>` should start with a `...type.*` spread.

---

## 8. Responsive Behavior

CognitiveCare is a **mobile-native app** built on Expo Router. There are no web breakpoints, no tablet-specific layouts, no desktop concerns.

### Device targets

- **Primary:** iOS (iPhone 12 and newer, iPhone SE 3rd gen)
- **Secondary:** Android (Material Design guidelines apply)
- **Tested reference:** iPhone 17 Pro at 1206×2622 (screenshot export resolution)

### Safe areas

- Every screen wraps content in `<SafeAreaView edges={['top']}>` on tab screens, `['top', 'bottom']` on auth/modal screens.
- The custom tab bar handles its own bottom inset via `paddingBottom: 24` internally.
- Scrollable content reserves **`paddingBottom: 120`** to clear the tab bar — this is the universal bottom-padding value for any `ScrollView.contentContainerStyle` on a tab screen.

### Touch targets

- **Minimum: 44×44pt.** Applies to buttons, icons, list item rows, tab items.
- Circular icon buttons: `40×40` visual + `hitSlop` if any sub-element is smaller.
- `TipCard` close button uses `hitSlop: 8` to extend the tappable area.

### Keyboard behavior

- Forms wrap in `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>` and `<ScrollView keyboardShouldPersistTaps="handled">`.
- See `app/(auth)/signup.tsx` for the canonical pattern.

### Dynamic type

- The app does **not** currently respect OS dynamic type settings — all sizes are fixed via `type.*` tokens.
- To compensate, the baseline type scale is already **2–4pt larger** than a typical 25-year-old's mobile app would use. 16px body instead of 14px. 22px section headers instead of 18–20.
- If dynamic type support is added later, `type.*` tokens should switch to a scaling function; all downstream code continues to use the tokens unchanged.

### Orientation

- Portrait only. `expo-router` stack and tabs do not lock, but layouts assume portrait.

### Reduced motion

- Not currently respected — all animations are unconditional.
- If respected later, gate `AudioWaveform` breathing, `FadeSlideIn` report reveals, and the spring bar animations behind `AccessibilityInfo.isReduceMotionEnabled()`.

---

## 9. Agent Prompt Guide

### Quick-reference cheat sheet

```
// Every screen starts with these imports
import { colors, type, radius, shadow, spacing } from '../../lib/theme';

// Every tab screen follows this shell
<SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
  <ScreenHeader title={t('headerXxx')} />
  <ScrollView
    contentContainerStyle={{
      paddingHorizontal: spacing.lg,    // 24
      paddingBottom: 120,               // clears tab bar
      gap: spacing.xl,                  // 32 between sections
    }}
    showsVerticalScrollIndicator={false}
  >
    {/* Section */}
    <View style={{ gap: spacing.md /* 16 */ }}>
      <Text style={{ ...type.headlineMd, color: colors.primary }}>
        {t('sectionTitle')}
      </Text>
      {/* Card(s) */}
      <View
        style={{
          backgroundColor: colors.surfaceContainerLowest,
          padding: spacing.lg,          // 24
          borderRadius: radius.lg,      // 20
          ...shadow.card,
        }}
      >
        <Text style={{ ...type.titleLg, color: colors.onSurface }}>Card title</Text>
        <Text style={{ ...type.bodyLg, color: colors.onSurfaceVariant, marginTop: 4 }}>
          Card description in 16px body.
        </Text>
      </View>
    </View>
  </ScrollView>
</SafeAreaView>
```

### Ready-to-use prompt: **"Build me a new screen"**

> Build a new screen at `app/<route>.tsx` that matches DESIGN.md exactly. Requirements:
> - `SafeAreaView edges={['top']}` on `colors.background`
> - `ScreenHeader` with the title from `t()`
> - `ScrollView` with `paddingHorizontal: 24, paddingBottom: 120, gap: 32`
> - Every section has a `type.headlineMd` title in `colors.primary`, then a card with `type.titleLg` + `type.bodyLg` content
> - Cards: `surfaceContainerLowest` background, `padding: 24`, `borderRadius: radius.lg` (20), `shadow.card`
> - Every `Text` spreads a `type.*` token first, then applies `color` and only necessary overrides (after the spread)
> - Every string goes through `t()` and you add keys to both `en` and `zh` in `lib/i18n.tsx`
> - No hardcoded hex, no hardcoded fontSize, no paddingHorizontal other than 24 at the screen level

### Ready-to-use prompt: **"Polish this screen against DESIGN.md"**

> Read DESIGN.md and `app/<screen>.tsx`. Find every token-level deviation from the Home baseline defined in DESIGN.md and fix them. Specifically check:
> - `paddingHorizontal` is 24, `gap` between sections is 32, `paddingBottom` is 120
> - Section headers are `type.headlineMd` in `colors.primary`, NOT `labelMd` or `headlineSm`
> - Card padding is 24 (or 28 only for documented hero cards), card radius is `radius.lg` (20) or allowed hero values (28/32)
> - No hardcoded `fontSize`, no hardcoded hex, no overrides that clobber token weight/size by being before the spread
> - All strings go through `t()` and exist in both `en` and `zh`
> - Icon container in card lists is 48×48 with a 24px emoji inside
>
> After each file edit, run `npx tsc --noEmit`. Do NOT change visual semantics that aren't listed in the Known Inconsistencies appendix below.

### Ready-to-use prompt: **"Add a new bilingual string"**

> Add a new translation key `<key>` used in `app/<path>.tsx`. Add both the `en` and `zh` entries to `lib/i18n.tsx`. The Chinese translation should match the tone of surrounding keys (warm, reassuring, not clinical). Do not ship an English-only string.

---

## Appendix: Normalization Rules & Known Inconsistencies

This appendix encodes the actual, file:line inconsistencies a polish pass must fix to bring the app in line with this document. **Treat this as a to-do list.**

### A. Baseline Declaration

> **The Home tab (`app/(tabs)/index.tsx`) is the canonical visual baseline.**
> Any deviation from Home's tokens in another screen is a bug unless it appears in the Hero & Emphasis Exceptions allowlist (section C below). When in doubt, match Home.

### B. Universal Rules (apply to every screen)

1. **Screen horizontal padding = `24` (`spacing.lg`).** No exceptions.
2. **Section gap (ScrollView-level) = `32` (`spacing.xl`).** No exceptions.
3. **Scroll bottom padding = `120`** on every primary tab screen.
4. **Section headers = `type.headlineMd` (22 / 700) in `colors.primary`.** No exceptions.
5. **Card titles = `type.titleLg` (20 / 700).** No exceptions.
6. **Body text = `type.bodyLg` (16 / 400).** Use `bodyMd` only for captions and row labels.
7. **Card padding = `24` standard**, `28` only for cards in the Hero & Emphasis allowlist.
8. **Card radius: `20` standard, `28` hero, `32` top-tier hero, never more than `32`.**
9. **Game / list icon containers = 48×48 with a `24`-size emoji inside.**
10. **No hardcoded `fontSize` in screens** except the two documented hero overrides.
11. **No hardcoded hex in screens.** Only `theme.color.*`.
12. **`shadow.card` for hero/elevated cards, `shadow.soft` for everything else.** No custom shadows.
13. **44px minimum touch targets.**
14. **All strings through `t()`, entries in both `en` and `zh`.**

### C. Hero & Emphasis Exceptions (the allowlist)

These are the **only** places where a screen is permitted to exceed the baseline tokens. Anything outside this list must conform.

| Location | Exception | Why |
|---|---|---|
| `app/(tabs)/index.tsx:108` — Home greeting | `fontSize: 40, fontWeight: '800', letterSpacing: -0.8, lineHeight: 44` | Signature hero greeting; sets the voice of the whole app |
| `components/OnboardingScaffold.tsx:70` — Onboarding title | `fontSize: 32, fontWeight: '800', letterSpacing: -0.6, lineHeight: 38` | Onboarding hero; one step down from Home to accommodate progress bar + subtitle |
| `app/(tabs)/index.tsx:132` — Hero CTA card | `padding: 32, borderRadius: 32` | Top hero card on the primary screen |
| `app/(tabs)/index.tsx:340` — Recommendation card | `padding: 28` | Emphasis card for the "latest recommendation" highlight |
| `app/(tabs)/screening.tsx:91,92,137,138` — Screening CTA cards (Voice Assessment, Cognitive Games) | `padding: 28` **only** — radius must normalize to `radius.xl` (28), currently wrongly `36` (see D below) | Screening's entire job is these two hero CTAs |
| `app/assessment/report.tsx` — Report insight / dimensions cards | `padding: 28, borderRadius: 32` | Top-tier report hero cards |

### D. Known Inconsistencies (polish-pass hit list)

Ordered by severity. Each item lists the file:line, the current value, the target, and the rationale.

---

#### 🔴 **D1. Me tab — the "way too small" offender (highest priority)**

The Me tab is the single most-off screen in the app. The user explicitly called out that its fonts are "way too small." Four related fixes bring it into line with Home.

**File: `app/(tabs)/me.tsx`**

| Line | Current | Target | Rationale |
|---|---|---|---|
| `100` | `padding: 20` | `paddingHorizontal: spacing.lg` (24) | Match Home's screen horizontal padding |
| `100` | `gap: 20` | `gap: spacing.xl` (32) | Match Home's section gap; `20` makes the screen read as cramped |
| `59` (inside `SectionTitle`) | `...type.labelMd` (11px uppercase) | `...type.headlineMd` (22px) in `colors.primary` | **This is the single biggest "too small" offender.** Me's section titles are 11px labels where Home's are 22px headlines. Fix the `SectionTitle` component to use the headline pattern. Drop `paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10, textTransform: 'uppercase'` — the Home pattern puts the header *above* the card with `gap: 16` in the wrapping View, not *inside* the card. |
| `24–25` (inside `Row`) | `paddingHorizontal: 20, paddingVertical: 14` | `paddingHorizontal: spacing.lg` (24), `paddingVertical: spacing.md` (16) | Match standard row padding rhythm |
| `30, 108, 114, 120, 182, 201, 204` | `...type.bodyMd` (14px) on Row labels / values / about text | `...type.bodyLg` (16px) | 14 is caption-sized. Primary row content must be 16. |
| `61` (`SectionTitle` horizontal padding) | `paddingHorizontal: 20` | delete (headers move outside the card) | — |

**Structural change:** The current Me tab nests section headers *inside* each `Section` card as an uppercase micro-label. The Home pattern puts the header *above* the card inside a wrapping `<View style={{ gap: 16 }}>`. The polish pass should restructure to match:

```tsx
<View style={{ gap: spacing.md /* 16 */ }}>
  <Text style={{ ...type.headlineMd, color: colors.primary }}>
    {t('settingsProfile')}
  </Text>
  <Section>
    <Row label={...}>...</Row>
    <Row label={...}>...</Row>
  </Section>
</View>
```

---

#### 🟠 **D2. Screening tab — cramped gap and over-rounded cards**

**File: `app/(tabs)/screening.tsx`**

| Line | Current | Target | Rationale |
|---|---|---|---|
| `51` | `gap: 24` | `gap: spacing.xl` (32) | Match Home's section gap |
| `91` | `borderRadius: 36` | `borderRadius: radius.xl` (28) | 36 exceeds the radius ceiling; cards become bubbly |
| `137` | `borderRadius: 36` | `borderRadius: radius.xl` (28) | Same as above |
| `92, 138` | `padding: 28` | **keep** (allowed hero padding, see Exception C) | — |

---

#### 🟠 **D3. Training tab — oversized game icons**

**File: `app/(tabs)/training.tsx`**

| Line | Current | Target | Rationale |
|---|---|---|---|
| `78–79` | `width: 52, height: 52` on game icon container | `width: 48, height: 48` | Match Home's `48×48` icon container (Home:310–311) |
| `86` | `fontSize: 26` on game emoji | `fontSize: 24` | Match Home's `fontSize: 24` emoji (Home:318). Also — once `24` is the literal, consider promoting to a `spacing.lg` or keeping as a documented "icon emoji size" constant. |
| `69` | `marginBottom: spacing.md` on each game card | Remove; use `gap: spacing.md` on the ScrollView `contentContainerStyle` | Match Home's pattern of section gaps instead of per-item margins |
| `44` (`marginBottom: 24` on progress ring container) | `marginBottom: 24` | Replace with `gap: 24` on parent | Consistency with Home's gap-based layout |

---

#### 🟠 **D4. Signup — hardcoded oversized input font**

**File: `app/(auth)/signup.tsx`**

| Line | Current | Target | Rationale |
|---|---|---|---|
| `155` (inside `Field`) | `fontSize: 18` hardcoded on `TextInput` | `...type.bodyLg` (16) or explicit `fontSize: 16` | 18 is between `headlineSm` and `titleLg` — it's wrong for an input. Inputs are body text. |
| `152–153` | `paddingHorizontal: 20, paddingVertical: 16` | `paddingHorizontal: spacing.lg` (24), `paddingVertical: spacing.md` (16) | Match 24px horizontal rhythm |
| `75–79` (welcome title) | `fontSize: 36, fontWeight: '800', letterSpacing: -0.8, lineHeight: 40` | **keep as-is** BUT document as a hero exception, OR drop to match OnboardingScaffold's 32 | **Decision: keep at 36** because Signup is a one-off welcome-to-the-app moment, distinct from the repeated onboarding scaffold screens. Add to Hero & Emphasis allowlist. *(This plan formalizes the exception instead of normalizing downward.)* |

---

#### 🟡 **D5. Onboarding — cramped padding**

**File: `components/OnboardingScaffold.tsx`**

| Line | Current | Target | Rationale |
|---|---|---|---|
| `70–74` | `fontSize: 32, fontWeight: '800', letterSpacing: -0.6, lineHeight: 38` | **keep** (allowed hero, see Exception C) | — |
| `66` | `paddingHorizontal: 24, gap: 24` | **keep** (24 is correct for content padding) | — |

**Child onboarding screens (focus areas, birth year):** The Explore audit found these use `paddingHorizontal: 20` on option items. Any option-item horizontal padding should be `spacing.lg` (24) and any `fontSize: 18` override on a `type.titleLg` spread should be removed — let `type.titleLg` (20) stand. File-level line references here are indicative; fix on whatever the current lines are at polish time.

---

#### 🟡 **D6. Home tab — one latent override bug**

**File: `app/(tabs)/index.tsx`**

| Line | Current | Target | Rationale |
|---|---|---|---|
| `394` | `<Text style={{ ...type.titleLg, color: colors.primary, fontSize: 16 }}>` — the assessment-list date title | Either fully use `type.bodyLg` (which is 16) or remove the `fontSize: 16` override so `titleLg`'s 20px stands | Spreading `titleLg` (20) and then overriding `fontSize` to 16 is exactly the "override order / clobber" anti-pattern DESIGN.md warns about. Pick one token. |

This is the one baseline bug in the baseline screen — fixing it makes Home fully self-consistent.

---

#### 🔵 **D7. Service Detail — wrong section-header token**

**File: `app/services/[id].tsx`**

| Line (approx) | Current | Target | Rationale |
|---|---|---|---|
| `110, 131` | "Features" / "Reviews" headers use `type.headlineSm` (18) | `type.headlineMd` (22) in `colors.primary` | `headlineSm` is reserved for `ScreenHeader`. Section headers are `headlineMd`. |

### E. Screen-by-Screen Conformance Checklist

Run this checklist top-to-bottom on any new screen PR — or when opening an existing screen for polish. If any answer is "no," fix it before merging.

**Screen shell**
- [ ] `SafeAreaView edges={['top']}` on `colors.background`
- [ ] `ScreenHeader` with title from `t()`
- [ ] `ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, gap: 32 }}`
- [ ] `showsVerticalScrollIndicator={false}`

**Sections**
- [ ] Each section is a `<View style={{ gap: 16 }}>` wrapping a `type.headlineMd` title + content
- [ ] Section title uses `type.headlineMd` in `colors.primary` — NOT `labelMd`, NOT `headlineSm`
- [ ] Optional subtitle below title uses `type.bodyLg` in `colors.onSurfaceVariant`

**Cards**
- [ ] Standard cards: `surfaceContainerLowest` bg, `padding: 24`, `borderRadius: radius.lg` (20), `shadow.card` or `shadow.soft`
- [ ] Hero cards (listed in the allowlist only): `padding: 28`, `borderRadius: radius.xl` (28) or `radius.xxl` (32)
- [ ] No card radius above 32
- [ ] No hand-rolled shadows

**Typography**
- [ ] Every `<Text>` starts with a `...type.*` spread
- [ ] No literal `fontSize` (except the two documented hero exceptions)
- [ ] Card titles = `type.titleLg`, not `headlineSm` or `bodyLg`
- [ ] Primary body = `type.bodyLg` (16), not `bodyMd` (14)
- [ ] Row labels / captions = `type.bodyMd` (14) — the only allowed use of 14
- [ ] Metadata = `type.labelMd` (11 uppercase), only for day names / uppercase micro-labels

**Color**
- [ ] No literal hex
- [ ] Section header color = `colors.primary`
- [ ] Primary text = `colors.onSurface`, secondary = `colors.onSurfaceVariant`, tertiary = `colors.outline`
- [ ] Dividers / subtle borders = `colors.outlineVariant`

**List items / icons**
- [ ] Icon containers in list items = 48×48 with a 24px emoji or MaterialIcon
- [ ] Icon container radius = `radius.md` (16) or `radius.lg` (20) matching visual weight
- [ ] Touch target ≥44px (use `hitSlop` if visual size is smaller)

**Buttons**
- [ ] Primary button: `colors.primary` bg (or `outlineVariant` disabled), `paddingVertical: 16`, `borderRadius: 20` or `radius.full`, `type.titleLg` white text, `shadow.card` when enabled
- [ ] Pressed state: `opacity: 0.9–0.92`
- [ ] Disabled state: `colors.outlineVariant` bg, no shadow
- [ ] No icon-only button unless it's a universal affordance

**i18n**
- [ ] Every user-facing string uses `t()`
- [ ] The key exists in both `en` and `zh` in `lib/i18n.tsx`
- [ ] Chinese translation matches the warm/reassuring tone of surrounding keys

**Type check**
- [ ] `npx tsc --noEmit` passes

---

*End of DESIGN.md.*
*Source of truth: `lib/theme.ts` for tokens; `app/(tabs)/index.tsx` for baseline patterns.*
*Maintain this file in lockstep with `lib/theme.ts` — if a token changes, update both.*
