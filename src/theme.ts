// Theme tokens (light + dark), mirroring the approved design.
export type ThemeName = 'dark' | 'light';

export type Palette = {
  scrBg: string;
  glass: string;
  glass2: string;
  glassLine: string;
  viewBg: string;
  ink: string;
  ink2: string;
  ink3: string;
  hair: string;
};

export const PALETTES: Record<ThemeName, Palette> = {
  dark: {
    scrBg: '#0b1119',
    glass: 'rgba(22,28,38,0.92)',
    glass2: 'rgba(28,34,45,0.96)',
    glassLine: 'rgba(255,255,255,0.13)',
    viewBg: '#0b1119',
    ink: '#F4F7FA',
    ink2: '#9AA7B4',
    ink3: '#67717f',
    hair: 'rgba(255,255,255,0.09)',
  },
  light: {
    scrBg: '#eaf0f7',
    glass: 'rgba(255,255,255,0.96)',
    glass2: 'rgba(255,255,255,0.99)',
    glassLine: 'rgba(20,30,50,0.10)',
    viewBg: '#eaf0f7',
    ink: '#0b1220',
    ink2: '#5a6675',
    ink3: '#93a0b0',
    hair: 'rgba(10,20,40,0.09)',
  },
};

// Accent + semantic colors (shared across themes)
export const C = {
  amber: '#FF9F0A',
  amber2: '#ff6a3d',
  blue: '#0A84FF',
  green: '#30D158',
  red: '#FF453A',
};

export function palette(name: ThemeName): Palette {
  return PALETTES[name];
}

// Map colors depend on theme
export function mapColors(name: ThemeName) {
  const dark = name === 'dark';
  return {
    water: dark ? '#0a1119' : '#d9e4f0',
    land: dark ? '#111a26' : '#f2f6fb',
    land2: dark ? '#0e1622' : '#e9f0f8',
    road: dark ? 'rgba(150,170,200,0.10)' : 'rgba(70,95,130,0.10)',
    river: dark ? 'rgba(30,90,150,0.5)' : 'rgba(120,170,220,0.7)',
    park: dark ? 'rgba(38,92,60,0.55)' : 'rgba(150,205,165,0.55)',
    label: dark ? '#5f6d80' : '#8393a8',
    plane: C.amber,
    planeDim: dark ? 'rgba(255,180,90,0.7)' : 'rgba(60,80,110,0.55)',
    route: C.amber,
  };
}
