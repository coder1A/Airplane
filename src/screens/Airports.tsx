import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useApp } from '../state';
import { useNav } from '../nav';
import { usePalette } from '../components/ui';
import { AIRPORTS } from '../data';
import { C } from '../theme';

export function AirportsScreen({ topInset }: { topInset: number }) {
  const { t } = useApp();
  const nav = useNav();
  const { p } = usePalette();
  const [q, setQ] = useState('');
  const list = q.trim()
    ? AIRPORTS.filter((a) => (a.code + a.name + a.city).toLowerCase().includes(q.trim().toLowerCase()))
    : AIRPORTS;

  return (
    <View style={{ flex: 1, backgroundColor: p.viewBg, paddingTop: topInset + 8 }}>
      <Text style={[s.title, { color: p.ink }]}>{t('airports')}</Text>
      <View style={[s.search, { backgroundColor: p.glass, borderColor: p.glassLine }]}>
        <Svg width={16} height={16} viewBox="0 0 17 17" fill="none" stroke={p.ink3} strokeWidth={1.7}><Circle cx={7} cy={7} r={5.2} /><Path d="m11 11 4 4" strokeLinecap="round" /></Svg>
        <TextInput style={{ flex: 1, color: p.ink, fontSize: 15 }} placeholder={t('airportSearchPh')} placeholderTextColor={p.ink3} value={q} onChangeText={setQ} autoCorrect={false} />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[s.card, { backgroundColor: p.glass, borderColor: p.glassLine }]}>
          {list.map((a, i) => (
            <Pressable key={a.code} style={[s.row, { borderBottomColor: p.hair, borderBottomWidth: i < list.length - 1 ? 1 : 0 }]} onPress={() => nav.openAirport(a)}>
              <View style={s.code}><Text style={{ color: C.amber, fontWeight: '700', fontSize: 14 }}>{a.code}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: p.ink, fontSize: 14.5, fontWeight: '600' }}>{a.name}</Text>
                <Text style={{ color: p.ink3, fontSize: 12 }}>{a.city} · {a.country}</Text>
              </View>
              <Text style={{ color: p.ink3, fontSize: 18 }}>›</Text>
            </Pressable>
          ))}
          {list.length === 0 && <Text style={{ color: p.ink3, textAlign: 'center', padding: 24 }}>{t('noResults')}</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5, paddingHorizontal: 18, paddingBottom: 12 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 44, borderRadius: 14, borderWidth: 1, marginHorizontal: 16, marginBottom: 14, paddingHorizontal: 14 },
  card: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  code: { width: 48, height: 34, borderRadius: 9, backgroundColor: 'rgba(255,159,10,0.18)', alignItems: 'center', justifyContent: 'center' },
});
