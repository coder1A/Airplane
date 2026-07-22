import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../state';
import { useNav } from '../nav';
import { usePalette } from '../components/ui';
import { Segmented } from '../components/ui';
import { AIRPORTS } from '../data';
import { C } from '../theme';

export function SavedScreen({ topInset }: { topInset: number }) {
  const app = useApp();
  const nav = useNav();
  const { p } = usePalette();
  const t = app.t;
  const [tab, setTab] = useState<'ap' | 'fl'>('ap');

  const airports = app.savedAirports
    .map((c) => AIRPORTS.find((a) => a.code === c))
    .filter((a): a is NonNullable<typeof a> => !!a);

  return (
    <View style={{ flex: 1, backgroundColor: p.viewBg, paddingTop: topInset + 8 }}>
      <Text style={[s.title, { color: p.ink }]}>{t('saved')}</Text>
      <View style={{ paddingHorizontal: 18, marginBottom: 14 }}>
        <Segmented value={tab} onChange={(k) => setTab(k as any)} options={[{ key: 'ap', label: t('airports') }, { key: 'fl', label: t('flights') }]} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {tab === 'ap' &&
          (airports.length ? (
            <View style={[s.card, { backgroundColor: p.glass, borderColor: p.glassLine }]}>
              {airports.map((a, i) => (
                <Pressable key={a.code} style={[s.row, { borderBottomColor: p.hair, borderBottomWidth: i < airports.length - 1 ? 1 : 0 }]} onPress={() => nav.openAirport(a)}>
                  <View style={s.code}><Text style={{ color: C.amber, fontWeight: '700', fontSize: 14 }}>{a.code}</Text></View>
                  <View style={{ flex: 1 }}><Text style={{ color: p.ink, fontSize: 14.5, fontWeight: '600' }}>{a.name}</Text><Text style={{ color: p.ink3, fontSize: 12 }}>{a.city} · {a.country}</Text></View>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text style={[s.empty, { color: p.ink3 }]}>{t('svApEmpty')}</Text>
          ))}
        {tab === 'fl' &&
          (app.savedFlights.length ? (
            <View style={[s.card, { backgroundColor: p.glass, borderColor: p.glassLine }]}>
              {app.savedFlights.map((f, i) => (
                <Pressable key={f.no} style={[s.row, { borderBottomColor: p.hair, borderBottomWidth: i < app.savedFlights.length - 1 ? 1 : 0 }]} onPress={() => nav.openFlight(f)}>
                  <View style={s.code}><Text style={{ color: C.amber, fontWeight: '700', fontSize: 13 }}>{f.no.slice(0, 2)}</Text></View>
                  <View style={{ flex: 1 }}><Text style={{ color: p.ink, fontSize: 14.5, fontWeight: '600' }}>{f.no} · {f.airline || f.aircraft}</Text><Text style={{ color: p.ink3, fontSize: 12 }}>{f.oCode && f.dCode ? `${f.oCode} → ${f.dCode}` : f.aircraft}</Text></View>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text style={[s.empty, { color: p.ink3 }]}>{t('svFlEmpty')}</Text>
          ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5, paddingHorizontal: 18, paddingBottom: 12 },
  card: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  code: { width: 48, height: 34, borderRadius: 9, backgroundColor: 'rgba(255,159,10,0.18)', alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', padding: 30, fontSize: 13 },
});
