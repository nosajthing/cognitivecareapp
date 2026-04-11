import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, type, radius, spacing, shadow } from '../../lib/theme';
import { useTranslation } from '../../lib/i18n';
import { completeTraining } from '../../lib/profileStore';

const DURATION = 60;

const CATEGORIES = [
  'gameCatAnimals',
  'gameCatFruits',
  'gameCatVegetables',
  'gameCatColors',
  'gameCatCountries',
  'gameCatKitchen',
  'gameCatVehicles',
  'gameCatBodyParts',
] as const;

type CategoryKey = (typeof CATEGORIES)[number];

// Pill background colors — varying teal/green shades from the theme
// palette. All 8 slots source from lib/theme.ts; two cyan variants
// reuse existing tokens rather than introducing new ones.
const PILL_COLORS = [
  colors.primaryFixed,
  colors.secondaryFixed,
  colors.secondaryFixedDim,
  colors.inversePrimary,
  colors.onPrimaryContainer,
  colors.secondaryContainer,
  colors.secondaryFixed,
  colors.primaryFixed,
];

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pillColor(index: number): string {
  return PILL_COLORS[index % PILL_COLORS.length];
}

export default function CategoryFluency() {
  const { t } = useTranslation();
  const router = useRouter();

  // Pick a random category once on mount
  const [categoryKey] = useState<CategoryKey>(() => pickRandom(CATEGORIES));

  const [words, setWords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [duplicateVisible, setDuplicateVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const duplicateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Animated progress bar value (1 → 0)
  const progressAnim = useRef(new Animated.Value(1)).current;

  // Start countdown + animation on mount
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: DURATION * 1000,
      useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Will trigger phase change via the effect below
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (duplicateTimerRef.current) clearTimeout(duplicateTimerRef.current);
    };
  }, []);

  // When timer hits 0, end the game
  useEffect(() => {
    if (timeLeft === 0 && phase === 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('result');
      completeTraining('category-fluency');
    }
  }, [timeLeft, phase]);

  const addWord = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const isDuplicate = words.some(
      (w) => w.toLowerCase() === trimmed.toLowerCase(),
    );

    if (isDuplicate) {
      setDuplicateVisible(true);
      if (duplicateTimerRef.current) clearTimeout(duplicateTimerRef.current);
      duplicateTimerRef.current = setTimeout(() => {
        setDuplicateVisible(false);
      }, 1500);
      return;
    }

    setWords((prev) => [...prev, trimmed]);
    setInputValue('');
  }, [inputValue, words]);

  const handleReset = useCallback(() => {
    // Reset all state for play again
    if (timerRef.current) clearInterval(timerRef.current);
    if (duplicateTimerRef.current) clearTimeout(duplicateTimerRef.current);

    setWords([]);
    setInputValue('');
    setDuplicateVisible(false);
    setTimeLeft(DURATION);
    setPhase('playing');

    // Reset animation
    progressAnim.setValue(1);
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: DURATION * 1000,
      useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
  }, [progressAnim]);

  const count = words.length;

  const encouragingMessage =
    count >= 10
      ? t('gameCategoryFluencyExcellent')
      : count >= 6
        ? t('gameCategoryFluencyGood')
        : t('gameCategoryFluencyPractice');

  // ------------------------------------------------------------------
  // Result screen
  // ------------------------------------------------------------------
  if (phase === 'result') {
    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: 48,
          }}
        >
          {/* Header */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: spacing.xl,
              marginTop: spacing.md,
            }}
          >
            <Text style={{ fontSize: 52, marginBottom: spacing.sm }}>🎉</Text>
            <Text
              style={{
                ...type.headlineLg,
                color: colors.onSurface,
                textAlign: 'center',
                marginBottom: spacing.xs,
              }}
            >
              {t('gameCategoryFluencyWords', { count })}
            </Text>
            <Text
              style={{
                ...type.bodyLg,
                color: colors.onSurfaceVariant,
                textAlign: 'center',
                lineHeight: 24,
                maxWidth: 300,
              }}
            >
              {encouragingMessage}
            </Text>
          </View>

          {/* Word pills */}
          {words.length > 0 && (
            <View
              style={{
                ...shadow.soft,
                backgroundColor: colors.surfaceContainerLowest,
                borderRadius: radius.lg,
                padding: spacing.md,
                marginBottom: spacing.xl,
              }}
            >
              <Text
                style={{
                  ...type.labelMd,
                  color: colors.onSurfaceVariant,
                  marginBottom: spacing.sm,
                  textTransform: 'uppercase',
                }}
              >
                {t('gameCategoryFluency')}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {words.map((word, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: pillColor(idx),
                      borderRadius: radius.full,
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                    }}
                  >
                    <Text
                      style={{
                        ...type.labelLg,
                        color: colors.onPrimaryFixed,
                      }}
                    >
                      {word}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action buttons */}
          <Pressable
            onPress={handleReset}
            style={{
              backgroundColor: colors.primary,
              borderRadius: radius.full,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ ...type.labelLg, color: colors.onPrimary }}>
              {t('gamePlayAgain')}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={{
              backgroundColor: colors.surfaceContainerHigh,
              borderRadius: radius.full,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ ...type.labelLg, color: colors.onSurface }}>
              {t('gameBackToTraining')}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ------------------------------------------------------------------
  // Playing screen
  // ------------------------------------------------------------------
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Top bar: back + category title */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.md,
            gap: spacing.sm,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.full,
              backgroundColor: colors.surfaceContainerHigh,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons
              name="arrow-back"
              size={22}
              color={colors.onSurface}
            />
          </Pressable>
          <Text
            style={{
              ...type.headlineMd,
              color: colors.onSurface,
              flex: 1,
            }}
          >
            {t(categoryKey)}
          </Text>
        </View>

        {/* Timer */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.md }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
              gap: spacing.sm,
            }}
          >
            <MaterialIcons
              name="timer"
              size={20}
              color={
                timeLeft <= 10 ? colors.error : colors.onSurfaceVariant
              }
            />
            <Text
              style={{
                ...type.headlineSm,
                color:
                  timeLeft <= 10 ? colors.error : colors.onSurface,
                minWidth: 36,
              }}
            >
              {timeLeft}
            </Text>
          </View>

          {/* Progress bar track */}
          <View
            style={{
              height: 8,
              backgroundColor: colors.surfaceContainerHigh,
              borderRadius: radius.full,
              overflow: 'hidden',
            }}
          >
            <Animated.View
              style={{
                height: '100%',
                borderRadius: radius.full,
                backgroundColor:
                  timeLeft <= 10 ? colors.error : colors.secondary,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }}
            />
          </View>
        </View>

        {/* Duplicate feedback */}
        {duplicateVisible && (
          <View
            style={{
              marginHorizontal: spacing.md,
              marginBottom: spacing.sm,
              backgroundColor: colors.errorContainer,
              borderRadius: radius.md,
              paddingHorizontal: spacing.md,
              paddingVertical: 8,
            }}
          >
            <Text
              style={{
                ...type.bodyMd,
                color: colors.onErrorContainer,
                textAlign: 'center',
              }}
            >
              {t('gameCategoryFluencyDuplicate')}
            </Text>
          </View>
        )}

        {/* Word pills area */}
        <ScrollView
          style={{ flex: 1, paddingHorizontal: spacing.md }}
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            paddingBottom: spacing.md,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {words.map((word, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: pillColor(idx),
                borderRadius: radius.full,
                paddingHorizontal: 14,
                paddingVertical: 7,
              }}
            >
              <Text
                style={{
                  ...type.labelLg,
                  color: colors.onPrimaryFixed,
                }}
              >
                {word}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Input row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
            backgroundColor: colors.surfaceContainerLowest,
          }}
        >
          <TextInput
            ref={inputRef}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={addWord}
            returnKeyType="done"
            placeholder={t('gameCategoryFluencyPlaceholder')}
            placeholderTextColor={colors.outline}
            style={{
              flex: 1,
              height: 48,
              backgroundColor: colors.surfaceContainerLow,
              borderRadius: radius.md,
              paddingHorizontal: spacing.md,
              ...type.bodyLg,
              color: colors.onSurface,
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable
            onPress={addWord}
            style={{
              height: 48,
              paddingHorizontal: spacing.lg,
              backgroundColor: colors.primary,
              borderRadius: radius.md,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...type.labelLg, color: colors.onPrimary }}>
              {t('gameCategoryFluencyAdd')}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
