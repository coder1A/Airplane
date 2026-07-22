// 4-language dictionary + translate helper.
export type Lang = 'uz' | 'en' | 'es' | 'ru';

export const LANG_NAMES: Record<Lang, string> = {
  uz: "O'zbekcha",
  en: 'English',
  es: 'Español',
  ru: 'Русский',
};

type Dict = Record<string, string>;

const uz: Dict = {
  searchPh: "Reys, aeroport, shahar…",
  airportSearchPh: "Aeroport nomi yoki kodi…",
  recent: 'Oxirgi qidiruvlar', results: 'Natijalar', noResults: 'Hech narsa topilmadi',
  recentEmpty: 'Oxirgi qidiruvlar shu yerda chiqadi',
  onTime: 'Vaqtida', delayed: 'Kechikish', boarding: 'Chiqishda', approx: 'Taxminan', landed: "Qo'ndi", departed: 'Uchdi', cancelled: "To'xtatilindi",
  gridCalAlt: 'Kalibrlangan balandlik', gridGS: 'Yer tezligi', gridGPS: 'GPS balandlik', gridVS: 'Vertikal tezlik', gridTAS: 'Haqiqiy havo tezligi', gridIAS: "Ko'rsatilgan (IAS)",
  apInfo: "Ma'lumot", apDep: 'Uchishlar', apArr: 'Qo’nishlar', depHead: 'Bugun · uchishlar', arrHead: 'Bugun · qo’nishlar (taxminiy)',
  infoFullName: "To'liq nom", infoIATA: 'IATA kodi', infoCity: 'Shahar', infoCountry: 'Davlat', infoToday: 'Bugungi reyslar',
  airports: 'Aeroportlar', saved: 'Saqlanganlar', flights: 'Reyslar',
  svApEmpty: "Saqlangan aeroport yo'q — aeroport oynasidagi ★ ni bosing",
  svFlEmpty: "Saqlangan reys yo'q — reys oynasidagi ★ ni bosing",
  profile: 'Profil', planFree: 'Bepul', more: "Batafsil ma'lumot",
  setAppearance: "Ko'rinish", setNotif: 'Bildirishnomalar', setUnits: "O'lchov birligi", setLangLbl: 'Til', setAbout: 'Ilova haqida', setHelp: "Yordam va qo'llab-quvvatlash",
  signout: 'Chiqish', themeDark: "Qorong'i", themeLight: "Yorug'", pickLang: 'Tilni tanlang', close: 'Yopish',
  aboutDesc: "Boshingiz uzra uchayotgan samolyotlarni real vaqtda kuzating. Reyslar, aeroportlar, jonli xarita va ogohlantirishlar.",
  notifOnT: 'Bildirishnomalar yoqildi', notifOnB: 'Kuzatilayotgan reyslar uchun ogohlantiramiz', notifOffT: "Bildirishnomalar o'chirildi",
  notif30: "SIN ga qo'nishiga 30 daqiqa qoldi", notifLanded: "SIN ga qo'ndi · Vaqtida",
  authSub: "Hisobingizga kiring yoki ro'yxatdan o'ting", authLogin: 'Kirish', authSignup: "Ro'yxatdan o'tish",
  phFirst: 'Ism', phLast: 'Familiya', phUser: 'Username', phEmail: 'Email', phLoginId: 'Username yoki email', phPass: 'Parol', phPass2: 'Parolni takrorlang',
  ruleLen: 'kamida 8 belgi', ruleUp: '1 katta harf', ruleNum: '1 raqam', ruleMatch: 'parollar mos', userTaken: 'band', userFree: "bo'sh ✓", userShort: 'qisqa',
  obuna: 'Obuna', premium: 'Premium', goPremium: "Premium'ga o'ting", subDesc: 'Reklamasiz, bildirishnomalar va cheksiz watchlist',
  benAdFree: 'Reklamasiz foydalanish', benNotif: 'Reys bildirishnomalari', benWatch: 'Cheksiz saqlanganlar',
  plan1: '1 oylik', plan6: '6 oylik', plan12: 'Yillik', planBest: 'Eng foydali', subBtn: 'Obunani rasmiylashtirish', subActive: 'Premium faol',
  reklama: 'Reklama', adText: 'Bu yerda reklama', needWatch: '5 tadan ortiq saqlash uchun Premium kerak', needNotif: 'Bildirishnomalar — Premium funksiyasi', premiumOn: 'Premium faollashtirildi',
  cityMe: 'Joriy joylashuv', noPlanes: 'Atrofda samolyot topilmadi', locErr: "Joylashuvni aniqlab bo'lmadi",
};

