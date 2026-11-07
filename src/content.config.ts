import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
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
    })
    .refine((entry) => entry.end === null || entry.end >= entry.start, {
      message: 'end must not be earlier than start',
      path: ['end'],
    }),
});

export const collections = { experience };
