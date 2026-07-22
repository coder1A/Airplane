// Real interactive map (Apple Maps on iOS) with live aircraft that glide
// smoothly via dead-reckoning between 5s polls — like FlightRadar24.
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, type Region } from 'react-native-maps';
import Svg, { Path } from 'react-native-svg';
import type { Aircraft } from '../geo';
import type { ThemeName } from '../theme';
import { C } from '../theme';

// Plane silhouette, nose pointing "north" (up). The Marker's `rotation` prop
// then turns it to the aircraft's track natively (no JS re-render needed).
const PLANE =
  'M0,-9 L1.3,-3 L8,2 L8,3.5 L1.6,1.2 L1.6,5.5 L3.7,8 L3.7,9.4 L0,7.7 L-3.7,9.4 L-3.7,8 L-1.6,5.5 L-1.6,1.2 L-8,3.5 L-8,2 L-1.3,-3 Z';

const KM_PER_DEG_LAT = 110.574;
const KM_PER_DEG_LON = 111.32;

export type MapRadarHandle = { animateTo: (lat: number, lon: number) => void };

type Props = {
  theme: ThemeName;
  initialCenter: { lat: number; lon: number };
  aircraft: Aircraft[];
  selectedHex: string | null;
  onSelect: (a: Aircraft) => void;
  onRegionChange: (lat: number, lon: number, radiusKm: number) => void;
  showUser: boolean;
};

type Coord = { latitude: number; longitude: number };

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
  coord,
  selected,
  onPress,
}: {
  a: Aircraft;
  coord: Coord;
  selected: boolean;
  onPress: (a: Aircraft) => void;
}) {
  // Re-snapshot the marker view only briefly (initial + when selection flips),
  // then freeze it so per-second coordinate updates stay cheap.
  const [tracks, setTracks] = useState(true);
  useEffect(() => {
    setTracks(true);
    const t = setTimeout(() => setTracks(false), 700);
    return () => clearTimeout(t);
  }, [selected]);
  const size = selected ? 30 : 22;
  return (
    <Marker
      coordinate={coord}
      rotation={a.track}
      flat
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={tracks}
      onPress={() => onPress(a)}
      zIndex={selected ? 20 : 1}
    >
      <Svg width={size} height={size} viewBox="-10 -10 20 20">
        <Path d={PLANE} fill={selected ? C.amber : '#e8a13a'} opacity={selected ? 1 : 0.92} />
      </Svg>
    </Marker>
  );
});

export const MapRadar = forwardRef<MapRadarHandle, Props>(function MapRadar(
  { theme, initialCenter, aircraft, selectedHex, onSelect, onRegionChange, showUser },
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

  // 1s clock that drives dead-reckoning between polls.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 1_000_000), 1000);
    return () => clearInterval(id);
  }, []);

  // Reset the extrapolation origin whenever a fresh poll arrives.
  const fetchedAt = useRef(Date.now());
  useEffect(() => {
    fetchedAt.current = Date.now();
  }, [aircraft]);

  const elapsedH = (Date.now() - fetchedAt.current) / 3_600_000;
  const positioned = aircraft.map((a) => ({ a, coord: project(a, elapsedH) }));

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
      showsUserLocation={showUser}
      showsMyLocationButton={false}
      showsCompass={false}
      rotateEnabled={false}
      pitchEnabled={false}
      userInterfaceStyle={theme}
    >
      {positioned.map(({ a, coord }, i) => (
        <PlaneMarker
          key={a.hex || `p${i}`}
          a={a}
          coord={coord}
          selected={a.hex === selectedHex}
          onPress={onSelect}
        />
      ))}
    </MapView>
  );
});