const en: Dict = {
  searchPh: 'Flight, airport, city…', airportSearchPh: 'Airport name or code…',
  recent: 'Recent searches', results: 'Results', noResults: 'Nothing found', recentEmpty: 'Recent searches appear here',
  onTime: 'On time', delayed: 'Delayed', boarding: 'Boarding', approx: 'Approx.', landed: 'Landed', departed: 'Departed', cancelled: 'Cancelled',
  gridCalAlt: 'Calibrated altitude', gridGS: 'Ground speed', gridGPS: 'GPS altitude', gridVS: 'Vertical speed', gridTAS: 'True airspeed', gridIAS: 'Indicated (IAS)',
  apInfo: 'Info', apDep: 'Departures', apArr: 'Arrivals', depHead: 'Today · departures', arrHead: 'Today · arrivals (est.)',
  infoFullName: 'Full name', infoIATA: 'IATA code', infoCity: 'City', infoCountry: 'Country', infoToday: 'Flights today',
  airports: 'Airports', saved: 'Saved', flights: 'Flights',
  svApEmpty: 'No saved airports — tap ★ on an airport', svFlEmpty: 'No saved flights — tap ★ on a flight',
  profile: 'Profile', planFree: 'Free', more: 'More details',
  setAppearance: 'Appearance', setNotif: 'Notifications', setUnits: 'Units', setLangLbl: 'Language', setAbout: 'About', setHelp: 'Help & support',
  signout: 'Sign out', themeDark: 'Dark', themeLight: 'Light', pickLang: 'Choose language', close: 'Close',
  aboutDesc: 'Track flights overhead in real time. Flights, airports, a live map and alerts.',
  notifOnT: 'Notifications on', notifOnB: "We'll alert you about tracked flights", notifOffT: 'Notifications off',
  notif30: 'Landing at SIN in 30 minutes', notifLanded: 'Landed at SIN · On time',
  authSub: 'Sign in or create an account', authLogin: 'Sign in', authSignup: 'Sign up',
  phFirst: 'First name', phLast: 'Last name', phUser: 'Username', phEmail: 'Email', phLoginId: 'Username or email', phPass: 'Password', phPass2: 'Repeat password',
  ruleLen: 'at least 8 chars', ruleUp: '1 uppercase', ruleNum: '1 number', ruleMatch: 'passwords match', userTaken: 'taken', userFree: 'available ✓', userShort: 'too short',
  obuna: 'Subscription', premium: 'Premium', goPremium: 'Go Premium', subDesc: 'Ad-free, notifications and unlimited watchlist',
  benAdFree: 'Ad-free experience', benNotif: 'Flight notifications', benWatch: 'Unlimited saved items',
  plan1: '1 month', plan6: '6 months', plan12: '1 year', planBest: 'Best value', subBtn: 'Subscribe', subActive: 'Premium active',
  reklama: 'Ad', adText: 'Your ad here', needWatch: 'Premium needed to save more than 5', needNotif: 'Notifications are a Premium feature', premiumOn: 'Premium activated',
  cityMe: 'Current location', noPlanes: 'No aircraft nearby', locErr: 'Could not get location',
};

const es: Dict = {
  searchPh: 'Vuelo, aeropuerto, ciudad…', airportSearchPh: 'Nombre o código…',
  recent: 'Búsquedas recientes', results: 'Resultados', noResults: 'Sin resultados', recentEmpty: 'Aquí aparecen las búsquedas',
  onTime: 'A tiempo', delayed: 'Retrasado', boarding: 'Embarque', approx: 'Aprox.', landed: 'Aterrizó', departed: 'Despegó', cancelled: 'Cancelado',
  gridCalAlt: 'Altitud calibrada', gridGS: 'Vel. en tierra', gridGPS: 'Altitud GPS', gridVS: 'Vel. vertical', gridTAS: 'Vel. verdadera', gridIAS: 'Indicada (IAS)',
  apInfo: 'Info', apDep: 'Salidas', apArr: 'Llegadas', depHead: 'Hoy · salidas', arrHead: 'Hoy · llegadas (est.)',
  infoFullName: 'Nombre completo', infoIATA: 'Código IATA', infoCity: 'Ciudad', infoCountry: 'País', infoToday: 'Vuelos hoy',
  airports: 'Aeropuertos', saved: 'Guardados', flights: 'Vuelos',
  svApEmpty: 'Sin aeropuertos — pulsa ★ en un aeropuerto', svFlEmpty: 'Sin vuelos — pulsa ★ en un vuelo',
  profile: 'Perfil', planFree: 'Gratis', more: 'Más detalles',
  setAppearance: 'Apariencia', setNotif: 'Notificaciones', setUnits: 'Unidades', setLangLbl: 'Idioma', setAbout: 'Acerca de', setHelp: 'Ayuda y soporte',
  signout: 'Cerrar sesión', themeDark: 'Oscuro', themeLight: 'Claro', pickLang: 'Elegir idioma', close: 'Cerrar',
  aboutDesc: 'Sigue los vuelos sobre ti en tiempo real. Vuelos, aeropuertos, mapa en vivo y alertas.',
  notifOnT: 'Notificaciones activadas', notifOnB: 'Te avisaremos de tus vuelos', notifOffT: 'Notificaciones desactivadas',
  notif30: 'Aterriza en SIN en 30 min', notifLanded: 'Aterrizó en SIN · A tiempo',
  authSub: 'Inicia sesión o regístrate', authLogin: 'Entrar', authSignup: 'Registrarse',
  phFirst: 'Nombre', phLast: 'Apellido', phUser: 'Usuario', phEmail: 'Correo', phLoginId: 'Usuario o correo', phPass: 'Contraseña', phPass2: 'Repite la contraseña',
  ruleLen: 'mín. 8 caracteres', ruleUp: '1 mayúscula', ruleNum: '1 número', ruleMatch: 'coinciden', userTaken: 'ocupado', userFree: 'libre ✓', userShort: 'muy corto',
  obuna: 'Suscripción', premium: 'Premium', goPremium: 'Hazte Premium', subDesc: 'Sin anuncios, notificaciones e ilimitado',
  benAdFree: 'Sin anuncios', benNotif: 'Notificaciones de vuelos', benWatch: 'Guardados ilimitados',
  plan1: '1 mes', plan6: '6 meses', plan12: '1 año', planBest: 'Mejor precio', subBtn: 'Suscribirse', subActive: 'Premium activo',
  reklama: 'Anuncio', adText: 'Tu anuncio aquí', needWatch: 'Premium para guardar más de 5', needNotif: 'Notificaciones es Premium', premiumOn: 'Premium activado',
  cityMe: 'Ubicación actual', noPlanes: 'Sin aviones cerca', locErr: 'No se pudo obtener la ubicación',
};

