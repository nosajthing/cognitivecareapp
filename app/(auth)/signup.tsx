import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, type, shadow, spacing } from '../../lib/theme';
import { createProfile } from '../../lib/profileStore';
import { useTranslation } from '../../lib/i18n';

export default function Signup() {
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length >= 2 && email.includes('@') && !submitting;

  async function onSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    await createProfile({ name, email });
    router.replace('/(auth)/onboarding-birthyear');
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24, gap: 32, justifyContent: 'space-between' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ gap: 24, marginTop: 32 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  backgroundColor: colors.surfaceContainerLowest,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...shadow.soft,
                }}
              >
                <Image
                  source={require('../../assets/logo.png')}
                  style={{ width: 52, height: 52 }}
                  resizeMode="contain"
                />
              </View>
              <Pressable
                onPress={() => setLocale(locale === 'en' ? 'zh' : 'en')}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: colors.surfaceContainerLow,
                }}
              >
                <Text style={{ ...type.labelLg, color: colors.primary }}>
                  {locale === 'en' ? '中文' : 'EN'}
                </Text>
              </Pressable>
            </View>
            <View style={{ gap: 12 }}>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: '800',
                  color: colors.primary,
                  letterSpacing: -0.8,
                  lineHeight: 40,
                }}
              >
                {t('welcomeTitle')}
              </Text>
              <Text style={{ ...type.bodyLg, color: colors.onSurfaceVariant }}>
                {t('welcomeSubtitle')}
              </Text>
            </View>

            <View style={{ gap: 16, marginTop: 24 }}>
              <Field
                label={t('yourName')}
                value={name}
                onChangeText={setName}
                placeholder={t('namePlaceholder')}
                autoCapitalize="words"
                autoComplete="name"
              />
              <Field
                label={t('email')}
                value={email}
                onChangeText={setEmail}
                placeholder={t('emailPlaceholder')}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <Pressable
              onPress={onSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => ({
                backgroundColor: canSubmit ? colors.primary : colors.outlineVariant,
                paddingVertical: 16,
                borderRadius: 20,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
                opacity: pressed ? 0.9 : 1,
                ...(canSubmit ? shadow.card : {}),
              })}
            >
              <Text style={{ ...type.titleLg, color: '#fff' }}>{t('getStarted')}</Text>
              <MaterialIcons name="arrow-forward" size={22} color="#fff" />
            </Pressable>
            <Text style={{ ...type.bodyMd, color: colors.outline, textAlign: 'center' }}>
              {t('dataPrivacy')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  ...props
}: React.ComponentProps<typeof TextInput> & { label: string }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ ...type.labelMd, color: colors.onSurfaceVariant, textTransform: 'uppercase' }}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.outline}
        style={{
          backgroundColor: colors.surfaceContainerLowest,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderRadius: 16,
          ...type.bodyLg,
          color: colors.onSurface,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
        }}
        {...props}
      />
    </View>
  );
}
