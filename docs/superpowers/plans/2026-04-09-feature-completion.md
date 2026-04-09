# CognitiveCare Feature Completion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete all 6 missing/stub modules: tip system, training games, settings, services redesign, report sharing, screening polish.

**Architecture:** Lightweight approach — no new dependencies. Games are self-contained React Native components. Tips use AsyncStorage. Training progress tracked in existing profileStore. All text in i18n.tsx bilingual dictionaries.

**Tech Stack:** React Native, Expo Router, AsyncStorage, MaterialIcons, Animated API. No new npm packages needed.

**Spec:** `docs/superpowers/specs/2026-04-09-feature-completion-design.md`

**Dependency graph:**
- Task 1 (i18n keys) — no deps, required by all others
- Task 2 (TipCard + tipStore) — no deps, required by Tasks 6, 7, 8, 10
- Task 3 (profileStore training) — no deps, required by Tasks 4, 5, 6, 7
- Task 4 (training layout + hub) — depends on 1, 2, 3
- Task 5 (Card Flip game) — depends on 1
- Task 6 (Category Fluency game) — depends on 1
- Task 7 (Stroop Test game) — depends on 1
- Task 8 (Settings page + ScreenHeader) — depends on 1, 2, 3
- Task 9 (Services tab redesign) — depends on 1, 2
- Task 10 (Report sharing) — depends on 1
- Task 11 (Screening polish) — depends on 1, 2

**Parallelizable groups after Task 1-3:**
- Group A (Training): Tasks 4, 5, 6, 7
- Group B (Screens): Tasks 8, 9, 10, 11

---

### Task 1: Add all new i18n keys

**Files:**
- Modify: `lib/i18n.tsx` (add keys to both `en` and `zh` dictionaries)

This task adds ALL new translation keys needed by every other task. Do this first so all other tasks can reference `t('keyName')` immediately.

- [ ] **Step 1: Add tip card i18n keys**

Add these keys to the `en` dictionary (after the existing keys, before the closing `}`):

```typescript
// Tip cards
tipHomeTitle: 'Daily Check-in',
tipHomeBody: 'A daily voice check-in helps track your cognitive health trends.',
tipTrainingTitle: 'Why Train Daily?',
tipTrainingBody: 'Daily training keeps your brain active. Complete 3 exercises to stay sharp.',
tipScreeningTitle: 'Voice Assessment',
tipScreeningBody: 'Voice assessments use AI to analyze your speech patterns for cognitive health signals.',
tipServicesTitle: 'Professional Services',
tipServicesBody: 'Professional services complement AI screening with clinical brain health assessments.',
tipReportsTitle: 'Your Progress',
tipReportsBody: 'View all your assessment records and trends to understand your long-term cognitive health.',
tipShowTips: 'Show Tips',
```

And the matching `zh` keys:

```typescript
tipHomeTitle: '每日签到',
tipHomeBody: '每天一次语音评估，帮助追踪您的认知健康趋势。',
tipTrainingTitle: '为什么要每日训练？',
tipTrainingBody: '每日训练帮助保持大脑活力。完成三项练习，持续锻炼认知能力。',
tipScreeningTitle: '语音评估',
tipScreeningBody: '语音评估通过AI分析您的表达，帮助了解记忆、语言和注意力状况。',
tipServicesTitle: '专业服务',
tipServicesBody: '结合AI筛查与专业医疗资源，为您提供从早筛到干预的全流程服务。',
tipReportsTitle: '您的进展',
tipReportsBody: '这里展示您所有的评估记录和趋势变化，帮助您了解长期认知健康状况。',
tipShowTips: '显示提示',
```

- [ ] **Step 2: Add training hub + game i18n keys**

Add to `en`:

