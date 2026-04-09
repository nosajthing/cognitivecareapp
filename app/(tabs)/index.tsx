import React from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, type, radius, shadow } from '../../lib/theme';
import { ScoreRing } from '../../components/ScoreRing';
import { ScreenHeader } from '../../components/ScreenHeader';
import {
  useAppState,
  firstName,
  latestAssessment,
  daysSinceLastAssessment,
  weeklyStreak,
  resetAll,
  seedDemoData,
  type FocusArea,
} from '../../lib/profileStore';
import { useTranslation, localizedGreeting } from '../../lib/i18n';
import { TipCard, TipRestoreButton } from '../../components/TipCard';

type TipKey = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  titleKey: string;
  bodyKey: string;
};

const TIPS_BY_FOCUS: Record<FocusArea, TipKey[]> = {
  memory: [
    { icon: 'lightbulb', titleKey: 'tipBlueberriesTitle', bodyKey: 'tipBlueberriesBody' },
    { icon: 'auto-stories', titleKey: 'tipStoriesTitle', bodyKey: 'tipStoriesBody' },
  ],
  language: [
    { icon: 'translate', titleKey: 'tipReadAloudTitle', bodyKey: 'tipReadAloudBody' },
    { icon: 'chat', titleKey: 'tipNameThingsTitle', bodyKey: 'tipNameThingsBody' },
  ],
  attention: [
    { icon: 'center-focus-strong', titleKey: 'tipSingleTaskTitle', bodyKey: 'tipSingleTaskBody' },
    { icon: 'self-improvement', titleKey: 'tipBreathTitle', bodyKey: 'tipBreathBody' },
  ],
  sleep: [
    { icon: 'bedtime', titleKey: 'tipSleepTitle', bodyKey: 'tipSleepBody' },
    { icon: 'nights-stay', titleKey: 'tipDimTitle', bodyKey: 'tipDimBody' },
  ],
  social: [
    { icon: 'groups', titleKey: 'tipCallTitle', bodyKey: 'tipCallBody' },
    { icon: 'coffee', titleKey: 'tipMealTitle', bodyKey: 'tipMealBody' },
  ],
};

const DEFAULT_TIPS: TipKey[] = [
  { icon: 'lightbulb', titleKey: 'tipBlueberriesTitle', bodyKey: 'tipBlueberriesBody' },
  { icon: 'nightlight-round', titleKey: 'tipSleepTitle', bodyKey: 'tipSleepBody' },
];

