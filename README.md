# ✈️ Plane Radar — iOS ilova (Expo / React Native)

Boshingiz uzra uchayotgan samolyotlarni real vaqtda kuzatadigan ilova. Dizayn asosida yozilgan **haqiqiy Expo (React Native + TypeScript)** kod.

## ✨ Funksiyalar
- **Kirish / Ro'yxatdan o'tish** — parol tekshiruvi (8+ belgi, 1 katta harf, 1 raqam), unique username, bayroqli til tanlash
- **Radar xarita** — `adsb.fi` dan **jonli samolyotlar** (kalitsiz), tanlab telemetriyani ko'rish
- **Qidiruv** — shahar (Open-Meteo geocoding, kalitsiz) + aeroport
- **Aeroportlar** — ro'yxat + tafsilot: Ma'lumot / Uchishlar / Qo'nishlar (holatlar: Vaqtida, Kechikish, To'xtatilindi…)
- **Reys tafsiloti** — marshrut, ko'rsatkichlar, saqlash (★), bildirishnoma (🔔)
- **Saqlanganlar (watchlist)** — aeroport/reyslar (bepul: 5 tagacha)
- **Profil** — mavzu (dark/light), o'lchov birligi (km/mil), **4 tilda to'liq tarjima** (uz/en/es/ru), bildirishnoma, ilova haqida, yordam (email)
- **Premium obuna** — 1/6/12 oylik; reklamasiz + bildirishnoma + cheksiz watchlist
- **Reklama** — AdMob banner uchun joy (`ADS_ENABLED` flag bilan boshqariladi)

## 🚀 Ishga tushirish (Expo Go — bepul, darrov)
```bash
cd plane-radar-app
npm install          # (allaqachon o'rnatilgan bo'lsa o'tkazib yuboring)
npx expo start
```
iPhone'da **Expo Go** ilovasini oching → QR kodni skanerlang.

> 2.4/5 GHz farqi yo'q — internet bo'lsa bo'ldi. Joylashuv (📍) uchun ruxsat so'raladi.

## 📦 IPA yasash (eSign uchun — Mac'siz)
Rejadagi (`../iOS-Radar-Ilova-REJA.md`) yo'l bilan:
```bash
npx expo prebuild -p ios --clean       # macOS/CI da
# GitHub Actions (macos-14) da unsigned .ipa (7-bo'lim) → eSign bilan imzolash
```
Yoki Apple Developer + `eas build -p ios`.

## 🧩 Loyiha tuzilishi
```
App.tsx                     # auth gating + navigatsiya + overlaylar
src/
  state.tsx                 # AppContext: mavzu, til, birlik, premium, watchlist, auth (+AsyncStorage)
  i18n.ts                   # 4 til lug'ati + translate()
  theme.ts                  # palitra (dark/light) + xarita ranglari
  data.ts                   # aeroportlar, aviakompaniyalar, reys generatsiyasi
  services.ts               # adsb.fi + Open-Meteo geocoding
  geo.ts                    # proyeksiya + vaqt yordamchilari
  hooks.ts                  # useAircraft (poll), useLocation (GPS)
  nav.tsx                   # navigatsiya konteksti
  components/               # RadarMap, FlagIcon, TabBar, ui (Toast, Segmented)
  screens/                  # Auth, Home, Airports, AirportDetail, FlightDetail, Saved, Profile, Subscription
```

## ⚠️ Haqiqiy vs namuna
- **Haqiqiy:** samolyotlar (adsb.fi), shahar qidiruv (Open-Meteo), i18n, mavzu, watchlist, holat saqlash.
- **Namuna (keyin ulanadi):**
  - **Xarita** — hozir uslublangan SVG "radar". Haqiqiy tayl-xarita uchun `react-native-maps` (Google Maps kaliti) yoki MapLibre qo'shiladi.
  - **Aeroport jadvali (uchish/qo'nish)** — demo generatsiya. Haqiqiy uchun jadval API'si (masalan AviationStack/OAG) ulanadi.
  - **Obuna** — mahalliy mock. Haqiqiy uchun **RevenueCat / StoreKit 2** (App Store Connect'da product'lar) — dev build kerak.
  - **Reklama** — `ADS_ENABLED` (state.tsx) va banner joyi tayyor. Haqiqiy AdMob uchun `react-native-google-mobile-ads` + dev build.

## 🔧 Sozlash nuqtalari
- `src/state.tsx`: `ADS_ENABLED`, `WATCH_FREE_LIMIT`
- `src/data.ts`: aeroportlar ro'yxati, narxlar (Subscription'da)
- `app.json`: bundle id, joylashuv ruxsati matni

## ✅ Holat
TypeScript **xatosiz** (`npx tsc --noEmit` toza). Expo Go'da ishga tayyor.
