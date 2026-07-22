import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useApp } from '../state';
import { palette, C, Palette, ThemeName } from '../theme';

export function usePalette(): { p: Palette; theme: ThemeName } {
  const { theme } = useApp();
  return { p: palette(theme), theme };
}

export function Toast() {
  const { toast } = useApp();
  const { p } = usePalette();
  if (!toast) return null;
  return (
    <View pointerEvents="none" style={[styles.toast, { top: 8, backgroundColor: p.glass2, borderColor: p.glassLine }]}>
      <View style={styles.toastIc}>
        <Text style={{ color: '#fff', fontSize: 15 }}>✈</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: p.ink, fontWeight: '700', fontSize: 13.5 }}>{toast.title}</Text>
        {!!toast.body && <Text style={{ color: p.ink2, fontSize: 12, marginTop: 1 }}>{toast.body}</Text>}
      </View>
    </View>
  );
}

export type Seg = { key: string; label: string };
export function Segmented({ options, value, onChange }: { options: Seg[]; value: string; onChange: (k: string) => void }) {
  const { p } = usePalette();
  return (
    <View style={[styles.seg, { backgroundColor: p.hair }]}>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <Pressable key={o.key} onPress={() => onChange(o.key)} style={[styles.segBtn, on && { backgroundColor: p.glass2 }]}>
            <Text style={{ color: on ? p.ink : p.ink2, fontWeight: '600', fontSize: 13 }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 10,
    right: 10,
    zIndex: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  toastIc: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: C.amber },
  seg: { flexDirection: 'row', borderRadius: 12, padding: 3 },
  segBtn: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
});
