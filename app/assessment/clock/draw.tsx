import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, type, radius, shadow, spacing } from '../../../lib/theme';
import { useTranslation } from '../../../lib/i18n';
import { ClockCanvas, type ClockCanvasHandle } from '../../../components/ClockCanvas';
import { setClockImageUri } from '../../../lib/assessmentStore';

export default function ClockDraw() {
  const router = useRouter();
  const { t } = useTranslation();
  const canvasRef = useRef<ClockCanvasHandle>(null);

  // Track stroke count via callback updates so buttons enable/disable correctly.
  const [strokeCount, setStrokeCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const canvasSize = Math.min(screenWidth - 48, 360);

  // Poll for stroke count changes since the canvas owns its own state.
  // Cheap interval — only runs while screen is mounted.
  React.useEffect(() => {
    const id = setInterval(() => {
      const c = canvasRef.current?.strokeCount() ?? 0;
      setStrokeCount((prev) => (prev === c ? prev : c));
    }, 200);
    return () => clearInterval(id);
  }, []);

  const hasStrokes = strokeCount > 0;
  const canSubmit = strokeCount >= 3 && !submitting;

  async function handleSubmit() {
    if (!canvasRef.current) return;
    setSubmitting(true);
    try {
      const uri = await canvasRef.current.capture();
      setClockImageUri(uri);
      router.replace('/assessment/clock/analyzing');
    } catch (err: any) {
      setSubmitting(false);
      Alert.alert(t('somethingWrong'), err?.message ?? String(err));
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingVertical: 16,
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={{ ...type.headlineSm, color: colors.primary }}>{t('clockTestTitle')}</Text>
      </View>

      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          gap: spacing.lg,
          justifyContent: 'space-between',
          paddingBottom: 32,
        }}
      >
        {/* Instructions card */}
        <View
          style={{
            backgroundColor: colors.surfaceContainerLowest,
            padding: 24,
            borderRadius: radius.xxl,
            gap: spacing.sm,
            marginTop: spacing.sm,
            ...shadow.card,
          }}
        >
          <Text style={{ ...type.labelMd, color: colors.secondary, letterSpacing: 1.2 }}>
            {t('clockTestName').toUpperCase()}
          </Text>
          <Text style={{ ...type.headlineMd, color: colors.primary, lineHeight: 30 }}>
            {t('clockTestPrompt')}
          </Text>
          <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant, marginTop: 4 }}>
            {t('clockTestCaption')}
          </Text>
        </View>

        {/* Canvas */}
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ClockCanvas ref={canvasRef} size={canvasSize} />
        </View>

        {/* Action row */}
        <View style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Pressable
              onPress={() => canvasRef.current?.undo()}
              disabled={!hasStrokes || submitting}
              style={({ pressed }) => ({
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 14,
                borderRadius: radius.full,
                backgroundColor: colors.secondaryContainer,
                opacity: !hasStrokes || submitting ? 0.4 : pressed ? 0.85 : 1,
              })}
            >
              <MaterialIcons name="undo" size={20} color={colors.onSecondaryContainer} />
              <Text style={{ ...type.titleLg, color: colors.onSecondaryContainer }}>
                {t('clockUndo')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => canvasRef.current?.clear()}
              disabled={!hasStrokes || submitting}
              style={({ pressed }) => ({
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 14,
                borderRadius: radius.full,
                backgroundColor: colors.surfaceContainerLow,
                opacity: !hasStrokes || submitting ? 0.4 : pressed ? 0.85 : 1,
              })}
            >
              <MaterialIcons name="delete-outline" size={20} color={colors.primary} />
              <Text style={{ ...type.titleLg, color: colors.primary }}>{t('clockClear')}</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 18,
              borderRadius: radius.full,
              backgroundColor: colors.primary,
              opacity: !canSubmit ? 0.4 : pressed ? 0.9 : 1,
              ...shadow.card,
            })}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <MaterialIcons name="check" size={22} color="#fff" />
            )}
            <Text style={{ ...type.titleLg, color: '#fff' }}>{t('clockSubmit')}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
