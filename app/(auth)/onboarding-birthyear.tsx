import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { colors, type, spacing, shadow } from '../../lib/theme';
import { updateProfile } from '../../lib/profileStore';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { useTranslation } from '../../lib/i18n';

const THIS_YEAR = new Date().getFullYear();
// Offer ages 30 to 100 (so birth years run THIS_YEAR-30 down to THIS_YEAR-100)
const YEARS = Array.from({ length: 71 }, (_, i) => THIS_YEAR - 30 - i);

export default function OnboardingBirthYear() {
  const router = useRouter();
  const { t } = useTranslation();
  const [year, setYear] = useState<number | null>(null);

  async function onContinue() {
    if (!year) return;
    await updateProfile({ birthYear: year });
    router.push('/(auth)/onboarding-sex');
  }

  return (
    <OnboardingScaffold
      step={1}
      total={5}
      title={t('birthYearTitle')}
      subtitle={t('birthYearSubtitle')}
      canContinue={year !== null}
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
            {t('birthYearPlaceholder')}
          </Text>
          <Picker
            selectedValue={year ?? 0}
            onValueChange={(v) => setYear(v === 0 ? null : Number(v))}
            itemStyle={{
              fontSize: 22,
              color: colors.onSurface,
              height: 200,
            }}
            dropdownIconColor={colors.primary}
            mode="dropdown"
          >
            <Picker.Item
              label={t('birthYearPlaceholder')}
              value={0}
              color={colors.outline}
            />
            {YEARS.map((y) => {
              const age = THIS_YEAR - y;
              return (
                <Picker.Item
                  key={y}
                  label={`${y}  ·  ${t('age', { age })}`}
                  value={y}
                  color={colors.onSurface}
                />
              );
            })}
          </Picker>
        </View>

        {year != null && (
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
              {t('age', { age: THIS_YEAR - year })}
            </Text>
          </View>
        )}
      </View>
    </OnboardingScaffold>
  );
}
