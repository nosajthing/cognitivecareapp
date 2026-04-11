import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, type, radius, shadow, spacing } from '../../lib/theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { ScoreRing } from '../../components/ScoreRing';
import { useTranslation } from '../../lib/i18n';
import { hydrateTraining, getTraining } from '../../lib/profileStore';

const GAMES = [
  { id: 'card-flip', icon: '🧠', nameKey: 'gameCardFlip', descKey: 'gameCardFlipDesc', color: colors.secondaryContainer, route: '/training/card-flip' },
  { id: 'category-fluency', icon: '🗣️', nameKey: 'gameCategoryFluency', descKey: 'gameCategoryFluencyDesc', color: colors.tertiaryFixed, route: '/training/category-fluency' },
  { id: 'stroop', icon: '🎯', nameKey: 'gameStroop', descKey: 'gameStroopDesc', color: colors.primaryFixed, route: '/training/stroop' },
] as const;

export default function Training() {
  const { t } = useTranslation();
  const router = useRouter();
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    hydrateTraining().then(() => {
      setCompleted(getTraining().completed);
    });
  }, []);

  // Re-check on focus
  useEffect(() => {
    const interval = setInterval(() => {
      setCompleted(getTraining().completed);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const done = completed.length;
  const total = GAMES.length;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t('tabTraining')} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120, gap: spacing.md }}>
        {/* Daily Progress */}
        <View style={{ alignItems: 'center', marginBottom: spacing.md }}>
          <ScoreRing
            progress={total > 0 ? done / total : 0}
            size={100}
            stroke={8}
            barColor={colors.secondary}
            label={`${done}/${total}`}
            sublabel={t('trainingDailyGoal' as any)}
          />
        </View>

        {/* Game Cards */}
        {GAMES.map((game) => {
          const isDone = completed.includes(game.id);
          return (
            <Pressable
              key={game.id}
              onPress={() => {
                if (!isDone) router.push(game.route as any);
              }}
              style={{
                ...shadow.soft,
                backgroundColor: colors.surfaceContainerLowest,
                borderRadius: radius.lg,
                padding: spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                opacity: isDone ? 0.7 : 1,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: radius.md,
                  backgroundColor: game.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 24 }}>{game.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...type.titleLg, color: colors.onSurface }}>{t(game.nameKey as any)}</Text>
                <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant, marginTop: 2 }}>
                  {t(game.descKey as any)}
                </Text>
              </View>
              {isDone ? (
                <Text style={{ ...type.labelLg, color: colors.secondary }}>{t('trainingCompletedToday' as any)}</Text>
              ) : (
                <View style={{ backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}>
                  <Text style={{ ...type.labelLg, color: '#fff' }}>{t('trainingStartGame' as any)}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
