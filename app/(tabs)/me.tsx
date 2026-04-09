import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, type, radius, shadow, spacing } from '../../lib/theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useTranslation } from '../../lib/i18n';
import { useAppState, resetAll } from '../../lib/profileStore';

/* ── Reusable row inside a card ──────────────────────────── */
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: colors.outlineVariant,
      }}
    >
      <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

/* ── Section card wrapper ────────────────────────────────── */
function Section({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: colors.surfaceContainerLowest,
        borderRadius: radius.lg,
        ...shadow.soft,
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  );
}

/* ── Section header ──────────────────────────────────────── */
function SectionTitle({ children }: { children: string }) {
  return (
    <Text
      style={{
        ...type.labelMd,
        color: colors.onSurfaceVariant,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 10,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Text>
  );
}

export default function MeScreen() {
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation();
  const { profile } = useAppState();
  const [dailyReminder, setDailyReminder] = useState(false);

  function handleReset() {
    Alert.alert(
      t('settingsResetAll'),
      t('settingsResetConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('settingsResetYes'),
          style: 'destructive',
          onPress: async () => {
            await resetAll();
            router.replace('/(auth)/signup');
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t('headerMe')} />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile ──────────────────────────────────── */}
        <Section>
          <SectionTitle>{t('settingsProfile')}</SectionTitle>

          <Row label={t('settingsName')}>
            <Text style={{ ...type.bodyMd, color: colors.onSurface }}>
              {profile?.name ?? '—'}
            </Text>
          </Row>

          <Row label={t('settingsEmail')}>
            <Text style={{ ...type.bodyMd, color: colors.onSurface }}>
              {profile?.email ?? '—'}
            </Text>
          </Row>

          <Row label={t('settingsBirthYear')}>
            <Text style={{ ...type.bodyMd, color: colors.onSurface }}>
              {profile?.birthYear != null ? String(profile.birthYear) : '—'}
            </Text>
          </Row>
        </Section>

        {/* ── Preferences ──────────────────────────────── */}
        <Section>
          <SectionTitle>{t('settingsLanguage')}</SectionTitle>

          {/* Language — inline segmented pill, same row height as Switch rows */}
          <Row label={t('settingsLanguage')}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: colors.surfaceContainerHigh,
                borderRadius: radius.full,
                padding: 3,
              }}
            >
              {(['en', 'zh'] as const).map((lang) => {
                const active = locale === lang;
                return (
                  <Pressable
                    key={lang}
                    onPress={() => setLocale(lang)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 5,
                      borderRadius: radius.full,
                      backgroundColor: active ? colors.surfaceContainerLowest : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        ...type.labelLg,
                        color: active ? colors.onSurface : colors.onSurfaceVariant,
                      }}
                    >
                      {lang === 'en' ? 'EN' : '中文'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Row>
        </Section>

        {/* ── Notifications ────────────────────────────── */}
        <Section>
          <SectionTitle>{t('settingsNotifications')}</SectionTitle>

          <Row label={t('settingsDailyReminder')}>
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
              trackColor={{ false: colors.surfaceVariant, true: colors.primaryContainer }}
              thumbColor={dailyReminder ? colors.primary : colors.outline}
            />
          </Row>

          <Row label={t('settingsReminderTime')}>
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
              9:00 AM
            </Text>
          </Row>
        </Section>

        {/* ── About ────────────────────────────────────── */}
        <Section>
          <SectionTitle>{t('settingsAbout')}</SectionTitle>

          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 14,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
              gap: 6,
            }}
          >
            <Text style={{ ...type.bodyMd, color: colors.onSurface, lineHeight: 20 }}>
              {t('settingsAboutText')}
            </Text>
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
              {t('settingsVersion', { version: '1.0.0' })}
            </Text>
          </View>
        </Section>

        {/* ── Reset ────────────────────────────────────── */}
        <Pressable
          onPress={handleReset}
          style={({ pressed }) => ({
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            borderRadius: radius.lg,
            paddingVertical: 14,
            alignItems: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ ...type.labelLg, color: colors.error }}>
            {t('settingsResetAll')}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
