import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../state';
import { usePalette } from '../components/ui';
import { FlagIcon } from '../components/FlagIcon';
import { C, Palette } from '../theme';
import type { Lang } from '../i18n';

const TAKEN = ['admin', 'test', 'user', 'pilot', 'aziz'];
const LANGS: Lang[] = ['en', 'es', 'uz', 'ru'];

// Module-scope field component so TextInputs keep focus while typing.
function AuthField(props: {
  p: Palette;
  value: string;
  onChangeText: (s: string) => void;
  placeholder: string;
  secure?: boolean;
  show?: boolean;
  onToggleShow?: () => void;
  hint?: React.ReactNode;
  keyboardType?: any;
}) {
  const { p } = props;
  return (
    <View style={[s.field, { backgroundColor: p.glass, borderColor: p.glassLine }]}>
      <TextInput
        style={{ flex: 1, color: p.ink, fontSize: 15 }}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={p.ink3}
        secureTextEntry={props.secure && !props.show}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={props.keyboardType}
      />
      {props.secure && (
        <Pressable onPress={props.onToggleShow} hitSlop={8}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={props.show ? C.amber : p.ink3} strokeWidth={1.7}>
            <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <Path d="M12 15a3 3 0 100-6 3 3 0 000 6Z" />
          </Svg>
        </Pressable>
      )}
      {props.hint}
    </View>
  );
}

export function AuthScreen() {
  const app = useApp();
  const { p } = usePalette();
  const t = app.t;
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loginId, setLoginId] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow((v) => !v);

  const rules = useMemo(
    () => ({ len: pass.length >= 8, up: /[A-Z]/.test(pass), num: /[0-9]/.test(pass), match: pass.length > 0 && pass === pass2 }),
    [pass, pass2],
  );
  const userState = useMemo(() => {
    const v = username.trim().toLowerCase();
    if (!v) return '';
    if (TAKEN.indexOf(v) !== -1) return 'taken';
    if (v.length < 3) return 'short';
    return 'free';
  }, [username]);
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  const passValid = rules.len && rules.up && rules.num;
  const canSubmit =
    mode === 'login'
      ? loginId.trim().length > 0 && pass.length > 0
      : !!(first.trim() && last.trim() && userState === 'free' && emailOk && passValid && pass === pass2);

  const submit = () => {
    if (!canSubmit) return;
    if (mode === 'signup') {
      app.signIn({ first: first.trim(), last: last.trim(), username: username.trim(), email: email.trim() });
    } else {
      const id = loginId.trim();
      app.signIn({ first: id, last: '', username: id, email: id.includes('@') ? id : '' });
    }
  };

  return (
    <View style={[s.root, { backgroundColor: p.scrBg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.logo}>
            <Svg width={34} height={34} viewBox="0 0 24 24" fill="#fff">
              <Path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
            </Svg>
          </View>
          <Text style={[s.title, { color: p.ink }]}>Plane Radar</Text>
          <Text style={[s.sub, { color: p.ink3 }]}>{t('authSub')}</Text>

          <View style={[s.seg, { backgroundColor: p.hair }]}>
            {(['login', 'signup'] as const).map((mk) => (
              <Pressable key={mk} onPress={() => setMode(mk)} style={[s.segBtn, mode === mk && { backgroundColor: p.glass2 }]}>
                <Text style={{ color: mode === mk ? p.ink : p.ink2, fontWeight: '600' }}>{t(mk === 'login' ? 'authLogin' : 'authSignup')}</Text>
              </Pressable>
            ))}
          </View>

          {mode === 'signup' && (
            <>
              <AuthField p={p} value={first} onChangeText={setFirst} placeholder={t('phFirst')} />
              <AuthField p={p} value={last} onChangeText={setLast} placeholder={t('phLast')} />
              <AuthField
                p={p}
                value={username}
                onChangeText={setUsername}
                placeholder={t('phUser')}
                hint={userState ? <Text style={{ marginLeft: 8, fontWeight: '600', fontSize: 12, color: userState === 'free' ? C.green : C.red }}>{t(userState === 'free' ? 'userFree' : userState === 'taken' ? 'userTaken' : 'userShort')}</Text> : undefined}
              />
              <AuthField p={p} value={email} onChangeText={setEmail} placeholder={t('phEmail')} keyboardType="email-address" />
            </>
          )}
          {mode === 'login' && <AuthField p={p} value={loginId} onChangeText={setLoginId} placeholder={t('phLoginId')} />}

          <AuthField p={p} value={pass} onChangeText={setPass} placeholder={t('phPass')} secure show={show} onToggleShow={toggleShow} />
          {mode === 'signup' && <AuthField p={p} value={pass2} onChangeText={setPass2} placeholder={t('phPass2')} secure show={show} onToggleShow={toggleShow} />}

          {mode === 'signup' && (
            <View style={s.rules}>
              {([['len', 'ruleLen'], ['up', 'ruleUp'], ['num', 'ruleNum'], ['match', 'ruleMatch']] as const).map(([k, key]) => (
                <Text key={k} style={{ fontSize: 11.5, color: rules[k] ? C.green : p.ink3 }}>• {t(key)}</Text>
              ))}
            </View>
          )}

          <Pressable onPress={submit} disabled={!canSubmit} style={[s.submit, { opacity: canSubmit ? 1 : 0.45 }]}>
            <Text style={{ color: '#04140b', fontWeight: '700', fontSize: 16 }}>{t(mode === 'login' ? 'authLogin' : 'authSignup')}</Text>
          </Pressable>

          <Text style={[s.langLabel, { color: p.ink3 }]}>Language</Text>
          <View style={s.flags}>
            {LANGS.map((l) => (
              <Pressable key={l} onPress={() => app.setLang(l)}>
                <FlagIcon code={l} size={38} active={app.lang === l} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 24, paddingTop: 70 },
  logo: { width: 64, height: 64, borderRadius: 18, backgroundColor: C.amber, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { textAlign: 'center', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  sub: { textAlign: 'center', fontSize: 13, marginTop: 3, marginBottom: 18 },
  seg: { flexDirection: 'row', borderRadius: 12, padding: 3, marginBottom: 16 },
  segBtn: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  field: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 48, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, marginBottom: 10 },
  rules: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14, marginHorizontal: 4 },
  submit: { height: 50, borderRadius: 14, backgroundColor: C.amber, alignItems: 'center', justifyContent: 'center' },
  langLabel: { textAlign: 'center', fontSize: 12, marginTop: 22, marginBottom: 10 },
  flags: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
});
