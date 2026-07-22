import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../state';
import { useNav } from '../nav';
import { usePalette } from '../components/ui';
import { C } from '../theme';

const PLANS = [
  { id: 'm1', key: 'plan1', price: '29 000', sub: '' },
  { id: 'm6', key: 'plan6', price: '149 000', sub: '24 800 / oy' },
  { id: 'y1', key: 'plan12', price: '249 000', sub: '20 750 / oy', best: true },
];

export function SubscriptionScreen({ topInset }: { topInset: number }) {
  const app = useApp();
  const nav = useNav();
  const { p } = usePalette();
  const t = app.t;
  const [plan, setPlan] = useState('y1');

  const doSubscribe = () => {
    app.subscribe();
    app.showToast(t('premiumOn'), t('subDesc'));
    nav.back();
  };

  return (
    <View style={[s.root, { backgroundColor: p.viewBg, paddingTop: topInset + 6 }]}>
      <View style={s.top}>
        <Pressable onPress={nav.back} style={[s.back, { backgroundColor: p.glass, borderColor: p.glassLine }]} hitSlop={8}>
          <Svg width={15} height={15} viewBox="0 0 15 15" fill="none" stroke={p.ink} strokeWidth={1.8}><Path d="m9 3-4.5 4.5L9 12" strokeLinecap="round" strokeLinejoin="round" /></Svg>
        </Pressable>
        <Text style={{ color: p.ink2, fontSize: 16, fontWeight: '700' }}>{t('obuna')}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={s.hero}>
          <View style={s.crown}><Svg width={32} height={32} viewBox="0 0 24 24" fill="#fff"><Path d="M3 8l4 3.5L12 5l5 6.5L21 8l-1.6 10.5H4.6z" /></Svg></View>
          <Text style={{ color: p.ink, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 }}>{t('goPremium')}</Text>
          <Text style={{ color: p.ink3, fontSize: 13, marginTop: 4, textAlign: 'center' }}>{t('subDesc')}</Text>
        </View>

        <View style={s.benefits}>
          {['benAdFree', 'benNotif', 'benWatch'].map((b) => (
            <View key={b} style={s.ben}>
              <View style={s.benIc}><Text style={{ color: C.green, fontWeight: '700', fontSize: 12 }}>✓</Text></View>
              <Text style={{ color: p.ink, fontSize: 14 }}>{t(b)}</Text>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 18, gap: 11 }}>
          {PLANS.map((pl) => {
            const on = plan === pl.id;
            return (
              <Pressable key={pl.id} onPress={() => setPlan(pl.id)} style={[s.plan, { backgroundColor: p.glass, borderColor: on ? C.amber : p.glassLine }]}>
                {pl.best && <View style={s.planBadge}><Text style={{ color: '#04140b', fontSize: 10, fontWeight: '700' }}>{t('planBest')}</Text></View>}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: p.ink, fontSize: 15, fontWeight: '700' }}>{t(pl.key)}</Text>
                  {!!pl.sub && <Text style={{ color: p.ink3, fontSize: 12, marginTop: 2 }}>{pl.sub}</Text>}
                </View>
                <Text style={{ color: p.ink, fontSize: 17, fontWeight: '700' }}>{pl.price}<Text style={{ color: p.ink3, fontSize: 11 }}> so'm</Text></Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={doSubscribe} style={s.subBtn}>
          <Text style={{ color: '#04140b', fontWeight: '700', fontSize: 16 }}>{t('subBtn')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 55 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingBottom: 8 },
  back: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  crown: { width: 60, height: 60, borderRadius: 16, backgroundColor: C.amber, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  benefits: { marginHorizontal: 20, marginBottom: 18, gap: 10 },
  ben: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  benIc: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(48,209,88,0.22)', alignItems: 'center', justifyContent: 'center' },
  plan: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16, borderWidth: 1.5 },
  planBadge: { position: 'absolute', top: -8, right: 14, backgroundColor: C.amber, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 7 },
  subBtn: { marginHorizontal: 18, marginTop: 18, height: 50, borderRadius: 14, backgroundColor: C.amber, alignItems: 'center', justifyContent: 'center' },
});
