import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Pressable, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, type } from '../../lib/theme';
import { getState, setReport, setTranscript, setError } from '../../lib/assessmentStore';
import { transcribeAudio, analyzeAssessment } from '../../lib/openai';
import { addAssessment } from '../../lib/profileStore';
import { useTranslation } from '../../lib/i18n';

const STEP_KEYS = [
  'stepTranscribing',
  'stepAnalyzing',
  'stepGenerating',
] as const;

const WORD_KEYS = [
  'wordMemory', 'wordClarity', 'wordVocabulary', 'wordRhythm', 'wordFluency',
  'wordCoherence', 'wordRecall', 'wordExpression', 'wordAttention', 'wordNarrative',
  'wordStructure', 'wordTemporal', 'wordNaming', 'wordSequencing', 'wordReasoning',
] as const;

function PulsingOrb() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.3, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <View style={{ width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.primaryContainer,
          opacity,
          transform: [{ scale }],
        }}
      />
      <Animated.View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.primary,
          opacity,
          transform: [{ scale }],
        }}
      />
    </View>
  );
}

function FloatingWord({ word, delay: startDelay }: { word: string; delay: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          delay: 1500,
          useNativeDriver: true,
        }).start();
      });
    }, startDelay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: colors.secondaryContainer,
        margin: 3,
      }}
    >
      <Text style={{ ...type.labelLg, color: colors.onSecondaryContainer }}>{word}</Text>
    </Animated.View>
  );
}

export default function Analyzing() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [stepIdx, setStepIdx] = useState(0);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [visibleWords, setVisibleWords] = useState<string[]>([]);
  const stepOpacity = useRef(new Animated.Value(1)).current;

  const steps = STEP_KEYS.map((k) => t(k));
  const floatingWords = WORD_KEYS.map((k) => t(k));

  // Reveal floating words progressively
  useEffect(() => {
    if (errMsg) return;
    const shuffled = [...floatingWords].sort(() => Math.random() - 0.5);
    const timers: ReturnType<typeof setTimeout>[] = [];
    shuffled.slice(0, 8).forEach((word, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleWords((prev) => [...prev, word]);
        }, 800 + i * 400)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [errMsg]);

  // Animate step transitions
  useEffect(() => {
    Animated.sequence([
      Animated.timing(stepOpacity, { toValue: 0.3, duration: 150, useNativeDriver: true }),
      Animated.timing(stepOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [stepIdx]);

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        const { audioUri, prompt } = getState();
        if (!audioUri) throw new Error('No recording found');

        setStepIdx(0);
        const transcript = await transcribeAudio(audioUri, locale);
        if (!mounted) return;
        setTranscript(transcript);

        setStepIdx(1);
        await new Promise((r) => setTimeout(r, 600));

        setStepIdx(2);
        const report = await analyzeAssessment(transcript, prompt, locale);
        if (!mounted) return;
        setReport(report);

        await addAssessment({ report, transcript });

        router.replace('/assessment/report');
      } catch (e: any) {
        const msg = e?.message ?? String(e);
        setError(msg);
        if (mounted) setErrMsg(msg);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 24 }}>
        {errMsg ? (
          <>
            <Text style={{ ...type.headlineMd, color: colors.error, textAlign: 'center' }}>
              {t('somethingWrong')}
            </Text>
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center' }}>
              {errMsg}
            </Text>
            <Pressable
              onPress={() => router.replace('/assessment/record')}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 28,
                paddingVertical: 14,
                borderRadius: 999,
                marginTop: 16,
              }}
            >
              <Text style={{ ...type.titleLg, color: '#fff' }}>{t('tryAgain')}</Text>
            </Pressable>
          </>
        ) : (
          <>
            <PulsingOrb />

            <Animated.Text
              style={{
                ...type.headlineMd,
                color: colors.primary,
                textAlign: 'center',
                opacity: stepOpacity,
              }}
            >
              {steps[stepIdx]}
            </Animated.Text>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              {steps.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: i <= stepIdx ? colors.secondary : colors.outlineVariant,
                  }}
                />
              ))}
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: 24,
                maxWidth: 300,
              }}
            >
              {visibleWords.map((word, i) => (
                <FloatingWord key={word} word={word} delay={i * 150} />
              ))}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
