import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { colors, type, spacing, shadow } from '../../lib/theme';
import { updateProfile, EDUCATION_YEARS_MAX } from '../../lib/profileStore';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { useTranslation } from '../../lib/i18n';

// 0 .. 20 ordinary years, plus a sentinel of 21 = "20+ years".
const YEAR_VALUES = Array.from({ length: EDUCATION_YEARS_MAX + 1 }, (_, i) => i);

export default function OnboardingEducation() {
  const router = useRouter();
  const { t } = useTranslation();
  const [years, setYears] = useState<number | null>(null);

  async function onContinue() {
    if (years == null) return;
    await updateProfile({ educationYears: years });
    router.push('/(auth)/onboarding-focus');
  }

  function labelFor(y: number): string {
    if (y >= EDUCATION_YEARS_MAX) return t('educationYearsPlus');
    return t('educationYearsValue', { years: y });
  }

  return (
    <OnboardingScaffold
      step={3}
      total={5}
      title={t('educationYearsTitle')}
      subtitle={t('educationYearsSubtitle')}
      canContinue={years !== null}
      onContinue={onContinue}
    >
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.lg }}>
        <View
          style={{
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            paddingHorizontal: spacing.lg,
            paddingVertical: Platform.OS === 'ios' ? spacing.sm : spacing.md,
            ...shadow.soft,
          }}
        >
          <Text
            style={{
              ...type.labelMd,
              color: colors.onSurfaceVariant,
              textTransform: 'uppercase',
              marginTop: spacing.sm,
            }}
          >
            {t('educationYearsPlaceholder')}
          </Text>
          <Picker
            selectedValue={years ?? -1}
            onValueChange={(v) => setYears(v === -1 ? null : Number(v))}
            itemStyle={{
              fontSize: 22,
              color: colors.onSurface,
              height: 200,
            }}
            dropdownIconColor={colors.primary}
            mode="dropdown"
          >
            <Picker.Item
              label={t('educationYearsPlaceholder')}
              value={-1}
              color={colors.outline}
            />
            {YEAR_VALUES.map((y) => (
              <Picker.Item
                key={y}
                label={labelFor(y)}
                value={y}
                color={colors.onSurface}
              />
            ))}
          </Picker>
        </View>

        {years != null && (
          <View
            style={{
              backgroundColor: colors.secondaryContainer,
              borderRadius: 20,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              alignItems: 'center',
            }}
          >
            <Text style={{ ...type.titleLg, color: colors.onSecondaryContainer }}>
              {labelFor(years)}
            </Text>
          </View>
        )}
      </View>
    </OnboardingScaffold>
  );
}
