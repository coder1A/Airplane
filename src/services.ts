// Network services: live aircraft (adsb.fi) + city geocoding (Open-Meteo). No API keys.
import type { Aircraft } from './geo';

const KM_PER_NM = 1.852;

export async function fetchAircraft(
  lat: number,
  lon: number,
  radiusKm: number,
  signal?: AbortSignal,
): Promise<Aircraft[]> {
  const distNm = (radiusKm / KM_PER_NM).toFixed(1);
  const url = `https://opendata.adsb.fi/api/v3/lat/${lat.toFixed(4)}/lon/${lon.toFixed(4)}/dist/${distNm}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`adsb.fi HTTP ${res.status}`);
  const data: any = await res.json();
  const list: any[] = Array.isArray(data.ac) ? data.ac : [];
  return list
    .filter((p) => typeof p.lat === 'number' && typeof p.lon === 'number')
    .slice(0, 80)
    .map((p): Aircraft => {
      const ground = p.alt_baro === 'ground';
      const altFt = typeof p.alt_baro === 'number' ? p.alt_baro : typeof p.alt_geom === 'number' ? p.alt_geom : null;
      return {
        hex: String(p.hex ?? ''),
        lat: p.lat,
        lon: p.lon,
        track: typeof p.track === 'number' ? p.track : typeof p.true_heading === 'number' ? p.true_heading : 0,
        gs: typeof p.gs === 'number' ? p.gs : 0,
        callsign: String(p.flight ?? p.hex ?? '').trim(),
        type: String(p.t ?? '').trim(),
        altFt,
        ground,
      };
    });
}

export type Place = { name: string; country: string; lat: number; lon: number };

export async function searchCity(query: string, lang = 'uz'): Promise<Place[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=${lang}&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
  const data: any = await res.json();
  const results: any[] = Array.isArray(data.results) ? data.results : [];
  return results.map((r): Place => ({
    name: r.name,
    country: r.country ?? '',
    lat: r.latitude,
    lon: r.longitude,
  }));
}
