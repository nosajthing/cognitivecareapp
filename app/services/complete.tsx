import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, type as typ, radius, shadow, spacing } from '../../lib/theme';
import { getServiceById } from '../../lib/servicesData';
import * as bookingStore from '../../lib/bookingStore';
import { useTranslation } from '../../lib/i18n';

export default function BookingComplete() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, locale } = useTranslation();
  const loc = locale as 'en' | 'zh';

  const state = bookingStore.getState();
  const service = getServiceById(state.serviceId ?? '');

  function handleBack() {
    bookingStore.reset();
    router.replace('/(tabs)/services');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 40 }]}>
      {/* Success icon */}
      <View style={styles.iconCircle}>
        <MaterialIcons name="check-circle" size={80} color={colors.secondary} />
      </View>

      {/* Title */}
      <Text style={{ ...typ.headlineLg, color: colors.onSurface, textAlign: 'center' }}>
        {t('servicesCompleteTitle' as any)}
      </Text>
      <Text style={{
        ...typ.bodyLg,
        color: colors.onSurfaceVariant,
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
        lineHeight: 24,
      }}>
        {t('servicesCompleteSub' as any)}
      </Text>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <Text style={{ ...typ.labelLg, color: colors.onSurfaceVariant, marginBottom: spacing.sm }}>
          {t('servicesBookingSummary' as any)}
        </Text>

        {service && (
          <SummaryRow
            icon="storefront"
            label={service.title[loc]}
            value={`¥${service.price.toLocaleString()}${service.priceLabel[loc]}`}
          />
        )}
        {state.name && (
          <SummaryRow icon="person" label={t('servicesYourName' as any)} value={state.name} />
        )}
        {state.phone && (
          <SummaryRow icon="phone" label={t('servicesPhone' as any)} value={state.phone} />
        )}
        {state.preferredDate && (
          <SummaryRow icon="calendar-today" label={t('servicesPreferredDate' as any)} value={state.preferredDate} />
        )}
        {state.preferredTime && (
          <SummaryRow icon="access-time" label={t('servicesPreferredTime' as any)} value={state.preferredTime} />
        )}
        {state.notes ? (
          <SummaryRow icon="notes" label={t('servicesNotes' as any)} value={state.notes} />
        ) : null}
      </View>

      {/* Back button */}
      <Pressable
        onPress={handleBack}
        style={({ pressed }) => [
          styles.backButton,
          { opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <MaterialIcons name="arrow-back" size={20} color={colors.onPrimary} />
        <Text style={{ ...typ.titleLg, color: colors.onPrimary }}>
          {t('servicesBackToServices' as any)}
        </Text>
      </Pressable>
    </View>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <MaterialIcons name={icon} size={18} color={colors.onSurfaceVariant} />
      <View style={{ flex: 1 }}>
        <Text style={{ ...typ.labelLg, color: colors.onSurfaceVariant }}>{label}</Text>
        <Text style={{ ...typ.bodyLg, color: colors.onSurface }}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  iconCircle: {
    marginBottom: spacing.sm,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.md,
    ...shadow.soft,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: 16,
    marginTop: spacing.lg,
  },
});
