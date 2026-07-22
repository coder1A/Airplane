// AeroDataBox (RapidAPI) key for real airport departure/arrival boards.
// Supplied at build time via EXPO_PUBLIC_AERODATABOX_KEY (never committed):
//   - CI:    from the GitHub Actions secret AERODATABOX_KEY
//   - local: from .env.local (git-ignored)
// When empty, the app gracefully falls back to demo schedules.
export const AERODATABOX_KEY: string = (process.env as any).EXPO_PUBLIC_AERODATABOX_KEY ?? '';
