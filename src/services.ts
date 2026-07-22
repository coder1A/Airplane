// Network services: live aircraft (adsb.fi) + city geocoding (Open-Meteo) +
// real airport departure/arrival boards (AeroDataBox).
import type { Aircraft } from './geo';
import type { FlightRow, FlightStatus } from './data';
import { AERODATABOX_KEY } from './config';

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

// ---- Real airport departure/arrival board (AeroDataBox via RapidAPI) ----

export type Board = { deps: FlightRow[]; arrs: FlightRow[] };

const boardCache = new Map<string, { ts: number; data: Board }>();
const BOARD_TTL = 3 * 60 * 1000; // 3 min — conserve the free quota

function mapStatus(s: string): FlightStatus {
  switch (s) {
    case 'Canceled':
    case 'Cancelled':
    case 'CanceledUncertain':
      return 'cancelled';
    case 'Delayed':
      return 'delayed';
    case 'Boarding':
    case 'GateClosed':
    case 'CheckIn':
      return 'boarding';
    case 'Departed':
      return 'departed';
    case 'Arrived':
      return 'landed';
    case 'Approaching':
      return 'approx';
    default:
      return 'onTime'; // Expected, EnRoute, Unknown, Diverted, ...
  }
}

// "2026-07-22 02:45+04:00" -> "02:45"
function hhmm(local?: string): string {
  if (!local) return '--:--';
  const m = local.match(/\s(\d{2}:\d{2})/);
  return m ? m[1] : '--:--';
}

function pad(n: number): string {
  return n < 10 ? '0' + n : String(n);
}
// Format a Date's UTC fields as local wall-clock "YYYY-MM-DDTHH:mm".
function fmtLocal(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export async function fetchAirportBoard(iata: string, tzOffsetH: number): Promise<Board> {
  const cached = boardCache.get(iata);
  if (cached && Date.now() - cached.ts < BOARD_TTL) return cached.data;
  if (!AERODATABOX_KEY) throw new Error('no AeroDataBox key');

  // Airport-local wall clock now = UTC + tz offset; window = [-1h, +11h] (12h max).
  const nowLocal = new Date(Date.now() + tzOffsetH * 3_600_000);
  const from = new Date(nowLocal.getTime() - 1 * 3_600_000);
  const to = new Date(nowLocal.getTime() + 11 * 3_600_000);
  const url =
    `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${iata}/${fmtLocal(from)}/${fmtLocal(to)}` +
    `?withLeg=false&direction=Both&withCancelled=true&withCodeshared=false&withCargo=false&withPrivate=false&withLocation=false`;

  const res = await fetch(url, {
    headers: { 'x-rapidapi-key': AERODATABOX_KEY, 'x-rapidapi-host': 'aerodatabox.p.rapidapi.com' },
  });
  if (!res.ok) throw new Error(`AeroDataBox HTTP ${res.status}`);
  const data: any = await res.json();

  const mapRow = (f: any, arriving: boolean): FlightRow => {
    const ap = f?.movement?.airport ?? {};
    const other = String(ap.iata || ap.icao || '—');
    return {
      no: String(f?.number ?? '').replace(/\s+/g, ''),
      from: arriving ? other : iata,
      to: arriving ? iata : other,
      city: String(ap.name || ap.municipalityName || ''),
      time: hhmm(f?.movement?.scheduledTime?.local),
      status: mapStatus(String(f?.status ?? '')),
      airline: f?.airline?.name ? String(f.airline.name) : undefined,
      aircraft: f?.aircraft?.model ? String(f.aircraft.model) : undefined,
    };
  };

  const deps = (Array.isArray(data.departures) ? data.departures : []).map((f: any) => mapRow(f, false)).slice(0, 40);
  const arrs = (Array.isArray(data.arrivals) ? data.arrivals : []).map((f: any) => mapRow(f, true)).slice(0, 40);
  const out: Board = { deps, arrs };
  boardCache.set(iata, { ts: Date.now(), data: out });
  return out;
}
