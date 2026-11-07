/**
 * Personal profile shown on the about page and in the site metadata.
 * Source: the user's Spanish CV ("CV Profesional - Español", 2026-11-07). The
 * site lists the user's whole range (C++, .NET, game UI) on top of the CV, at
 * the user's request. The phone number is left out because the site is public.
 * Language-specific copy lives in src/i18n/content.ts.
 */
export const profile = {
  name: 'Wladimir Hernández',
  role: 'Product Engineer',
  headline: 'Product Engineer | Senior Full Stack Developer',
  location: 'Barinas, Venezuela (UTC−4)',
  /** First professional role (Weibook, formerly Barbers Cloud, 2018-08); drives "years of experience". */
  careerStart: '2018-08',
  contact: {
    email: 'wladimirhernandezdev@gmail.com',
    linkedin: 'https://www.linkedin.com/in/wladimir-hernandez',
    github: 'https://github.com/wladimirhernandez',
  },
  /** Skill groups; labels are translated through `skills.<key>` in src/i18n/ui.ts. */
  skills: {
    product: [
      'Shopify (Liquid, Functions, custom apps, APIs)',
      'Rust (WebAssembly / WASI)',
      'Technical SEO',
      'Core Web Vitals',
      'UI/UX optimization',
      'Accessibility (WCAG 2.2 AA)',
    ],
    frontend: [
      'Angular',
      'TypeScript',
      'JavaScript (ES6+)',
      'Vue.js',
      'React',
      'Next.js',
      'Astro',
      'Ionic',
      'Tailwind CSS',
      'GSAP',
      'HTML5 / CSS3',
    ],
    backend: [
      'Java',
      'Spring Boot',
      'Node.js (NestJS)',
      'Python (FastAPI)',
      'PHP (Laravel)',
      'Prisma',
      'Microservices',
      'REST APIs',
      'AWS (Lambda, S3)',
      'Docker',
      'CI/CD (Jenkins, GitHub Actions)',
    ],
    ai: [
      'AI-assisted development and agent workflows (Gemini, Claude Code)',
      'RPA (Selenium)',
      'Playwright',
      'Vitest',
      'JUnit',
      'Jest',
      'TestNG',
      'SonarQube',
    ],
    data: ['MySQL', 'PostgreSQL', 'MongoDB', 'Supabase', 'Jira', 'Notion', 'Scrum'],
    desktop: ['C++', 'C# (.NET, WPF)', 'NoesisGUI (XAML)'],
  },
  education: [
    {
      id: 'masters',
      institution: 'Universidad Nacional Experimental de los Llanos Occidentales "Ezequiel Zamora" (UNELLEZ)',
      location: 'Barinas, Venezuela',
      start: null,
      end: null,
    },
    {
      id: 'systems-engineering',
      institution: 'Universidad Nacional Experimental Politécnica de la Fuerza Armada Nacional Bolivariana (UNEFA)',
      location: 'Barinas, Venezuela',
      start: '2012-09',
      end: '2018-07',
    },
  ],
  /**
   * Certifications, newest first. AWS: completion certificate and class
   * confirmation (2023-06-06); its old transcript link now redirects to the
   * Skill Builder home page, so no link. freeCodeCamp: verified on its public
   * page (issued 2023-03-27, about 300 hours).
   */
  certifications: [
    {
      name: 'AWS Partner: Sales Accreditation (Business)',
      issuer: 'Amazon Web Services',
      date: '2023-06',
      credentialId: 'SyRQCOPMfU6_4K9XdkLYcw2',
    },
    {
      name: 'JavaScript Algorithms and Data Structures (Legacy V7)',
      issuer: 'freeCodeCamp',
      date: '2023-03',
      url: 'https://www.freecodecamp.org/certification/fcc57bf97ea-6af8-4128-91be-3841ca763c3a/javascript-algorithms-and-data-structures',
    },
  ],
} as const;

export type EducationId = (typeof profile.education)[number]['id'];

/** Full years since the first professional role, computed at build time. */
export function yearsOfExperience(now: Date = new Date()): number {
  const [year, month] = profile.careerStart.split('-').map(Number);
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.floor(months / 12);
}