```typescript
// Training hub
trainingDailyGoal: 'Daily Goal',
trainingCompleted: 'Completed',
trainingXOfY: '{{done}} of {{total}}',
trainingStartGame: 'Start',
trainingCompletedToday: 'Done ✓',

// Card Flip game
gameCardFlip: 'Memory Match',
gameCardFlipDesc: 'Find matching pairs to train your visual memory.',
gameCardFlipInstructions: 'Tap cards to flip them. Find all matching pairs!',
gameCardFlipMoves: 'Moves',
gameCardFlipTime: 'Time',
gameCardFlipComplete: 'Great Memory!',
gameCardFlipStars3: 'Perfect — you found all pairs with very few moves!',
gameCardFlipStars2: 'Well done — your memory is sharp!',
gameCardFlipStars1: 'Good effort — keep practicing to improve!',
gamePlayAgain: 'Play Again',
gameBackToTraining: 'Back to Training',

// Category Fluency game
gameCategoryFluency: 'Word Fluency',
gameCategoryFluencyDesc: 'Name as many words in a category as you can.',
gameCategoryFluencyInstructions: 'Type words that belong to the category. You have 60 seconds!',
gameCategoryFluencyPlaceholder: 'Type a word...',
gameCategoryFluencyAdd: 'Add',
gameCategoryFluencyDuplicate: 'Already added!',
gameCategoryFluencyExcellent: 'Excellent fluency! Your word recall is impressive.',
gameCategoryFluencyGood: 'Good job! You have solid word recall.',
gameCategoryFluencyPractice: 'Keep practicing — it gets easier each time!',
gameCategoryFluencyWords: '{{count}} words',
gameCatAnimals: 'Animals',
gameCatFruits: 'Fruits',
gameCatVegetables: 'Vegetables',
gameCatColors: 'Colors',
gameCatCountries: 'Countries',
gameCatKitchen: 'Kitchen Items',
gameCatVehicles: 'Vehicles',
gameCatBodyParts: 'Body Parts',

// Stroop Test
gameStroop: 'Color Match',
gameStroopDesc: 'Test your focus by matching display colors.',
gameStroopInstructions: 'A color word will appear in a DIFFERENT color. Tap the button matching the DISPLAY COLOR, not what the word says.',
gameStroopTapColor: 'What COLOR is this word displayed in?',
gameStroopRound: 'Round {{current}} of {{total}}',
gameStroopCorrect: '{{count}} correct out of {{total}}',
gameStroopAvgTime: 'Avg. time: {{time}}s',
gameStroopResultGreat: 'Excellent focus! Your attention is razor-sharp.',
gameStroopResultGood: 'Good concentration! Keep training to get even faster.',
gameStroopResultPractice: 'This is a tricky one — practice makes perfect!',
gameStroopRed: 'RED',
gameStroopBlue: 'BLUE',
gameStroopGreen: 'GREEN',
gameStroopYellow: 'YELLOW',
gameStroopTimeUp: "Time's up!",
```

Add to `zh`:

```typescript
trainingDailyGoal: '每日目标',
trainingCompleted: '已完成',
trainingXOfY: '{{done}} / {{total}}',
trainingStartGame: '开始',
trainingCompletedToday: '已完成 ✓',

gameCardFlip: '记忆配对',
gameCardFlipDesc: '找到配对的卡片，锻炼视觉记忆力。',
gameCardFlipInstructions: '点击卡片翻转，找到所有配对！',
gameCardFlipMoves: '步数',
gameCardFlipTime: '用时',
gameCardFlipComplete: '记忆力超棒！',
gameCardFlipStars3: '完美——用最少的步数找到了所有配对！',
gameCardFlipStars2: '很棒——您的记忆力很敏锐！',
gameCardFlipStars1: '不错的尝试——继续练习会更好！',
gamePlayAgain: '再玩一次',
gameBackToTraining: '返回训练',

gameCategoryFluency: '词语流畅',
gameCategoryFluencyDesc: '在限定类别中说出尽可能多的词。',
gameCategoryFluencyInstructions: '输入属于该类别的词语，限时60秒！',
gameCategoryFluencyPlaceholder: '输入词语...',
gameCategoryFluencyAdd: '添加',
gameCategoryFluencyDuplicate: '已经添加过了！',
gameCategoryFluencyExcellent: '出色的流畅性！您的词汇回忆能力令人印象深刻。',
gameCategoryFluencyGood: '做得好！您的词汇回忆能力不错。',
gameCategoryFluencyPractice: '继续练习——每次都会更容易！',
gameCategoryFluencyWords: '{{count}} 个词',
gameCatAnimals: '动物',
gameCatFruits: '水果',
gameCatVegetables: '蔬菜',
gameCatColors: '颜色',
gameCatCountries: '国家',
gameCatKitchen: '厨房用品',
gameCatVehicles: '交通工具',
gameCatBodyParts: '身体部位',

gameStroop: '颜色匹配',
gameStroopDesc: '通过辨别显示颜色来测试专注力。',
gameStroopInstructions: '屏幕会显示一个颜色词，但它的显示颜色不同。请点击与显示颜色一致的按钮，而不是文字内容。',
gameStroopTapColor: '这个字是什么颜色显示的？',
gameStroopRound: '第 {{current}} 轮，共 {{total}} 轮',
gameStroopCorrect: '{{total}} 题中答对 {{count}} 题',
gameStroopAvgTime: '平均用时：{{time}}秒',
gameStroopResultGreat: '出色的专注力！您的注意力非常敏锐。',
gameStroopResultGood: '不错的专注力！继续训练会更快。',
gameStroopResultPractice: '这个很有挑战性——多练习就会进步！',
gameStroopRed: '红',
gameStroopBlue: '蓝',
gameStroopGreen: '绿',
gameStroopYellow: '黄',
gameStroopTimeUp: '时间到！',
```

- [ ] **Step 3: Add settings i18n keys**

Add to `en`:

