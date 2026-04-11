import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, type, radius, shadow, spacing } from '../../lib/theme';
import { ScoreRing } from '../../components/ScoreRing';
import { ScreenHeader } from '../../components/ScreenHeader';
import {
  useAppState,
  daysSinceLastAssessment,
  latestAssessment,
} from '../../lib/profileStore';
import { useTranslation } from '../../lib/i18n';

function useFormatDaysAgo() {
  const { t } = useTranslation();
  return (d: number | null): string => {
    if (d === null) return t('daysNever');
    if (d === 0) return t('daysToday');
    if (d === 1) return t('daysYesterday');
    return t('daysAgo', { days: d });
  };
}

export default function Screening() {
  const router = useRouter();
  const { t } = useTranslation();
  const formatDaysAgo = useFormatDaysAgo();
  const appState = useAppState();
  const days = daysSinceLastAssessment(appState);
  const latest = latestAssessment(appState);
  const progress = latest ? latest.report.score / 100 : 0;

  // Calculate delta vs previous assessment
  let deltaText = t('completeFirstTrend');
  if (appState.assessments.length >= 2) {
    const curr = appState.assessments[0].report.score;
    const prev = appState.assessments[1].report.score;
    const delta = curr - prev;
    const sign = delta >= 0 ? '+' : '';
    deltaText = t('scoreChange', { sign, delta: delta.toFixed(0) });
  } else if (latest) {
    deltaText = t('baselineScore', { score: Math.round(latest.report.score) });
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t('headerScreening')} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status */}
        <View
          style={{
            backgroundColor: colors.surfaceContainerLow,
            borderRadius: 32,
            padding: 24,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ ...type.labelMd, color: colors.outline, textTransform: 'uppercase' }}>
              {t('statusOverview')}
            </Text>
            <Text style={{ ...type.titleLg, color: colors.onSurface, marginTop: 4 }}>
              {t('lastScreened')}{formatDaysAgo(days)}
            </Text>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 8 }}>
              <MaterialIcons name="trending-up" size={18} color={colors.secondary} />
              <Text style={{ ...type.bodyMd, color: colors.secondary, fontWeight: '600' }}>
                {deltaText}
              </Text>
            </View>
          </View>
          <ScoreRing size={64} stroke={6} progress={progress} />
        </View>

        <Text style={{ ...type.headlineMd, color: colors.onSurface, paddingHorizontal: 8 }}>
          {t('readyToStart')}
        </Text>

        {/* Voice Assessment Card */}
        <Pressable
          onPress={() => router.push('/assessment/record')}
          style={({ pressed }) => ({
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: radius.xl,
            padding: 28,
            gap: spacing.md,
            opacity: pressed ? 0.95 : 1,
            ...shadow.card,
          })}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: colors.primaryContainer,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="mic" size={28} color={colors.onPrimaryContainer} />
          </View>
          <Text style={{ ...type.headlineMd, color: colors.primary }}>{t('voiceAssessment')}</Text>
          <Text style={{ ...type.bodyLg, color: colors.onSurfaceVariant }}>
            {t('voiceAssessmentDesc')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 14,
              borderRadius: 999,
              alignSelf: 'flex-start',
              marginTop: 8,
            }}
          >
            <Text style={{ ...type.titleLg, color: '#fff' }}>{t('startRecording')}</Text>
            <MaterialIcons name="arrow-forward" size={22} color="#fff" />
          </View>
        </Pressable>

        {/* Cognitive Games Card */}
        <Pressable
          onPress={() => router.push('/(tabs)/training')}
          style={({ pressed }) => ({
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: radius.xl,
            padding: 28,
            gap: spacing.md,
            opacity: pressed ? 0.95 : 1,
            ...shadow.card,
          })}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: colors.secondaryContainer,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="psychology" size={28} color={colors.onSecondaryContainer} />
          </View>
          <Text style={{ ...type.headlineMd, color: colors.secondary }}>{t('cognitiveGames')}</Text>
          <Text style={{ ...type.bodyLg, color: colors.onSurfaceVariant }}>
            {t('cognitiveGamesDesc')}
          </Text>
        </Pressable>

        <Text
          style={{
            ...type.bodyMd,
            color: colors.outline,
            textAlign: 'center',
            paddingHorizontal: 24,
            marginTop: 16,
          }}
        >
          {t('dataDisclaimer')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
