import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors, type } from '../lib/theme';
import { useTranslation } from '../lib/i18n';

const BAR_COUNT = 35;
const BAR_WIDTH = 5;
const BAR_GAP = 2;
const BAR_RADIUS = 3;
const COMPONENT_HEIGHT = 200;
const MAX_BAR_HEIGHT = 140;
const MIN_BAR_HEIGHT = 6;
const IDLE_BAR_HEIGHT = 10;

interface AudioWaveformProps {
  isRecording: boolean;
  meteringValues: number[];
}

/**
 * Normalize a dB metering value (typically -160 to 0) into 0..1 range.
 * Values below -60 are treated as silence.
 */
function normalizeMeering(db: number): number {
  const min = -60;
  const max = 0;
  const clamped = Math.max(min, Math.min(max, db));
  return (clamped - min) / (max - min);
}

export default function AudioWaveform({ isRecording, meteringValues }: AudioWaveformProps) {
  const { t } = useTranslation();
  // One Animated.Value per bar
  const barAnims = useRef<Animated.Value[]>(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(IDLE_BAR_HEIGHT))
  ).current;

  // Breathing animation for idle state
  const breathAnim = useRef(new Animated.Value(0)).current;
  const breathLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Pulsing dot animation
  const dotOpacity = useRef(new Animated.Value(1)).current;
  const dotLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Start/stop breathing when idle
  useEffect(() => {
    if (!isRecording) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(breathAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      );
      breathLoopRef.current = loop;
      loop.start();

      // Reset bars to idle
      barAnims.forEach((anim) => {
        Animated.timing(anim, {
          toValue: IDLE_BAR_HEIGHT,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    } else {
      breathLoopRef.current?.stop();
      breathLoopRef.current = null;
    }

    return () => {
      breathLoopRef.current?.stop();
    };
  }, [isRecording]);

  // Pulsing green dot when recording
  useEffect(() => {
    if (isRecording) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(dotOpacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      dotLoopRef.current = loop;
      loop.start();
    } else {
      dotLoopRef.current?.stop();
      dotLoopRef.current = null;
      dotOpacity.setValue(1);
    }

    return () => {
      dotLoopRef.current?.stop();
    };
  }, [isRecording]);

  // Animate bars based on metering values
  useEffect(() => {
    if (!isRecording) return;

    barAnims.forEach((anim, i) => {
      // Map bar index to a metering value, spreading available data across all bars
      let normalized = 0;
      if (meteringValues.length > 0) {
        // Pick the nearest metering sample for this bar position
        const sampleIndex = Math.floor((i / BAR_COUNT) * meteringValues.length);
        const clampedIndex = Math.min(sampleIndex, meteringValues.length - 1);
        normalized = normalizeMeering(meteringValues[clampedIndex]);
      }

      // Add slight random variation so bars don't all look identical
      const jitter = 0.85 + Math.random() * 0.3;
      const targetHeight =
        MIN_BAR_HEIGHT + normalized * jitter * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT);

      Animated.spring(anim, {
        toValue: Math.max(MIN_BAR_HEIGHT, targetHeight),
        friction: 8,
        tension: 100,
        useNativeDriver: false,
      }).start();
    });
  }, [isRecording, meteringValues]);

  // Compute idle bar heights from breathing animation
  const idleBarHeights = barAnims.map((_, i) => {
    // Create a wave pattern across bars
    const distFromCenter = Math.abs(i - BAR_COUNT / 2) / (BAR_COUNT / 2);
    const base = IDLE_BAR_HEIGHT;
    const maxBreath = 8;
    return breathAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [base, base + maxBreath * (1 - distFromCenter * 0.6)],
    });
  });

  return (
    <View style={styles.container}>
      {/* Bars */}
      <View style={styles.barsContainer}>
        {barAnims.map((anim, i) => {
          // Distance from center for opacity variation
          const distFromCenter = Math.abs(i - BAR_COUNT / 2) / (BAR_COUNT / 2);
          const opacity = 0.5 + 0.5 * (1 - distFromCenter);

          const height = isRecording ? anim : idleBarHeights[i];

          return (
            <Animated.View
              key={i}
              style={[
                styles.bar,
                {
                  height,
                  opacity,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Status label */}
      {isRecording && (
        <View style={styles.labelContainer}>
          <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
          <Text style={styles.labelText}>{t('aiListening')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: COMPONENT_HEIGHT,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: MAX_BAR_HEIGHT + 20,
    gap: BAR_GAP,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: BAR_RADIUS,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  labelText: {
    ...type.labelLg,
    color: colors.onSurfaceVariant,
  },
});
