/**
 * Personal profile shown on the about page and in the site metadata.
 * Source: the user's CV (English), with the current role confirmed on 2026-11-07.
 * The phone number is intentionally left out because the site is public.
 */
export const profile = {
  name: 'Wladimir Hernández',
  role: 'Product Engineer',
  location: 'Barinas, Venezuela (UTC−4)',
  /** Started coding at 14; the user was 31 in 2026, so 2026 - 17 = 2009. */
  codingStartAge: 14,
  codingSince: 2009,
  summary:
    'Product engineer who has been writing code since the age of 14, building scalable web applications and automating business processes for startups and digital agencies.',
  contact: {
    email: 'wladimirhernandezdev@gmail.com',
    linkedin: 'https://www.linkedin.com/in/wladimir-hernandez',
    github: 'https://github.com/wladimirhernandez',
  },
  skills: {
    languages: ['JavaScript', 'TypeScript', 'Java', 'Python'],
    frameworks: ['Angular', 'React', 'Node.js', 'Spring Boot', 'Selenium'],
    databases: ['MySQL', 'MongoDB'],
    testing: ['Jest', 'TestNG', 'JUnit'],
    tools: ['Git', 'Docker', 'Jira', 'SonarQube', 'Jenkins', 'Bitbucket'],
  },
  spokenLanguages: [
    { language: 'Spanish', level: 'Native' },
    { language: 'English', level: 'Intermediate' },
  ],
  education: {
    institution: 'Universidad Nacional Experimental Politécnica de la Fuerza Armada Nacional Bolivariana',
    degree: 'Systems Engineering',
    location: 'Barinas, Venezuela',
    start: '2012-09',
    end: '2018-07',
  },
  certifications: [
    { name: 'Career in JavaScript Development', issuer: 'Platzi', year: 2018 },
    { name: 'Frontend Architecture Career', issuer: 'Platzi', year: 2020 },
    { name: 'JavaScript Algorithms and Data Structures', issuer: 'freeCodeCamp', year: 2023 },
    { name: 'Angular Certification', issuer: 'HackerRank', year: 2023 },
  ],
} as const;

/** Years writing code (since age 14), computed at build time so it stays current. */
export function yearsCoding(now: Date = new Date()): number {
  return now.getFullYear() - profile.codingSince;
}
