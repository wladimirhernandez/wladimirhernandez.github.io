import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Year and month, e.g. "2022-10". */
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use the YYYY-MM format');

const experience = defineCollection({
  loader: file('src/data/experience.json'),
  schema: z
    .object({
      id: z.string(),
      company: z.string(),
      role: z.string(),
      start: yearMonth,
      /** `null` means the role is current. */
      end: yearMonth.nullable(),
      highlights: z.array(z.string()),
      stack: z.array(z.string()),
      /** Spanish role and highlights (required by the /es/ pages); company only when it differs. */
      es: z.object({ company: z.string().optional(), role: z.string(), highlights: z.array(z.string()) }).optional(),
    })
    .refine((entry) => entry.end === null || entry.end >= entry.start, {
      message: 'end must not be earlier than start',
      path: ['end'],
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        tagline: z.string(),
        kind: z.enum(['agency', 'personal']),
        /** Agency projects show the client; personal projects omit it. */
        client: z.string().optional(),
        year: z.number().int().min(2018),
        tags: z.array(z.string()).min(1),
        url: z.url().optional(),
        repo: z.url().optional(),
        /** Portrait (3:5) image for the home grid card. */
        card: image(),
        cardAlt: z.string(),
        /** CSS object-position for cropping the card image. */
        cardPosition: z.string().default('center'),
        /** Wide image for the top of the project page. */
        hero: image(),
        heroAlt: z.string(),
        gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
        flag: z.enum(['Featured', 'New']).optional(),
        /** Position in the grid, lowest first. */
        order: z.number().int(),
      })
      .refine((project) => project.kind === 'personal' || project.client, {
        message: 'agency projects need a client',
        path: ['client'],
      }),
});

/**
 * Spanish copy for each project, matched by file name to `projects`:
 * translated text fields plus the Markdown body. Shared data (images, links,
 * tags, order) stays in the English entry.
 */
const projectsEs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects-es' }),
  schema: z.object({
    tagline: z.string(),
    cardAlt: z.string(),
    heroAlt: z.string(),
    /** One alt per gallery image, in the same order as the English entry. */
    galleryAlts: z.array(z.string()).default([]),
  }),
});

export const collections = { experience, projects, projectsEs };
