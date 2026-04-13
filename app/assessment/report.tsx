import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, Pressable, Animated, Easing, Share, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { colors, type, shadow, radius } from '../../lib/theme';
import { ScoreRing } from '../../components/ScoreRing';
import { getState } from '../../lib/assessmentStore';
import { useTranslation, localizedDate } from '../../lib/i18n';
import type { AssessmentReport } from '../../lib/openai';

function FadeSlideIn({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

const DIM_KEYS: Record<string, 'dimMemory' | 'dimLanguage' | 'dimAttention' | 'dimExecutive'> = {
  memory: 'dimMemory',
  language: 'dimLanguage',
  attention: 'dimAttention',
  executive: 'dimExecutive',
};

export default function Report() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { report, transcript, clockImageUrl, kind } = getState();
  const isQuestionnaire = kind === 'questionnaire';
  const isClock = !!clockImageUrl && !isQuestionnaire;
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const buildNarration = (r: AssessmentReport) =>
    [r.headline, r.analysis, ...r.recommendations].filter(Boolean).join('. ');

  const handleListen = () => {
    if (!report) return;
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    Speech.speak(buildNarration(report), {
      language: locale === 'zh' ? 'zh-CN' : 'en-US',
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleShare = async () => {
    const { report } = getState();
    if (!report) return;
    const riskLabels: Record<string, string> = locale === 'zh'
      ? { low: '低风险', moderate: '中等风险', elevated: '需关注' }
      : { low: 'Low', moderate: 'Moderate', elevated: 'Elevated' };
    const text = [
      `[${t('shareReportTitle')}]`,
      '',
      `${t('shareDate')}: ${localizedDate(new Date().toISOString(), locale)}`,
      `${t('shareScore')}: ${report.score}/100`,
      `${t('shareRisk')}: ${riskLabels[report.riskLevel] ?? report.riskLevel}`,
      '',
      `${t('shareHighlight')}: ${report.headline}`,
      '',
      `${t('shareDimensions')}:`,
      `• ${t('shareMemory')}: ${report.dimensions.memory}  • ${t('shareLanguage')}: ${report.dimensions.language}`,
      `• ${t('shareAttention')}: ${report.dimensions.attention}  • ${t('shareExecutive')}: ${report.dimensions.executive}`,
      '',
      `${t('shareRecommendation')}: ${report.recommendations[0]}`,
    ].join('\n');
    await Share.share({ message: text });
  };

  const RISK_STYLE = {
    low: { bg: colors.secondaryContainer, fg: colors.onSecondaryContainer, label: t('riskLow') },
    moderate: { bg: colors.tertiaryFixed, fg: colors.onTertiaryFixed, label: t('riskModerate') },
    elevated: { bg: colors.errorContainer, fg: colors.onErrorContainer, label: t('riskElevated') },
  };

  if (!report) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ ...type.bodyLg, color: colors.onSurfaceVariant, textAlign: 'center' }}>
          {t('noReportAvailable')}
        </Text>
        <Pressable
          onPress={() => router.replace('/assessment/record')}
          style={{ marginTop: 16, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 }}
        >
          <Text style={{ ...type.titleLg, color: '#fff' }}>{t('startAssessment')}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const risk = RISK_STYLE[report.riskLevel] ?? RISK_STYLE.low;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingVertical: 16,
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => router.replace('/(tabs)')}
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
        >
          <MaterialIcons name="close" size={24} color={colors.primary} />
        </Pressable>
        <Text style={{ ...type.headlineSm, color: colors.primary, flex: 1 }}>{t('yourReport')}</Text>
        <Pressable
          onPress={handleShare}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.secondaryContainer,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name="share" size={22} color={colors.onSecondaryContainer} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Captured clock drawing (only for clock reports) */}
        {isClock && (
          <FadeSlideIn delay={50}>
            <View
              style={{
                backgroundColor: colors.surfaceContainerLowest,
                borderRadius: 32,
                padding: 16,
                alignItems: 'center',
                ...shadow.card,
              }}
            >
              <Image
                source={{ uri: clockImageUrl! }}
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: radius.xl,
                  backgroundColor: '#fff',
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  ...type.labelMd,
                  color: colors.outline,
                  textTransform: 'uppercase',
                  marginTop: 12,
                  letterSpacing: 1.2,
                }}
              >
                {t('clockTestName')}
              </Text>
            </View>
          </FadeSlideIn>
        )}

        {/* Striking insight card */}
        <FadeSlideIn delay={100}>
          <View
            style={{
              backgroundColor: colors.primary,
              borderRadius: 32,
              padding: 28,
              gap: 16,
              ...shadow.card,
            }}
          >
            <Text style={{ ...type.labelMd, color: 'rgba(255,255,255,0.7)', letterSpacing: 1.2 }}>
              {t('todaysInsight')}
            </Text>
            <Text
              style={{
                ...type.headlineLg,
                color: '#fff',
                lineHeight: 36,
                letterSpacing: -0.5,
              }}
            >
              {report.headline}
            </Text>
          </View>
        </FadeSlideIn>

        {/* Score + risk */}
        <FadeSlideIn delay={300}>
          <View
            style={{
              backgroundColor: colors.surfaceContainerLowest,
              borderRadius: 32,
              padding: 28,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 24,
              ...shadow.card,
            }}
          >
            <ScoreRing
              size={120}
              stroke={12}
              progress={report.score / 100}
              label={`${Math.round(report.score)}`}
              sublabel="SCORE"
            />
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={{ ...type.labelMd, color: colors.outline, textTransform: 'uppercase' }}>
                {t('overall')}
              </Text>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: risk.bg,
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 999,
                }}
              >
                <Text style={{ ...type.labelLg, color: risk.fg }}>{risk.label}</Text>
              </View>
              <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
                {isQuestionnaire
                  ? t('basedOnQuestionnaire')
                  : isClock
                    ? t('clockTestName')
                    : t('basedOnVoiceSample')}
              </Text>
            </View>
          </View>
        </FadeSlideIn>

        {/* Dimensions */}
        <FadeSlideIn delay={500}>
          <View
            style={{
              backgroundColor: colors.surfaceContainerLowest,
              borderRadius: 32,
              padding: 24,
              gap: 16,
              ...shadow.card,
            }}
          >
            <Text style={{ ...type.titleLg, color: colors.primary }}>{t('dimensions')}</Text>
            {(['memory', 'language', 'attention', 'executive'] as const).map((k) => (
              <AnimatedDimensionBar key={k} label={t(DIM_KEYS[k])} value={report.dimensions[k]} />
            ))}
          </View>
        </FadeSlideIn>

        {/* Keywords */}
        {report.keywords?.length > 0 && (
          <FadeSlideIn delay={700}>
            <View
              style={{
                backgroundColor: colors.surfaceContainerLowest,
                borderRadius: 32,
                padding: 24,
                gap: 16,
                ...shadow.card,
              }}
            >
              <Text style={{ ...type.titleLg, color: colors.primary }}>{t('wordsYouUsed')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {report.keywords.map((w, i) => (
                  <KeywordPill key={w} word={w} delay={700 + i * 80} />
                ))}
              </View>
            </View>
          </FadeSlideIn>
        )}

        {/* Analysis */}
        <FadeSlideIn delay={900}>
          <View
            style={{
              backgroundColor: colors.tertiaryFixed,
              borderRadius: 32,
              padding: 28,
              gap: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <MaterialIcons name="auto-awesome" size={22} color={colors.tertiary} />
              <Text style={{ ...type.titleLg, color: colors.onTertiaryFixed }}>{t('aiAnalysis')}</Text>
            </View>
            <Pressable
              onPress={handleListen}
              accessibilityRole="button"
              accessibilityLabel={isSpeaking ? t('stopListening') : t('listenToAnalysis')}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                backgroundColor: isSpeaking ? colors.error : colors.tertiary,
                borderRadius: radius.full,
                paddingVertical: 14,
                paddingHorizontal: 20,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <MaterialIcons
                name={isSpeaking ? 'stop' : 'volume-up'}
                size={22}
                color="#fff"
              />
              <Text style={{ ...type.titleLg, color: '#fff' }}>
                {isSpeaking ? t('stopListening') : t('listenToAnalysis')}
              </Text>
            </Pressable>
            <Text style={{ ...type.bodyLg, color: colors.onTertiaryFixed, lineHeight: 26 }}>
              {report.analysis}
            </Text>
          </View>
        </FadeSlideIn>

        {/* Recommendations */}
        <FadeSlideIn delay={1100}>
          <View style={{ gap: 12 }}>
            <Text style={{ ...type.titleLg, color: colors.primary, paddingHorizontal: 8 }}>
              {t('recommendations')}
            </Text>
            {report.recommendations.map((r, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  padding: 20,
                  borderRadius: 20,
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: colors.secondary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>{i + 1}</Text>
                </View>
                <Text style={{ ...type.bodyLg, color: colors.onSurface, flex: 1 }}>{r}</Text>
              </View>
            ))}
          </View>
        </FadeSlideIn>

        {/* Transcript — for voice and clock. The questionnaire stores
            structured answers in transcript for record keeping only and is
            never displayed verbatim. */}
        {transcript && !isQuestionnaire && (
          <FadeSlideIn delay={1300}>
            <View
              style={{
                backgroundColor: colors.surfaceContainerLow,
                padding: 20,
                borderRadius: 20,
                gap: 8,
              }}
            >
              <Text style={{ ...type.labelMd, color: colors.outline, textTransform: 'uppercase' }}>
                {t('yourWords')}
              </Text>
              <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant, fontStyle: 'italic' }}>
                "{transcript}"
              </Text>
            </View>
          </FadeSlideIn>
        )}

        <FadeSlideIn delay={1500}>
          {report.riskLevel !== 'low' ? (
            <View style={{ gap: 12, marginTop: 8 }}>
              <View
                style={{
                  backgroundColor: colors.errorContainer,
                  borderRadius: 24,
                  padding: 20,
                  gap: 16,
                  ...shadow.card,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: colors.onErrorContainer,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialIcons name="health-and-safety" size={24} color={colors.errorContainer} />
                  </View>
                  <Text style={{ ...type.titleLg, color: colors.onErrorContainer, flex: 1 }}>
                    {t('deeperScreeningTitle')}
                  </Text>
                </View>
                <Text style={{ ...type.bodyMd, color: colors.onErrorContainer, opacity: 0.9 }}>
                  {t('deeperScreeningBody')}
                </Text>
                <Pressable
                  onPress={() => router.push('/services/screening-comprehensive')}
                  style={({ pressed }) => ({
                    backgroundColor: colors.primary,
                    paddingVertical: 16,
                    borderRadius: 20,
                    alignItems: 'center',
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <Text style={{ ...type.titleLg, color: '#fff' }}>{t('deeperScreeningCta')}</Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() =>
                  router.replace(
                    isQuestionnaire
                      ? '/assessment/questionnaire/questions'
                      : isClock
                        ? '/assessment/clock/draw'
                        : '/assessment/record',
                  )
                }
                style={({ pressed }) => ({
                  paddingVertical: 12,
                  alignItems: 'center',
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Text style={{ ...type.bodyLg, color: colors.primary, fontWeight: '600' }}>{t('takeAnother')}</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() =>
                router.replace(
                  isQuestionnaire
                    ? '/assessment/questionnaire/questions'
                    : isClock
                      ? '/assessment/clock/draw'
                      : '/assessment/record',
                )
              }
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                paddingVertical: 16,
                borderRadius: 20,
                alignItems: 'center',
                marginTop: 8,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text style={{ ...type.titleLg, color: '#fff' }}>{t('takeAnother')}</Text>
            </Pressable>
          )}
        </FadeSlideIn>
      </ScrollView>
    </SafeAreaView>
  );
}

function AnimatedDimensionBar({ label, value }: { label: string; value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: v,
      duration: 800,
      delay: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [v]);

  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ ...type.bodyMd, color: colors.onSurface, fontWeight: '600' }}>{label}</Text>
        <Text style={{ ...type.bodyMd, color: colors.primary, fontWeight: '700' }}>{Math.round(v)}</Text>
      </View>
      <View
        style={{
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.surfaceContainerHigh,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            width: width.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: colors.secondary,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
}

function KeywordPill({ word, delay }: { word: string; delay: number }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: colors.secondaryFixed,
        opacity,
        transform: [{ scale }],
      }}
    >
      <Text style={{ ...type.labelLg, color: colors.onSecondaryFixed }}>{word}</Text>
    </Animated.View>
  );
}
