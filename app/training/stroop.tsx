import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadow, spacing, type } from '../../lib/theme';
import { useTranslation } from '../../lib/i18n';
import { completeTraining } from '../../lib/profileStore';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOTAL_ROUNDS = 10;
const ROUND_TIMEOUT_MS = 5000;
const CORRECT_FLASH_MS = 300;
const CORRECT_ADVANCE_MS = 400;
const WRONG_FLASH_MS = 800;

const COLORS = [
  { id: 'red', hex: '#E53935', enKey: 'gameStroopRed' },
  { id: 'blue', hex: '#1E88E5', enKey: 'gameStroopBlue' },
  { id: 'green', hex: '#43A047', enKey: 'gameStroopGreen' },
  { id: 'yellow', hex: '#FDD835', enKey: 'gameStroopYellow' },
] as const;

type ColorEntry = (typeof COLORS)[number];

type GameState = 'intro' | 'playing' | 'result';

type Round = {
  wordColor: ColorEntry;
  displayColor: ColorEntry;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRound(): Round {
  const wordColor = pickRandom(COLORS);
  let displayColor: ColorEntry;
  do {
    displayColor = pickRandom(COLORS);
  } while (displayColor.id === wordColor.id);
  return { wordColor, displayColor };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StroopGame() {
  const { t } = useTranslation();
  const router = useRouter();

  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentRound, setCurrentRound] = useState(0);
  const [round, setRound] = useState<Round>(() => generateRound());
  const [correct, setCorrect] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong' | 'timeout'>('none');
  const [answered, setAnswered] = useState(false);

  // Animated border values for each button
  const flashAnims = useRef(COLORS.map(() => new Animated.Value(0))).current;

  // Refs for timing
  const roundStartRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------------------------------------------------------------------------
  // Round management
  // ---------------------------------------------------------------------------

  const clearRoundTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const advanceRound = useCallback(
    (nextRoundIndex: number) => {
      if (nextRoundIndex >= TOTAL_ROUNDS) {
        setGameState('result');
        completeTraining('stroop');
        return;
      }
      setCurrentRound(nextRoundIndex);
      setRound(generateRound());
      setFeedback('none');
      setAnswered(false);
      flashAnims.forEach((anim) => anim.setValue(0));
      roundStartRef.current = Date.now();

      // Set timeout for this round
      timeoutRef.current = setTimeout(() => {
        setFeedback('timeout');
        setAnswered(true);
        timeoutRef.current = setTimeout(() => {
          advanceRound(nextRoundIndex + 1);
        }, WRONG_FLASH_MS);
      }, ROUND_TIMEOUT_MS);
    },
    [flashAnims],
  );

  // Start first round when game begins
  useEffect(() => {
    if (gameState === 'playing') {
      setCurrentRound(0);
      setCorrect(0);
      setReactionTimes([]);
      setFeedback('none');
      setAnswered(false);
      flashAnims.forEach((anim) => anim.setValue(0));
      roundStartRef.current = Date.now();
      setRound(generateRound());

      timeoutRef.current = setTimeout(() => {
        setFeedback('timeout');
        setAnswered(true);
        timeoutRef.current = setTimeout(() => {
          advanceRound(1);
        }, WRONG_FLASH_MS);
      }, ROUND_TIMEOUT_MS);
    }

    return () => {
      clearRoundTimeout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRoundTimeout();
    };
  }, [clearRoundTimeout]);

  // ---------------------------------------------------------------------------
  // Tap handler
  // ---------------------------------------------------------------------------

  const handleTap = useCallback(
    (colorIndex: number, tappedColor: ColorEntry) => {
      if (answered) return;
      clearRoundTimeout();

      const isCorrect = tappedColor.id === round.displayColor.id;
      setAnswered(true);

      if (isCorrect) {
        const elapsed = (Date.now() - roundStartRef.current) / 1000;
        setCorrect((prev) => prev + 1);
        setReactionTimes((prev) => [...prev, elapsed]);
        setFeedback('correct');

        // Flash correct button green
        Animated.sequence([
          Animated.timing(flashAnims[colorIndex], {
            toValue: 1,
            duration: CORRECT_FLASH_MS,
            useNativeDriver: false,
          }),
          Animated.timing(flashAnims[colorIndex], {
            toValue: 0,
            duration: CORRECT_FLASH_MS,
            useNativeDriver: false,
          }),
        ]).start();

        timeoutRef.current = setTimeout(() => {
          advanceRound(currentRound + 1);
        }, CORRECT_ADVANCE_MS);
      } else {
        setFeedback('wrong');

        // Flash wrong button red
        Animated.sequence([
          Animated.timing(flashAnims[colorIndex], {
            toValue: 1,
            duration: WRONG_FLASH_MS / 2,
            useNativeDriver: false,
          }),
          Animated.timing(flashAnims[colorIndex], {
            toValue: 0,
            duration: WRONG_FLASH_MS / 2,
            useNativeDriver: false,
          }),
        ]).start();

        timeoutRef.current = setTimeout(() => {
          advanceRound(currentRound + 1);
        }, WRONG_FLASH_MS);
      }
    },
    [answered, clearRoundTimeout, round, flashAnims, currentRound, advanceRound],
  );

  // ---------------------------------------------------------------------------
  // Restart
  // ---------------------------------------------------------------------------

  const startGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const restartGame = useCallback(() => {
    clearRoundTimeout();
    setGameState('intro');
  }, [clearRoundTimeout]);

  // ---------------------------------------------------------------------------
  // Average reaction time
  // ---------------------------------------------------------------------------

  const avgTime =
    reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : null;

  // ---------------------------------------------------------------------------
  // Render: Intro
  // ---------------------------------------------------------------------------

  if (gameState === 'intro') {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </Pressable>
          <Text style={{ ...type.headlineSm, color: colors.onSurface, marginLeft: spacing.sm }}>
            {t('gameStroop' as any)}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing.xxl,
            alignItems: 'center',
          }}
        >
          {/* Icon */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#E8EAF6',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.lg,
              marginTop: spacing.md,
            }}
          >
            <Text style={{ fontSize: 40 }}>🎯</Text>
          </View>

          {/* Instructions */}
          <Text
            style={{
              ...type.bodyLg,
              color: colors.onSurfaceVariant,
              textAlign: 'center',
              marginBottom: spacing.xl,
              lineHeight: 26,
            }}
          >
            {t('gameStroopInstructions' as any)}
          </Text>

          {/* Example */}
          <View
            style={{
              ...shadow.soft,
              backgroundColor: colors.surfaceContainerLowest,
              borderRadius: radius.lg,
              padding: spacing.lg,
              width: '100%',
              alignItems: 'center',
              marginBottom: spacing.xl,
            }}
          >
            <Text style={{ ...type.labelLg, color: colors.onSurfaceVariant, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 }}>
              Example
            </Text>
            {/* Word "RED" displayed in blue */}
            <Text
              style={{
                fontSize: 48,
                fontWeight: '800',
                color: '#1E88E5',
                letterSpacing: 4,
                marginBottom: spacing.sm,
              }}
            >
              {t('gameStroopRed' as any)}
            </Text>
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center' }}>
              The word says RED but it is displayed in blue.{'\n'}Tap the BLUE button!
            </Text>
          </View>

          {/* Start button */}
          <Pressable
            onPress={startGame}
            style={{
              backgroundColor: colors.primary,
              borderRadius: radius.full,
              paddingHorizontal: spacing.xxl,
              paddingVertical: spacing.md,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...type.titleLg, color: colors.onPrimary }}>
              {t('trainingStartGame' as any)}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Result
  // ---------------------------------------------------------------------------

  if (gameState === 'result') {
    const resultKey =
      correct >= 8
        ? 'gameStroopResultGreat'
        : correct >= 5
        ? 'gameStroopResultGood'
        : 'gameStroopResultPractice';

    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </Pressable>
          <Text style={{ ...type.headlineSm, color: colors.onSurface, marginLeft: spacing.sm }}>
            {t('gameStroop' as any)}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing.xxl,
            alignItems: 'center',
          }}
        >
          {/* Trophy */}
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: correct >= 8 ? '#E8F5E9' : correct >= 5 ? '#FFF8E1' : '#FCE4EC',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.lg,
              marginTop: spacing.md,
            }}
          >
            <Text style={{ fontSize: 52 }}>
              {correct >= 8 ? '🏆' : correct >= 5 ? '⭐' : '💪'}
            </Text>
          </View>

          {/* Score */}
          <Text style={{ ...type.displayLg, color: colors.onSurface, marginBottom: spacing.sm }}>
            {t('gameStroopCorrect' as any, { count: correct, total: TOTAL_ROUNDS } as any)}
          </Text>

          {/* Avg time */}
          {avgTime !== null && (
            <Text
              style={{
                ...type.bodyLg,
                color: colors.onSurfaceVariant,
                marginBottom: spacing.md,
              }}
            >
              {t('gameStroopAvgTime' as any, { time: avgTime.toFixed(1) } as any)}
            </Text>
          )}

          {/* Message */}
          <View
            style={{
              ...shadow.soft,
              backgroundColor: colors.surfaceContainerLowest,
              borderRadius: radius.lg,
              padding: spacing.lg,
              width: '100%',
              marginBottom: spacing.xl,
            }}
          >
            <Text
              style={{
                ...type.bodyLg,
                color: colors.onSurface,
                textAlign: 'center',
                lineHeight: 26,
              }}
            >
              {t(resultKey as any)}
            </Text>
          </View>

          {/* Play Again */}
          <Pressable
            onPress={startGame}
            style={{
              backgroundColor: colors.primary,
              borderRadius: radius.full,
              paddingHorizontal: spacing.xxl,
              paddingVertical: spacing.md,
              width: '100%',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}
          >
            <Text style={{ ...type.titleLg, color: colors.onPrimary }}>
              {t('gamePlayAgain' as any)}
            </Text>
          </Pressable>

          {/* Back to Training */}
          <Pressable
            onPress={() => router.back()}
            style={{
              backgroundColor: colors.surfaceContainerHigh,
              borderRadius: radius.full,
              paddingHorizontal: spacing.xxl,
              paddingVertical: spacing.md,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...type.titleLg, color: colors.onSurface }}>
              {t('gameBackToTraining' as any)}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Playing
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        }}
      >
        <Pressable
          onPress={() => {
            clearRoundTimeout();
            router.back();
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name="close" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={{ ...type.headlineSm, color: colors.onSurface, marginLeft: spacing.sm }}>
          {t('gameStroopRound' as any, { current: currentRound + 1, total: TOTAL_ROUNDS } as any)}
        </Text>
      </View>

      {/* Progress bar */}
      <View
        style={{
          height: 4,
          backgroundColor: colors.surfaceContainerHigh,
          marginHorizontal: spacing.lg,
          borderRadius: 2,
          marginBottom: spacing.lg,
        }}
      >
        <View
          style={{
            height: 4,
            backgroundColor: colors.primary,
            borderRadius: 2,
            width: `${((currentRound + 1) / TOTAL_ROUNDS) * 100}%`,
          }}
        />
      </View>

      {/* Main content */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
        {/* Prompt */}
        <Text
          style={{
            ...type.bodyLg,
            color: colors.onSurfaceVariant,
            textAlign: 'center',
            marginBottom: spacing.xl,
          }}
        >
          {t('gameStroopTapColor' as any)}
        </Text>

        {/* The Stroop word */}
        <View
          style={{
            ...shadow.card,
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: radius.xl,
            paddingHorizontal: spacing.xxl,
            paddingVertical: spacing.xl,
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 240,
            marginBottom: spacing.xl,
          }}
        >
          <Text
            style={{
              fontSize: 52,
              fontWeight: '800',
              color: round.displayColor.hex,
              letterSpacing: 4,
            }}
          >
            {t(round.wordColor.enKey as any)}
          </Text>
        </View>

        {/* Feedback overlay */}
        {feedback === 'timeout' && (
          <Text
            style={{
              ...type.headlineMd,
              color: colors.error,
              marginBottom: spacing.md,
            }}
          >
            {t('gameStroopTimeUp' as any)}
          </Text>
        )}
        {feedback === 'wrong' && (
          <Text
            style={{
              fontSize: 32,
              color: colors.error,
              marginBottom: spacing.md,
            }}
          >
            ✗
          </Text>
        )}
      </View>

      {/* Color buttons */}
      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.lg,
          gap: spacing.sm,
        }}
      >
        {/* 2×2 grid */}
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {COLORS.slice(0, 2).map((colorEntry, idx) => {
            const anim = flashAnims[idx];
            const isCorrectButton = colorEntry.id === round.displayColor.id;
            const borderColor = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [
                'transparent',
                answered && isCorrectButton ? '#00C853' : '#D32F2F',
              ],
            });

            return (
              <Animated.View
                key={colorEntry.id}
                style={{
                  flex: 1,
                  borderWidth: 3,
                  borderColor,
                  borderRadius: radius.md,
                }}
              >
                <Pressable
                  onPress={() => handleTap(idx, colorEntry)}
                  disabled={answered}
                  style={{
                    backgroundColor: colorEntry.hex,
                    borderRadius: radius.md - 3,
                    height: 72,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ ...type.headlineSm, color: '#ffffff', letterSpacing: 1 }}>
                    {t(colorEntry.enKey as any)}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {COLORS.slice(2, 4).map((colorEntry, rawIdx) => {
            const idx = rawIdx + 2;
            const anim = flashAnims[idx];
            const isCorrectButton = colorEntry.id === round.displayColor.id;
            const borderColor = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [
                'transparent',
                answered && isCorrectButton ? '#00C853' : '#D32F2F',
              ],
            });

            return (
              <Animated.View
                key={colorEntry.id}
                style={{
                  flex: 1,
                  borderWidth: 3,
                  borderColor,
                  borderRadius: radius.md,
                }}
              >
                <Pressable
                  onPress={() => handleTap(idx, colorEntry)}
                  disabled={answered}
                  style={{
                    backgroundColor: colorEntry.hex,
                    borderRadius: radius.md - 3,
                    height: 72,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ ...type.headlineSm, color: '#ffffff', letterSpacing: 1 }}>
                    {t(colorEntry.enKey as any)}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
