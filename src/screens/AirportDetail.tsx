import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../state';
import { useNav } from '../nav';
import { usePalette } from '../components/ui';
import { Segmented } from '../components/ui';
import { Airport, generateFlights, flightFromRow, FlightRow, FlightStatus } from '../data';
import { C, Palette } from '../theme';

function statusColor(st: FlightStatus, p: Palette): string {
  switch (st) {
    case 'onTime': return C.green;
    case 'delayed': return '#FF9F0A';
    case 'boarding': return C.blue;
    case 'approx': return C.blue;
    case 'landed': return p.ink3;
    case 'cancelled': return C.red;
  }
}

export function AirportDetailScreen({ airport, topInset }: { airport: Airport; topInset: number }) {
  const app = useApp();
  const nav = useNav();
  const { p } = usePalette();
  const t = app.t;
  const [tab, setTab] = useState<'info' | 'dep' | 'arr'>('info');
  const { deps, arrs } = useMemo(() => generateFlights(airport), [airport]);
  const saved = app.isAirportSaved(airport.code);

  const toggleSave = () => {
    const ok = app.toggleSaveAirport(airport.code);
    if (!ok) { app.showToast(t('needWatch'), t('goPremium')); nav.openSub(); }
  };

  const renderFlight = (f: FlightRow, i: number, arriving: boolean) => (
    <Pressable key={i} style={[s.fl, { borderBottomColor: p.hair }]} onPress={() => nav.openFlight(flightFromRow(f, airport.city, arriving))}>
      <Text style={[s.flTime, { color: p.ink, textDecorationLine: f.status === 'cancelled' ? 'line-through' : 'none' }]}>{f.time}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: p.ink, fontWeight: '700', fontSize: 14 }}>{f.from} → {f.to}</Text>
        <Text style={{ color: p.ink3, fontSize: 12 }}>{f.city} · {f.no}</Text>
      </View>
      <Text style={{ color: statusColor(f.status, p), fontWeight: '700', fontSize: 11 }}>{t(f.status)}</Text>
    </Pressable>
  );

  return (
    <View style={[s.root, { backgroundColor: p.viewBg, paddingTop: topInset + 6 }]}>
      <View style={s.top}>
        <Pressable onPress={nav.back} style={[s.back, { backgroundColor: p.glass, borderColor: p.glassLine }]} hitSlop={8}>
          <Svg width={15} height={15} viewBox="0 0 15 15" fill="none" stroke={p.ink} strokeWidth={1.8}><Path d="m9 3-4.5 4.5L9 12" strokeLinecap="round" strokeLinejoin="round" /></Svg>
        </Pressable>
        <Text style={{ color: p.ink2, fontSize: 16, fontWeight: '700' }}>{airport.code}</Text>
        <Pressable onPress={toggleSave} style={[s.back, { marginLeft: 'auto', backgroundColor: p.glass, borderColor: p.glassLine }]} hitSlop={8}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill={saved ? C.amber : 'none'} stroke={saved ? C.amber : p.ink3} strokeWidth={1.7} strokeLinejoin="round">
            <Path d="M12 3.4l2.55 5.17 5.7.83-4.13 4.02.98 5.68L12 16.42 6.9 19.1l.98-5.68L3.75 9.4l5.7-.83z" />
          </Svg>
        </Pressable>
      </View>

      <View style={s.hero}>
        <Text style={{ color: C.amber, fontSize: 38, fontWeight: '800', letterSpacing: -0.5 }}>{airport.code}</Text>
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text style={{ color: p.ink, fontSize: 16, fontWeight: '700' }}>{airport.name}</Text>
          <Text style={{ color: p.ink3, fontSize: 12.5 }}>{airport.city} · {airport.country}</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 18, marginBottom: 14 }}>
        <Segmented
          value={tab}
          onChange={(k) => setTab(k as any)}
          options={[{ key: 'info', label: t('apInfo') }, { key: 'dep', label: t('apDep') }, { key: 'arr', label: t('apArr') }]}
        />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {tab === 'info' && (
          <View style={[s.list, { backgroundColor: p.glass, borderColor: p.glassLine }]}>
            {([['infoFullName', airport.name], ['infoIATA', airport.code], ['infoCity', airport.city], ['infoCountry', airport.country], ['infoToday', String(deps.length + arrs.length)]] as const).map(([k, v], i) => (
              <View key={k} style={[s.infoRow, { borderBottomColor: p.hair, borderBottomWidth: i < 4 ? 1 : 0 }]}>
                <Text style={{ color: p.ink3, fontSize: 13 }}>{t(k)}</Text>
                <Text style={{ color: p.ink, fontSize: 13.5, fontWeight: '600' }}>{v}</Text>
              </View>
            ))}
          </View>
        )}
        {tab === 'dep' && (
          <>
            <Text style={[s.head, { color: p.ink3 }]}>{t('depHead')}</Text>
            <View style={[s.list, { backgroundColor: p.glass, borderColor: p.glassLine }]}>{deps.map((f, i) => renderFlight(f, i, false))}</View>
          </>
        )}
        {tab === 'arr' && (
          <>
            <Text style={[s.head, { color: p.ink3 }]}>{t('arrHead')}</Text>
            <View style={[s.list, { backgroundColor: p.glass, borderColor: p.glassLine }]}>{arrs.map((f, i) => renderFlight(f, i, true))}</View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingBottom: 6 },
  back: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  head: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, paddingHorizontal: 22, paddingBottom: 8, textTransform: 'uppercase' },
  list: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 13 },
  fl: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderBottomWidth: 1 },
  flTime: { width: 44, fontWeight: '700', fontSize: 15 },
});
