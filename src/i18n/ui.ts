/**
 * Interface strings and locale helpers. English lives at `/`, Spanish at `/es/`
 * (see the `i18n` block in astro.config.mjs).
 */
export const languages = { en: 'English', es: 'Español' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';
export const langs = Object.keys(languages) as Lang[];

/** Key under which the visitor's explicit language choice is stored. */
export const LANG_STORAGE_KEY = 'lang';

const ui = {
  en: {
    'nav.primary': 'Primary',
    'nav.home': 'home',
    'nav.about': 'About',
    'nav.back': 'Back to home',
    'lang.switch': 'Ver en español',
    'view.toList': 'Show projects as a list',
    'view.toGrid': 'Show projects as a grid',
    'home.recent': 'Recent work',
    'card.tags': 'Tags',
    'flag.Featured': 'Featured',
    'flag.New': 'New',
    'work.year': 'Year',
    'work.client': 'Client',
    'work.visit': 'Visit site',
    'work.github': 'View on GitHub',
    'work.newTab': '(opens in a new tab)',
    'work.gallery': 'Gallery',
    'work.more': 'More recent work',
    'work.home': 'Return home',
    'about.title': 'About',
    'about.currentRole': 'Current role',
    'about.experience': 'Experience',
    'about.skills': 'Skills',
    'about.education': 'Education',
    'about.languages': 'Languages',
    'about.contact': 'Contact',
    'about.closing': "Let's build something.",
    'about.present': 'Present',
    'skills.product': 'Product and e-commerce',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend and cloud',
    'skills.ai': 'AI, automation and QA',
    'skills.data': 'Databases and management',
    'skills.desktop': 'Desktop and game UI',
  },
  es: {
    'nav.primary': 'Principal',
    'nav.home': 'inicio',
    'nav.about': 'Sobre mí',
    'nav.back': 'Volver al inicio',
    'lang.switch': 'View in English',
    'view.toList': 'Mostrar los proyectos como lista',
    'view.toGrid': 'Mostrar los proyectos como cuadrícula',
    'home.recent': 'Trabajo reciente',
    'card.tags': 'Etiquetas',
    'flag.Featured': 'Destacado',
    'flag.New': 'Nuevo',
    'work.year': 'Año',
    'work.client': 'Cliente',
    'work.visit': 'Ver el sitio',
    'work.github': 'Ver en GitHub',
    'work.newTab': '(se abre en una pestaña nueva)',
    'work.gallery': 'Galería',
    'work.more': 'Más trabajo reciente',
    'work.home': 'Volver al inicio',
    'about.title': 'Sobre mí',
    'about.currentRole': 'Puesto actual',
    'about.experience': 'Experiencia',
    'about.skills': 'Habilidades',
    'about.education': 'Formación',
    'about.languages': 'Idiomas',
    'about.contact': 'Contacto',
    'about.closing': 'Construyamos algo.',
    'about.present': 'Actualidad',
    'skills.product': 'Producto y e-commerce',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend y cloud',
    'skills.ai': 'IA, automatización y QA',
    'skills.data': 'Bases de datos y gestión',
    'skills.desktop': 'Escritorio e interfaces de juego',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UiKey = keyof (typeof ui)['en'];

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key];
}

export function isLang(value: string | undefined): value is Lang {
  return value !== undefined && value in languages;
}

/** Language of a URL: `/es` and `/es/...` are Spanish, everything else English. */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return isLang(first) ? first : defaultLang;
}

/** Path without its language prefix, e.g. `/es/about/` -> `/about/`. */
export function stripLang(path: string): string {
  const stripped = path.replace(/^\/(es)(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/** The same page in another language, e.g. ('es', '/about') -> '/es/about'. */
export function localizePath(lang: Lang, path: string): string {
  const clean = stripLang(path.startsWith('/') ? path : `/${path}`);
  if (lang === defaultLang) return clean;
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
}

/** BCP 47 locale used for dates. */
export const dateLocale: Record<Lang, string> = { en: 'en-US', es: 'es-ES' };