```typescript
// Settings
settingsTitle: 'Settings',
settingsProfile: 'Profile',
settingsName: 'Name',
settingsEmail: 'Email',
settingsBirthYear: 'Birth Year',
settingsFocusAreas: 'Focus Areas',
settingsLanguage: 'Language',
settingsNotifications: 'Notifications',
settingsDailyReminder: 'Daily Reminder',
settingsReminderTime: 'Reminder Time',
settingsAbout: 'About',
settingsAboutText: 'CognitiveCare helps you track and improve your cognitive health through AI-powered voice assessments and daily brain training.',
settingsVersion: 'Version {{version}}',
settingsResetAll: 'Reset All Data',
settingsResetConfirm: 'This will delete all your data including profile and assessments. Are you sure?',
settingsResetYes: 'Reset Everything',
```

Add to `zh`:

```typescript
settingsTitle: '设置',
settingsProfile: '个人资料',
settingsName: '姓名',
settingsEmail: '邮箱',
settingsBirthYear: '出生年份',
settingsFocusAreas: '关注领域',
settingsLanguage: '语言',
settingsNotifications: '通知',
settingsDailyReminder: '每日提醒',
settingsReminderTime: '提醒时间',
settingsAbout: '关于',
settingsAboutText: 'CognitiveCare 通过AI语音评估和每日大脑训练，帮助您追踪和改善认知健康。',
settingsVersion: '版本 {{version}}',
settingsResetAll: '重置所有数据',
settingsResetConfirm: '这将删除您的所有数据，包括个人资料和评估记录。确定要继续吗？',
settingsResetYes: '重置所有',
```

- [ ] **Step 4: Add services tab i18n keys**

Add to `en`:

```typescript
// Services
servicesBrainScreening: 'Brain Health Screening',
servicesBrainScreeningSub: 'United Family Healthcare × Prof. Guo Yi · EEG + rTMS',
servicesStandard: 'Standard',
servicesStandardDesc: 'EEG Non-invasive Screening',
servicesComprehensive: 'Comprehensive',
servicesComprehensiveDesc: 'Biomarkers & Imaging Analysis',
servicesRecommended: 'Recommended',
servicesIncludes: 'Includes all Standard items, plus:',
servicesBookConsult: 'Book Consultation',
servicesBookConfirmTitle: 'Consultation Request',
servicesBookConfirmMsg: 'Your consultation request has been submitted. We will contact you shortly.',
servicesNeuroConsult: 'Neurology consult ×2',
servicesEEG: 'EEG cognitive risk assessment',
servicesMoCA: 'MoCA cognitive assessment',
servicesMMSE: 'MMSE mental status exam',
servicesPSQI: 'PSQI sleep quality assessment',
servicesNeuro11: 'Somatic screening (Neuro-11)',
servicesBiomarkers: 'Blood biomarker panel',
servicesAmyloid: 'Aβ amyloid protein',
servicesMRI: 'Brain MRI',
servicesThyroid: 'Thyroid function',
servicesOrganFunction: 'Liver & kidney function',
servicesBloodPanel: 'CBC / glucose / lipids / B12',
servicesPrimeTitle: 'Health Protection',
servicesPrimeSub: 'Prosper Health × Allianz',
servicesPrimeName: 'Prime',
servicesPrimeCoverage: 'Coverage',
servicesPrimeDeductible: 'Deductible from',
servicesPrimeHospital: 'Hospitalization',
servicesPrimeTags: 'VIP Wards|Pre-existing OK|Health Concierge|Fast Track',
servicesLearnMore: 'Learn More',
servicesPrimeDetailTitle: 'Prime Health Protection',
servicesPrimeDetail1: 'Global coverage including hospitalization, specialist outpatient, VIP/International wards',
servicesPrimeDetail2: 'Overseas cancer treatment direct billing (up to ¥6M)',
servicesPrimeDetail3: 'Pre-existing conditions accepted (6-month stable period)',
servicesPrimeDetail4: 'Adult deductible from ¥2,000 only',
servicesPrimeDetail5: 'Personal health concierge — 1-on-1 service',
servicesPrimeDetail6: 'Fast-track access to top hospitals',
servicesContactAdvisor: 'Contact Advisor',
servicesAdvisorConfirm: 'An advisor will contact you shortly.',
servicesSpecialists: 'Specialist Booking',
servicesBookNow: 'Book',
servicesDrGuo: 'Prof. Guo Yi',
servicesDrGuoSpec: 'Chief Brain Health Expert',
servicesDrChen: 'Dr. Chen',
servicesDrChenSpec: 'Neurology',
servicesDrLi: 'Dr. Li',
servicesDrLiSpec: 'Cognitive Rehabilitation',
```

Add to `zh`:

