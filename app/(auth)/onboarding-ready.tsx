import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, shadow } from '../../lib/theme';
import { useAppState, firstName } from '../../lib/profileStore';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { useTranslation } from '../../lib/i18n';

const PARTICLE_COUNT = 8;
const PARTICLE_RADIUS = 92;
const PARTICLE_COLORS = [
  colors.secondaryFixed,
  colors.tertiaryFixed,
  colors.primaryFixedDim,
  colors.secondary,
];

function CelebrationBurst() {
  const scale = useRef(new Animated.Value(0.4)).current;
  const rotate = useRef(new Animated.Value(-15)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      progress: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Entrance: spring the central pad in, rotate the icon to neutral.
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After entrance, start a gentle continuous pulse on the central pad.
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.04,
            duration: 1400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Stagger the particles outward.
    particles.forEach((p, i) => {
      Animated.sequence([
        Animated.delay(120 + i * 80),
        Animated.parallel([
          Animated.timing(p.progress, {
            toValue: 1,
            duration: 900,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(p.opacity, {
              toValue: 1,
              duration: 220,
              useNativeDriver: true,
            }),
            Animated.delay(380),
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
    });
  }, []);

  const rotateInterpolated = rotate.interpolate({
    inputRange: [-15, 0],
    outputRange: ['-15deg', '0deg'],
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 240,
          height: 240,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Particles */}
        {particles.map((p, i) => {
          const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
          const dx = Math.cos(angle) * PARTICLE_RADIUS;
          const dy = Math.sin(angle) * PARTICLE_RADIUS;
          const translateX = p.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, dx],
          });
          const translateY = p.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, dy],
          });
          return (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
                opacity: p.opacity,
                transform: [{ translateX }, { translateY }],
              }}
            />
          );
        })}

        {/* Central pad */}
        <Animated.View
          style={{
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ scale: Animated.multiply(scale, pulse) }],
            ...shadow.card,
          }}
        >
          <Animated.View style={{ transform: [{ rotate: rotateInterpolated }] }}>
            <MaterialIcons name="celebration" size={68} color="#fff" />
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

export default function OnboardingReady() {
  const router = useRouter();
  const { t } = useTranslation();
  const { profile } = useAppState();
  const name = firstName(profile);

  return (
    <OnboardingScaffold
      step={5}
      total={5}
      title={t('readyTitle', { name })}
      subtitle={t('readySubtitle')}
      canContinue={true}
      onContinue={() => router.replace('/(tabs)')}
      continueLabel={t('goToHome')}
    >
      <CelebrationBurst />
    </OnboardingScaffold>
  );
}
