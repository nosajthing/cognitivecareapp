import React from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, type, radius, shadow } from '../../lib/theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TipCard, TipRestoreButton } from '../../components/TipCard';
import { useTranslation } from '../../lib/i18n';

const standardItems: string[] = [
  'servicesNeuroConsult',
  'servicesEEG',
  'servicesMoCA',
  'servicesMMSE',
  'servicesPSQI',
  'servicesNeuro11',
];

const comprehensiveItems = [
  'servicesBiomarkers',
  'servicesAmyloid',
  'servicesMRI',
  'servicesThyroid',
  'servicesOrganFunction',
  'servicesBloodPanel',
] as const;

const doctors = [
  { nameKey: 'servicesDrGuo', specKey: 'servicesDrGuoSpec', color: '#E3F2FD', emoji: '👨‍⚕️' },
  { nameKey: 'servicesDrChen', specKey: 'servicesDrChenSpec', color: '#FFF3E0', emoji: '👩‍⚕️' },
  { nameKey: 'servicesDrLi', specKey: 'servicesDrLiSpec', color: '#F3E5F5', emoji: '👨‍⚕️' },
] as const;

export default function Services() {
  const { t } = useTranslation();

  function handleBookConsult() {
    Alert.alert(t('servicesBookConfirmTitle' as any), t('servicesBookConfirmMsg' as any));
  }

  function handleLearnMore() {
    const details = [
      t('servicesPrimeDetail1' as any),
      t('servicesPrimeDetail2' as any),
      t('servicesPrimeDetail3' as any),
      t('servicesPrimeDetail4' as any),
      t('servicesPrimeDetail5' as any),
      t('servicesPrimeDetail6' as any),
    ].join('\n\n');
    Alert.alert(t('servicesPrimeDetailTitle' as any), details, [
      {
        text: t('servicesContactAdvisor' as any),
        onPress: () => Alert.alert(t('servicesContactAdvisor' as any), t('servicesAdvisorConfirm' as any)),
      },
      { text: t('cancel' as any), style: 'cancel' },
    ]);
  }

  function handleBookDoctor(name: string) {
    Alert.alert(t('servicesBookConfirmTitle' as any), `${name} — ${t('servicesBookConfirmMsg' as any)}`);
  }

  const primeTags = (t('servicesPrimeTags' as any) as string).split('|');

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t('tabServices' as any)} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TipCard */}
        <TipCard
          tipId="services_intro"
          icon="💡"
          titleKey="tipServicesTitle"
          bodyKey="tipServicesBody"
        />

        {/* ── Brain Health Screening ── */}
        <View style={{ gap: 16 }}>
          <View>
            <Text style={{ ...type.headlineMd, color: colors.primary }}>
              {t('servicesBrainScreening' as any)}
            </Text>
            <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant, marginTop: 4 }}>
              {t('servicesBrainScreeningSub' as any)}
            </Text>
          </View>

          {/* Standard Package */}
          <View
            style={{
              borderRadius: radius.xl,
              overflow: 'hidden',
              backgroundColor: colors.surfaceContainerLowest,
              ...shadow.soft,
            }}
          >
            {/* Package header */}
            <View style={{ backgroundColor: '#0d8c7f', padding: 20 }}>
              <Text style={{ ...type.headlineSm, color: '#fff' }}>
                {t('servicesStandard' as any)}
              </Text>
              <Text style={{ ...type.bodyMd, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                {t('servicesStandardDesc' as any)}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
                <Text
                  style={{
                    ...type.bodyMd,
                    color: 'rgba(255,255,255,0.55)',
                    textDecorationLine: 'line-through',
                  }}
                >
                  ¥2,500
                </Text>
                <Text style={{ ...type.headlineMd, color: '#fff', fontWeight: '800' }}>¥1,880</Text>
              </View>
            </View>

            {/* Checklist */}
            <View style={{ padding: 20, gap: 10 }}>
              {standardItems.map((key) => (
                <View key={key} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                  <Text style={{ color: '#0d8c7f', fontWeight: '700', fontSize: 14, lineHeight: 20 }}>✓</Text>
                  <Text style={{ ...type.bodyMd, color: colors.onSurface, flex: 1 }}>
                    {t(key as any)}
                  </Text>
                </View>
              ))}

              <Pressable
                onPress={handleBookConsult}
                style={({ pressed }) => ({
                  marginTop: 8,
                  backgroundColor: '#0d8c7f',
                  borderRadius: radius.md,
                  paddingVertical: 14,
                  alignItems: 'center',
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text style={{ ...type.labelLg, color: '#fff', fontSize: 14 }}>
                  {t('servicesBookConsult' as any)}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Comprehensive Package */}
          <View
            style={{
              borderRadius: radius.xl,
              overflow: 'hidden',
              backgroundColor: colors.surfaceContainerLowest,
              ...shadow.soft,
            }}
          >
            {/* Recommended badge */}
            <View style={{ backgroundColor: '#004D40', padding: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ ...type.headlineSm, color: '#fff' }}>
                    {t('servicesComprehensive' as any)}
                  </Text>
                  <Text style={{ ...type.bodyMd, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                    {t('servicesComprehensiveDesc' as any)}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFB300',
                    borderRadius: radius.full,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Text style={{ ...type.labelMd, color: '#fff', fontSize: 11 }}>推荐</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
                <Text
                  style={{
                    ...type.bodyMd,
                    color: 'rgba(255,255,255,0.55)',
                    textDecorationLine: 'line-through',
                  }}
                >
                  ¥11,000
                </Text>
                <Text style={{ ...type.headlineMd, color: '#fff', fontWeight: '800' }}>¥7,800</Text>
              </View>
            </View>

            {/* Checklist */}
            <View style={{ padding: 20, gap: 10 }}>
              <Text style={{ ...type.labelLg, color: colors.onSurfaceVariant, marginBottom: 4 }}>
                {t('servicesIncludes' as any)}
              </Text>
              {comprehensiveItems.map((key) => (
                <View key={key} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                  <Text style={{ color: '#004D40', fontWeight: '700', fontSize: 14, lineHeight: 20 }}>✓</Text>
                  <Text style={{ ...type.bodyMd, color: colors.onSurface, flex: 1 }}>
                    {t(key as any)}
                  </Text>
                </View>
              ))}

              <Pressable
                onPress={handleBookConsult}
                style={({ pressed }) => ({
                  marginTop: 8,
                  backgroundColor: colors.primary,
                  borderRadius: radius.md,
                  paddingVertical: 14,
                  alignItems: 'center',
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text style={{ ...type.labelLg, color: '#fff', fontSize: 14 }}>
                  {t('servicesBookConsult' as any)}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ── Prime Insurance Card ── */}
        <View
          style={{
            backgroundColor: '#1A237E',
            borderRadius: radius.xl,
            padding: 24,
            gap: 16,
            ...shadow.card,
          }}
        >
          {/* Header row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ ...type.labelLg, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 }}>
              {t('servicesPrimeTitle' as any)}
            </Text>
            <View
              style={{
                backgroundColor: '#FFB300',
                borderRadius: radius.full,
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              <Text style={{ ...type.labelMd, color: '#fff' }}>Prime</Text>
            </View>
          </View>

          {/* Product name */}
          <Text style={{ ...type.headlineMd, color: '#fff' }}>和睦致逸</Text>

          {/* Stat boxes */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: radius.md,
                padding: 14,
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Text style={{ ...type.labelMd, color: 'rgba(255,255,255,0.65)' }}>
                {t('servicesPrimeCoverage' as any)}
              </Text>
              <Text style={{ ...type.titleLg, color: '#fff' }}>800万</Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: radius.md,
                padding: 14,
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Text style={{ ...type.labelMd, color: 'rgba(255,255,255,0.65)' }}>
                {t('servicesPrimeDeductible' as any)}
              </Text>
              <Text style={{ ...type.titleLg, color: '#fff' }}>¥2,000</Text>
            </View>
          </View>

          {/* Tag pills */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {primeTags.map((tag) => (
              <View
                key={tag}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: radius.full,
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                }}
              >
                <Text style={{ ...type.labelMd, color: 'rgba(255,255,255,0.9)' }}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Price + CTA */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
              <Text style={{ ...type.headlineMd, color: '#fff' }}>¥2,999</Text>
              <Text style={{ ...type.bodyMd, color: 'rgba(255,255,255,0.65)' }}>/年 起</Text>
            </View>
            <Pressable
              onPress={handleLearnMore}
              style={({ pressed }) => ({
                backgroundColor: '#FFB300',
                borderRadius: radius.md,
                paddingHorizontal: 20,
                paddingVertical: 12,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ ...type.labelLg, color: '#fff', fontSize: 14 }}>
                {t('servicesLearnMore' as any)}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ── Specialist Booking ── */}
        <View style={{ gap: 16 }}>
          <Text style={{ ...type.headlineMd, color: colors.primary }}>
            {t('servicesSpecialists' as any)}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingRight: 4 }}
          >
            {doctors.map((doc) => (
              <View
                key={doc.nameKey}
                style={{
                  width: 180,
                  backgroundColor: colors.surfaceContainerLowest,
                  borderRadius: radius.xl,
                  overflow: 'hidden',
                  ...shadow.soft,
                }}
              >
                {/* Avatar */}
                <View
                  style={{
                    backgroundColor: doc.color,
                    height: 110,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 44 }}>{doc.emoji}</Text>
                </View>

                {/* Info */}
                <View style={{ padding: 14, gap: 4 }}>
                  <Text style={{ ...type.titleLg, color: colors.onSurface, fontSize: 15 }}>
                    {t(doc.nameKey as any)}
                  </Text>
                  <Text
                    style={{ ...type.bodyMd, color: colors.onSurfaceVariant, fontSize: 12, lineHeight: 16 }}
                  >
                    {t(doc.specKey as any)}
                  </Text>

                  <Pressable
                    onPress={() => handleBookDoctor(t(doc.nameKey as any))}
                    style={({ pressed }) => ({
                      marginTop: 8,
                      backgroundColor: colors.surfaceContainerLow,
                      borderRadius: radius.md,
                      paddingVertical: 10,
                      alignItems: 'center',
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    <Text style={{ ...type.labelLg, color: colors.primary }}>
                      {t('servicesBookNow' as any)}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* TipRestoreButton */}
        <TipRestoreButton tipIds={['services_intro']} />
      </ScrollView>
    </SafeAreaView>
  );
}