const ru: Dict = {
  searchPh: 'Рейс, аэропорт, город…', airportSearchPh: 'Название или код…',
  recent: 'Недавние', results: 'Результаты', noResults: 'Ничего не найдено', recentEmpty: 'Здесь появятся недавние',
  onTime: 'Вовремя', delayed: 'Задержка', boarding: 'Посадка', approx: 'Прибл.', landed: 'Приземлился', departed: 'Вылетел', cancelled: 'Отменён',
  gridCalAlt: 'Калибр. высота', gridGS: 'Путевая скорость', gridGPS: 'GPS высота', gridVS: 'Верт. скорость', gridTAS: 'Истинная скорость', gridIAS: 'Приборная (IAS)',
  apInfo: 'Инфо', apDep: 'Вылеты', apArr: 'Прилёты', depHead: 'Сегодня · вылеты', arrHead: 'Сегодня · прилёты (прибл.)',
  infoFullName: 'Полное название', infoIATA: 'Код IATA', infoCity: 'Город', infoCountry: 'Страна', infoToday: 'Рейсов сегодня',
  airports: 'Аэропорты', saved: 'Сохранённые', flights: 'Рейсы',
  svApEmpty: 'Нет аэропортов — нажмите ★ у аэропорта', svFlEmpty: 'Нет рейсов — нажмите ★ у рейса',
  profile: 'Профиль', planFree: 'Бесплатно', more: 'Подробнее',
  setAppearance: 'Оформление', setNotif: 'Уведомления', setUnits: 'Единицы', setLangLbl: 'Язык', setAbout: 'О приложении', setHelp: 'Помощь и поддержка',
  signout: 'Выйти', themeDark: 'Тёмная', themeLight: 'Светлая', pickLang: 'Выберите язык', close: 'Закрыть',
  aboutDesc: 'Отслеживайте самолёты над вами в реальном времени. Рейсы, аэропорты, живая карта и оповещения.',
  notifOnT: 'Уведомления включены', notifOnB: 'Оповестим о ваших рейсах', notifOffT: 'Уведомления выключены',
  notif30: 'Посадка в SIN через 30 минут', notifLanded: 'Приземлился в SIN · Вовремя',
  authSub: 'Войдите или зарегистрируйтесь', authLogin: 'Войти', authSignup: 'Регистрация',
  phFirst: 'Имя', phLast: 'Фамилия', phUser: 'Имя пользователя', phEmail: 'Email', phLoginId: 'Имя пользователя или email', phPass: 'Пароль', phPass2: 'Повторите пароль',
  ruleLen: 'не менее 8 символов', ruleUp: '1 заглавная', ruleNum: '1 цифра', ruleMatch: 'пароли совпадают', userTaken: 'занято', userFree: 'свободно ✓', userShort: 'коротко',
  obuna: 'Подписка', premium: 'Premium', goPremium: 'Оформить Premium', subDesc: 'Без рекламы, уведомления и безлимит',
  benAdFree: 'Без рекламы', benNotif: 'Уведомления о рейсах', benWatch: 'Безлимитные сохранения',
  plan1: '1 месяц', plan6: '6 месяцев', plan12: '1 год', planBest: 'Выгоднее всего', subBtn: 'Оформить подписку', subActive: 'Premium активен',
  reklama: 'Реклама', adText: 'Здесь реклама', needWatch: 'Premium нужен для 5+ сохранений', needNotif: 'Уведомления — функция Premium', premiumOn: 'Premium активирован',
  cityMe: 'Текущее местоположение', noPlanes: 'Рядом нет самолётов', locErr: 'Не удалось определить местоположение',
};

export const DICT: Record<Lang, Dict> = { uz, en, es, ru };

export function translate(lang: Lang, key: string): string {
  return DICT[lang]?.[key] ?? DICT.uz[key] ?? key;
}
