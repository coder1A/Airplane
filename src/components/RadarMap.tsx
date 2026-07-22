import React from 'react';
import Svg, { Rect, Circle, Path, G, Line } from 'react-native-svg';
import { offsetKm, Aircraft } from '../geo';
import { mapColors } from '../theme';
import type { ThemeName } from '../theme';
import type { Center } from '../state';

const PLANE =
  'M0,-9 L1.3,-3 L8,2 L8,3.5 L1.6,1.2 L1.6,5.5 L3.7,8 L3.7,9.4 L0,7.7 L-3.7,9.4 L-3.7,8 L-1.6,5.5 L-1.6,1.2 L-8,3.5 L-8,2 L-1.3,-3 Z';

type Props = {
  width: number;
  height: number;
  theme: ThemeName;
  center: Center;
  aircraft: Aircraft[];
  rangeKm?: number;
  selectedHex?: string | null;
  onSelect?: (a: Aircraft) => void;
};

export function RadarMap({ width, height, theme, center, aircraft, rangeKm = 300, selectedHex, onSelect }: Props) {
  const m = mapColors(theme);
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 8;
  const pxPerKm = radius / rangeKm;

  const shown = aircraft
    .map((a) => {
      const { dxKm, dyKm, distKm } = offsetKm(a.lat, a.lon, center.lat, center.lon);
      return { a, x: cx + dxKm * pxPerKm, y: cy - dyKm * pxPerKm, distKm };
    })
    .filter((p) => p.distKm <= rangeKm);

  const sel = shown.find((p) => p.a.hex === selectedHex);

  return (
    <Svg width={width} height={height}>
      {/* water + stylised land */}
      <Rect x={0} y={0} width={width} height={height} fill={m.water} />
      <Path d={`M${-20},${height * 0.1} Q${width * 0.4},${height * 0.02} ${width + 20},${height * 0.22} L${width + 20},${-20} L${-20},${-20} Z`} fill={m.land} />
      <Path d={`M${-20},${height * 0.75} Q${width * 0.35},${height * 0.62} ${width * 0.7},${height * 0.82} T${width + 20},${height * 0.8} L${width + 20},${height + 20} L${-20},${height + 20} Z`} fill={m.land} />
      <Path d={`M${width * 0.05},${height * 0.4} Q${width * 0.25},${height * 0.42} ${width * 0.22},${height * 0.6}`} stroke={m.river} strokeWidth={4} fill="none" strokeLinecap="round" />

      {/* range rings */}
      {[0.4, 0.7, 1].map((r, i) => (
        <Circle key={i} cx={cx} cy={cy} r={radius * r} stroke={m.road} strokeWidth={1} fill="none" />
      ))}

      {/* route to selected */}
      {sel && (
        <Line x1={cx} y1={cy} x2={sel.x} y2={sel.y} stroke={m.route} strokeWidth={2} strokeDasharray="1,6" strokeLinecap="round" />
      )}

      {/* aircraft */}
      {shown.map((p) => {
        const on = p.a.hex === selectedHex;
        return (
          <G key={p.a.hex || `${p.x},${p.y}`}>
            <G transform={`translate(${p.x},${p.y}) rotate(${p.a.track}) scale(${on ? 1.3 : 1})`}>
              <Path d={PLANE} fill={on ? m.plane : m.planeDim} />
            </G>
            <Circle cx={p.x} cy={p.y} r={16} fill="transparent" onPress={() => onSelect && onSelect(p.a)} />
          </G>
        );
      })}

      {/* you */}
      <Circle cx={cx} cy={cy} r={5} fill={theme === 'dark' ? '#fff' : '#0A84FF'} />
      <Circle cx={cx} cy={cy} r={9} stroke={theme === 'dark' ? '#fff' : '#0A84FF'} strokeWidth={1.5} fill="none" opacity={0.5} />
    </Svg>
  );
}
