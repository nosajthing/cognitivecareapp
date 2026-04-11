import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, type, shadow, spacing } from '../../lib/theme';
import { useAppState, firstName } from '../../lib/profileStore';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { useTranslation } from '../../lib/i18n';

export default function OnboardingReady() {
  const router = useRouter();
  const { t } = useTranslation();
  const { profile } = useAppState();
  const name = firstName(profile);

  return (
    <OnboardingScaffold
      step={3}
      total={3}
      title={t('readyTitle', { name })}
      subtitle={t('readySubtitle')}
      canContinue={true}
      onContinue={() => router.replace('/assessment/record?first=1')}
      continueLabel={t('startFirstCheckIn')}
    >
      <View style={{ flex: 1, justifyContent: 'center', gap: 24 }}>
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 32,
            padding: 28,
            gap: spacing.lg,
            ...shadow.card,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="mic" size={28} color="#fff" />
          </View>
          <View style={{ gap: 8 }}>
            <Text style={{ ...type.headlineMd, color: '#fff' }}>{t('howItWorks')}</Text>
            <Text style={{ ...type.bodyLg, color: 'rgba(255,255,255,0.85)' }}>
              {t('howItWorksBody')}
            </Text>
          </View>
          <View style={{ gap: 12 }}>
            {([
              t('speakNormal'),
              t('noWrongAnswers'),
              t('recordingPrivate'),
            ] as string[]).map((txt) => (
              <View key={txt} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <MaterialIcons name="check" size={18} color={colors.secondaryFixed} />
                <Text style={{ ...type.bodyLg, color: '#fff' }}>{txt}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </OnboardingScaffold>
  );
}
