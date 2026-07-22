import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useApp, ADS_ENABLED } from '../state';
import { useNav } from '../nav';
import { usePalette } from '../components/ui';
import { RadarMap } from '../components/RadarMap';
import { useAircraft, useLocation } from '../hooks';
import { AIRPORTS, flightFromAircraft } from '../data';
import { searchCity, Place } from '../services';
import { C } from '../theme';
import type { Aircraft } from '../geo';

export function HomeScreen({ topInset }: { topInset: number }) {
  const app = useApp();
  const nav = useNav();
  const { p, theme } = usePalette();
  const t = app.t;
  const { width, height } = useWindowDimensions();
  const { aircraft } = useAircraft(app.center.lat, app.center.lon, 300);
  const { locate, busy } = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [cities, setCities] = useState<Place[]>([]);
  const [selHex, setSelHex] = useState<string | null>(null);

  const sel = aircraft.find((a) => a.hex === selHex) || null;
  const apMatches = q.trim().length >= 1
    ? AIRPORTS.filter((a) => (a.code + a.name + a.city).toLowerCase().includes(q.trim().toLowerCase())).slice(0, 4)
    : [];

  const runSearch = async (text: string) => {
    setQ(text);
    try { setCities(await searchCity(text, app.lang)); } catch { setCities([]); }
  };
  const gps = async () => {
    const loc = await locate();
    if (loc) app.setCenter({ lat: loc.lat, lon: loc.lon, label: t('cityMe') });
    else app.showToast(t('locErr'));
  };

  const showAd = ADS_ENABLED && !app.premium;

  return (
    <View style={{ flex: 1, backgroundColor: p.scrBg }}>
      <RadarMap
        width={width}
        height={height}
        theme={theme}
        center={app.center}
        aircraft={aircraft}
        selectedHex={selHex}
        onSelect={(a) => setSelHex(a.hex)}
      />

      {/* Search bar */}
      <View style={[st.search, { top: topInset + 6, backgroundColor: p.glass2, borderColor: p.glassLine }]}>
        <Svg width={17} height={17} viewBox="0 0 17 17" fill="none" stroke={p.ink3} strokeWidth={1.7}>
          <Circle cx={7} cy={7} r={5.2} /><Path d="m11 11 4 4" strokeLinecap="round" />
        </Svg>
        <TextInput
          style={{ flex: 1, color: p.ink, fontSize: 15 }}
          placeholder={t('searchPh')}
          placeholderTextColor={p.ink3}
          value={q}
          onFocus={() => setSearchOpen(true)}
          onChangeText={runSearch}
          autoCorrect={false}
        />
        <Pressable onPress={gps} hitSlop={8}>
          {busy ? <ActivityIndicator color={C.amber} /> : (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth={1.8}>
              <Circle cx={12} cy={12} r={3.2} /><Path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
            </Svg>
          )}
        </Pressable>
      </View>

      {/* Search results */}
      {searchOpen && (q.length > 0) && (
        <View style={[st.results, { top: topInset + 58, backgroundColor: p.glass2, borderColor: p.glassLine }]}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {apMatches.map((a) => (
              <Pressable key={a.code} style={[st.row, { borderColor: p.hair }]} onPress={() => { setSearchOpen(false); setQ(''); nav.openAirport(a); }}>
                <View style={st.code}><Text style={{ color: C.amber, fontWeight: '700', fontSize: 13 }}>{a.code}</Text></View>
                <View><Text style={{ color: p.ink, fontSize: 14, fontWeight: '600' }}>{a.name}</Text><Text style={{ color: p.ink3, fontSize: 12 }}>{a.city} · {a.country}</Text></View>
              </Pressable>
            ))}
            {cities.map((c, i) => (
              <Pressable key={'c' + i} style={[st.row, { borderColor: p.hair }]} onPress={() => { app.setCenter({ lat: c.lat, lon: c.lon, label: c.name }); setSearchOpen(false); setQ(''); }}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={p.ink3} strokeWidth={1.7}><Path d="M12 21s7-6.4 7-11a7 7 0 10-14 0c0 4.6 7 11 7 11Z" /><Circle cx={12} cy={10} r={2.5} /></Svg>
                <View><Text style={{ color: p.ink, fontSize: 14, fontWeight: '600' }}>{c.name}</Text><Text style={{ color: p.ink3, fontSize: 12 }}>{c.country}</Text></View>
              </Pressable>
            ))}
            {apMatches.length === 0 && cities.length === 0 && (
              <Text style={{ color: p.ink3, textAlign: 'center', padding: 24 }}>{t('noResults')}</Text>
            )}
          </ScrollView>
        </View>
      )}

      {/* Ad banner */}
      {showAd && !searchOpen && (
        <Pressable style={[st.ad, { top: topInset + 58, backgroundColor: p.glass, borderColor: p.glassLine }]} onPress={nav.openSub}>
          <View style={st.adIc}><Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Ad</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: p.ink3, fontSize: 9, fontWeight: '700', letterSpacing: 0.5 }}>{t('reklama').toUpperCase()}</Text>
            <Text style={{ color: p.ink2, fontSize: 12.5 }}>{t('adText')}</Text>
          </View>
          <Text style={{ color: C.amber, fontSize: 11, fontWeight: '700' }}>{t('goPremium')}</Text>
        </Pressable>
      )}

      {/* Selected aircraft card */}
      {sel && !searchOpen && <PlaneCard a={sel} onMore={() => nav.openFlight(flightFromAircraft(sel))} onClose={() => setSelHex(null)} />}
    </View>
  );
}

