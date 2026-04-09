import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { colors, type, shadow } from '../../lib/theme';
import { ScoreRing } from '../../components/ScoreRing';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useAppState, latestAssessment, firstName } from '../../lib/profileStore';
import { setReport, setTranscript } from '../../lib/assessmentStore';
import { useTranslation, localizedDate, localizedTime } from '../../lib/i18n';
import { TipCard, TipRestoreButton } from '../../components/TipCard';

export default function Reports() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const appState = useAppState();
  const { profile, assessments } = appState;
  const latest = latestAssessment(appState);
  const name = firstName(profile);

  const RISK_LABEL = {
    low: { label: t('riskLow'), bg: colors.secondaryContainer, fg: colors.onSecondaryContainer },
    moderate: { label: t('riskModerate'), bg: colors.tertiaryFixed, fg: colors.onTertiaryFixed },
    elevated: { label: t('riskElevated'), bg: colors.errorContainer, fg: colors.onErrorContainer },
  };

  // Empty state
  if (!latest) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title={t('headerReports')} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.secondaryContainer,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="insights" size={40} color={colors.onSecondaryContainer} />
          </View>
          <Text style={{ ...type.headlineMd, color: colors.primary, textAlign: 'center' }}>
            {t('noReportsYet')}
          </Text>
          <Text style={{ ...type.bodyLg, color: colors.onSurfaceVariant, textAlign: 'center' }}>
            {t('noReportsDesc')}
          </Text>
          <Pressable
            onPress={() => router.push('/assessment/record')}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 28,
              paddingVertical: 14,
              borderRadius: 999,
              marginTop: 16,
            }}
          >
            <Text style={{ ...type.titleLg, color: '#fff' }}>{t('startFirstCheckInBtn')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const risk = RISK_LABEL[latest.report.riskLevel];

  // Build trend chart from assessments (last 8 in chronological order)
  const chartData = assessments.slice(0, 8).reverse().map((a) => a.report.score);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t('headerReports')} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, gap: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <TipCard tipId="reports_intro" icon="💡" titleKey="tipReportsTitle" bodyKey="tipReportsBody" />
        {/* Status + Score */}
        <View style={{ gap: 16 }}>
          <View
            style={{
              backgroundColor: colors.surfaceContainerLowest,
              padding: 28,
              borderRadius: 24,
              ...shadow.card,
            }}
          >
            <Text style={{ ...type.labelMd, color: colors.secondary, letterSpacing: 1.2 }}>
              {t('currentStatus')}
            </Text>
            <Text style={{ ...type.displayLg, color: colors.primary, marginTop: 8 }}>
              {latest.report.riskLevel === 'low' ? t('stableHealthy') : latest.report.riskLevel === 'moderate' ? t('worthWatching') : t('worthDiscussing')}
            </Text>
            <Text style={{ ...type.bodyLg, color: colors.onSurfaceVariant, marginTop: 12 }}>
              {latest.report.headline}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 20 }}>
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                  backgroundColor: risk.bg,
                  borderRadius: 999,
                }}
              >
                <Text style={{ ...type.labelLg, color: risk.fg }}>{risk.label}</Text>
              </View>
              <Text style={{ ...type.labelMd, color: colors.outline, textTransform: 'none' }}>
                {localizedDate(latest.date, locale)}, {localizedTime(latest.date, locale)}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: colors.primary,
              padding: 28,
              borderRadius: 24,
              alignItems: 'center',
            }}
          >
            <ScoreRing
              size={128}
              stroke={12}
              progress={latest.report.score / 100}
              trackColor="rgba(0,103,120,0.4)"
              barColor={colors.secondaryFixed}
              label={`${Math.round(latest.report.score)}`}
            />
            <Text style={{ ...type.titleLg, color: '#fff', marginTop: 16 }}>
              {t('clarityScore', { name })}
            </Text>
            <Text style={{ ...type.bodyMd, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
              {assessments.length === 1
                ? t('basedOnAssessments_one', { count: assessments.length })
                : t('basedOnAssessments_other', { count: assessments.length })}
            </Text>
          </View>
        </View>

        {/* Trend chart (only if 2+ data points) */}
        {chartData.length >= 2 && (
          <View style={{ gap: 16 }}>
            <Text style={{ ...type.headlineMd, color: colors.primary }}>{t('trend')}</Text>
            <View
              style={{
                backgroundColor: colors.surfaceContainerLowest,
                padding: 24,
                borderRadius: 24,
                ...shadow.card,
              }}
            >
              <TrendChart values={chartData} />
              <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant, fontStyle: 'italic', marginTop: 16 }}>
                {t('checkInsTrending', {
                  count: chartData.length,
                  direction: chartData[chartData.length - 1] >= chartData[0] ? t('trendUp') : t('trendDown'),
                })}
              </Text>
            </View>
          </View>
        )}

        {/* Latest recommendation */}
        {latest.report.recommendations[0] && (
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

        {/* Detailed reports list */}
        <View style={{ gap: 16 }}>
          <Text style={{ ...type.headlineMd, color: colors.primary }}>{t('allAssessments')}</Text>
          {assessments.map((a) => (
            <Pressable
              key={a.id}
              onPress={() => {
                setReport(a.report);
                setTranscript(a.transcript);
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
                    backgroundColor: colors.secondaryFixed,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ ...type.titleLg, color: colors.onSecondaryFixed }}>
                    {Math.round(a.report.score)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...type.titleLg, color: colors.primary, fontSize: 16 }}>
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
                    {RISK_LABEL[a.report.riskLevel].label} • {localizedTime(a.date, locale)}
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.outlineVariant} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <TipRestoreButton tipIds={['reports_intro']} />
    </SafeAreaView>
  );
}

function TrendChart({ values }: { values: number[] }) {
  const W = 300;
  const H = 140;
  const pad = 16;
  const min = Math.max(0, Math.min(...values) - 5);
  const max = Math.min(100, Math.max(...values) + 5);
  const range = Math.max(1, max - min);
  const step = values.length > 1 ? (W - pad * 2) / (values.length - 1) : 0;

  const points = values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (1 - (v - min) / range) * (H - pad * 2);
    return { x, y };
  });

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${path} L${points[points.length - 1].x},${H - pad} L${points[0].x},${H - pad} Z`;

  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0%" stopColor={colors.secondary} stopOpacity="0.25" />
          <Stop offset="100%" stopColor={colors.secondary} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke={colors.outlineVariant} strokeWidth={1} />
      <Path d={area} fill="url(#g)" />
      <Path d={path} stroke={colors.secondary} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={4} fill={colors.secondary} />
      ))}
    </Svg>
  );
}
