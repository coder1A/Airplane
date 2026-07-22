import { createContext, useContext } from 'react';
import type { Airport, Flight } from './data';
import type { Tab } from './components/TabBar';

export type Overlay =
  | { kind: 'airport'; airport: Airport }
  | { kind: 'flight'; flight: Flight }
  | { kind: 'sub' };

export type Nav = {
  tab: Tab;
  goTab: (t: Tab) => void;
  openAirport: (a: Airport) => void;
  openFlight: (f: Flight) => void;
  openSub: () => void;
  back: () => void;
};

export const NavCtx = createContext<Nav | null>(null);
export const useNav = (): Nav => {
  const v = useContext(NavCtx);
  if (!v) throw new Error('useNav must be used within NavCtx');
  return v;
};
