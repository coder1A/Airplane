// Geometry + time helpers.
export type Aircraft = {
  hex: string;
  lat: number;
  lon: number;
  track: number;
  gs: number;
  callsign: string;
  type: string;
  altFt: number | null;
  ground: boolean;
};

const KM_PER_DEG_LAT = 110.574;
const KM_PER_DEG_LON = 111.32;

export function offsetKm(lat: number, lon: number, cLat: number, cLon: number) {
  const dyKm = (lat - cLat) * KM_PER_DEG_LAT;
  const dxKm = (lon - cLon) * KM_PER_DEG_LON * Math.cos((cLat * Math.PI) / 180);
  return { dxKm, dyKm, distKm: Math.hypot(dxKm, dyKm) };
}

export function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

export function addMinutes(hhmm: string, mins: number): string {
  const parts = hhmm.split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const tot = (((h * 60 + m + mins) % 1440) + 1440) % 1440;
  return pad2(Math.floor(tot / 60)) + ':' + pad2(tot % 60);
}

export function durationBetween(a: string, b: string): string {
  const [ah, am] = a.split(':').map((x) => parseInt(x, 10));
  const [bh, bm] = b.split(':').map((x) => parseInt(x, 10));
  const d = ((bh * 60 + bm - (ah * 60 + am)) % 1440 + 1440) % 1440;
  return pad2(Math.floor(d / 60)) + ':' + pad2(d % 60);
}
