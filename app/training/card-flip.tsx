import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, type, radius, spacing, shadow } from '../../lib/theme';
import { useTranslation } from '../../lib/i18n';
import { completeTraining } from '../../lib/profileStore';

const EMOJIS = ['🍎', '🌸', '🐱', '🌙', '⭐', '🎵'];

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function shuffleCards(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS].map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
  // Fisher-Yates shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

function getStars(moves: number): number {
  if (moves < 12) return 3;
  if (moves < 18) return 2;
  return 1;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function CardFlipGame() {
  const { t } = useTranslation();
  const router = useRouter();

  const [cards, setCards] = useState<Card[]>(shuffleCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [locked, setLocked] = useState(false);

  // One Animated.Value per card (0 = face down, 1 = face up)
  const animValues = useRef<Animated.Value[]>(
    Array.from({ length: 12 }, () => new Animated.Value(0))
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  // Start timer on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Stop timer when game over
  useEffect(() => {
    if (gameOver && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [gameOver]);

  const flipCard = useCallback((index: number, toValue: number, duration = 300) => {
    return new Promise<void>((resolve) => {
      Animated.timing(animValues.current[index], {
        toValue,
        duration,
        useNativeDriver: true,
      }).start(() => resolve());
    });
  }, []);

  const handleCardPress = useCallback(
    async (index: number) => {
      if (locked) return;
      if (cards[index].flipped || cards[index].matched) return;
      if (selected.includes(index)) return;

      // Flip card face up
      await flipCard(index, 1);

      const updatedCards = cards.map((c, i) =>
        i === index ? { ...c, flipped: true } : c
      );
      const newSelected = [...selected, index];

      if (newSelected.length === 1) {
        setCards(updatedCards);
        setSelected(newSelected);
        return;
      }

      // Second card selected
      setLocked(true);
      setCards(updatedCards);
      const newMoves = moves + 1;
      setMoves(newMoves);

      const [firstIdx, secondIdx] = newSelected;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        const matchedCards = updatedCards.map((c, i) =>
          i === firstIdx || i === secondIdx ? { ...c, matched: true } : c
        );
        setCards(matchedCards);
        setSelected([]);
        setLocked(false);

        // Check if all matched
        const allMatched = matchedCards.every((c) => c.matched);
        if (allMatched) {
          setGameOver(true);
          completeTraining('card-flip');
        }
      } else {
        // No match — flip both back after 800ms
        setTimeout(async () => {
          await Promise.all([flipCard(firstIdx, 0), flipCard(secondIdx, 0)]);
          setCards(
            updatedCards.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
          setLocked(false);
        }, 800);
      }
    },
    [locked, cards, selected, moves, flipCard]
  );

  const handlePlayAgain = useCallback(() => {
    const newCards = shuffleCards();
    setCards(newCards);
    setSelected([]);
    setMoves(0);
    setElapsed(0);
    elapsedRef.current = 0;
    setGameOver(false);
    setLocked(false);
    animValues.current.forEach((v) => v.setValue(0));
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
  }, []);

  if (gameOver) {
    const stars = getStars(moves);
    const messageKey =
      stars === 3
        ? 'gameCardFlipStars3'
        : stars === 2
        ? 'gameCardFlipStars2'
        : 'gameCardFlipStars1';

    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
          }}
        >
          {/* Headline */}
          <Text
            style={{
              ...type.headlineLg,
              color: colors.onSurface,
              textAlign: 'center',
              marginBottom: spacing.sm,
            }}
          >
            {t('gameCardFlipComplete' as any)}
          </Text>

          {/* Star display */}
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
            {[1, 2, 3].map((star) => (
              <Text key={star} style={{ fontSize: 36 }}>
                {star <= stars ? '★' : '☆'}
              </Text>
            ))}
          </View>

          {/* Stats */}
          <View
            style={{
              flexDirection: 'row',
              gap: spacing.xl,
              marginBottom: spacing.lg,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={{ ...type.headlineMd, color: colors.primary }}>{moves}</Text>
              <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
                {t('gameCardFlipMoves' as any)}
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ ...type.headlineMd, color: colors.primary }}>
                {formatTime(elapsed)}
              </Text>
              <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
                {t('gameCardFlipTime' as any)}
              </Text>
            </View>
          </View>

          {/* Encouraging message */}
          <Text
            style={{
              ...type.bodyLg,
              color: colors.onSurfaceVariant,
              textAlign: 'center',
              marginBottom: spacing.xxl,
              paddingHorizontal: spacing.sm,
            }}
          >
            {t(messageKey as any)}
          </Text>

          {/* Buttons */}
          <Pressable
            onPress={handlePlayAgain}
            style={{
              backgroundColor: colors.primary,
              borderRadius: radius.full,
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.md,
              marginBottom: spacing.md,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...type.titleLg, color: colors.onPrimary }}>
              {t('gamePlayAgain' as any)}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={{
              backgroundColor: colors.surfaceContainerHigh,
              borderRadius: radius.full,
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.md,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...type.titleLg, color: colors.onSurface }}>
              {t('gameBackToTraining' as any)}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Playing state
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
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
          style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
          hitSlop={8}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text style={{ ...type.headlineSm, color: colors.onSurface }}>
            {t('gameCardFlip' as any)}
          </Text>
          <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
            {t('gameCardFlipInstructions' as any)}
          </Text>
        </View>
      </View>

      {/* Stats row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: spacing.xxl,
          paddingVertical: spacing.md,
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={{ ...type.headlineMd, color: colors.primary }}>{moves}</Text>
          <Text style={{ ...type.labelMd, color: colors.onSurfaceVariant }}>
            {t('gameCardFlipMoves' as any)}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ ...type.headlineMd, color: colors.primary }}>
            {formatTime(elapsed)}
          </Text>
          <Text style={{ ...type.labelMd, color: colors.onSurfaceVariant }}>
            {t('gameCardFlipTime' as any)}
          </Text>
        </View>
      </View>

      {/* 4×3 Card Grid */}
      <View
        style={{
          flex: 1,
          padding: spacing.md,
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.sm,
            justifyContent: 'center',
          }}
        >
          {cards.map((card, index) => {
            const anim = animValues.current[index];

            // Front (face-up) rotation: 0deg -> 180deg
            const frontRotate = anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['180deg', '360deg'],
            });

            // Back (face-down) rotation: 180deg -> 360deg
            const backRotate = anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            });

            // Hide face when rotating away
            const frontOpacity = anim.interpolate({
              inputRange: [0, 0.5, 0.5, 1],
              outputRange: [0, 0, 1, 1],
            });

            const backOpacity = anim.interpolate({
              inputRange: [0, 0.5, 0.5, 1],
              outputRange: [1, 1, 0, 0],
            });

            const CARD_SIZE = 72;

            return (
              <Pressable
                key={card.id}
                onPress={() => handleCardPress(index)}
                style={{ width: CARD_SIZE, height: CARD_SIZE }}
              >
                {/* Back face (face-down, shows "?") */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    width: CARD_SIZE,
                    height: CARD_SIZE,
                    borderRadius: radius.md,
                    backgroundColor: colors.primaryContainer,
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ rotateY: backRotate }],
                    opacity: backOpacity,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <Text style={{ fontSize: 28, color: colors.onPrimary, fontWeight: '700' }}>
                    ?
                  </Text>
                </Animated.View>

                {/* Front face (face-up, shows emoji) */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    width: CARD_SIZE,
                    height: CARD_SIZE,
                    borderRadius: radius.md,
                    backgroundColor: card.matched ? colors.secondaryContainer : colors.surfaceContainerLowest,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: card.matched ? 2 : 1,
                    borderColor: card.matched ? colors.secondary : colors.outlineVariant,
                    transform: [{ rotateY: frontRotate }],
                    opacity: frontOpacity,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <Text style={{ fontSize: 32 }}>{card.emoji}</Text>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
