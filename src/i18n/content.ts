/**
 * Localized content: profile copy, experience and projects per language.
 * English is the source; Spanish adds overrides (experience `es` field,
 * `projects-es` collection), and missing translations fail the build.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { profile, yearsOfExperience } from '../data/profile';
import { dateLocale, type Lang } from './ui';

const since = profile.careerStart.slice(0, 4);

export const profileText = {
  en: {
    summary: profile.summary,
    heroLine: (firstName: string) => ({
      before: `I'm ${firstName}, a `,
      after: ' crafting storefronts, real-time tools and game-inspired interfaces.',
    }),
    heroLead: `${yearsOfExperience()}+ years building for the web, since ${since}. Below is some of my most recent work.`,
    aboutLead: {
      before: ' is a ',
      after: ' building scalable web applications and automating business processes since 2018, shipping projects for startups and digital agencies.',
    },
    degree: profile.education.degree,
    spokenLanguages: profile.spokenLanguages,
  },
  es: {
    summary:
      'Desarrollador full-stack que crea aplicaciones web escalables y automatiza procesos de negocio desde 2018, con proyectos entregados para startups y agencias digitales.',
    heroLine: (firstName: string) => ({
      before: `Soy ${firstName}, `,
      after: ', y creo tiendas en línea, herramientas en tiempo real e interfaces inspiradas en videojuegos.',
    }),
    heroLead: `Más de ${yearsOfExperience()} años construyendo para la web, desde ${since}. Aquí abajo está parte de mi trabajo más reciente.`,
    aboutLead: {
      before: ' es ',
      after: ' y desde 2018 crea aplicaciones web escalables y automatiza procesos de negocio, con proyectos entregados para startups y agencias digitales.',
    },
    degree: 'Ingeniería de Sistemas',
    spokenLanguages: [
      { language: 'Español', level: 'Nativo' },
      { language: 'Inglés', level: 'B2 (intermedio alto)' },
    ],
  },
} as const satisfies Record<Lang, unknown>;

/** "2022-10" -> "Oct 2022" / "oct 2022". */
export function formatMonth(lang: Lang, value: string): string {
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat(dateLocale[lang], { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

export async function getExperience(lang: Lang) {
  const entries = (await getCollection('experience')).map((entry) => entry.data);
  return entries
    .sort((a, b) => b.start.localeCompare(a.start))
    .map((entry) => {
      if (lang === 'en') return entry;
      if (!entry.es) throw new Error(`Missing Spanish translation for experience "${entry.id}"`);
      return { ...entry, role: entry.es.role, highlights: entry.es.highlights };
    });
}

export interface LocalizedProject {
  id: string;
  data: CollectionEntry<'projects'>['data'];
  /** Entry whose Markdown body is rendered for this language. */
  body: CollectionEntry<'projects'> | CollectionEntry<'projectsEs'>;
}

export async function getProjects(lang: Lang): Promise<LocalizedProject[]> {
  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  if (lang === 'en') return projects.map((project) => ({ id: project.id, data: project.data, body: project }));

  const translations = new Map((await getCollection('projectsEs')).map((entry) => [entry.id, entry]));
  return projects.map((project) => {
    const es = translations.get(project.id);
    if (!es) throw new Error(`Missing Spanish translation: src/content/projects-es/${project.id}.md`);
    if (es.data.galleryAlts.length !== project.data.gallery.length) {
      throw new Error(`projects-es/${project.id}.md needs one galleryAlts entry per gallery image`);
    }
    return {
      id: project.id,
      data: {
        ...project.data,
        tagline: es.data.tagline,
        cardAlt: es.data.cardAlt,
        heroAlt: es.data.heroAlt,
        gallery: project.data.gallery.map((item, index) => ({ ...item, alt: es.data.galleryAlts[index] })),
      },
      body: es,
    };
  });
}
