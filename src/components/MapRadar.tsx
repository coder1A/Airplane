// Real interactive map (Apple Maps on iOS). Live aircraft glide continuously
// via a native AnimatedRegion (dead-reckoning), and airports are marked.
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, {
  Marker,
  MarkerAnimated,
  AnimatedRegion,
  PROVIDER_DEFAULT,
  type Region,
} from 'react-native-maps';
import Svg, { Path } from 'react-native-svg';
import type { Aircraft } from '../geo';
import type { Airport } from '../data';
import type { ThemeName } from '../theme';
import { C } from '../theme';

// Plane silhouette, nose pointing "north"; the Marker `rotation` prop turns it.
const PLANE =
  'M0,-9 L1.3,-3 L8,2 L8,3.5 L1.6,1.2 L1.6,5.5 L3.7,8 L3.7,9.4 L0,7.7 L-3.7,9.4 L-3.7,8 L-1.6,5.5 L-1.6,1.2 L-8,3.5 L-8,2 L-1.3,-3 Z';
const TOWER =
  'M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z';

const KM_PER_DEG_LAT = 110.574;
const KM_PER_DEG_LON = 111.32;
// Aircraft glide toward where they'll be this many seconds ahead; the next
// 5s poll re-targets from wherever the marker currently is → continuous motion.
const LOOKAHEAD_SEC = 6;

export type MapRadarHandle = { animateTo: (lat: number, lon: number) => void };

type Coord = { latitude: number; longitude: number };

type Props = {
  theme: ThemeName;
  initialCenter: { lat: number; lon: number };
  aircraft: Aircraft[];
  airports: Airport[];
  selectedHex: string | null;
  onSelect: (a: Aircraft) => void;
  onSelectAirport: (ap: Airport) => void;
  onRegionChange: (lat: number, lon: number, radiusKm: number) => void;
};

// Extrapolate an aircraft's position forward by `elapsedH` hours along its track.
function project(a: Aircraft, elapsedH: number): Coord {
  if (a.ground || !a.gs) return { latitude: a.lat, longitude: a.lon };
  const distKm = a.gs * 1.852 * elapsedH; // knots -> km
  const tr = (a.track * Math.PI) / 180;
  const dLat = (distKm * Math.cos(tr)) / KM_PER_DEG_LAT;
  const dLon = (distKm * Math.sin(tr)) / (KM_PER_DEG_LON * Math.cos((a.lat * Math.PI) / 180));
  return { latitude: a.lat + dLat, longitude: a.lon + dLon };
}

const PlaneMarker = React.memo(function PlaneMarker({
  a,
  selected,
  onPress,
}: {
  a: Aircraft;
  selected: boolean;
  onPress: (a: Aircraft) => void;
}) {
  const animRef = useRef<AnimatedRegion | null>(null);
  if (!animRef.current) {
    animRef.current = new AnimatedRegion({ latitude: a.lat, longitude: a.lon, latitudeDelta: 0, longitudeDelta: 0 });
  }
  const anim = animRef.current;

  // Each fresh poll re-targets the glide from the marker's current position.
  useEffect(() => {
    const f = project(a, LOOKAHEAD_SEC / 3600);
    anim
      .timing({
        latitude: f.latitude,
        longitude: f.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
        duration: LOOKAHEAD_SEC * 1000,
        useNativeDriver: false,
      } as any)
      .start();
  }, [a, anim]);

  // Re-snapshot the icon only briefly (mount + selection flip), then freeze.
  const [tracks, setTracks] = useState(true);
  useEffect(() => {
    setTracks(true);
    const t = setTimeout(() => setTracks(false), 800);
    return () => clearTimeout(t);
  }, [selected]);

  const size = selected ? 30 : 22;
  return (
    <MarkerAnimated
      coordinate={anim as any}
      rotation={a.track}
      flat
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={tracks}
      onPress={() => onPress(a)}
      zIndex={selected ? 20 : 3}
    >
      <Svg width={size} height={size} viewBox="-10 -10 20 20">
        <Path d={PLANE} fill={selected ? C.amber : '#e8a13a'} />
      </Svg>
    </MarkerAnimated>
  );
});

const AirportMarker = React.memo(function AirportMarker({
  ap,
  onPress,
}: {
  ap: Airport;
  onPress: (ap: Airport) => void;
}) {
  const [tracks, setTracks] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setTracks(false), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <Marker
      coordinate={{ latitude: ap.lat, longitude: ap.lon }}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={tracks}
      onPress={() => onPress(ap)}
      zIndex={2}
    >
      <View style={styles.apBadge}>
        <Svg width={11} height={11} viewBox="0 0 24 24" fill={C.amber}>
          <Path d={TOWER} />
        </Svg>
        <Text style={styles.apCode}>{ap.code}</Text>
      </View>
    </Marker>
  );
});

export const MapRadar = forwardRef<MapRadarHandle, Props>(function MapRadar(
  { theme, initialCenter, aircraft, airports, selectedHex, onSelect, onSelectAirport, onRegionChange },
  ref,
) {
  const mapRef = useRef<MapView>(null);

  useImperativeHandle(
    ref,
    () => ({
      animateTo: (lat: number, lon: number) =>
        mapRef.current?.animateToRegion(
          { latitude: lat, longitude: lon, latitudeDelta: 0.9, longitudeDelta: 0.9 },
          650,
        ),
    }),
    [],
  );

  const handleRegion = (region: Region) => {
    const radiusKm = Math.min(400, Math.max(40, ((region.latitudeDelta * KM_PER_DEG_LAT) / 2) * 1.4));
    onRegionChange(region.latitude, region.longitude, radiusKm);
  };

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_DEFAULT}
      initialRegion={{
        latitude: initialCenter.lat,
        longitude: initialCenter.lon,
        latitudeDelta: 1.1,
        longitudeDelta: 1.1,
      }}
      onRegionChangeComplete={handleRegion}
      showsMyLocationButton={false}
      showsCompass={false}
      rotateEnabled={false}
      pitchEnabled={false}
      userInterfaceStyle={theme}
    >
      {airports.map((ap) => (
        <AirportMarker key={ap.code} ap={ap} onPress={onSelectAirport} />
      ))}
      {aircraft.map((a, i) => (
        <PlaneMarker key={a.hex || `p${i}`} a={a} selected={a.hex === selectedHex} onPress={onSelect} />
      ))}
    </MapView>
  );
});

const styles = StyleSheet.create({
  apBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16,22,32,0.92)',
    borderColor: C.amber,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  apCode: { color: C.amber, fontWeight: '800', fontSize: 11, letterSpacing: 0.3 },
});