```typescript
servicesBrainScreening: '脑健康筛查',
servicesBrainScreeningSub: '和睦家医疗 × 郭毅教授团队 · EEG + rTMS 技术',
servicesStandard: '标准版',
servicesStandardDesc: '脑电图无创初筛',
servicesComprehensive: '综合版',
servicesComprehensiveDesc: '生物标志物与功能影像学综合检查',
servicesRecommended: '推荐',
servicesIncludes: '包含标准版全部项目，另加：',
servicesBookConsult: '预约咨询',
servicesBookConfirmTitle: '预约确认',
servicesBookConfirmMsg: '您的预约咨询请求已提交，我们会尽快与您联系。',
servicesNeuroConsult: '神经内科问诊×2（首诊+复诊）',
servicesEEG: 'EEG脑电图认知风险评估',
servicesMoCA: 'MoCA蒙特利尔认知评估量表',
servicesMMSE: 'MMSE简易精神状态检查量表',
servicesPSQI: 'PSQI睡眠质量评估',
servicesNeuro11: '躯体形式障碍筛查 (Neuro-11)',
servicesBiomarkers: '血液标志物检测 (P-Tau217, GFAP, NfL)',
servicesAmyloid: 'Aβ淀粉样蛋白 (Aβ-42, Aβ-40)',
servicesMRI: '颅脑MRI (SWI序列、冠状位海马相)',
servicesThyroid: '甲状腺功能',
servicesOrganFunction: '肝功能 / 肾功能',
servicesBloodPanel: '血常规 / 血糖 / 血脂 / 铁蛋白 / 维生素B12',
servicesPrimeTitle: '健康保障',
servicesPrimeSub: '万欣和 Prosper Health × 京东安联 Allianz',
servicesPrimeName: 'Prime',
servicesPrimeCoverage: '住院保障',
servicesPrimeDeductible: '免赔额低至',
servicesPrimeHospital: '住院保障',
servicesPrimeTags: '特需/VIP部|既往症可投|私人健康管家|绿色通道',
servicesLearnMore: '了解更多',
servicesPrimeDetailTitle: '和睦致逸 高端医疗保险',
servicesPrimeDetail1: '保障覆盖全球，包含住院医疗、特定门诊、特需部/国际部/VIP部就诊',
servicesPrimeDetail2: '恶性肿瘤海外就医直付（最高600万）',
servicesPrimeDetail3: '既往症6个月稳定期可投保',
servicesPrimeDetail4: '成人免赔额仅¥2,000',
servicesPrimeDetail5: '私人健康管家一对一服务',
servicesPrimeDetail6: '权威医疗机构绿色通道',
servicesContactAdvisor: '咨询顾问',
servicesAdvisorConfirm: '顾问会尽快与您联系。',
servicesSpecialists: '专家预约',
servicesBookNow: '预约',
servicesDrGuo: '郭毅 教授',
servicesDrGuoSpec: '脑健康首席专家',
servicesDrChen: '陈医生',
servicesDrChenSpec: '神经内科',
servicesDrLi: '李医生',
servicesDrLiSpec: '认知康复',
```

- [ ] **Step 5: Add report sharing + screening i18n keys**

Add to `en`:

```typescript
// Report sharing
shareReport: 'Share Report',
shareReportTitle: 'CognitiveCare Assessment Report',
shareDate: 'Date',
shareScore: 'Overall Score',
shareRisk: 'Risk Level',
shareHighlight: 'Highlight',
shareDimensions: 'Dimension Scores',
shareRecommendation: 'Recommendation',
shareMemory: 'Memory',
shareLanguage: 'Language',
shareAttention: 'Attention',
shareExecutive: 'Executive',

// Screening updates
cognitiveGamesDesc: 'Train memory, language, and attention through fun games.',
```

Add to `zh`:

```typescript
shareReport: '分享报告',
shareReportTitle: 'CognitiveCare 认知评估报告',
shareDate: '日期',
shareScore: '综合评分',
shareRisk: '风险等级',
shareHighlight: '亮点',
shareDimensions: '维度评分',
shareRecommendation: '建议',
shareMemory: '记忆力',
shareLanguage: '语言能力',
shareAttention: '注意力',
shareExecutive: '执行功能',

cognitiveGamesDesc: '通过趣味游戏锻炼记忆力、语言和注意力。',
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add lib/i18n.tsx
git commit -m "feat: add all new i18n keys for tips, training, settings, services, sharing"
```

---

### Task 2: Create TipCard component and tipStore

**Files:**
- Create: `lib/tipStore.ts`
- Create: `components/TipCard.tsx`

- [ ] **Step 1: Create `lib/tipStore.ts`**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const K_DISMISSED = '@cc/dismissed_tips';

let dismissed: string[] = [];
let hydrated = false;

export async function hydrateTips(): Promise<void> {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(K_DISMISSED);
    dismissed = raw ? JSON.parse(raw) : [];
  } catch {
    dismissed = [];
  }
  hydrated = true;
}

export function isDismissed(tipId: string): boolean {
  return dismissed.includes(tipId);
}

export async function dismissTip(tipId: string): Promise<void> {
  if (!dismissed.includes(tipId)) {
    dismissed = [...dismissed, tipId];
    await AsyncStorage.setItem(K_DISMISSED, JSON.stringify(dismissed));
  }
}

