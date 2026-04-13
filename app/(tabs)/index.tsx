import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, type, radius, shadow, spacing } from '../../lib/theme';
import { ScoreRing } from '../../components/ScoreRing';
import { ScreenHeader } from '../../components/ScreenHeader';
import {
  useAppState,
  firstName,
  latestAssessment,
  daysSinceLastAssessment,
  weeklyStreak,
  resetAll,
  hydrateTraining,
  getTraining,
} from '../../lib/profileStore';
import { setReport, setTranscript, setClockImageUrl, setKind } from '../../lib/assessmentStore';
import { useTranslation, localizedGreeting, localizedDate, localizedTime } from '../../lib/i18n';

const GAMES = [
  { id: 'card-flip', icon: '🧠', nameKey: 'gameCardFlip', descKey: 'gameCardFlipDesc', color: colors.secondaryContainer, route: '/training/card-flip' },
  { id: 'category-fluency', icon: '🗣️', nameKey: 'gameCategoryFluency', descKey: 'gameCategoryFluencyDesc', color: colors.tertiaryFixed, route: '/training/category-fluency' },
  { id: 'stroop', icon: '🎯', nameKey: 'gameStroop', descKey: 'gameStroopDesc', color: colors.primaryFixed, route: '/training/stroop' },
] as const;

/**
 * Compact horizontal card used for both clinical tests on the Home tab.
 * Both the Clock Drawing Test and the Voice Check-In share this template
 * so they read as peer assessments rather than hero + secondary.
 */
function TestCard({
  title,
  body,
  icon,
  background,
  foreground,
  onPress,
}: {
  title: string;
  body: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  background: string;
  foreground: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: background,
        padding: 24,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        opacity: pressed ? 0.92 : 1,
        ...shadow.soft,
      })}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainerLowest,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name={icon} size={32} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ ...type.titleLg, color: foreground }}>{title}</Text>
        <Text
          style={{
            ...type.bodyMd,
            color: foreground,
            opacity: 0.85,
            marginTop: 2,
          }}
        >
          {body}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={foreground} />
    </Pressable>
  );
}

const DAY_KEYS = ['daySun', 'dayMon', 'dayTue', 'dayWed', 'dayThu', 'dayFri', 'daySat'] as const;

