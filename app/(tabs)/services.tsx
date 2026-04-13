import React, { useRef } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, type as typ, radius, shadow, spacing } from '../../lib/theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useTranslation } from '../../lib/i18n';
import { getServicesByCategory, type ServiceItem } from '../../lib/servicesData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = spacing.lg;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;

export default function Services() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const loc = locale as 'en' | 'zh';

  const insurance = getServicesByCategory('insurance');
  const doctors = getServicesByCategory('doctor');

  const featuredScreeningId = 'screening-comprehensive';
  const featuredInsurance = insurance[0];

  function navigateTo(id: string) {
    router.push(`/services/${id}`);
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t('tabServices' as any)} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120, gap: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Brain Health Screening ── */}
        <View style={{ paddingHorizontal: CARD_MARGIN, gap: spacing.md }}>
          <Section
            title={t('servicesBrainScreening' as any)}
            subtitle={loc === 'zh'
              ? '早期发现认知风险，抓住黄金干预窗口期。专业EEG脑电与影像学筛查，让您安心了解大脑健康状况。'
              : 'Detect cognitive risks early and seize the golden intervention window. Professional EEG and imaging screening for peace of mind about your brain health.'}
          />
          <ProductCard
            item={getServicesByCategory('screening').find((s) => s.id === featuredScreeningId)!}
            locale={loc}
            icon="biotech"
            onPress={() => navigateTo(featuredScreeningId)}
          />
        </View>

        {/* ── Health Protection ── */}
        <View style={{ paddingHorizontal: CARD_MARGIN, gap: spacing.md }}>
          <Section
            title={t('servicesPrimeTitle' as any)}
            subtitle={loc === 'zh'
              ? '认知障碍治疗费用高昂，柏盛健康高端住院险为全家提供认知健康与住院综合保障。'
              : 'Cognitive care can be costly. Basheng Health\'s premium inpatient plan gives your family complete peace of mind for cognitive and general hospital care.'}
          />
          <ProductCard
            item={featuredInsurance}
            locale={loc}
            icon="shield"
            onPress={() => navigateTo(featuredInsurance.id)}
          />
        </View>

        {/* ── Specialist Booking ── */}
        <View style={{ gap: spacing.md }}>
          <View style={{ paddingHorizontal: CARD_MARGIN }}>
            <Section
              title={t('servicesSpecialists' as any)}
              subtitle={loc === 'zh'
                ? 'AI筛查发现风险后，由权威神经内科专家为您制定个性化诊疗和康复方案，从筛查到干预无缝衔接。'
                : 'After AI screening identifies risks, our top neurologists create personalized treatment and rehabilitation plans — seamless from screening to intervention.'}
            />
          </View>
          <DoctorCarousel doctors={doctors} locale={loc} onPress={navigateTo} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── Section header with subtitle ── */
function Section({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={{ ...typ.headlineMd, color: colors.primary }}>{title}</Text>
      <Text style={{ ...typ.bodyMd, color: colors.onSurfaceVariant, lineHeight: 22 }}>
        {subtitle}
      </Text>
    </View>
  );
}

/* ── Doctor Carousel ── */
function DoctorCarousel({
  doctors,
  locale,
  onPress,
}: {
  doctors: ServiceItem[];
  locale: 'en' | 'zh';
  onPress: (id: string) => void;
}) {
  return (
    <FlatList
      data={doctors}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + spacing.md}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: CARD_MARGIN, gap: spacing.md }}
      renderItem={({ item }) => (
        <View style={{ width: CARD_WIDTH }}>
          <ProductCard
            item={item}
            locale={locale}
            isDoctor
            onPress={() => onPress(item.id)}
          />
        </View>
      )}
    />
  );
}

