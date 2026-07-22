import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { usePalette } from './ui';
import { C } from '../theme';

export type Tab = 'map' | 'airports' | 'saved' | 'profile';

function Icon({ tab, color }: { tab: Tab; color: string }) {
  if (tab === 'map') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill={color}>
        <Path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
      </Svg>
    );
  }
  if (tab === 'airports') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M7.5 21h9" />
        <Path d="M10 21l.5-6.5M14 21l-.5-6.5" />
        <Path d="M8.4 9.4h7.2l-.5 5H8.9z" />
        <Path d="M12 9.4V6" />
        <Path d="M9.6 6.4a3.4 3.4 0 0 1 4.8 0" />
      </Svg>
    );
  }
  if (tab === 'saved') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinejoin="round">
        <Path d="m12 3 2.6 5.6 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6L4 9.3l6-.7z" />
      </Svg>
    );
  }
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7}>
      <Circle cx={12} cy={8} r={3.6} />
      <Path d="M5.5 20a6.5 6.5 0 0 1 13 0" strokeLinecap="round" />
    </Svg>
  );
}

export function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const { p } = usePalette();
  const tabs: Tab[] = ['map', 'airports', 'saved', 'profile'];
  return (
    <View style={[styles.bar, { backgroundColor: p.glass2, borderColor: p.glassLine }]}>
      {tabs.map((tb) => (
        <Pressable key={tb} onPress={() => onChange(tb)} style={styles.btn}>
          <Icon tab={tb} color={active === tb ? C.amber : p.ink3} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 26,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 26,
    borderWidth: 1,
    zIndex: 60,
  },
  btn: { width: 54, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
});
