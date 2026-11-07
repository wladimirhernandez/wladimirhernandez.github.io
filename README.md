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

## Fonts

The site uses [Switzer](https://www.fontshare.com/fonts/switzer) under the ITF Free Font License, which allows self-hosting but not publishing the font files in a public repository. They are therefore gitignored: `scripts/fetch-fonts.mjs` downloads them from Fontshare into `public/fonts/` before `dev` and `build` (run it alone with `npm run fonts`). `build` fails if the fonts cannot be fetched, so a deploy never ships without them.

## Deploy

Every push to `master` builds and deploys the site through `.github/workflows/deploy.yml` (official Astro GitHub Pages action).
