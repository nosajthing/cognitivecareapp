import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, type, radius, shadow, spacing } from '../../lib/theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useTranslation } from '../../lib/i18n';
import {
  useAppState,
  resetAll,
  EDUCATION_YEARS_MAX,
  type Sex,
  type Handedness,
  type FamilyHistoryDementia,
} from '../../lib/profileStore';

// Locale-aware label lookups for the demographic fields. Reuses translation
// keys defined for the onboarding screens so labels stay in sync.
function sexLabel(t: (k: any) => string, v?: Sex): string {
  if (!v) return '';
  return t(v === 'male' ? 'sexMale' : v === 'female' ? 'sexFemale' : 'sexUnspecified');
}
function handednessLabel(t: (k: any) => string, v?: Handedness): string {
  if (!v) return '';
  return t(v === 'right' ? 'handRight' : v === 'left' ? 'handLeft' : 'handBoth');
}
function educationYearsLabel(t: (k: any, p?: any) => string, v?: number): string {
  if (v == null) return '';
  if (v >= EDUCATION_YEARS_MAX) return t('educationYearsPlus');
  return t('educationYearsValue', { years: v });
}
function familyHistoryLabel(t: (k: any) => string, v?: FamilyHistoryDementia): string {
  if (!v) return '';
  return t(
    v === 'yes' ? 'familyHistoryYes' : v === 'no' ? 'familyHistoryNo' : 'familyHistoryUnsure'
  );
}

/* ── Reusable row inside a section card ──────────────────────────── */
function Row({
  label,
  children,
  first,
}: {
  label: string;
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderTopWidth: first ? 0 : 1,
        borderTopColor: colors.outlineVariant,
      }}
    >
      <Text style={{ ...type.bodyLg, color: colors.onSurfaceVariant }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

/* ── Section card wrapper ────────────────────────────────────────── */
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

/* ── Section header (mirrors Home's pattern) ─────────────────────── */
function SectionHeader({ children }: { children: string }) {
  return (
    <Text style={{ ...type.headlineMd, color: colors.primary }}>
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
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile ──────────────────────────────────── */}
        <View style={{ gap: spacing.md }}>
          <SectionHeader>{t('settingsProfile')}</SectionHeader>
          <Section>
            <Row label={t('settingsName')} first>
              <Text style={{ ...type.bodyLg, color: colors.onSurface }}>
                {profile?.name ?? '—'}
              </Text>
            </Row>
            <Row label={t('settingsEmail')}>
              <Text style={{ ...type.bodyLg, color: colors.onSurface }}>
                {profile?.email ?? '—'}
              </Text>
            </Row>
            <Row label={t('settingsBirthYear')}>
              <Text style={{ ...type.bodyLg, color: colors.onSurface }}>
                {profile?.birthYear != null ? String(profile.birthYear) : '—'}
              </Text>
            </Row>
            <Row label={t('settingsSex')}>
              <Text style={{ ...type.bodyLg, color: colors.onSurface }}>
                {sexLabel(t, profile?.sex) || '—'}
              </Text>
            </Row>
            <Row label={t('settingsHandedness')}>
              <Text style={{ ...type.bodyLg, color: colors.onSurface }}>
                {handednessLabel(t, profile?.handedness) || '—'}
              </Text>
            </Row>
            <Row label={t('settingsEducation')}>
              <Text style={{ ...type.bodyLg, color: colors.onSurface }}>
                {educationYearsLabel(t, profile?.educationYears) || '—'}
              </Text>
            </Row>
            <Row label={t('settingsFamilyHistory')}>
              <Text style={{ ...type.bodyLg, color: colors.onSurface }}>
                {familyHistoryLabel(t, profile?.familyHistoryDementia) || '—'}
              </Text>
            </Row>
          </Section>
        </View>

        {/* ── Language ─────────────────────────────────── */}
        <View style={{ gap: spacing.md }}>
          <SectionHeader>{t('settingsLanguage')}</SectionHeader>
          <Section>
            <Row label={t('settingsLanguage')} first>
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
        </View>

        {/* ── Notifications ────────────────────────────── */}
        <View style={{ gap: spacing.md }}>
          <SectionHeader>{t('settingsNotifications')}</SectionHeader>
          <Section>
            <Row label={t('settingsDailyReminder')} first>
              <Switch
                value={dailyReminder}
                onValueChange={setDailyReminder}
                trackColor={{ false: colors.surfaceVariant, true: colors.primaryContainer }}
                thumbColor={dailyReminder ? colors.primary : colors.outline}
              />
            </Row>
            <Row label={t('settingsReminderTime')}>
              <Text style={{ ...type.bodyLg, color: colors.onSurfaceVariant }}>
                9:00 AM
              </Text>
            </Row>
          </Section>
        </View>

        {/* ── About ────────────────────────────────────── */}
        <View style={{ gap: spacing.md }}>
          <SectionHeader>{t('settingsAbout')}</SectionHeader>
          <Section>
            <View
              style={{
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                gap: spacing.xs,
              }}
            >
              <Text style={{ ...type.bodyLg, color: colors.onSurface }}>
                {t('settingsAboutText')}
              </Text>
              <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
                {t('settingsVersion', { version: '1.0.0' })}
              </Text>
            </View>
          </Section>
        </View>

        {/* ── Reset ────────────────────────────────────── */}
        <Pressable
          onPress={handleReset}
          style={({ pressed }) => ({
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            borderRadius: radius.lg,
            paddingVertical: spacing.md,
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