export async function restoreTips(tipIds: string[]): Promise<void> {
  dismissed = dismissed.filter((id) => !tipIds.includes(id));
  await AsyncStorage.setItem(K_DISMISSED, JSON.stringify(dismissed));
}
```

- [ ] **Step 2: Create `components/TipCard.tsx`**

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, type, radius } from '../lib/theme';
import { useTranslation } from '../lib/i18n';
import { hydrateTips, isDismissed, dismissTip, restoreTips } from '../lib/tipStore';

type TipCardProps = {
  tipId: string;
  icon: string;
  titleKey: string;
  bodyKey: string;
};

export function TipCard({ tipId, icon, titleKey, bodyKey }: TipCardProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateTips().then(() => {
      setVisible(!isDismissed(tipId));
      setReady(true);
    });
  }, [tipId]);

  if (!ready || !visible) return null;

  return (
    <View
      style={{
        backgroundColor: '#E8F5E9',
        borderRadius: radius.md,
        padding: 14,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ ...type.labelLg, color: '#2E7D32', marginBottom: 2 }}>
          {t(titleKey as any)}
        </Text>
        <Text style={{ fontSize: 13, color: '#2E7D32', lineHeight: 18 }}>
          {t(bodyKey as any)}
        </Text>
      </View>
      <Pressable
        onPress={() => {
          dismissTip(tipId);
          setVisible(false);
        }}
        hitSlop={8}
      >
        <MaterialIcons name="close" size={18} color="#2E7D32" style={{ opacity: 0.5 }} />
      </Pressable>
    </View>
  );
}

export function TipRestoreButton({ tipIds }: { tipIds: string[] }) {
  const { t } = useTranslation();
  const [anyDismissed, setAnyDismissed] = useState(false);

  useEffect(() => {
    hydrateTips().then(() => {
      setAnyDismissed(tipIds.some((id) => isDismissed(id)));
    });
  }, [tipIds]);

  if (!anyDismissed) return null;

  return (
    <Pressable
      onPress={async () => {
        await restoreTips(tipIds);
        setAnyDismissed(false);
      }}
      style={{
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: colors.secondaryContainer,
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      }}
    >
      <Text style={{ fontSize: 16 }}>💡</Text>
      <Text style={{ ...type.labelLg, color: colors.onSecondaryContainer }}>
        {t('tipShowTips' as any)}
      </Text>
    </Pressable>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add lib/tipStore.ts components/TipCard.tsx
git commit -m "feat: add TipCard component and tipStore for dismissable inline tips"
```

---

### Task 3: Add training progress tracking to profileStore

**Files:**
- Modify: `lib/profileStore.ts`

- [ ] **Step 1: Add training state and helpers**

In `lib/profileStore.ts`, add new AsyncStorage key after existing keys (line ~29):

```typescript
const K_TRAINING = '@cc/training/v1';
```

Add training state type and merge into hydrate/persist. After the `persist` function, add:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/profileStore.ts
git commit -m "feat: add training progress tracking to profileStore"
```

---

### Task 4: Training hub and navigation layout

**Files:**
- Create: `app/training/_layout.tsx`
- Modify: `app/(tabs)/training.tsx` (full rewrite)

- [ ] **Step 1: Create `app/training/_layout.tsx`**

```tsx
import { Stack } from 'expo-router';
import { colors } from '../../lib/theme';

export default function TrainingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
```

- [ ] **Step 2: Rewrite `app/(tabs)/training.tsx`**

Replace the entire file with the training hub. Read the full current file first, then replace:

```tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, type, radius, shadow } from '../../lib/theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TipCard, TipRestoreButton } from '../../components/TipCard';
import { ScoreRing } from '../../components/ScoreRing';
import { useTranslation } from '../../lib/i18n';
import { hydrateTraining, getTraining } from '../../lib/profileStore';

const GAMES = [
  { id: 'card-flip', icon: '🧠', nameKey: 'gameCardFlip', descKey: 'gameCardFlipDesc', color: '#E8F5E9', route: '/training/card-flip' },
  { id: 'category-fluency', icon: '🗣️', nameKey: 'gameCategoryFluency', descKey: 'gameCategoryFluencyDesc', color: '#FFF8E1', route: '/training/category-fluency' },
  { id: 'stroop', icon: '🎯', nameKey: 'gameStroop', descKey: 'gameStroopDesc', color: '#E8EAF6', route: '/training/stroop' },
] as const;

