import { useEffect, useRef, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { fetchAircraft } from './services';
import type { Aircraft } from './geo';

export function useAircraft(lat: number, lon: number, radiusKm: number, intervalMs = 5000) {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const ctrl = new AbortController();

    const tick = async () => {
      try {
        const list = await fetchAircraft(lat, lon, radiusKm, ctrl.signal);
        if (!cancelled) {
          setAircraft(list);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled && e?.name !== 'AbortError') setError('network');
      } finally {
        if (!cancelled) timer = setTimeout(tick, intervalMs);
      }
    };
    tick();
    return () => {
      cancelled = true;
      ctrl.abort();
      if (timer) clearTimeout(timer);
    };
  }, [lat, lon, radiusKm, intervalMs]);

  return { aircraft, error };
}

export function useLocation() {
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  const locate = useCallback(async (): Promise<{ lat: number; lon: number } | null> => {
    setBusy(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      return { lat: pos.coords.latitude, lon: pos.coords.longitude };
    } catch {
      return null;
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, []);

  return { locate, busy };
}
