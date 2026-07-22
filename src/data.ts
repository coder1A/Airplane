// Static airport data + demo flight generation.
import { addMinutes, pad2 } from './geo';

export type Airport = { code: string; name: string; city: string; country: string; lat: number; lon: number };

export const AIRPORTS: Airport[] = [
  { code: 'TAS', name: 'Islom Karimov', city: 'Toshkent', country: "O'zbekiston", lat: 41.2579, lon: 69.2812 },
  { code: 'SKD', name: 'Samarqand', city: 'Samarqand', country: "O'zbekiston", lat: 39.7005, lon: 66.9838 },
  { code: 'CGK', name: 'Soekarno–Hatta', city: 'Jakarta', country: 'Indoneziya', lat: -6.1256, lon: 106.6559 },
  { code: 'SIN', name: 'Changi', city: 'Singapur', country: 'Singapur', lat: 1.3644, lon: 103.9915 },
  { code: 'DXB', name: 'Dubai Intl', city: 'Dubai', country: 'BAA', lat: 25.2532, lon: 55.3657 },
  { code: 'IST', name: 'Istanbul', city: 'Istanbul', country: 'Turkiya', lat: 41.2753, lon: 28.7519 },
  { code: 'LHR', name: 'Heathrow', city: 'London', country: 'Buyuk Britaniya', lat: 51.47, lon: -0.4543 },
  { code: 'JFK', name: 'John F. Kennedy', city: 'Nyu-York', country: 'AQSh', lat: 40.6413, lon: -73.7781 },
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Germaniya', lat: 50.0379, lon: 8.5622 },
  { code: 'SVO', name: 'Sheremetyevo', city: 'Moskva', country: 'Rossiya', lat: 55.9726, lon: 37.4146 },
  { code: 'ALA', name: 'Almati', city: 'Almati', country: "Qozog'iston", lat: 43.3521, lon: 77.0405 },
  { code: 'HKG', name: 'Hong Kong Intl', city: 'Gonkong', country: 'Xitoy', lat: 22.308, lon: 113.9185 },
  { code: 'DEL', name: 'Indira Gandhi', city: 'Dehli', country: 'Hindiston', lat: 28.5562, lon: 77.1 },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Parij', country: 'Fransiya', lat: 49.0097, lon: 2.5479 },
];

export const AIRLINES: Record<string, string> = {
  HY: 'Uzbekistan Airways', EK: 'Emirates', TK: 'Turkish Airlines', QR: 'Qatar Airways',
  SU: 'Aeroflot', SQ: 'Singapore Airlines', LH: 'Lufthansa', JT: 'Lion Air',
};

export const AIRCRAFT: Record<string, string> = {
  HY: 'Boeing 787-8', EK: 'Airbus A380-800', TK: 'Airbus A321neo', QR: 'Boeing 777-300ER',
  SU: 'Airbus A320', SQ: 'Boeing 787-10', LH: 'Airbus A350-900', JT: 'Boeing 737-800',
};

const AIRLINE_CODES = Object.keys(AIRLINES);

export type FlightStatus = 'onTime' | 'delayed' | 'boarding' | 'approx' | 'landed' | 'cancelled';

export type FlightRow = {
  no: string;
  from: string;
  to: string;
  city: string; // the "other" endpoint city
  time: string; // dep time (departures) or arr time (arrivals)
  status: FlightStatus;
};

export type Flight = {
  no: string;
  airline: string;
  aircraft: string;
  oCode: string;
  oCity: string;
  oTime: string;
  dCode: string;
  dCity: string;
  dTime: string;
  status: FlightStatus;
  // Optional live telemetry (when opened from the live map).
  live?: boolean;
  altFt?: number | null;
  gs?: number;
};

function pick(others: Airport[], i: number): Airport {
  return others[(i * 3 + 2) % others.length];
}

export function generateFlights(sel: Airport): { deps: FlightRow[]; arrs: FlightRow[] } {
  const others = AIRPORTS.filter((a) => a.code !== sel.code);
  const deps: FlightRow[] = [];
  const arrs: FlightRow[] = [];
  for (let i = 0; i < 8; i++) {
    const d = pick(others, i);
    const al = AIRLINE_CODES[(i + 2) % AIRLINE_CODES.length];
    const st: FlightStatus = i % 6 === 4 ? 'cancelled' : i % 4 === 1 ? 'delayed' : i % 5 === 0 ? 'boarding' : 'onTime';
    deps.push({ no: al + (100 + ((i * 73) % 800)), from: sel.code, to: d.code, city: d.city, time: pad2((6 + i * 2) % 24) + ':' + pad2((i * 13) % 60), status: st });
  }
  for (let i = 0; i < 8; i++) {
    const o = pick(others, i + 1);
    const al = AIRLINE_CODES[(i + 4) % AIRLINE_CODES.length];
    const st: FlightStatus = i % 6 === 3 ? 'cancelled' : i % 5 === 2 ? 'delayed' : i % 6 === 0 ? 'landed' : 'approx';
    arrs.push({ no: al + (200 + ((i * 59) % 700)), from: o.code, to: sel.code, city: o.city, time: pad2((7 + i * 2) % 24) + ':' + pad2((i * 17) % 60), status: st });
  }
  return { deps, arrs };
}

export function airlineOf(no: string): string {
  return AIRLINES[no.slice(0, 2)] || no.slice(0, 2);
}
export function aircraftOf(no: string): string {
  return AIRCRAFT[no.slice(0, 2)] || 'Airbus A320';
}

// Build a full Flight from an airport-list row.
export function flightFromRow(row: FlightRow, selCity: string, arriving: boolean): Flight {
  const base: Flight = {
    no: row.no,
    airline: airlineOf(row.no),
    aircraft: aircraftOf(row.no),
    oCode: row.from,
    oCity: arriving ? row.city : selCity,
    oTime: arriving ? addMinutes(row.time, -135) : row.time,
    dCode: row.to,
    dCity: arriving ? selCity : row.city,
    dTime: arriving ? row.time : addMinutes(row.time, 135),
    status: row.status,
  };
  return base;
}

// Build a Flight from a live aircraft (route unknown; telemetry known).
export function flightFromAircraft(a: {
  hex: string; callsign: string; type: string; altFt: number | null; gs: number;
}): Flight {
  return {
    no: a.callsign || a.hex || '—',
    airline: '',
    aircraft: a.type || '—',
    oCode: '', oCity: '', oTime: '', dCode: '', dCity: '', dTime: '',
    status: 'onTime',
    live: true,
    altFt: a.altFt,
    gs: a.gs,
  };
}

// The default flight shown on the map (the tracked one).
export const DEMO_FLIGHT: Flight = {
  no: 'JT716', airline: 'Lion Air', aircraft: 'Boeing 737-800',
  oCode: 'CGK', oCity: 'Jakarta', oTime: '15:20',
  dCode: 'SIN', dCity: 'Singapur', dTime: '18:11', status: 'onTime',
};