export default function Training() {
  const { t } = useTranslation();
  const router = useRouter();
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    hydrateTraining().then(() => {
      setCompleted(getTraining().completed);
    });
  }, []);

  // Re-check on focus
  useEffect(() => {
    const interval = setInterval(() => {
      setCompleted(getTraining().completed);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const done = completed.length;
  const total = GAMES.length;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t('tabTraining')} />
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <TipCard tipId="training_intro" icon="💡" titleKey="tipTrainingTitle" bodyKey="tipTrainingBody" />

        {/* Daily Progress */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <ScoreRing progress={total > 0 ? done / total : 0} size={100} strokeWidth={8} color={colors.secondary}>
            <Text style={{ ...type.headlineMd, color: colors.onSurface }}>{done}/{total}</Text>
            <Text style={{ ...type.labelMd, color: colors.onSurfaceVariant }}>{t('trainingDailyGoal')}</Text>
          </ScoreRing>
        </View>

        {/* Game Cards */}
        {GAMES.map((game) => {
          const isDone = completed.includes(game.id);
          return (
            <Pressable
              key={game.id}
              onPress={() => {
                if (!isDone) router.push(game.route as any);
              }}
              style={{
                ...shadow.soft,
                backgroundColor: '#fff',
                borderRadius: radius.lg,
                padding: 18,
                marginBottom: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                opacity: isDone ? 0.7 : 1,
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: game.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 26 }}>{game.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...type.titleLg, color: colors.onSurface }}>{t(game.nameKey as any)}</Text>
                <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant, marginTop: 2 }}>
                  {t(game.descKey as any)}
                </Text>
              </View>
              {isDone ? (
                <Text style={{ ...type.labelLg, color: colors.secondary }}>{t('trainingCompletedToday')}</Text>
              ) : (
                <View style={{ backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 }}>
                  <Text style={{ ...type.labelLg, color: '#fff' }}>{t('trainingStartGame')}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      <TipRestoreButton tipIds={['training_intro']} />
    </SafeAreaView>
  );
}
```

- [ ] **Step 3: Add training route to root layout**

In `app/_layout.tsx`, add a new Stack.Screen for training inside the `<Stack>` (after the assessment screen):

```tsx
<Stack.Screen name="training" options={{ presentation: 'card' }} />
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add app/training/_layout.tsx app/(tabs)/training.tsx app/_layout.tsx
git commit -m "feat: training hub with daily progress and game cards"
```

---

### Task 5: Card Flip memory game

**Files:**
- Create: `app/training/card-flip.tsx`

- [ ] **Step 1: Create the Card Flip game screen**

Create `app/training/card-flip.tsx` with the complete game: a 4×3 grid of emoji cards, flip animation, match logic, and result screen. The game should:

- Shuffle 6 emoji pairs into a 12-card grid
- Track flipped state, matched pairs, move count, and elapsed time
- On game complete, show result screen with star rating and score
- Call `completeTraining('card-flip')` on game complete
- Have "Play Again" and "Back to Training" buttons
- Use `useTranslation()` for all text with the i18n keys from Task 1

Key implementation details:
- Use `Animated.Value` for card flip rotation (0 = face down, 1 = face up)
- `Animated.timing` with 300ms duration for flip
- When two cards are face-up and don't match, flip both back after 800ms
- When matched, change background to `colors.secondaryContainer`
- Star rating: 3 stars if moves < 12, 2 stars if moves < 18, else 1 star
- Time display in seconds (e.g. "23s")
- Use `useRef` for timer interval, clear on unmount

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/training/card-flip.tsx
git commit -m "feat: card flip memory game with flip animation and scoring"
```

---

### Task 6: Category Fluency language game

**Files:**
- Create: `app/training/category-fluency.tsx`

- [ ] **Step 1: Create the Category Fluency game screen**

Create `app/training/category-fluency.tsx` with the complete game: category prompt, 60-second timer, text input, word pills, and result screen. The game should:

- Pick a random category from 8 options (using i18n keys `gameCatAnimals` through `gameCatBodyParts`)
- Show a 60-second countdown timer as both a number and an animated progress bar
- Text input at bottom with "Add" button; pressing enter also adds
- Words appear as colored pills/tags in a flex-wrap container
- Case-insensitive duplicate detection with brief toast feedback using the `gameCategoryFluencyDuplicate` key
- Haptic feedback (via `expo-haptics` if available, or skip) at 10 seconds remaining
- On timer end, show result screen: word count, list of words, encouraging message
- Scoring thresholds: 10+ = excellent (`gameCategoryFluencyExcellent`), 6-9 = good (`gameCategoryFluencyGood`), <6 = practice (`gameCategoryFluencyPractice`)
- Call `completeTraining('category-fluency')` on game end
- "Play Again" and "Back to Training" buttons

Key implementation details:
- Timer: `useRef` with `setInterval` every 1000ms, decrement from 60
- Progress bar: `Animated.timing` from 1 to 0 over 60 seconds
- Input uses `TextInput` with `onSubmitEditing` for enter key
- `FlatList` or `ScrollView` with `flexWrap: 'wrap'` for word pills

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/training/category-fluency.tsx
git commit -m "feat: category fluency language game with timer and word tracking"
```

---

### Task 7: Stroop Test attention game

**Files:**
- Create: `app/training/stroop.tsx`

- [ ] **Step 1: Create the Stroop Test game screen**

Create `app/training/stroop.tsx` with the complete game: instruction screen, 10 rounds of color-word mismatch, and result screen. The game should:

- Start with an instruction screen explaining the rule, with a "Start" button
- 10 rounds: display a color word (e.g. "RED"/"红") in a DIFFERENT display color
- 4 color buttons at bottom: Red (#E53935), Blue (#1E88E5), Green (#43A047), Yellow (#FDD835)
- Button labels use i18n keys (`gameStroopRed` etc.)
- User taps the button matching the DISPLAY COLOR
- Correct: brief green flash on the button, advance to next round after 400ms
- Wrong: brief red flash, show correct answer text for 800ms, then advance
- 5-second timeout per round (show `gameStroopTimeUp`, count as wrong)
- Track: correct count, reaction times for correct answers
- On game complete, show result screen: accuracy (X/10), average reaction time, encouraging message
- Thresholds: 8+ correct = great, 5-7 = good, <5 = practice
- Call `completeTraining('stroop')` on game complete
- "Play Again" and "Back to Training" buttons

Key implementation details:
- Colors array: `[{ id: 'red', hex: '#E53935', key: 'gameStroopRed' }, ...]`
- Each round: pick a random word and a DIFFERENT random display color
- Ensure word !== display color (the Stroop effect)
- Use `Date.now()` to measure reaction time from round start to button press
- Average time formatted to 1 decimal place (e.g. "1.2s")
- Round counter shows `gameStroopRound` with `{{current}}` and `{{total}}`

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/training/stroop.tsx
git commit -m "feat: stroop test attention game with color-word mismatch and timing"
```

---

### Task 8: Settings page and ScreenHeader wiring

**Files:**
- Create: `app/settings.tsx`
- Modify: `components/ScreenHeader.tsx`
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Create `app/settings.tsx`**

Create the settings screen as a modal page. It should have sections for:

1. **Profile** — name (read-only Text), email (read-only Text), birth year (horizontal ScrollView picker like onboarding), focus areas (multi-select toggles like onboarding). Birth year and focus area changes call `updateProfile()` from profileStore.
2. **Language** — Pressable toggle between "English" and "中文", calls `setLocale()` from i18n context
3. **Notifications** — "Daily Reminder" toggle (visual only, state in local `useState`), time display "9:00 AM" (non-functional placeholder)
4. **About** — version text "1.0.0", description using `settingsAboutText` i18n key
5. **Reset** — red "Reset All Data" button with Alert.alert confirmation, calls `resetAll()` and navigates to `/(auth)/signup`

UI pattern: ScrollView with section cards, each section has a header label and content in a white rounded card. Back button at top to dismiss.

- [ ] **Step 2: Add settings route to root layout**

In `app/_layout.tsx`, add inside the `<Stack>`:

```tsx
<Stack.Screen name="settings" options={{ presentation: 'modal' }} />
```

- [ ] **Step 3: Wire ScreenHeader settings button**

In `components/ScreenHeader.tsx`, add `useRouter` import from `expo-router` and add `onPress` to the settings Pressable:

```tsx
onPress={() => router.push('/settings')}
```

The settings Pressable is on line 58-68. Add `onPress` to it.

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add app/settings.tsx app/_layout.tsx components/ScreenHeader.tsx
git commit -m "feat: settings page with profile editing, language toggle, and reset"
```

---

### Task 9: Services tab redesign

**Files:**
- Modify: `app/(tabs)/services.tsx` (full rewrite)

- [ ] **Step 1: Rewrite `app/(tabs)/services.tsx`**

Read the current file first, then replace entirely. The new layout should be a ScrollView with these sections top to bottom:

1. **ScreenHeader** with `t('tabServices')` title
2. **TipCard** — tipId `services_intro`, icon `💡`, using services tip i18n keys
3. **Brain Health Screening section** — section header with title/subtitle, then two package cards:
   - **Standard (标准版)**: green gradient LinearGradient-style header (use View with backgroundColor since no expo-linear-gradient), price ~~¥2,500~~ ¥1,880, 6 checklist items with ✓ icons, "预约咨询" button → `Alert.alert(t('servicesBookConfirmTitle'), t('servicesBookConfirmMsg'))`
   - **Comprehensive (综合版)**: dark teal header, "推荐" badge, price ~~¥11,000~~ ¥7,800, "包含标准版全部" label, 6 additional items, primary-colored CTA button
4. **Prime Insurance card** — indigo gradient background, "和睦致逸" title, "Prime" badge, two stat boxes (800万 coverage, ¥2,000 deductible), 4 tag pills, price ¥2,999/yr, "了解更多" button → `Alert.alert()` with full benefits list and "咨询顾问" CTA
5. **Specialist Booking** — horizontal ScrollView with 3 doctor cards (郭毅教授, 陈医生, 李医生), each with avatar circle, name, specialty, "预约" button → Alert confirmation
6. **TipRestoreButton** for `['services_intro']`

Use the existing app patterns: `SafeAreaView edges={['top']}`, `ScreenHeader`, `colors`, `type`, `radius`, `shadow` from theme.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/services.tsx
git commit -m "feat: services tab with brain health screening packages, Prime insurance, and specialist booking"
```

---

### Task 10: Report sharing

**Files:**
- Modify: `app/assessment/report.tsx`

- [ ] **Step 1: Add share button to report screen**

Read `app/assessment/report.tsx` first. Then add:

1. Import `Share` from `react-native` (add to existing import)
2. Import `localizedDate` from i18n
3. Add a share function that builds a text summary using the current report data and locale:

```typescript
const handleShare = async () => {
  const r = report; // from getState()
  if (!r) return;
  const isZh = locale === 'zh';
  const riskLabels = { low: isZh ? '低风险' : 'Low', moderate: isZh ? '中等风险' : 'Moderate', elevated: isZh ? '需关注' : 'Elevated' };
  const text = [
    `[${t('shareReportTitle')}]`,
    '',
    `${t('shareDate')}: ${localizedDate(new Date().toISOString(), locale)}`,
    `${t('shareScore')}: ${r.score}/100`,
    `${t('shareRisk')}: ${riskLabels[r.riskLevel]}`,
    '',
    `${t('shareHighlight')}: ${r.headline}`,
    '',
    `${t('shareDimensions')}:`,
    `• ${t('shareMemory')}: ${r.dimensions.memory}  • ${t('shareLanguage')}: ${r.dimensions.language}`,
    `• ${t('shareAttention')}: ${r.dimensions.attention}  • ${t('shareExecutive')}: ${r.dimensions.executive}`,
    '',
    `${t('shareRecommendation')}: ${r.recommendations[0]}`,
  ].join('\n');
  await Share.share({ message: text });
};
```

4. Add a share button in the header area of the report (after the close button or in the top action bar). Style it as a circular Pressable with `MaterialIcons name="share"`.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/assessment/report.tsx
git commit -m "feat: add share button to assessment report screen"
```

---

### Task 11: Screening polish + tip cards on all tab screens

**Files:**
- Modify: `app/(tabs)/screening.tsx`
- Modify: `app/(tabs)/index.tsx`
- Modify: `app/(tabs)/reports.tsx`

- [ ] **Step 1: Fix screening cognitive games card**

Read `app/(tabs)/screening.tsx`. Find the Cognitive Games card (look for "Coming Soon" or `comingSoon` or `opacity: 0.75`). Make these changes:
- Remove `opacity: 0.75` style
- Remove the "Coming Soon" label/text
- Add `onPress={() => router.push('/(tabs)/training')}` to the card Pressable
- Change the description to use `t('cognitiveGamesDesc')`
- Add `TipCard` at top of the ScrollView content (after ScreenHeader, before the first card):

```tsx
<TipCard tipId="screening_intro" icon="💡" titleKey="tipScreeningTitle" bodyKey="tipScreeningBody" />
```

- Add `TipRestoreButton` with `tipIds={['screening_intro']}` at the end (before closing SafeAreaView)
- Add imports for `TipCard`, `TipRestoreButton` from `../../components/TipCard`

- [ ] **Step 2: Add tip card to Home screen**

Read `app/(tabs)/index.tsx`. Add a `TipCard` inside the ScrollView content, after the ScreenHeader and before the hero/greeting section:

```tsx
<TipCard tipId="home_welcome" icon="💡" titleKey="tipHomeTitle" bodyKey="tipHomeBody" />
```

Add `TipRestoreButton` with `tipIds={['home_welcome']}` before closing SafeAreaView.
Add imports for `TipCard`, `TipRestoreButton` from `../../components/TipCard`.

- [ ] **Step 3: Add tip card to Reports screen**

Read `app/(tabs)/reports.tsx`. Add a `TipCard` inside the ScrollView content, after ScreenHeader:

```tsx
<TipCard tipId="reports_intro" icon="💡" titleKey="tipReportsTitle" bodyKey="tipReportsBody" />
```

Add `TipRestoreButton` with `tipIds={['reports_intro']}` before closing SafeAreaView.
Add imports for `TipCard`, `TipRestoreButton` from `../../components/TipCard`.

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add app/(tabs)/screening.tsx app/(tabs)/index.tsx app/(tabs)/reports.tsx
git commit -m "feat: activate cognitive games card, add tip cards to all tab screens"
```

---

### Task 12: Final integration verification

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Verify all new routes exist**

Check that these files exist:
- `app/training/_layout.tsx`
- `app/training/card-flip.tsx`
- `app/training/category-fluency.tsx`
- `app/training/stroop.tsx`
- `app/settings.tsx`
- `components/TipCard.tsx`
- `lib/tipStore.ts`

- [ ] **Step 3: Commit any remaining fixes**

If any TypeScript errors were found and fixed, commit them:

```bash
git add -A
git commit -m "fix: resolve integration issues from feature completion"
```