/* ── Big Airbnb-style Product Card ── */
function ProductCard({
  item,
  locale,
  icon,
  isDoctor,
  onPress,
}: {
  item: ServiceItem;
  locale: 'en' | 'zh';
  icon?: keyof typeof MaterialIcons.glyphMap;
  isDoctor?: boolean;
  onPress: () => void;
}) {
  // Photo-led hero variant: when item.heroImage is set, render the strong
  // editorial layout with title overlaid on the image and no price.
  if (item.heroImage) {
    return <PhotoLedProductCard item={item} locale={locale} onPress={onPress} />;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.95 : 1 },
      ]}
    >
      {/* Hero image area */}
      <View style={[styles.cardHero, { backgroundColor: item.heroColor }]}>
        {isDoctor && item.doctorEmoji ? (
          <View style={styles.doctorCircle}>
            <Text style={{ fontSize: 56 }}>{item.doctorEmoji}</Text>
          </View>
        ) : (
          <View style={styles.heroIconCircle}>
            <MaterialIcons
              name={icon ?? 'medical-services'}
              size={48}
              color="rgba(255,255,255,0.25)"
            />
          </View>
        )}

        {/* Badge */}
        {item.badge && (
          <View style={styles.cardBadge}>
            <Text style={{ ...typ.labelLg, color: '#fff' }}>{item.badge[locale]}</Text>
          </View>
        )}

        {/* Availability */}
        {item.availability && (
          <View style={styles.availBadge}>
            <MaterialIcons name="event-available" size={13} color="#fff" />
            <Text style={{ ...typ.labelMd, color: '#fff' }}>{item.availability[locale]}</Text>
          </View>
        )}
      </View>

      {/* Content area */}
      <View style={styles.cardContent}>
        <Text style={{ ...typ.titleLg, color: colors.onSurface }} numberOfLines={1}>
          {item.title[locale]}
        </Text>
        <Text style={{ ...typ.bodyMd, color: colors.onSurfaceVariant }} numberOfLines={2}>
          {item.subtitle[locale]}
        </Text>

        {/* Price row */}
        {!item.hidePrice && (
          <View style={styles.priceRow}>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>¥{item.originalPrice.toLocaleString()}</Text>
            )}
            <Text style={{ ...typ.titleLg, color: colors.onSurface }}>
              ¥{item.price.toLocaleString()}
            </Text>
            <Text style={{ ...typ.bodyMd, color: colors.onSurfaceVariant }}>
              {item.priceLabel[locale]}
            </Text>
          </View>
        )}

        {/* Rating row */}
        {item.reviews.length > 0 && (
          <View style={styles.ratingRow}>
            <Text style={{ fontSize: 13, color: colors.tertiary }}>★</Text>
            <Text style={{ ...typ.labelLg, color: colors.onSurface }}>
              {(item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length).toFixed(1)}
            </Text>
            <Text style={{ ...typ.labelLg, color: colors.onSurfaceVariant }}>
              ({item.reviews.length})
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

/* ── Photo-led editorial card (used for flagship products) ── */
function PhotoLedProductCard({
  item,
  locale,
  onPress,
}: {
  item: ServiceItem;
  locale: 'en' | 'zh';
  onPress: () => void;
}) {
  const avgRating =
    item.reviews.length > 0
      ? item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length
      : 0;
  const reviewsLabel = locale === 'zh'
    ? `${item.reviews.length} 条评价`
    : `${item.reviews.length} reviews`;
  const topReview = item.reviews[0];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.95 : 1 },
      ]}
    >
      {/* Photo hero — 3:2 aspect, full image edge-to-edge */}
      <View style={[styles.photoHero, { backgroundColor: item.heroColor }]}>
        <Image
          source={item.heroImage}
          style={styles.photoHeroImage}
          resizeMode="cover"
        />

        {/* Flagship badge */}
        {item.badge && (
          <View style={styles.flagshipBadge}>
            <MaterialIcons name="verified" size={14} color="#fff" />
            <Text style={{ ...typ.labelLg, color: '#fff' }}>
              {item.badge[locale]}
            </Text>
          </View>
        )}

        {/* Tech tag chip */}
        {item.techTag && (
          <View style={styles.techTagChip}>
            <MaterialIcons name="bolt" size={15} color="#fff" />
            <Text style={{ ...typ.labelLg, color: '#fff' }}>
              {item.techTag[locale]}
            </Text>
          </View>
        )}
      </View>

      {/* Title + subtitle block (white area) */}
      <View style={styles.photoTitleBlock}>
        <Text style={styles.photoTitleDark}>{item.title[locale]}</Text>
        <Text style={styles.photoSubtitleDark} numberOfLines={2}>
          {item.subtitle[locale]}
        </Text>
      </View>

      {/* Social-proof strip */}
      <View style={styles.socialStrip}>
        <View style={styles.socialRow}>
          <MaterialIcons name="star" size={16} color={colors.tertiary} />
          <Text style={{ ...typ.labelLg, color: colors.onSurface }}>
            {avgRating.toFixed(1)}
          </Text>
          <Text style={styles.socialDot}>·</Text>
          <Text style={{ ...typ.labelLg, color: colors.onSurfaceVariant }}>
            {reviewsLabel}
          </Text>
          {item.totalBookingsLabel && (
            <>
              <Text style={styles.socialDot}>·</Text>
              <Text style={{ ...typ.labelLg, color: colors.onSurfaceVariant }}>
                {item.totalBookingsLabel[locale]}
              </Text>
            </>
          )}
        </View>

        {topReview && (
          <Text
            style={styles.reviewQuote}
            numberOfLines={2}
          >
            “{topReview.text[locale]}” — {topReview.author[locale]}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLowest,
    ...shadow.card,
  },
  cardHero: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  availBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cardContent: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: spacing.xs,
  },
  originalPrice: {
    ...typ.bodyMd,
    color: colors.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // ── Photo-led card ──
  photoHero: {
    width: '100%',
    aspectRatio: 3 / 2,
    overflow: 'hidden',
  },
  photoHeroImage: {
    width: '100%',
    height: '100%',
  },
  flagshipBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...shadow.soft,
  },
  techTagChip: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 77, 91, 0.92)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  photoTitleBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
    gap: 4,
  },
  photoTitleDark: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    color: colors.onSurface,
    letterSpacing: -0.2,
  },
  photoSubtitleDark: {
    ...typ.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  socialStrip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 6,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  socialDot: {
    ...typ.labelLg,
    color: colors.onSurfaceVariant,
    marginHorizontal: 4,
  },
  reviewQuote: {
    ...typ.bodyMd,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
