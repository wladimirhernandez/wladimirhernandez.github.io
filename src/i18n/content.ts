/**
 * Localized content: profile copy, experience and projects per language.
 * English is the source; Spanish adds overrides (experience `es` field,
 * `projects-es` collection), and missing translations fail the build.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { profile, yearsOfExperience, type EducationId } from '../data/profile';
import { dateLocale, type Lang } from './ui';

const since = profile.careerStart.slice(0, 4);
const years = yearsOfExperience();

interface ProfileCopy {
  /** Meta description. */
  summary: string;
  heroLine: (firstName: string) => { before: string; after: string };
  heroLead: string;
  /** About h1: name + `aboutLead`. */
  aboutLead: string;
  /** About profile paragraph, adapted from the CV's professional profile. */
  aboutProfile: string;
  degrees: Record<EducationId, string>;
  inProgress: string;
  spokenLanguages: { language: string; level: string }[];
}

export const profileText: Record<Lang, ProfileCopy> = {
  en: {
    summary: `Product Engineer and Senior Full Stack Developer with ${years}+ years of commercial experience building, scaling and optimizing digital products, e-commerce platforms and enterprise applications.`,
    heroLine: (firstName) => ({
      before: `I'm ${firstName}, a `,
      after: ' crafting storefronts, real-time tools and game-inspired interfaces.',
    }),
    heroLead: `${years}+ years building for the web, since ${since}. Below is some of my most recent work.`,
    aboutLead: ` is a Product Engineer and Senior Full Stack Developer with ${years}+ years of commercial experience building, scaling and optimizing digital products.`,
    aboutProfile:
      'A systems engineer who has been coding, self-taught, since the age of 14. I connect business goals, conversion and user experience (UI/UX, technical SEO, Core Web Vitals) with high-performance software: from advanced Shopify ecosystems (Rust/WebAssembly extensions, API integrations and custom checkout logic) to backend microservices (Java Spring Boot, Node.js), modern interfaces (Angular, Vue.js, React), cloud infrastructure (AWS, Docker) and intelligent automation with AI and RPA.',
    degrees: {
      masters: "Master's in Educational Guidance (research in applied AI)",
      'systems-engineering': 'Systems Engineering',
    },
    inProgress: 'In progress',
    spokenLanguages: [
      { language: 'Spanish', level: 'Native' },
      { language: 'English', level: 'B2 (professional)' },
    ],
  },
  es: {
    summary: `Product Engineer y Senior Full Stack Developer con más de ${years} años de experiencia comercial creando, escalando y optimizando productos digitales, plataformas de e-commerce y aplicaciones empresariales.`,
    heroLine: (firstName) => ({
      before: `Soy ${firstName}, `,
      after: ', y creo tiendas en línea, herramientas en tiempo real e interfaces inspiradas en videojuegos.',
    }),
    heroLead: `Más de ${years} años construyendo para la web, desde ${since}. Aquí abajo está parte de mi trabajo más reciente.`,
    aboutLead: ` es Product Engineer y Senior Full Stack Developer, con más de ${years} años de experiencia comercial creando, escalando y optimizando productos digitales.`,
    aboutProfile:
      'Ingeniero de Sistemas que programa de forma autodidacta desde los 14 años. Conecto objetivos de negocio, conversión y experiencia de usuario (UI/UX, SEO técnico, Core Web Vitals) con software de alto rendimiento: desde ecosistemas avanzados en Shopify (extensiones en Rust/WebAssembly, integraciones de APIs y lógica personalizada de checkout) hasta microservicios backend (Java Spring Boot, Node.js), interfaces modernas (Angular, Vue.js, React), infraestructura cloud (AWS, Docker) y automatización inteligente con IA y RPA.',
    degrees: {
      masters: 'Maestría en Orientación Educativa (investigación en IA aplicada)',
      'systems-engineering': 'Ingeniería de Sistemas',
    },
    inProgress: 'En curso',
    spokenLanguages: [
      { language: 'Español', level: 'Nativo' },
      { language: 'Inglés', level: 'B2 (profesional)' },
    ],
  },
};

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
      if (entry.es.highlights.length !== entry.highlights.length) {
        throw new Error(`Spanish highlights for experience "${entry.id}" do not match the English ones`);
      }
      return { ...entry, company: entry.es.company ?? entry.company, role: entry.es.role, highlights: entry.es.highlights };
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
