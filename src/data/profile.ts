/**
 * Personal profile shown on the about page and in the site metadata.
 * Source: the user's CV (English), with the current role confirmed on 2026-11-07.
 * The phone number is intentionally left out because the site is public.
 */
export const profile = {
  name: 'Wladimir Hernández',
  role: 'Product Engineer',
  location: 'Barinas, Venezuela (UTC−4)',
  /** First professional role (Barbers Cloud, 2018-08); drives "years of experience". */
  careerStart: '2018-08',
  summary:
    'Full-stack developer building scalable web applications and automating business processes since 2018, with a track record of shipping projects for startups and digital agencies.',
  contact: {
    email: 'wladimirhernandezdev@gmail.com',
    linkedin: 'https://www.linkedin.com/in/wladimir-hernandez',
    github: 'https://github.com/wladimirhernandez',
  },
  /**
   * Current stack from the user's recent repositories (approved 2026-11-07),
   * plus Angular and Java (Spring Boot), six years of the user's career, and NestJS.
   */
  skills: {
    shopify: [
      'Online Store 2.0 themes (Liquid, Horizon)',
      'Apps (React Router, Polaris, App Bridge)',
      'Functions',
      'Theme app extensions',
      'Metafields and metaobjects',
    ],
    frontend: ['TypeScript', 'Angular', 'React', 'Next.js', 'Astro', 'Tailwind CSS', 'GSAP'],
    backend: ['Java (Spring Boot)', 'Node.js', 'NestJS', 'Prisma', '.NET (C#, WPF)', 'C++'],
    quality: ['Playwright', 'Vitest', 'Accessibility (WCAG 2.2 AA)'],
    tools: ['Git', 'GitHub Actions', 'Docker', 'AI-assisted development'],
  },
  spokenLanguages: [
    { language: 'Spanish', level: 'Native' },
    { language: 'English', level: 'B2 (upper intermediate)' },
  ],
  education: {
    institution: 'Universidad Nacional Experimental Politécnica de la Fuerza Armada Nacional Bolivariana',
    degree: 'Systems Engineering',
    location: 'Barinas, Venezuela',
    start: '2012-09',
    end: '2018-07',
  },
} as const;

/** Full years since the first professional role, computed at build time. */
export function yearsOfExperience(now: Date = new Date()): number {
  const [year, month] = profile.careerStart.split('-').map(Number);
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.floor(months / 12);
}
