import React from 'react';
import { View, Text, Image } from 'react-native';
import { colors, type } from '../lib/theme';

export function ScreenHeader({ title, showLogo }: { title: string; showLogo?: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        gap: 12,
      }}
    >
      {showLogo && (
        <Image
          source={require('../assets/logo.png')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
        />
      )}
      <Text
        style={{
          ...type.headlineSm,
          color: colors.primary,
          letterSpacing: -0.3,
        }}
      >
        {title}
      </Text>
    </View>
  );
}
