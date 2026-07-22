import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Switch, Modal, Linking } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useApp } from '../state';
import { useNav } from '../nav';
import { usePalette } from '../components/ui';
import { FlagIcon } from '../components/FlagIcon';
import { LANG_NAMES } from '../i18n';
import type { Lang } from '../i18n';
import { C, Palette } from '../theme';

const LANGS: Lang[] = ['uz', 'en', 'es', 'ru'];

function Row({ p, color, glyph, label, right, onPress }: { p: Palette; color: string; glyph: React.ReactNode; label: string; right?: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.row, { borderBottomColor: p.hair }]}>
      <View style={[s.ic, { backgroundColor: color }]}>{glyph}</View>
      <Text style={{ flex: 1, color: p.ink, fontSize: 15 }}>{label}</Text>
      {right}
    </Pressable>
  );
}

export function ProfileScreen({ topInset }: { topInset: number }) {
  const app = useApp();
  const nav = useNav();
  const { p } = usePalette();
  const t = app.t;
  const [langOpen, setLangOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const u = app.user;
  const name = u ? `${u.first}${u.last ? ' ' + u.last.charAt(0).toUpperCase() + '.' : ''}` : 'Guest';

  const onNotif = (val: boolean) => {
    if (val && !app.premium) { app.showToast(t('needNotif'), t('goPremium')); nav.openSub(); return; }
    app.setNotifOn(val);
    app.showToast(val ? t('notifOnT') : t('notifOffT'), val ? t('notifOnB') : '');
  };

  return (
    <View style={{ flex: 1, backgroundColor: p.viewBg, paddingTop: topInset + 8 }}>
      <Text style={[s.title, { color: p.ink }]}>{t('profile')}</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        {/* user card */}
        <View style={[s.userCard, { backgroundColor: p.glass, borderColor: p.glassLine }]}>
          <View style={s.avatar}><Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>{(u?.first || 'A').charAt(0).toUpperCase()}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: p.ink, fontSize: 18, fontWeight: '700' }}>{name}</Text>
            <Text style={{ color: p.ink3, fontSize: 13 }}>{u?.email || ''}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: app.premium ? 'rgba(255,159,10,0.2)' : p.hair }]}>
            <Text style={{ color: app.premium ? C.amber : p.ink3, fontSize: 11, fontWeight: '700' }}>{app.premium ? t('premium') : t('planFree')}</Text>
          </View>
        </View>

        {/* premium card */}
        <Pressable onPress={nav.openSub} style={[s.prem, { borderColor: 'rgba(255,159,10,0.4)' }]}>
          <View style={s.premIc}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="#fff"><Path d="M3 8l4 3.5L12 5l5 6.5L21 8l-1.6 10.5H4.6z" /></Svg>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: p.ink, fontSize: 15, fontWeight: '700' }}>{t('premium')}</Text>
            <Text style={{ color: p.ink2, fontSize: 11.5 }}>{t('subDesc')}</Text>
          </View>
          <View style={s.premCta}><Text style={{ color: '#04140b', fontWeight: '700', fontSize: 13 }}>{app.premium ? t('subActive') : t('obuna')}</Text></View>
        </Pressable>

        {/* settings group 1 */}
        <View style={[s.group, { backgroundColor: p.glass, borderColor: p.glassLine }]}>
          <Row p={p} color="#5E5CE6" label={t('setAppearance')} onPress={app.toggleTheme}
            glyph={<Svg width={17} height={17} viewBox="0 0 24 24" fill="#fff"><Path d="M20 14.5A7.5 7.5 0 0 1 9.5 4 7.5 7.5 0 1 0 20 14.5Z" /></Svg>}
            right={<Text style={{ color: p.ink3, fontSize: 14 }}>{app.theme === 'dark' ? t('themeDark') : t('themeLight')}</Text>} />
          <Row p={p} color="#FF453A" label={t('setNotif')}
            glyph={<Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"><Path d="M6.5 16v-4a5.5 5.5 0 0 1 11 0v4l1.5 2h-14z" /><Path d="M10 20a2 2 0 0 0 4 0" /></Svg>}
            right={<Switch value={app.notifOn && app.premium} onValueChange={onNotif} trackColor={{ true: C.green, false: p.hair }} thumbColor="#fff" />} />
          <Row p={p} color="#32ADE6" label={t('setUnits')} onPress={app.toggleUnits}
            glyph={<Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round"><Path d="M4 15a8 8 0 0 1 16 0" /><Path d="M12 15l4-3" /></Svg>}
            right={<Text style={{ color: p.ink3, fontSize: 14 }}>{app.units === 'km' ? 'km · ft' : 'mil · ft'} ›</Text>} />
          <Row p={p} color="#0A84FF" label={t('setLangLbl')} onPress={() => setLangOpen(true)}
            glyph={<Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.5}><Circle cx={12} cy={12} r={8} /><Path d="M4 12h16M12 4c2.5 2.7 2.5 12.6 0 16M12 4c-2.5 2.7-2.5 12.6 0 16" /></Svg>}
            right={<Text style={{ color: p.ink3, fontSize: 14 }}>{LANG_NAMES[app.lang]} ›</Text>} />
        </View>

        {/* settings group 2 */}
        <View style={[s.group, { backgroundColor: p.glass, borderColor: p.glassLine }]}>
          <Row p={p} color="#8E8E93" label={t('setAbout')} onPress={() => setAboutOpen(true)}
            glyph={<Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.7} strokeLinecap="round"><Circle cx={12} cy={12} r={8.5} /><Path d="M12 11v5M12 8h.01" /></Svg>}
            right={<Text style={{ color: p.ink3, fontSize: 18 }}>›</Text>} />
          <Row p={p} color="#FF9F0A" label={t('setHelp')} onPress={() => Linking.openURL('mailto:aircraftuz@gmail.com?subject=Plane%20Radar%20-%20Yordam')}
            glyph={<Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.7} strokeLinecap="round"><Circle cx={12} cy={12} r={8.5} /><Path d="M9.6 9.6a2.5 2.5 0 0 1 3.6 2c0 1.6-2 1.9-2 3.2M12 17h.01" /></Svg>}
            right={<Text style={{ color: p.ink3, fontSize: 18 }}>›</Text>} />
        </View>

        <Pressable onPress={app.signOut} style={[s.signout, { backgroundColor: p.glass, borderColor: p.glassLine }]}>
          <Text style={{ color: C.red, fontSize: 15, fontWeight: '700' }}>{t('signout')}</Text>
        </Pressable>
      </ScrollView>

      {/* Language modal */}
      <Modal transparent visible={langOpen} animationType="fade" onRequestClose={() => setLangOpen(false)}>
        <Pressable style={s.modalBack} onPress={() => setLangOpen(false)}>
          <Pressable style={[s.modal, { backgroundColor: p.glass2, borderColor: p.glassLine }]}>
            <Text style={[s.modalTitle, { color: p.ink3 }]}>{t('pickLang')}</Text>
            {LANGS.map((l) => (
              <Pressable key={l} style={s.langRow} onPress={() => { app.setLang(l); setLangOpen(false); }}>
                <FlagIcon code={l} size={26} />
                <Text style={{ flex: 1, marginLeft: 12, color: p.ink, fontSize: 16 }}>{LANG_NAMES[l]}</Text>
                {app.lang === l && <Text style={{ color: C.amber, fontWeight: '700' }}>✓</Text>}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* About modal */}
      <Modal transparent visible={aboutOpen} animationType="fade" onRequestClose={() => setAboutOpen(false)}>
        <Pressable style={s.modalBack} onPress={() => setAboutOpen(false)}>
          <Pressable style={[s.modal, { backgroundColor: p.glass2, borderColor: p.glassLine, alignItems: 'center', padding: 22 }]}>
            <View style={[s.aboutIc]}>
              <Svg width={30} height={30} viewBox="0 0 24 24" fill="#fff"><Path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" /></Svg>
            </View>
            <Text style={{ color: p.ink, fontSize: 20, fontWeight: '700', marginTop: 12 }}>Plane Radar</Text>
            <Text style={{ color: p.ink3, fontSize: 12, marginTop: 2 }}>Versiya 1.0</Text>
            <Text style={{ color: p.ink2, fontSize: 13.5, textAlign: 'center', lineHeight: 20, marginVertical: 14 }}>{t('aboutDesc')}</Text>
            <Pressable style={s.aboutClose} onPress={() => setAboutOpen(false)}><Text style={{ color: '#04140b', fontWeight: '700', fontSize: 15 }}>{t('close')}</Text></Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5, paddingHorizontal: 18, paddingBottom: 12 },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 18, borderWidth: 1 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.amber, alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  prem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginBottom: 16, padding: 14, borderRadius: 16, borderWidth: 1, backgroundColor: 'rgba(255,159,10,0.12)' },
  premIc: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.amber, alignItems: 'center', justifyContent: 'center' },
  premCta: { backgroundColor: C.amber, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  group: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1 },
  ic: { width: 29, height: 29, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  signout: { marginHorizontal: 16, height: 48, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  modalBack: { flex: 1, backgroundColor: 'rgba(4,7,12,0.5)', alignItems: 'center', justifyContent: 'center', padding: 26 },
  modal: { width: '100%', maxWidth: 340, borderRadius: 20, borderWidth: 1, padding: 8 },
  modalTitle: { textAlign: 'center', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', paddingVertical: 10 },
  langRow: { flexDirection: 'row', alignItems: 'center', padding: 13, borderRadius: 12 },
  aboutIc: { width: 60, height: 60, borderRadius: 16, backgroundColor: C.amber, alignItems: 'center', justifyContent: 'center' },
  aboutClose: { width: '100%', height: 46, borderRadius: 14, backgroundColor: C.amber, alignItems: 'center', justifyContent: 'center' },
});
