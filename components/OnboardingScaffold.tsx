import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, type, shadow } from '../lib/theme';
import { useTranslation } from '../lib/i18n';

export function OnboardingScaffold({
  step,
  total,
  title,
  subtitle,
  children,
  canContinue,
  onContinue,
  continueLabel,
}: {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  canContinue: boolean;
  onContinue: () => void;
  continueLabel?: string;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const label = continueLabel ?? t('continue');
  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingVertical: 16,
          gap: 16,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          disabled={step === 1}
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', opacity: step === 1 ? 0 : 1 }}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 6, flex: 1 }}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: i < step ? colors.primary : colors.outlineVariant,
              }}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 24, gap: 24 }}>
        <View style={{ gap: 12, marginTop: 16 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '800',
              color: colors.primary,
              letterSpacing: -0.6,
              lineHeight: 38,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={{ ...type.bodyLg, color: colors.onSurfaceVariant }}>{subtitle}</Text>
          )}
        </View>
        <View style={{ flex: 1 }}>{children}</View>
      </View>

      {/* Continue */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <Pressable
          onPress={onContinue}
          disabled={!canContinue}
          style={({ pressed }) => ({
            backgroundColor: canContinue ? colors.primary : colors.outlineVariant,
            paddingVertical: 16,
            borderRadius: 20,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            opacity: pressed ? 0.9 : 1,
            ...(canContinue ? shadow.card : {}),
          })}
        >
          <Text style={{ ...type.titleLg, color: '#fff' }}>{label}</Text>
          <MaterialIcons name="arrow-forward" size={22} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
