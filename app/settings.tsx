import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, type, radius, shadow } from '../lib/theme';
import { useTranslation } from '../lib/i18n';
import {
  useAppState,
  resetAll,
  EDUCATION_YEARS_MAX,
  type Sex,
  type Handedness,
  type FamilyHistoryDementia,
} from '../lib/profileStore';

const FOCUS_AREA_KEYS = {
  memory: 'focusMemory',
  language: 'focusLanguage',
  attention: 'focusAttention',
  mood: 'focusMood',
  social: 'focusSocial',
} as const;

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

export default function SettingsScreen() {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.outlineVariant,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radius.full,
          }}
          hitSlop={8}
        >
          <MaterialIcons name="close" size={24} color={colors.onSurface} />
        </Pressable>
        <Text
          style={{
            ...type.headlineSm,
            color: colors.onSurface,
            marginLeft: 8,
            flex: 1,
          }}
        >
          {t('settingsTitle')}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View
          style={{
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: radius.lg,
            ...shadow.card,
            overflow: 'hidden',
          }}
        >
          <Text
            style={{
              ...type.labelMd,
              color: colors.primary,
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 8,
              textTransform: 'uppercase',
            }}
          >
            {t('settingsProfile')}
          </Text>

          {/* Name row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
            }}
          >
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
              {t('settingsName')}
            </Text>
            <Text style={{ ...type.bodyMd, color: colors.onSurface }}>
              {profile?.name ?? '—'}
            </Text>
          </View>

          {/* Email row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
            }}
          >
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
              {t('settingsEmail')}
            </Text>
            <Text style={{ ...type.bodyMd, color: colors.onSurface }}>
              {profile?.email ?? '—'}
            </Text>
          </View>

          {/* Birth year row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
            }}
          >
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
              {t('settingsBirthYear')}
            </Text>
            <Text style={{ ...type.bodyMd, color: colors.onSurface }}>
              {profile?.birthYear != null ? String(profile.birthYear) : '—'}
            </Text>
          </View>

          {/* Sex row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
            }}
          >
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
              {t('settingsSex')}
            </Text>
            <Text style={{ ...type.bodyMd, color: colors.onSurface }}>
              {sexLabel(t, profile?.sex) || '—'}
            </Text>
          </View>

          {/* Handedness row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
            }}
          >
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
              {t('settingsHandedness')}
            </Text>
            <Text style={{ ...type.bodyMd, color: colors.onSurface }}>
              {handednessLabel(t, profile?.handedness) || '—'}
            </Text>
          </View>

          {/* Education row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
            }}
          >
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
              {t('settingsEducation')}
            </Text>
            <Text
              style={{ ...type.bodyMd, color: colors.onSurface, flexShrink: 1, textAlign: 'right' }}
            >
              {educationYearsLabel(t, profile?.educationYears) || '—'}
            </Text>
          </View>

          {/* Family history row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
            }}
          >
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
              {t('settingsFamilyHistory')}
            </Text>
            <Text style={{ ...type.bodyMd, color: colors.onSurface }}>
              {familyHistoryLabel(t, profile?.familyHistoryDementia) || '—'}
            </Text>
          </View>

          {/* Focus areas row */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
            }}
          >
            <Text
              style={{
                ...type.bodyMd,
                color: colors.onSurfaceVariant,
                marginBottom: 8,
              }}
            >
              {t('settingsFocusAreas')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {profile?.focusAreas && profile.focusAreas.length > 0 ? (
                profile.focusAreas.map((area) => (
                  <View
                    key={area}
                    style={{
                      backgroundColor: colors.primaryContainer,
                      borderRadius: radius.full,
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{ ...type.labelLg, color: colors.onPrimaryContainer }}
                    >
                      {t(FOCUS_AREA_KEYS[area])}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
                  —
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Language Section */}
        <View
          style={{
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: radius.lg,
            ...shadow.card,
            overflow: 'hidden',
          }}
        >
          <Text
            style={{
              ...type.labelMd,
              color: colors.primary,
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 12,
              textTransform: 'uppercase',
            }}
          >
            {t('settingsLanguage')}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              paddingHorizontal: 16,
              paddingBottom: 16,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
              paddingTop: 12,
            }}
          >
            <Pressable
              onPress={() => setLocale('en')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: radius.md,
                alignItems: 'center',
                backgroundColor: locale === 'en' ? colors.primary : 'transparent',
                borderWidth: 1.5,
                borderColor: locale === 'en' ? colors.primary : colors.outline,
              }}
            >
              <Text
                style={{
                  ...type.labelLg,
                  color: locale === 'en' ? colors.onPrimary : colors.onSurface,
                }}
              >
                English
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setLocale('zh')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: radius.md,
                alignItems: 'center',
                backgroundColor: locale === 'zh' ? colors.primary : 'transparent',
                borderWidth: 1.5,
                borderColor: locale === 'zh' ? colors.primary : colors.outline,
              }}
            >
              <Text
                style={{
                  ...type.labelLg,
                  color: locale === 'zh' ? colors.onPrimary : colors.onSurface,
                }}
              >
                中文
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Notifications Section */}
        <View
          style={{
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: radius.lg,
            ...shadow.card,
            overflow: 'hidden',
          }}
        >
          <Text
            style={{
              ...type.labelMd,
              color: colors.primary,
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 8,
              textTransform: 'uppercase',
            }}
          >
            {t('settingsNotifications')}
          </Text>

          {/* Daily reminder toggle */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
            }}
          >
            <Text style={{ ...type.bodyMd, color: colors.onSurface }}>
              {t('settingsDailyReminder')}
            </Text>
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
              trackColor={{ false: colors.surfaceVariant, true: colors.primaryContainer }}
              thumbColor={dailyReminder ? colors.primary : colors.outline}
            />
          </View>

          {/* Reminder time */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
            }}
          >
            <Text style={{ ...type.bodyMd, color: colors.onSurface }}>
              {t('settingsReminderTime')}
            </Text>
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
              9:00 AM
            </Text>
          </View>
        </View>

        {/* About Section */}
        <View
          style={{
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: radius.lg,
            ...shadow.card,
            overflow: 'hidden',
          }}
        >
          <Text
            style={{
              ...type.labelMd,
              color: colors.primary,
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 8,
              textTransform: 'uppercase',
            }}
          >
            {t('settingsAbout')}
          </Text>

          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
              gap: 8,
            }}
          >
            <Text style={{ ...type.bodyMd, color: colors.onSurface, lineHeight: 20 }}>
              {t('settingsAboutText')}
            </Text>
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant }}>
              {t('settingsVersion', { version: '1.0.0' })}
            </Text>
          </View>
        </View>

        {/* Reset Button */}
        <Pressable
          onPress={handleReset}
          style={({ pressed }) => ({
            borderWidth: 1.5,
            borderColor: colors.error,
            borderRadius: radius.lg,
            paddingVertical: 14,
            alignItems: 'center',
            opacity: pressed ? 0.7 : 1,
            marginBottom: 8,
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
