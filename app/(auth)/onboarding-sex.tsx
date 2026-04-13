import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, type, spacing } from '../../lib/theme';
import { updateProfile, type Sex } from '../../lib/profileStore';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { useTranslation } from '../../lib/i18n';

type Option = {
  key: Sex;
  labelKey: 'sexMale' | 'sexFemale' | 'sexUnspecified';
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const OPTIONS: Option[] = [
  { key: 'female', labelKey: 'sexFemale', icon: 'gender-female' },
  { key: 'male', labelKey: 'sexMale', icon: 'gender-male' },
  { key: 'unspecified', labelKey: 'sexUnspecified', icon: 'account-outline' },
];

export default function OnboardingSex() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Sex | null>(null);

  async function onContinue() {
    if (!selected) return;
    await updateProfile({ sex: selected });
    router.push('/(auth)/onboarding-education');
  }

  return (
    <OnboardingScaffold
      step={2}
      total={5}
      title={t('sexTitle')}
      subtitle={t('sexSubtitle')}
      canContinue={selected !== null}
      onContinue={onContinue}
    >
      <View style={{ gap: 12, paddingVertical: 8 }}>
        {OPTIONS.map((o) => {
          const isSelected = selected === o.key;
          return (
            <Pressable
              key={o.key}
              onPress={() => setSelected(o.key)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                paddingHorizontal: spacing.lg,
                paddingVertical: 20,
                borderRadius: 20,
                backgroundColor: isSelected
                  ? colors.secondaryContainer
                  : colors.surfaceContainerLowest,
                borderWidth: 2,
                borderColor: isSelected ? colors.secondary : colors.outlineVariant,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: isSelected ? colors.secondary : colors.surfaceContainerLow,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons
                  name={o.icon}
                  size={26}
                  color={isSelected ? '#fff' : colors.primary}
                />
              </View>
              <Text style={{ ...type.titleLg, color: colors.onSurface, flex: 1 }}>
                {t(o.labelKey)}
              </Text>
              {isSelected && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color={colors.secondary}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </OnboardingScaffold>
  );
}
