import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, type as typ, radius, shadow, spacing } from '../../lib/theme';
import { getServiceById } from '../../lib/servicesData';
import * as bookingStore from '../../lib/bookingStore';
import { useAppState } from '../../lib/profileStore';
import { useTranslation } from '../../lib/i18n';

export default function BookingConfirm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, locale } = useTranslation();
  const { profile } = useAppState();
  const loc = locale as 'en' | 'zh';

  const serviceId = bookingStore.getState().serviceId;
  const service = getServiceById(serviceId ?? '');

  const [name, setName] = useState(profile?.name ?? '');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const canConfirm = name.trim().length > 0 && phone.trim().length > 0;

  function handleConfirm() {
    bookingStore.setName(name.trim());
    bookingStore.setPhone(phone.trim());
    bookingStore.setPreferredDate(date.trim());
    bookingStore.setPreferredTime(time.trim());
    bookingStore.setNotes(notes.trim());
    bookingStore.setCompletedAt(new Date().toISOString());
    router.push('/services/complete');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.8 : 1 }]}
        >
          <MaterialIcons name="arrow-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={{ ...typ.headlineSm, color: colors.onSurface }}>
          {t('servicesConfirmTitle' as any)}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120, gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Service summary card */}
        {service && (
          <View style={styles.summaryCard}>
            <View
              style={[styles.summaryColor, { backgroundColor: service.heroColor }]}
            >
              {service.doctorEmoji ? (
                <Text style={{ fontSize: 28 }}>{service.doctorEmoji}</Text>
              ) : (
                <MaterialIcons
                  name={service.category === 'insurance' ? 'shield' : 'biotech'}
                  size={24}
                  color="rgba(255,255,255,0.8)"
                />
              )}
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ ...typ.bodyLg, color: colors.onSurface, fontWeight: '600' }}>
                {service.title[loc]}
              </Text>
              <Text style={{ ...typ.bodyMd, color: colors.onSurfaceVariant }}>
                {service.subtitle[loc]}
              </Text>
            </View>
            <Text style={{ ...typ.headlineSm, color: colors.primary }}>
              ¥{service.price.toLocaleString()}
            </Text>
          </View>
        )}

        {/* Form fields */}
        <View style={{ gap: spacing.md }}>
          <FormField
            label={t('servicesYourName' as any)}
            value={name}
            onChangeText={setName}
            placeholder={loc === 'zh' ? '请输入姓名' : 'Enter your name'}
            autoCapitalize="words"
          />
          <FormField
            label={t('servicesPhone' as any)}
            value={phone}
            onChangeText={setPhone}
            placeholder={loc === 'zh' ? '请输入手机号码' : 'Enter phone number'}
            keyboardType="phone-pad"
          />
          <FormField
            label={t('servicesPreferredDate' as any)}
            value={date}
            onChangeText={setDate}
            placeholder="2026-04-15"
          />
          <FormField
            label={t('servicesPreferredTime' as any)}
            value={time}
            onChangeText={setTime}
            placeholder="10:00 AM"
          />
          <FormField
            label={t('servicesNotes' as any)}
            value={notes}
            onChangeText={setNotes}
            placeholder={loc === 'zh' ? '如有特殊需求请在此说明' : 'Any special requests or notes'}
            multiline
          />
        </View>
      </ScrollView>

      {/* Fixed bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          onPress={handleConfirm}
          disabled={!canConfirm}
          style={({ pressed }) => [
            styles.confirmButton,
            !canConfirm && styles.confirmButtonDisabled,
            { opacity: pressed && canConfirm ? 0.9 : 1 },
          ]}
        >
          <Text style={{
            ...typ.titleLg,
            color: canConfirm ? colors.onPrimary : colors.onSurfaceVariant,
          }}>
            {t('servicesConfirmButton' as any)}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad';
  multiline?: boolean;
  autoCapitalize?: 'none' | 'words' | 'sentences';
}) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={{ ...typ.labelLg, color: colors.onSurfaceVariant }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.outline}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          multiline && { height: 100, textAlignVertical: 'top' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.soft,
  },
  summaryColor: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    ...typ.bodyLg,
    color: colors.onSurface,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.lg,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    ...shadow.card,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: colors.surfaceContainerHigh,
  },
});
