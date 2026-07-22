import React, { useMemo, useState } from 'react';
import { View, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/state';
import { palette } from './src/theme';
import { NavCtx, Nav, Overlay } from './src/nav';
import { Tab, TabBar } from './src/components/TabBar';
import { Toast } from './src/components/ui';
import { AuthScreen } from './src/screens/Auth';
import { HomeScreen } from './src/screens/Home';
import { AirportsScreen } from './src/screens/Airports';
import { AirportDetailScreen } from './src/screens/AirportDetail';
import { FlightDetailScreen } from './src/screens/FlightDetail';
import { SavedScreen } from './src/screens/Saved';
import { ProfileScreen } from './src/screens/Profile';
import { SubscriptionScreen } from './src/screens/Subscription';

const TOP_INSET = Platform.OS === 'ios' ? 54 : (RNStatusBar.currentHeight ?? 24) + 6;

function Main() {
  const app = useApp();
  const [tab, setTab] = useState<Tab>('map');
  const [stack, setStack] = useState<Overlay[]>([]);

  const nav = useMemo<Nav>(
    () => ({
      tab,
      goTab: (tb) => { setStack([]); setTab(tb); },
      openAirport: (a) => setStack((s) => [...s, { kind: 'airport', airport: a }]),
      openFlight: (f) => setStack((s) => [...s, { kind: 'flight', flight: f }]),
      openSub: () => setStack((s) => [...s, { kind: 'sub' }]),
      back: () => setStack((s) => s.slice(0, -1)),
    }),
    [tab],
  );

  const top = stack[stack.length - 1];

  return (
    <NavCtx.Provider value={nav}>
      <View style={{ flex: 1, backgroundColor: palette(app.theme).scrBg }}>
        {tab === 'map' && <HomeScreen topInset={TOP_INSET} />}
        {tab === 'airports' && <AirportsScreen topInset={TOP_INSET} />}
        {tab === 'saved' && <SavedScreen topInset={TOP_INSET} />}
        {tab === 'profile' && <ProfileScreen topInset={TOP_INSET} />}

        {top?.kind === 'airport' && <AirportDetailScreen airport={top.airport} topInset={TOP_INSET} />}
        {top?.kind === 'flight' && <FlightDetailScreen flight={top.flight} topInset={TOP_INSET} />}
        {top?.kind === 'sub' && <SubscriptionScreen topInset={TOP_INSET} />}

        <TabBar active={tab} onChange={nav.goTab} />
        <Toast />
        <StatusBar style={app.theme === 'dark' ? 'light' : 'dark'} />
      </View>
    </NavCtx.Provider>
  );
}

function Root() {
  const { ready, user, theme } = useApp();
  if (!ready) return <View style={{ flex: 1, backgroundColor: palette(theme).scrBg }} />;
  if (!user) {
    return (
      <>
        <AuthScreen />
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </>
    );
  }
  return <Main />;
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}
