import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, type, spacing } from '../../lib/theme';
import { updateProfile } from '../../lib/profileStore';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { useTranslation } from '../../lib/i18n';

const THIS_YEAR = new Date().getFullYear();
// Offer ages 50 to 90 (birth years)
const YEARS = Array.from({ length: 41 }, (_, i) => THIS_YEAR - 50 - i);

export default function OnboardingBirthYear() {
  const router = useRouter();
  const { t } = useTranslation();
  const [year, setYear] = useState<number | null>(null);

  async function onContinue() {
    if (!year) return;
    await updateProfile({ birthYear: year });
    router.push('/(auth)/onboarding-focus');
  }

  return (
    <OnboardingScaffold
      step={1}
      total={3}
      title={t('birthYearTitle')}
      subtitle={t('birthYearSubtitle')}
      canContinue={year !== null}
      onContinue={onContinue}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12, gap: 12 }}
      >
        {YEARS.map((y) => {
          const age = THIS_YEAR - y;
          const selected = year === y;
          return (
            <Pressable
              key={y}
              onPress={() => setYear(y)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: spacing.lg,
                paddingVertical: 18,
                borderRadius: 16,
                backgroundColor: selected ? colors.primary : colors.surfaceContainerLowest,
                borderWidth: 1,
                borderColor: selected ? colors.primary : colors.outlineVariant,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text
                style={{
                  ...type.titleLg,
                  color: selected ? '#fff' : colors.onSurface,
                }}
              >
                {y}
              </Text>
              <Text
                style={{
                  ...type.bodyMd,
                  color: selected ? 'rgba(255,255,255,0.8)' : colors.outline,
                }}
              >
                {t('age', { age })}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </OnboardingScaffold>
  );
}
