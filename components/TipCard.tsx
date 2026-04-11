import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, type, radius, spacing, shadow } from '../lib/theme';
import { useTranslation } from '../lib/i18n';
import { hydrateTips, isDismissed, dismissTip, restoreTips } from '../lib/tipStore';

type TipCardProps = {
  tipId: string;
  icon: string;
  titleKey: string;
  bodyKey: string;
};

export function TipCard({ tipId, icon, titleKey, bodyKey }: TipCardProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateTips().then(() => {
      setVisible(!isDismissed(tipId));
      setReady(true);
    });
  }, [tipId]);

  if (!ready || !visible) return null;

  return (
    <View
      style={{
        backgroundColor: colors.secondaryContainer,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
      }}
    >
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ ...type.labelLg, color: colors.onSecondaryContainer, marginBottom: 2 }}>
          {t(titleKey as any)}
        </Text>
        <Text style={{ ...type.labelLg, color: colors.onSecondaryContainer, fontWeight: '400' }}>
          {t(bodyKey as any)}
        </Text>
      </View>
      <Pressable
        onPress={() => {
          dismissTip(tipId);
          setVisible(false);
        }}
        hitSlop={8}
      >
        <MaterialIcons name="close" size={18} color={colors.onSecondaryContainer} style={{ opacity: 0.5 }} />
      </Pressable>
    </View>
  );
}

export function TipRestoreButton({ tipIds }: { tipIds: string[] }) {
  const { t } = useTranslation();
  const [anyDismissed, setAnyDismissed] = useState(false);

  useEffect(() => {
    hydrateTips().then(() => {
      setAnyDismissed(tipIds.some((id) => isDismissed(id)));
    });
  }, [tipIds]);

  if (!anyDismissed) return null;

  return (
    <Pressable
      onPress={async () => {
        await restoreTips(tipIds);
        setAnyDismissed(false);
      }}
      style={{
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: colors.secondaryContainer,
        borderRadius: radius.full,
        paddingHorizontal: 14,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        ...shadow.card,
      }}
    >
      <Text style={{ fontSize: 16 }}>💡</Text>
      <Text style={{ ...type.labelLg, color: colors.onSecondaryContainer }}>
        {t('tipShowTips' as any)}
      </Text>
    </Pressable>
  );
}
