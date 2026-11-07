// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// User site (wladimirhernandez.github.io), so no `base` is needed.
export default defineConfig({
  site: 'https://wladimirhernandez.github.io',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