function PlaneCard({ a, onMore, onClose }: { a: Aircraft; onMore: () => void; onClose: () => void }) {
  const { p } = usePalette();
  const { t } = useApp();
  return (
    <View style={[st.card, { backgroundColor: p.glass2, borderColor: p.glassLine }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={st.logo}><Text style={{ color: '#fff', fontWeight: '800' }}>{(a.callsign || 'A').charAt(0)}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: p.ink, fontWeight: '700', fontSize: 15 }}>{a.callsign || a.hex || '—'}</Text>
          <Text style={{ color: p.ink3, fontSize: 12 }}>{a.type || '—'} · {a.ground ? 'GND' : (a.altFt != null ? a.altFt + ' ft' : '—')}</Text>
        </View>
        <Pressable onPress={onClose} hitSlop={8}><Text style={{ color: p.ink3, fontSize: 20 }}>×</Text></Pressable>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
        <Metric p={p} label={t('gridGS')} value={`${Math.round(a.gs)} kts`} />
        <Metric p={p} label={t('gridCalAlt')} value={a.altFt != null ? `${a.altFt} ft` : '—'} />
        <Metric p={p} label="Track" value={`${Math.round(a.track)}°`} />
      </View>
      <Pressable onPress={onMore} style={[st.more, { borderColor: p.hair }]}>
        <Text style={{ color: p.ink2, fontWeight: '600', fontSize: 13 }}>{t('more')} ›</Text>
      </Pressable>
    </View>
  );
}

function Metric({ p, label, value }: { p: any; label: string; value: string }) {
  return (
    <View>
      <Text style={{ color: p.ink3, fontSize: 10 }}>{label}</Text>
      <Text style={{ color: p.ink, fontSize: 16, fontWeight: '700' }}>{value}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  search: { position: 'absolute', left: 12, right: 12, height: 46, borderRadius: 22, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15, zIndex: 30 },
  results: { position: 'absolute', left: 12, right: 12, maxHeight: 320, borderRadius: 20, borderWidth: 1, zIndex: 29, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderBottomWidth: 1 },
  code: { width: 44, height: 30, borderRadius: 8, backgroundColor: 'rgba(255,159,10,0.18)', alignItems: 'center', justifyContent: 'center' },
  ad: { position: 'absolute', left: 12, right: 12, height: 46, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 8, paddingRight: 12, zIndex: 25 },
  adIc: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#3b7ddd', alignItems: 'center', justifyContent: 'center' },
  card: { position: 'absolute', left: 12, right: 12, bottom: 92, borderRadius: 24, borderWidth: 1, padding: 16, zIndex: 28 },
  logo: { width: 26, height: 26, borderRadius: 8, backgroundColor: '#e2231a', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  more: { marginTop: 12, paddingTop: 11, borderTopWidth: 1, alignItems: 'center' },
});
