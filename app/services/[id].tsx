import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, type as typ, radius, shadow, spacing } from '../../lib/theme';
import { getServiceById } from '../../lib/servicesData';
import { setServiceId } from '../../lib/bookingStore';
import { useTranslation } from '../../lib/i18n';

export default function ServiceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, locale } = useTranslation();
  const service = getServiceById(id ?? '');

  if (!service) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ ...typ.bodyLg, color: colors.onSurfaceVariant }}>Service not found</Text>
      </SafeAreaView>
    );
  }

  const loc = locale as 'en' | 'zh';

  function handleBook() {
    setServiceId(service!.id);
    router.push('/services/confirm');
  }

  const stars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero */}
        <View
          style={{
            height: 280,
            backgroundColor: service.heroColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {service.doctorEmoji ? (
            <View style={styles.doctorAvatar}>
              <Text style={{ fontSize: 72 }}>{service.doctorEmoji}</Text>
            </View>
          ) : (
            <View style={styles.heroIcon}>
              <MaterialIcons
                name={service.category === 'insurance' ? 'shield' : 'biotech'}
                size={64}
                color="rgba(255,255,255,0.3)"
              />
            </View>
          )}

          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              { top: insets.top + 8, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <MaterialIcons name="arrow-back" size={22} color={colors.onSurface} />
          </Pressable>

          {/* Badge */}
          {service.badge && (
            <View style={[styles.heroBadge, { top: insets.top + 8 }]}>
              <Text style={{ ...typ.labelLg, color: '#fff' }}>{service.badge[loc]}</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={{ padding: spacing.lg, gap: spacing.lg }}>
          {/* Title section */}
          <View style={{ gap: spacing.xs }}>
            <Text style={{ ...typ.headlineLg, color: colors.onSurface }}>
              {service.title[loc]}
            </Text>
            <Text style={{ ...typ.bodyLg, color: colors.onSurfaceVariant }}>
              {service.subtitle[loc]}
            </Text>
            {service.availability && (
              <View style={styles.availabilityBadge}>
                <MaterialIcons name="event-available" size={14} color={colors.secondary} />
                <Text style={{ ...typ.labelLg, color: colors.secondary }}>
                  {service.availability[loc]}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={{ ...typ.bodyLg, color: colors.onSurface, lineHeight: 26 }}>
            {service.description[loc]}
          </Text>

          {/* Features */}
          <View style={{ gap: spacing.md }}>
            <Text style={{ ...typ.headlineSm, color: colors.onSurface }}>
              {t('servicesFeatures' as any)}
            </Text>
            <View style={{ gap: spacing.sm }}>
              {service.features[loc].map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
                  <Text style={{ ...typ.bodyLg, color: colors.onSurface, flex: 1 }}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: colors.outlineVariant }} />

          {/* Reviews */}
          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ ...typ.headlineSm, color: colors.onSurface }}>
                {t('servicesReviews' as any)}
              </Text>
              <View style={styles.trustBadge}>
                <MaterialIcons name="verified" size={14} color={colors.secondary} />
                <Text style={{ ...typ.labelLg, color: colors.secondary }}>
                  {t('servicesVerified' as any)}
                </Text>
              </View>
            </View>

            {service.reviews.map((review, i) => (
              <View key={i} style={styles.reviewCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ ...typ.bodyLg, color: colors.onSurface, fontWeight: '600' }}>
                    {review.author[loc]}
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.tertiary }}>
                    {stars(review.rating)}
                  </Text>
                </View>
                <Text style={{ ...typ.bodyMd, color: colors.onSurfaceVariant, lineHeight: 22 }}>
                  {review.text[loc]}
                </Text>
              </View>
            ))}
          </View>

          {/* Trust signals */}
          <View style={styles.trustRow}>
            <View style={styles.trustPill}>
              <MaterialIcons name="people" size={16} color={colors.onSurfaceVariant} />
              <Text style={{ ...typ.labelLg, color: colors.onSurfaceVariant }}>
                {t('servicesBookings' as any)}
              </Text>
            </View>
            <View style={styles.trustPill}>
              <MaterialIcons name="verified-user" size={16} color={colors.onSurfaceVariant} />
              <Text style={{ ...typ.labelLg, color: colors.onSurfaceVariant }}>
                {t('servicesVerified' as any)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom action bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View>
          {service.originalPrice && (
            <Text style={styles.originalPrice}>¥{service.originalPrice.toLocaleString()}</Text>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
            <Text style={{ ...typ.headlineMd, color: colors.onSurface }}>
              ¥{service.price.toLocaleString()}
            </Text>
            <Text style={{ ...typ.bodyMd, color: colors.onSurfaceVariant }}>
              {service.priceLabel[loc]}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleBook}
          style={({ pressed }) => [
            styles.bookButton,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={{ ...typ.titleLg, color: colors.onPrimary }}>
            {service.category === 'insurance'
              ? (loc === 'zh' ? '购买' : 'Purchase')
              : t('servicesBookNow' as any)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  doctorAvatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  heroBadge: {
    position: 'absolute',
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  reviewCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    ...shadow.card,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
  },
  originalPrice: {
    ...typ.bodyMd,
    color: colors.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
});
