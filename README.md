# Wladimir Hernandez — Portfolio

Personal portfolio built with [Astro](https://astro.build), Tailwind CSS v4 and GSAP. Deployed to GitHub Pages at <https://wladimirhernandez.github.io>.

## Requirements

- Node.js 22.23.4 or newer (see `.nvmrc`)

## Commands

| Command           | Action                                        |
| ----------------- | --------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Start the dev server at `localhost:4321`      |
| `npm run check`   | Type-check the project                        |
| `npm run build`   | Type-check and build the static site to `dist/` |
| `npm run preview` | Preview the production build locally          |

## Deploy

Every push to `master` builds and deploys the site through `.github/workflows/deploy.yml` (official Astro GitHub Pages action).
