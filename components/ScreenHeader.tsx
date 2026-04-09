import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, type } from '../lib/theme';
import { useTranslation } from '../lib/i18n';

export function ScreenHeader({ title }: { title: string }) {
  const { locale, setLocale } = useTranslation();
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.secondaryContainer,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name="person" size={22} color={colors.onSecondaryContainer} />
        </View>
        <Text
          style={{
            ...type.headlineSm,
            color: '#0f3a3f',
            letterSpacing: -0.3,
          }}
        >
          {title}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Pressable
          onPress={() => setLocale(locale === 'en' ? 'zh' : 'en')}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>
            {locale === 'en' ? '中文' : 'EN'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/settings')}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
          }}
        >
          <MaterialIcons name="settings" size={24} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}
