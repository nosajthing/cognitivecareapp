import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, type } from '../lib/theme';

type Props = {
  size?: number;
  stroke?: number;
  progress: number; // 0..1
  trackColor?: string;
  barColor?: string;
  label?: string;
  sublabel?: string;
};

export function ScoreRing({
  size = 96,
  stroke = 10,
  progress,
  trackColor = colors.secondaryFixedDim,
  barColor = colors.secondary,
  label,
  sublabel,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * Math.max(0, Math.min(1, progress));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={barColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          fill="transparent"
        />
      </Svg>
      {(label || sublabel) && (
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          {label && (
            <Text style={{ ...type.headlineMd, color: colors.primary }}>{label}</Text>
          )}
          {sublabel && (
            <Text style={{ ...type.labelMd, color: colors.outline }}>{sublabel}</Text>
          )}
        </View>
      )}
    </View>
  );
}
