import React, { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lang, translate } from './i18n';
import type { ThemeName } from './theme';
import type { Flight } from './data';

export type Units = 'km' | 'mil';
export type User = { first: string; last: string; username: string; email: string } | null;
export type Center = { lat: number; lon: number; label: string };
export type Toast = { title: string; body: string } | null;

// Set false to fully disable ads. When true, ads show for non-premium users only.
export const ADS_ENABLED = true;
export const WATCH_FREE_LIMIT = 5;

const TASHKENT: Center = { lat: 41.2995, lon: 69.2401, label: 'Toshkent' };

type AppState = {
  ready: boolean;
  theme: ThemeName;
  lang: Lang;
  units: Units;
  premium: boolean;
  user: User;
  center: Center;
  savedAirports: string[];
  savedFlights: Flight[];
  notifOn: boolean;
  toast: Toast;
  t: (key: string) => string;
  toggleTheme: () => void;
  setLang: (l: Lang) => void;
  toggleUnits: () => void;
  subscribe: () => void;
  cancelPremium: () => void;
  signIn: (u: NonNullable<User>) => void;
  signOut: () => void;
  setCenter: (c: Center) => void;
  setNotifOn: (on: boolean) => void;
  isAirportSaved: (code: string) => boolean;
  isFlightSaved: (no: string) => boolean;
  toggleSaveAirport: (code: string) => boolean; // returns false if blocked (limit)
  toggleSaveFlight: (f: Flight) => boolean;
  canSaveMore: () => boolean;
  showToast: (title: string, body?: string) => void;
};

const Ctx = createContext<AppState | null>(null);
export const useApp = (): AppState => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used within AppProvider');
  return v;
};

const KEY = 'planeradar.state.v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [lang, setLangState] = useState<Lang>('uz');
  const [units, setUnits] = useState<Units>('km');
  const [premium, setPremium] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [center, setCenter] = useState<Center>(TASHKENT);
  const [savedAirports, setSavedAirports] = useState<string[]>(['DXB']);
  const [savedFlights, setSavedFlights] = useState<Flight[]>([]);
  const [notifOn, setNotifOn] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted state once.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const s = JSON.parse(raw);
          if (s.theme) setTheme(s.theme);
          if (s.lang) setLangState(s.lang);
          if (s.units) setUnits(s.units);
          if (typeof s.premium === 'boolean') setPremium(s.premium);
          if (s.user) setUser(s.user);
          if (s.center) setCenter(s.center);
          if (Array.isArray(s.savedAirports)) setSavedAirports(s.savedAirports);
          if (Array.isArray(s.savedFlights)) setSavedFlights(s.savedFlights);
        }
      } catch {
        // ignore corrupt storage
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Persist on change (after ready).
  useEffect(() => {
    if (!ready) return;
    const data = JSON.stringify({ theme, lang, units, premium, user, center, savedAirports, savedFlights });
    AsyncStorage.setItem(KEY, data).catch(() => {});
  }, [ready, theme, lang, units, premium, user, center, savedAirports, savedFlights]);

  const t = useCallback((key: string) => translate(lang, key), [lang]);

  const showToast = useCallback((title: string, body = '') => {
    setToast({ title, body });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3400);
  }, []);

  const canSaveMore = useCallback(
    () => premium || savedAirports.length + savedFlights.length < WATCH_FREE_LIMIT,
    [premium, savedAirports.length, savedFlights.length],
  );

  const isAirportSaved = useCallback((code: string) => savedAirports.indexOf(code) !== -1, [savedAirports]);
  const isFlightSaved = useCallback((no: string) => savedFlights.some((f) => f.no === no), [savedFlights]);

  const toggleSaveAirport = useCallback(
    (code: string): boolean => {
      const has = savedAirports.indexOf(code) !== -1;
      if (!has && !canSaveMore()) return false;
      setSavedAirports((prev) => (has ? prev.filter((c) => c !== code) : [code, ...prev]));
      return true;
    },
    [savedAirports, canSaveMore],
  );

  const toggleSaveFlight = useCallback(
    (f: Flight): boolean => {
      const has = savedFlights.some((x) => x.no === f.no);
      if (!has && !canSaveMore()) return false;
      setSavedFlights((prev) => (has ? prev.filter((x) => x.no !== f.no) : [f, ...prev]));
      return true;
    },
    [savedFlights, canSaveMore],
  );

  const value = useMemo<AppState>(
    () => ({
      ready, theme, lang, units, premium, user, center, savedAirports, savedFlights, notifOn, toast, t,
      toggleTheme: () => setTheme((p) => (p === 'dark' ? 'light' : 'dark')),
      setLang: (l) => setLangState(l),
      toggleUnits: () => setUnits((p) => (p === 'km' ? 'mil' : 'km')),
      subscribe: () => setPremium(true),
      cancelPremium: () => setPremium(false),
      signIn: (u) => setUser(u),
      signOut: () => { setUser(null); setPremium(false); setNotifOn(false); },
      setCenter,
      setNotifOn,
      isAirportSaved, isFlightSaved, toggleSaveAirport, toggleSaveFlight, canSaveMore, showToast,
    }),
    [ready, theme, lang, units, premium, user, center, savedAirports, savedFlights, notifOn, toast, t,
      isAirportSaved, isFlightSaved, toggleSaveAirport, toggleSaveFlight, canSaveMore, showToast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
