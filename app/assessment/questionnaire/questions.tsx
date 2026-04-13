import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { colors, type, radius, shadow, spacing } from '../../../lib/theme';
import { useTranslation } from '../../../lib/i18n';
import {
  setReport,
  setTranscript,
  setKind,
  setClockImageUrl,
} from '../../../lib/assessmentStore';
import { addAssessment } from '../../../lib/profileStore';
import {
  scoreQuestionnaire,
  answersToTranscript,
  QUESTION_COUNT,
  type QuestionAnswer,
} from '../../../lib/questionnaireScoring';

const QUESTION_KEYS = [
  'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11',
] as const;

const ANSWER_OPTIONS: { value: QuestionAnswer; key: 'answerYes' | 'answerSometimes' | 'answerNo'; bg: string; fg: string }[] = [
  { value: 'yes',       key: 'answerYes',       bg: colors.errorContainer,    fg: colors.onErrorContainer },
  { value: 'sometimes', key: 'answerSometimes', bg: colors.tertiaryFixed,     fg: colors.onTertiaryFixed },
  { value: 'no',        key: 'answerNo',        bg: colors.secondaryContainer, fg: colors.onSecondaryContainer },
];

export default function QuestionnaireScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Sparse array — undefined slots are unanswered. Length is fixed at QUESTION_COUNT.
  const [answers, setAnswers] = useState<(QuestionAnswer | undefined)[]>(
    () => Array<QuestionAnswer | undefined>(QUESTION_COUNT).fill(undefined),
  );
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const isFirst = current === 0;
  const isLast = current === QUESTION_COUNT - 1;
  const questionKey = QUESTION_KEYS[current];

  async function handleAnswer(answer: QuestionAnswer) {
    if (submitting) return;
    const next = [...answers];
    next[current] = answer;
    setAnswers(next);

    if (!isLast) {
      setCurrent((c) => c + 1);
      return;
    }

    // Last question — score and route to report.
    setSubmitting(true);
    try {
      const finalAnswers = next as QuestionAnswer[]; // every slot is now filled
      const { report } = scoreQuestionnaire(finalAnswers, t);
      const transcript = answersToTranscript(finalAnswers);
      setReport(report);
      setTranscript(transcript);
      setKind('questionnaire');
      setClockImageUrl(''); // ensure stale clock state from a prior run is cleared
      await addAssessment({ kind: 'questionnaire', report, transcript });
      router.replace('/assessment/report');
    } catch (e) {
      // If anything goes sideways, surface the user back to the screen.
      setSubmitting(false);
    }
  }

  function handleBack() {
    if (current === 0) {
      router.back();
      return;
    }
    setCurrent((c) => c - 1);
  }

  const progressFraction = (current + 1) / QUESTION_COUNT;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header with back + close */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          gap: spacing.md,
        }}
      >
        <Pressable
          onPress={handleBack}
          accessibilityLabel={t('questionnaireBack')}
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
        >
          <MaterialIcons
            name={isFirst ? 'close' : 'arrow-back'}
            size={24}
            color={colors.primary}
          />
        </Pressable>
        <Text style={{ ...type.headlineSm, color: colors.primary, flex: 1 }}>
          {t('questionnaireTitle')}
        </Text>
        <Text style={{ ...type.labelLg, color: colors.outline }}>
          {t('questionnaireProgress', { current: current + 1, total: QUESTION_COUNT })}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
        <View
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.surfaceContainerHigh,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${progressFraction * 100}%`,
              backgroundColor: colors.secondary,
              borderRadius: 3,
            }}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xxl,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isFirst && (
          <View
            style={{
              backgroundColor: colors.primaryContainer,
              padding: spacing.lg,
              borderRadius: radius.xl,
              gap: spacing.sm,
            }}
          >
            <Text style={{ ...type.labelMd, color: colors.onPrimaryContainer, opacity: 0.85 }}>
              {t('questionnaireTitle').toUpperCase()}
            </Text>
            <Text style={{ ...type.bodyLg, color: colors.onPrimaryContainer, lineHeight: 24 }}>
              {t('questionnaireIntro')}
            </Text>
          </View>
        )}

        {/* Question card */}
        <View
          style={{
            backgroundColor: colors.surfaceContainerLowest,
            padding: spacing.lg + spacing.xs,
            borderRadius: radius.xxl,
            ...shadow.card,
            gap: spacing.sm,
          }}
        >
          <Text style={{ ...type.labelMd, color: colors.outline, textTransform: 'uppercase' }}>
            {t('questionnaireProgress', { current: current + 1, total: QUESTION_COUNT })}
          </Text>
          <Text
            style={{
              ...type.headlineMd,
              color: colors.onSurface,
              lineHeight: 30,
            }}
          >
            {t(questionKey as any)}
          </Text>
        </View>

        {/* Answer buttons — large tap targets, color-coded by severity */}
        <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
          {ANSWER_OPTIONS.map((opt) => {
            const selected = answers[current] === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => handleAnswer(opt.value)}
                disabled={submitting}
                accessibilityRole="button"
                accessibilityLabel={t(opt.key)}
                style={({ pressed }) => ({
                  backgroundColor: opt.bg,
                  paddingVertical: spacing.lg,
                  paddingHorizontal: spacing.lg,
                  borderRadius: radius.xl,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  ...shadow.soft,
                  opacity: pressed || submitting ? 0.85 : 1,
                  borderWidth: selected ? 2 : 0,
                  borderColor: opt.fg,
                })}
              >
                <Text style={{ ...type.titleLg, color: opt.fg, fontSize: 22 }}>
                  {t(opt.key)}
                </Text>
                <MaterialIcons name="chevron-right" size={28} color={opt.fg} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
