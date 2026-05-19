// Logos: guarda los archivos en src/assets/logos/ con estos nombres exactos
// y descomenta las importaciones cuando los tengas listos.
// import argentinaLogo from '../assets/logos/argentina.png'
// import chileLogo     from '../assets/logos/chile.png'
// import ecuadorLogo   from '../assets/logos/ecuador.png'

export const COUNTRIES = {
  argentina: {
    slug: 'argentina',
    name: 'Argentina',
    flag: '🇦🇷',
    logo: null, // reemplaza null por argentinaLogo al agregar el archivo
    i1: 'A', i2: 'R',
    c1: '#E8305A', c2: '#F47B3E', c3: '#3AB8D4',
    accent: '#3AB8D4',
    accentDark: '#0b2b50',
    cardBg: 'linear-gradient(155deg, #040e1c 0%, #071b36 55%, #0b2b50 100%)',
    heroBg: 'linear-gradient(135deg, #040e1c 0%, #082540 45%, #3AB8D4 100%)',
    heroOverlay: 'linear-gradient(160deg, rgba(4,14,28,0.96) 0%, rgba(7,27,54,0.88) 60%, rgba(58,184,212,0.3) 100%)',
    navBg: 'rgba(4,14,28,0.92)',
    sectionBg: '#f0f8fb',
    tagline: 'Argentina Comparte',
    desc: 'Conectamos comunidades argentinas para construir un futuro más justo y solidario.',
    values: ['Solidaridad', 'Identidad', 'Progreso'],
  },
  chile: {
    slug: 'chile',
    name: 'Chile',
    flag: '🇨🇱',
    logo: null, // reemplaza null por chileLogo al agregar el archivo
    i1: 'C', i2: 'H',
    c1: '#E8305A', c2: '#F47B3E', c3: '#7B2D8B',
    accent: '#E8305A',
    accentDark: '#420d1c',
    cardBg: 'linear-gradient(155deg, #130305 0%, #2c0810 55%, #420d1c 100%)',
    heroBg: 'linear-gradient(135deg, #130305 0%, #3d0c18 45%, #E8305A 100%)',
    heroOverlay: 'linear-gradient(160deg, rgba(19,3,5,0.96) 0%, rgba(44,8,16,0.88) 60%, rgba(232,48,90,0.3) 100%)',
    navBg: 'rgba(19,3,5,0.92)',
    sectionBg: '#fdf0f2',
    tagline: 'Chile Comparte',
    desc: 'Unimos a chilenas y chilenos bajo un propósito transformador de impacto real.',
    values: ['Comunidad', 'Innovación', 'Impacto'],
  },
  ecuador: {
    slug: 'ecuador',
    name: 'Ecuador',
    flag: '🇪🇨',
    logo: null, // reemplaza null por ecuadorLogo al agregar el archivo
    i1: 'E', i2: 'C',
    c1: '#FFD100', c2: '#F47B3E', c3: '#3AB8D4',
    accent: '#FFD100',
    accentDark: '#3a2c00',
    cardBg: 'linear-gradient(155deg, #100d00 0%, #251c00 55%, #3a2c00 100%)',
    heroBg: 'linear-gradient(135deg, #100d00 0%, #2e2000 45%, #FFD100 100%)',
    heroOverlay: 'linear-gradient(160deg, rgba(16,13,0,0.96) 0%, rgba(37,28,0,0.88) 60%, rgba(255,209,0,0.25) 100%)',
    navBg: 'rgba(16,13,0,0.92)',
    sectionBg: '#fdfbf0',
    tagline: 'Ecuador Comparte',
    desc: 'Impulsamos el potencial ecuatoriano desde la colaboración y la solidaridad.',
    values: ['Propósito', 'Territorio', 'Unión'],
  },
}

export function getCountry(slug) {
  return COUNTRIES[slug] ?? null
}

export const COUNTRY_LIST = Object.values(COUNTRIES)
