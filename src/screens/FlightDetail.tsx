import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../state';
import { useNav } from '../nav';
import { usePalette } from '../components/ui';
import { Flight, FlightStatus } from '../data';
import { durationBetween } from '../geo';
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

export function FlightDetailScreen({ flight, topInset }: { flight: Flight; topInset: number }) {
  const app = useApp();
  const nav = useNav();
  const { p } = usePalette();
  const t = app.t;
  const saved = app.isFlightSaved(flight.no);
  const hasRoute = !!(flight.oCode && flight.dCode);
  const notifOn = app.notifOn;

  const toggleSave = () => {
    const ok = app.toggleSaveFlight(flight);
    if (!ok) { app.showToast(t('needWatch'), t('goPremium')); nav.openSub(); }
  };
  const toggleBell = () => {
    if (!app.premium) { app.showToast(t('needNotif'), t('goPremium')); nav.openSub(); return; }
    const next = !notifOn;
    app.setNotifOn(next);
    app.showToast(next ? t('notifOnT') : t('notifOffT'), next ? `${flight.no} · ${flight.airline}` : '');
  };

  const metrics: Array<[string, string]> = flight.live
    ? [
        [t('gridCalAlt'), flight.altFt != null ? `${flight.altFt} ft` : '—'],
        [t('gridGS'), flight.gs != null ? `${Math.round(flight.gs)} kts` : '—'],
        [t('gridGPS'), flight.altFt != null ? `${flight.altFt} ft` : '—'],
        [t('gridVS'), '—'],
        [t('gridTAS'), '—'],
        [t('gridIAS'), '—'],
      ]
    : [
        [t('gridCalAlt'), '28 000 ft'],
        [t('gridGS'), '322 kts'],
        [t('gridGPS'), '26 320 ft'],
        [t('gridVS'), '+1000 ft/m'],
        [t('gridTAS'), '388 kts'],
        [t('gridIAS'), '289 kts'],
      ];

  return (
    <View style={[s.root, { backgroundColor: p.glass2, paddingTop: topInset + 6 }]}>
      <View style={s.grab}><View style={[s.grabber, { backgroundColor: p.ink3 }]} /></View>
      <View style={s.top}>
        <Pressable onPress={nav.back} style={[s.back, { backgroundColor: p.glass, borderColor: p.glassLine }]} hitSlop={8}>
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke={p.ink} strokeWidth={1.9}><Path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></Svg>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={s.airline}>
          <View style={s.logo}><Text style={{ color: '#fff', fontWeight: '800' }}>{flight.no.charAt(0)}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: p.ink, fontWeight: '700', fontSize: 15 }}>{flight.airline || flight.no}</Text>
            <Text style={{ color: p.ink3, fontSize: 12 }}>{flight.aircraft}</Text>
          </View>
          <Text style={{ color: p.ink2, fontWeight: '600', marginRight: 10 }}>{flight.no}</Text>
          <Pressable onPress={toggleBell} style={[s.icbtn, { backgroundColor: p.glass, borderColor: p.glassLine }]} hitSlop={6}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill={notifOn && app.premium ? C.amber : 'none'} stroke={notifOn && app.premium ? C.amber : p.ink3} strokeWidth={1.7} strokeLinejoin="round">
              <Path d="M6.5 16.5v-4a5.5 5.5 0 0 1 11 0v4l1.6 2h-14.2z" /><Path d="M10 20.5a2 2 0 0 0 4 0" />
            </Svg>
          </Pressable>
          <Pressable onPress={toggleSave} style={[s.icbtn, { marginLeft: 8, backgroundColor: p.glass, borderColor: p.glassLine }]} hitSlop={6}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill={saved ? C.amber : 'none'} stroke={saved ? C.amber : p.ink3} strokeWidth={1.7} strokeLinejoin="round">
              <Path d="M12 3.4l2.55 5.17 5.7.83-4.13 4.02.98 5.68L12 16.42 6.9 19.1l.98-5.68L3.75 9.4l5.7-.83z" />
            </Svg>
          </Pressable>
        </View>

        {hasRoute && (
          <View style={s.route}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: p.ink, fontSize: 40, fontWeight: '800', letterSpacing: -1 }}>{flight.oCode}</Text>
              <Text style={{ color: p.ink3, fontSize: 12 }}>{flight.oCity}</Text>
              <Text style={{ color: p.ink2, fontSize: 12, fontWeight: '600' }}>{flight.oTime}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Svg width={40} height={16} viewBox="0 0 40 16" fill="none" stroke={C.amber} strokeWidth={1.6}><Path d="M2 8h30" strokeDasharray="1,5" strokeLinecap="round" /><Path d="M34 8l-6-4v8z" fill={C.amber} stroke="none" /></Svg>
              <Text style={{ color: p.ink3, fontSize: 11, marginTop: 4 }}>{durationBetween(flight.oTime, flight.dTime)}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: p.ink, fontSize: 40, fontWeight: '800', letterSpacing: -1 }}>{flight.dCode}</Text>
              <Text style={{ color: p.ink3, fontSize: 12 }}>{flight.dCity}</Text>
              <Text style={{ color: statusColor(flight.status, p), fontSize: 12, fontWeight: '600' }}>{flight.dTime} · {t(flight.status)}</Text>
            </View>
          </View>
        )}

        <View style={[s.grid, { borderColor: p.hair }]}>
          {metrics.map(([k, v], i) => (
            <View key={i} style={[s.cell, { backgroundColor: p.glass, borderColor: p.hair }]}>
              <Text style={{ color: p.ink3, fontSize: 10.5, textTransform: 'uppercase' }}>{k}</Text>
              <Text style={{ color: p.ink, fontSize: 19, fontWeight: '700', marginTop: 3 }}>{v}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 },
  grab: { alignItems: 'center', paddingVertical: 6 },
  grabber: { width: 38, height: 5, borderRadius: 3, opacity: 0.5 },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 8 },
  back: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  airline: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingBottom: 16 },
  logo: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#e2231a', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  icbtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  route: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingBottom: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 18, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  cell: { width: '50%', padding: 13, borderWidth: 0.5 },
});