export default function Home() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const appState = useAppState();
  const { profile } = appState;
  const name = firstName(profile);
  const latest = latestAssessment(appState);
  const daysSince = daysSinceLastAssessment(appState);
  const streak = weeklyStreak(appState);

  const vitality = latest?.report.score ?? null;
  const dueToday = daysSince === null || daysSince >= 1;

  const tips = (profile?.focusAreas ?? []).length > 0
    ? profile!.focusAreas.flatMap((f) => TIPS_BY_FOCUS[f]).slice(0, 3)
    : DEFAULT_TIPS;

  function confirmReset() {
    Alert.alert(
      t('resetDemoTitle'),
      t('resetDemoMsg'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('reset'),
          style: 'destructive',
          onPress: async () => {
            await resetAll();
            router.replace('/(auth)/signup');
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t('headerCognitiveCare')} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, gap: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <TipCard tipId="home_welcome" icon="💡" titleKey="tipHomeTitle" bodyKey="tipHomeBody" />
        {/* Greeting */}
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 40,
              fontWeight: '800',
              color: colors.primary,
              letterSpacing: -0.8,
              lineHeight: 44,
            }}
          >
            {localizedGreeting(locale)},{'\n'}
            {name}.
          </Text>
          <Text style={{ ...type.bodyLg, color: colors.onSurfaceVariant, opacity: 0.85 }}>
            {latest
              ? dueToday
                ? t('statusCheckIn')
                : t('statusGreatWork')
              : t('statusBaseline')}
          </Text>

          {vitality !== null && (
            <View
              style={{
                marginTop: 24,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                backgroundColor: colors.surfaceContainerLow,
                padding: 24,
                borderRadius: radius.xl,
              }}
            >
              <ScoreRing size={80} stroke={8} progress={vitality / 100} label={`${Math.round(vitality)}`} />
              <View>
                <Text style={{ ...type.headlineSm, color: colors.primary }}>{t('dailyVitality')}</Text>
                <Text
                  style={{
                    ...type.labelMd,
                    color: colors.outline,
                    textTransform: 'uppercase',
                    marginTop: 4,
                  }}
                >
                  {vitality >= 80 ? t('optimumRange') : vitality >= 60 ? t('goodRange') : t('building')}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Hero CTA */}
        <Pressable
          onPress={() => router.push('/assessment/record')}
          style={({ pressed }) => ({
            backgroundColor: colors.primary,
            padding: 32,
            borderRadius: 32,
            opacity: pressed ? 0.92 : 1,
            ...shadow.card,
          })}
        >
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(255,255,255,0.2)',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 999,
            }}
          >
            <Text style={{ ...type.labelMd, color: '#fff', letterSpacing: 1.2 }}>
              {dueToday ? t('badgeToday') : t('badgeNextActivity')}
            </Text>
          </View>
          <Text style={{ ...type.headlineLg, color: '#fff', marginTop: 12 }}>
            {dueToday ? t('dailyCheckIn') : t('extraAssessment')}
          </Text>
          <Text style={{ ...type.bodyLg, color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>
            {t('voiceCheckDesc')}
          </Text>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: colors.secondaryContainer,
              paddingHorizontal: 28,
              paddingVertical: 14,
              borderRadius: 20,
              alignSelf: 'flex-start',
            }}
          >
            <MaterialIcons name="play-arrow" size={22} color={colors.onSecondaryContainer} />
            <Text style={{ ...type.titleLg, color: colors.onSecondaryContainer }}>
              {dueToday ? t('startNow') : t('doAnother')}
            </Text>
          </View>
        </Pressable>

        {/* Tips */}
        <View style={{ gap: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <Text style={{ ...type.titleLg, color: colors.primary }}>
              {profile?.focusAreas && profile.focusAreas.length > 0 ? t('tipsForYou') : t('cognitiveTips')}
            </Text>
            <Text style={{ ...type.labelLg, color: colors.secondary }}>{t('viewAll')}</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingRight: 16 }}
          >
            {tips.map((tip, i) => (
              <View
                key={i}
                style={{
                  width: 280,
                  padding: 24,
                  borderRadius: 32,
                  backgroundColor: colors.surfaceContainerLowest,
                  borderWidth: 1,
                  borderColor: 'rgba(190,200,203,0.1)',
                  gap: 16,
                  ...shadow.soft,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    backgroundColor: colors.tertiaryFixed,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialIcons name={tip.icon} size={24} color={colors.tertiary} />
                </View>
                <Text style={{ ...type.headlineSm, color: colors.primary }}>{t(tip.titleKey as any)}</Text>
                <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>{t(tip.bodyKey as any)}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bento stats */}
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 1, backgroundColor: '#fff', padding: 24, borderRadius: 24, ...shadow.soft }}>
            <MaterialIcons name="insights" size={24} color={colors.secondary} />
            <Text
              style={{
                ...type.labelMd,
                color: colors.outline,
                textTransform: 'uppercase',
                marginTop: 12,
              }}
            >
              {t('weeklyStreak')}
            </Text>
            <Text style={{ ...type.headlineLg, color: colors.primary, marginTop: 4 }}>
              {streak} {streak === 1 ? t('day_one') : t('day_other')}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff', padding: 24, borderRadius: 24, ...shadow.soft }}>
            <MaterialIcons name="event-available" size={24} color={colors.tertiary} />
            <Text
              style={{
                ...type.labelMd,
                color: colors.outline,
                textTransform: 'uppercase',
                marginTop: 12,
              }}
            >
              {t('assessments')}
            </Text>
            <Text style={{ ...type.headlineLg, color: colors.primary, marginTop: 4 }}>
              {appState.assessments.length}
            </Text>
          </View>
        </View>

        {/* Demo controls */}
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Pressable
            onPress={async () => {
              await seedDemoData(locale);
              Alert.alert(t('demoDataLoaded'), t('demoDataLoadedMsg'));
            }}
            style={{ paddingVertical: 12, paddingHorizontal: 16 }}
          >
            <Text style={{ ...type.labelMd, color: colors.secondary, textTransform: 'uppercase' }}>
              {t('loadDemoData')}
            </Text>
          </Pressable>
          <Pressable onPress={confirmReset} style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
            <Text style={{ ...type.labelMd, color: colors.outline, textTransform: 'uppercase' }}>
              {t('resetDemo')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      <TipRestoreButton tipIds={['home_welcome']} />
    </SafeAreaView>
  );
}
