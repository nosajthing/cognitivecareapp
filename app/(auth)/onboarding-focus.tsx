import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, type, spacing } from '../../lib/theme';
import { updateProfile, type FocusArea } from '../../lib/profileStore';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { useTranslation } from '../../lib/i18n';

type AreaDef = {
  key: FocusArea;
  labelKey: 'focusMemory' | 'focusLanguage' | 'focusAttention' | 'focusSleep' | 'focusSocial';
  descKey: 'focusMemoryDesc' | 'focusLanguageDesc' | 'focusAttentionDesc' | 'focusSleepDesc' | 'focusSocialDesc';
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
};

const AREAS: AreaDef[] = [
  { key: 'memory', labelKey: 'focusMemory', descKey: 'focusMemoryDesc', icon: 'psychology' },
  { key: 'language', labelKey: 'focusLanguage', descKey: 'focusLanguageDesc', icon: 'translate' },
  { key: 'attention', labelKey: 'focusAttention', descKey: 'focusAttentionDesc', icon: 'center-focus-strong' },
  { key: 'sleep', labelKey: 'focusSleep', descKey: 'focusSleepDesc', icon: 'bedtime' },
  { key: 'social', labelKey: 'focusSocial', descKey: 'focusSocialDesc', icon: 'groups' },
];

export default function OnboardingFocus() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Set<FocusArea>>(new Set());

  function toggle(k: FocusArea) {
    const next = new Set(selected);
    next.has(k) ? next.delete(k) : next.add(k);
    setSelected(next);
  }

  async function onContinue() {
    await updateProfile({ focusAreas: Array.from(selected) });
    router.push('/(auth)/onboarding-ready');
  }

  return (
    <OnboardingScaffold
      step={2}
      total={3}
      title={t('focusTitle')}
      subtitle={t('focusSubtitle')}
      canContinue={selected.size > 0}
      onContinue={onContinue}
    >
      <View style={{ gap: 12, paddingVertical: 8 }}>
        {AREAS.map((a) => {
          const isSelected = selected.has(a.key);
          return (
            <Pressable
              key={a.key}
              onPress={() => toggle(a.key)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                paddingHorizontal: spacing.lg,
                paddingVertical: 18,
                borderRadius: 20,
                backgroundColor: isSelected ? colors.secondaryContainer : colors.surfaceContainerLowest,
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
                <MaterialIcons
                  name={a.icon}
                  size={24}
                  color={isSelected ? '#fff' : colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...type.titleLg, color: colors.onSurface }}>
                  {t(a.labelKey)}
                </Text>
                <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant, marginTop: 2 }}>
                  {t(a.descKey)}
                </Text>
              </View>
              {isSelected && (
                <MaterialIcons name="check-circle" size={24} color={colors.secondary} />
              )}
            </Pressable>
          );
        })}
      </View>
    </OnboardingScaffold>
  );
}