export default function Home() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const appState = useAppState();
  const { profile, assessments } = appState;
  const name = firstName(profile);
  const latest = latestAssessment(appState);
  const daysSince = daysSinceLastAssessment(appState);
  const streak = weeklyStreak(appState);
  const dueToday = daysSince === null || daysSince >= 1;

  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    hydrateTraining().then(() => setCompleted(getTraining().completed));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompleted(getTraining().completed);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Build 7 days starting from today for activity grid
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const assessmentsByDay = new Map<string, number>();
  assessments.forEach((a) => {
    const key = new Date(a.date).toDateString();
    if (!assessmentsByDay.has(key)) {
      assessmentsByDay.set(key, a.report.score);
    }
  });

  const RISK_LABEL = {
    low: { label: t('riskLow'), bg: colors.secondaryContainer, fg: colors.onSecondaryContainer },
    moderate: { label: t('riskModerate'), bg: colors.tertiaryFixed, fg: colors.onTertiaryFixed },
    elevated: { label: t('riskElevated'), bg: colors.errorContainer, fg: colors.onErrorContainer },
  };

  const trainingDone = completed.length;
  const trainingTotal = GAMES.length;

  function startVoiceAssessment() {
    // Clear any lingering clock / questionnaire state from a prior session
    // in this run so the upcoming voice report renders cleanly.
    setClockImageUrl('');
    setKind('voice');
    router.push('/assessment/record');
  }

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
      <ScreenHeader title={t('headerCognitiveCare')} showLogo />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, gap: 32 }}
        showsVerticalScrollIndicator={false}
      >
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
        </View>

        {/* Clinical tests — questionnaire first, clock second, voice third. Same compact template. */}
        <View style={{ gap: spacing.md }}>
          <TestCard
            title={t('homeQuestionnaireCardTitle')}
            body={t('homeQuestionnaireCardBody')}
            icon="fact-check"
            background={colors.primaryContainer}
            foreground={colors.onPrimaryContainer}
            onPress={() => {
              setClockImageUrl('');
              setKind('questionnaire');
              router.push('/assessment/questionnaire/questions');
            }}
          />
          <TestCard
            title={t('homeClockCardTitle')}
            body={t('homeClockCardBody')}
            icon="schedule"
            background={colors.secondaryContainer}
            foreground={colors.onSecondaryContainer}
            onPress={() => {
              setKind('clock');
              router.push('/assessment/clock/draw');
            }}
          />
          <TestCard
            title={dueToday ? t('dailyCheckIn') : t('extraAssessment')}
            body={t('voiceCheckDesc')}
            icon="mic"
            background={colors.tertiaryFixed}
            foreground={colors.onTertiaryFixed}
            onPress={startVoiceAssessment}
          />
        </View>

        {/* Activity — Duolingo-style 7-day grid */}
        <View style={{ gap: 16 }}>
          <Text style={{ ...type.headlineMd, color: colors.primary }}>{t('activity')}</Text>
          <View
            style={{
              backgroundColor: colors.surfaceContainerLowest,
              padding: 24,
              borderRadius: 24,
              ...shadow.card,
              gap: 20,
            }}
          >
            {/* 7-day row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {next7Days.map((day, i) => {
                const isToday = day.toDateString() === new Date().toDateString();
                const score = assessmentsByDay.get(day.toDateString());
                const hasAssessment = score !== undefined;
                const dayKey = DAY_KEYS[day.getDay()];

                return (
                  <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                    <Text style={{ ...type.labelMd, color: colors.outline }}>
                      {t(dayKey as any)}
                    </Text>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: hasAssessment ? colors.secondary : colors.surfaceContainerLow,
                        borderWidth: isToday && !hasAssessment ? 2 : 0,
                        borderColor: colors.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {hasAssessment ? (
                        <Text style={{ ...type.labelLg, color: '#fff', fontWeight: '700' }}>
                          {Math.round(score!)}
                        </Text>
                      ) : isToday ? (
                        <MaterialIcons name="add" size={18} color={colors.primary} />
                      ) : (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: colors.outlineVariant,
                          }}
                        />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Streak */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialIcons name="local-fire-department" size={24} color={colors.tertiary} />
                <Text style={{ ...type.titleLg, color: colors.primary }}>
                  {t('dayStreak', { count: streak })}
                </Text>
              </View>
              {!dueToday && (
                <View
                  style={{
                    backgroundColor: colors.secondaryContainer,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 999,
                  }}
                >
                  <Text style={{ ...type.labelLg, color: colors.onSecondaryContainer }}>
                    {t('todayDone')}
                  </Text>
                </View>
              )}
            </View>

            {/* CTA if today not done */}
            {dueToday && (
              <Pressable
                onPress={startVoiceAssessment}
                style={({ pressed }) => ({
                  backgroundColor: colors.primary,
                  paddingVertical: 14,
                  borderRadius: radius.full,
                  alignItems: 'center',
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text style={{ ...type.titleLg, color: '#fff' }}>
                  {t('todayNotDone')}
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Daily Training */}
        <View style={{ gap: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ ...type.headlineMd, color: colors.primary }}>{t('dailyTraining')}</Text>
            <Text style={{ ...type.labelLg, color: colors.secondary }}>
              {trainingDone}/{trainingTotal}
            </Text>
          </View>
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
                  backgroundColor: colors.surfaceContainerLowest,
                  borderRadius: radius.lg,
                  padding: spacing.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  opacity: isDone ? 0.7 : 1,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    backgroundColor: game.color,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{game.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...type.titleLg, color: colors.onSurface }}>{t(game.nameKey as any)}</Text>
                </View>
                {isDone ? (
                  <Text style={{ ...type.labelLg, color: colors.secondary }}>{t('trainingCompletedToday' as any)}</Text>
                ) : (
                  <View style={{ backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}>
                    <Text style={{ ...type.labelLg, color: '#fff' }}>{t('trainingStartGame' as any)}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Latest recommendation */}
        {latest?.report.recommendations[0] && (
          <View
            style={{
              backgroundColor: colors.tertiaryFixed,
              padding: 28,
              borderRadius: 24,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <MaterialIcons name="lightbulb" size={24} color={colors.tertiary} />
              <Text style={{ ...type.titleLg, color: colors.onTertiaryFixed }}>
                {t('recommendationFor', { name })}
              </Text>
            </View>
            <Text style={{ ...type.bodyLg, color: colors.onTertiaryFixed }}>
              {latest.report.recommendations[0]}
            </Text>
          </View>
        )}

        {/* All Assessments list */}
        {assessments.length > 0 && (
          <View style={{ gap: 16 }}>
            <Text style={{ ...type.headlineMd, color: colors.primary }}>{t('allAssessments')}</Text>
            {assessments.map((a) => {
              const kind = a.kind ?? 'voice';
              const isClock = kind === 'clock';
              const isQuestionnaire = kind === 'questionnaire';
              const tileBg = isQuestionnaire
                ? colors.primaryContainer
                : isClock
                  ? colors.tertiaryFixed
                  : colors.secondaryFixed;
              const tileFg = isQuestionnaire
                ? colors.onPrimaryContainer
                : isClock
                  ? colors.onTertiaryFixed
                  : colors.onSecondaryFixed;
              return (
                <Pressable
                  key={a.id}
                  onPress={() => {
                    setReport(a.report);
                    setTranscript(a.transcript);
                    // Restore (or clear) the clock image and kind so the report
                    // screen renders the correct variant for this historical entry.
                    setClockImageUrl(isClock && a.imageUrl ? a.imageUrl : '');
                    setKind(kind);
                    router.push('/assessment/report');
                  }}
                  style={({ pressed }) => ({
                    backgroundColor: colors.surfaceContainerLowest,
                    padding: 20,
                    borderRadius: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 16,
                        backgroundColor: tileBg,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isClock ? (
                        <MaterialIcons name="schedule" size={24} color={tileFg} />
                      ) : isQuestionnaire ? (
                        <MaterialIcons name="fact-check" size={24} color={tileFg} />
                      ) : (
                        <Text style={{ ...type.titleLg, color: tileFg }}>
                          {Math.round(a.report.score)}
                        </Text>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...type.bodyLg, color: colors.primary, fontWeight: '700' }}>
                        {localizedDate(a.date, locale)}
                      </Text>
                      <Text
                        style={{
                          ...type.labelMd,
                          color: colors.outline,
                          textTransform: 'none',
                          marginTop: 2,
                        }}
                      >
                        {isClock
                          ? `${t('clockBadge')} • ${Math.round(a.report.score)} • ${localizedTime(a.date, locale)}`
                          : isQuestionnaire
                            ? `${t('questionnaireBadge')} • ${RISK_LABEL[a.report.riskLevel].label} • ${localizedTime(a.date, locale)}`
                            : `${RISK_LABEL[a.report.riskLevel].label} • ${localizedTime(a.date, locale)}`}
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.outlineVariant} />
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Reset demo */}
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Pressable onPress={confirmReset} style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
            <Text style={{ ...type.labelMd, color: colors.outline, textTransform: 'uppercase' }}>
              {t('resetDemo')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
