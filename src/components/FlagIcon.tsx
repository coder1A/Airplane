import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Path, Circle, G } from 'react-native-svg';
import type { Lang } from '../i18n';

const stars: Array<[number, number]> = [
  [16.4, 3.6], [19, 3.6], [21.6, 3.6],
  [15.1, 6.4], [17.7, 6.4], [20.3, 6.4], [22.9, 6.4],
  [13.8, 9.2], [16.4, 9.2], [19, 9.2], [21.6, 9.2], [24.2, 9.2],
];

function Flag({ code }: { code: Lang }) {
  if (code === 'en') {
    return (
      <Svg viewBox="0 0 40 40" width="100%" height="100%">
        <Rect width={40} height={40} fill="#012169" />
        <Path d="M0,0 L40,40 M40,0 L0,40" stroke="#fff" strokeWidth={6} />
        <Path d="M0,0 L40,40 M40,0 L0,40" stroke="#C8102E" strokeWidth={3} />
        <Path d="M20,0 V40 M0,20 H40" stroke="#fff" strokeWidth={8} />
        <Path d="M20,0 V40 M0,20 H40" stroke="#C8102E" strokeWidth={5} />
      </Svg>
    );
  }
  if (code === 'es') {
    return (
      <Svg viewBox="0 0 40 40" width="100%" height="100%">
        <Rect width={40} height={40} fill="#AA151B" />
        <Rect y={10} width={40} height={20} fill="#F1BF00" />
        <G>
          <Rect x={8.6} y={17} width={1} height={7} rx={0.3} fill="#C8102E" />
          <Rect x={16.4} y={17} width={1} height={7} rx={0.3} fill="#C8102E" />
          <Path d="M10,17 H16 V20.6 Q16,23.4 13,24.7 Q10,23.4 10,20.6 Z" fill="#fff" stroke="#7a0d12" strokeWidth={0.3} />
          <Path d="M10,17 H13 V20.7 H10 Z" fill="#AD1519" />
          <Path d="M13,20.7 H16 V20.6 Q16,22.3 14.4,23.3 L13,22.5 Z" fill="#AD1519" />
          <Path d="M10.4,16.7 l1,-1.15 0.75,0.85 0.85,-1.05 0.85,1.05 0.75,-0.85 1,1.15 z" fill="#F1BF00" stroke="#8a6d00" strokeWidth={0.2} />
        </G>
      </Svg>
    );
  }
  if (code === 'ru') {
    return (
      <Svg viewBox="0 0 40 40" width="100%" height="100%">
        <Rect width={40} height={40} fill="#fff" />
        <Rect y={13.3} width={40} height={13.3} fill="#0039A6" />
        <Rect y={26.6} width={40} height={13.4} fill="#D52B1E" />
      </Svg>
    );
  }
  // uz
  return (
    <Svg viewBox="0 0 40 40" width="100%" height="100%">
      <Rect width={40} height={13.3} fill="#0099B5" />
      <Rect y={13.3} width={40} height={13.4} fill="#fff" />
      <Rect y={26.7} width={40} height={13.3} fill="#1EB53A" />
      <Rect y={12.4} width={40} height={1.3} fill="#CE1126" />
      <Rect y={26.3} width={40} height={1.3} fill="#CE1126" />
      <Circle cx={9.8} cy={6.8} r={3.6} fill="#fff" />
      <Circle cx={11.4} cy={6.5} r={3.3} fill="#0099B5" />
      {stars.map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={0.7} fill="#fff" />
      ))}
    </Svg>
  );
}

export function FlagIcon({ code, size = 38, active = false }: { code: Lang; size?: number; active?: boolean }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: active ? '#FF9F0A' : 'transparent',
      }}
    >
      <Flag code={code} />
    </View>
  );
}
