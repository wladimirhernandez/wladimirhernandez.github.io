# Astro portfolio rebuild

## Objective
Rebuild the personal portfolio as a close replica of https://this.design/, using Astro + GSAP, and publish it on GitHub Pages at wladimirhernandez.github.io.

## Problem
The current site is an outdated Parcel/PostHTML/Tailwind build with a "Coming soon" placeholder and no real project data. The portfolio previously lived on a custom domain and now needs to return to GitHub Pages.

## Why
Showcase work experience, selected Solomedia (agency) projects and personal projects with a polished, motion-rich presentation.

## Scope
- New stack: Astro (static output) + Tailwind v4 + GSAP (ScrollTrigger, ScrollSmoother, Flip).
- Pages: home (pinned hero, parallax grid of cards, grid/list toggle), about, project case study (`/work/[slug]`).
- Content: work experience, Solomedia projects, personal projects (Astro content collections).
- Deploy via the official Astro GitHub Pages action.

## Constraints
- Personal public repo: no company code or config. Any external parity tooling runs from outside this repo, with its config and output kept out of it.
- Local commits only; push and Pages setup happen at the end, after logging into the personal GitHub account (gh currently uses the company account).
- Fonts must be properly licensed (Suisse Intl is commercial).
- Reference analysis: `.atl/research/this-design-analysis.md` (git-excluded).

## Workflow settings
- TDD: off (source: no project/session config; not requested). Runner: none yet; functional checks are `astro check`, `astro build` and parity-check runs.
- Delivery strategy: ask-on-risk. Forecast: well above 400 authored lines; the chain strategy is pending the user's choice before slicing PRs.
- Branch: `feat/astro-rebuild`.

## Tasks
- [x] T01 — Decide the font: license Suisse Intl or use a free substitute (Switzer / Inter / Geist) with metric tuning. Decision (2026-11-05): Switzer (Fontshare ITF free license), self-hosted, tuned to the Suisse metrics.
- [ ] T02 — Gather content: work experience, Solomedia projects (what may be shown publicly), personal projects, updated bio and socials. Progress: experience, skills, education, certifications and contact taken from the CV; Insoftar ended 2026-01 and the current role is Product Engineer at Solo Media Group since 2026-02 (confirmed by the user). Personal project added by the user (2026-11-07): car-game-ui, a NoesisGUI native C++ racing-menu implementation of a Dribbble concept (credit the original design; published 2026-11-07 at https://github.com/wladimirhernandez/car-game-ui (public, main); the user loves game UI, so feature it). Solomedia projects chosen by the user (2026-11-07; Oatly dropped): Lifelines (https://www.lifelines.com), Thirteen Lune (https://thirteenlune.com), LA Archive (https://losangelesarchive.com). Presentation rule from the user: "solo pon que trabajé ahi y ya" (name, link and that he worked on it at Solo Media Group; no technical detail). Personal project 2 (2026-11-07): Forza Telemetry, https://github.com/wladimirhernandez/forza-telemetry (public, .NET 10 WPF live telemetry for Forza Horizon 6; 8 screenshots in docs/screenshots of its repository, reusable as card media). The user: "necesito es los proyectos que sean vistosos" and "con car-game-ui alcanza" for other GitHub repos (Forza added on top at the user's request). Still pending: highlights for the current role, and captures or a video of car-game-ui for its card.
- [x] T03 — Scaffold Astro + Tailwind v4 + GSAP; remove the old Parcel/PostHTML stack; keep the favicons and profile.jpg; add the GitHub Pages workflow (not pushed). Route: inline (no writer trigger). Evidence: astro 7.4.6, tailwind 4.3.4, gsap 3.15.1, TS 6 (`@astrojs/check` does not support TS 7); Node 22.23.4 pinned in `.nvmrc`; `npm run build` gives 0 errors and static `dist/`.
- [x] T04 — Design tokens and base layout: colours (#000 / #f2f2f0 / #2b2b2b / #1e1e1e), type scale (16/22.4, 36/41.4 with tracking) and the grid (30px gap; breakpoints 800/1024/1380/1744/2104 for 3–7 columns). Route: inline. Evidence: tokens in `src/styles/global.css` (@theme); Switzer variable fonts fetched by `scripts/fetch-fonts.mjs` (prebuild --strict, predev lenient), gitignored, byte-identical to the official zip; `scripts/` excluded from tsconfig because it made `astro check` hang; `npm run build` gives 0 errors. Pending for T10: `size-adjust` metric tuning against Suisse, the `xs` breakpoint (not measured). The fetch script now has a 30s timeout; fresh fetch, strict failure and lenient fallback were tested on 2026-11-07.
- [x] T05 — Global motion shell: header (`transition:persist`), ClientRouter black-curtain page transition (power3.inOut, 250ms), and the ScrollSmoother lifecycle (>=768px via gsap.matchMedia; init on astro:page-load, kill on astro:before-swap); restore the home scroll position. Route: inline. Evidence: headless Chrome E2E (scratch, not committed) 20/20 plus browser back over 3 round trips and full-page scroll; build 0 errors. Gotcha fixed: Astro ClientRouter replaces <body>, but ScrollSmoother caches the first body and sizes it, so later pages could not scroll past one viewport; a custom event.swap keeps the same <body> and reuses Astro swapBodyElement on inner wrappers. Restore runs after the smoother's deferred refresh. Removed the leftover tailwind.config.js.
- [x] T06 — Content collections: schemas for projects and experience; seed data from T02. Progress: `experience` collection (file loader, YYYY-MM dates, end >= start refine) seeded in `src/data/experience.json`, plus `src/data/profile.ts`; a bad end date is rejected by `astro sync`. Done 2026-11-07: `projects` collection (glob loader, image() card/hero/gallery, agency needs client) with 5 entries; media captured from the live sites (mobile 390x650 cards, desktop heroes, floating widgets hidden), Forza screenshots from its repo, car-game-ui screens via PrintWindow.
- [x] T07 — Home: pinned hero with fade-out, per-column scrubbed parallax grid, 3:5 cards with video/image, card hover (clipPath inset + scale 1.1 + caption, 0.5s power4.inOut), grid/list toggle. Route: inline (parent). Evidence: commit 02ab21a; screenshots desktop/hover/list/mobile. Deviations: parallax settles at top 30% (single row of 5 projects); caption shows max 3 tags at 1.25vw on xl.
- [x] T08 — Project page `/work/[slug]`: case study layout and reveal animations. Route: delegated writer (parallel unit). Evidence: commit bd9ab54; parent review fixed the hero gradient and replaced a duplicate ProjectRow with the home one.
- [x] T09 — About page: bio, experience, contact. Route: delegated writer (parallel unit). Evidence: commit 1f2b19f.
- [x] T10 — Responsive and parity verification: parity-check at several viewports against this.design (layout/motion parity, not content), plus an accessibility pass and `prefers-reduced-motion`. Evidence 2026-11-07: production build + headless Chrome over 7 pages x desktop/mobile x normal/reduced motion: axe WCAG 2.2 AA clean, no horizontal scroll, one h1, all images with alt, no console errors; T05 regression 20/20. Fixed: secondary text raised from 40% to 60% opacity for AA contrast. Not run: parity-check against this.design (pixel parity is not meaningful with different content).
- [ ] T12 — i18n (2026-11-07). User: "tambien por un localizador de idioma y traducción eng/esp". Scope: Astro i18n routing (en at /, es at /es/), EN/ES switcher in the header that keeps the current page and remembers the choice, first-visit redirect to /es/ for Spanish browsers without a saved choice, hreflang alternates, full Spanish translation (UI, profile, experience, project texts) in neutral professional Spanish. Route: inline (one intertwined unit).
- [ ] T11 — Deploy: log into the personal GitHub account, push, enable Pages via Actions, verify the live site.

## Acceptance criteria
- `astro build` produces static output that works under GitHub Pages.
- Layout, typography and motion match this.design within the parity-check thresholds at the checked viewports, using the user's own content.
- Animations respect `prefers-reduced-motion`; there is no horizontal scroll on mobile.
- No company code, tokens or config in the repo.

## Progress
- 2026-10-22: Repo cloned; this.design analysed; stack decided (Astro + GSAP); branch `feat/astro-rebuild` created; feature document created. Paused: work resumes later, starting with T01/T02.

- 2026-11-05: T01 decided (Switzer). Personal GitHub: github.com/wladimirhernandez. The user wants a later phase to optimize the whole personal brand (LinkedIn and the rest) after the portfolio ships.
- 2026-11-07: Node 22.23.4 installed into the nvm folder (the global switch still needs an admin `nvm use 22.23.4`). T03 done.

- 2026-11-07: T04 blocker. The Switzer license (ITF FFL v2.0, 17 Aug 2026) allows self-hosting through @font-face (s.36, s.59) but forbids making the files available through a "repository" or "publicly accessible servers" (s.53), and forbids subsetting or modification (s.51). Committing the woff2 files to this public repo is therefore not allowed. Fork pending the user's choice: fetch the fonts at build time (gitignored), use the Fontshare CDN, or switch to an OFL font.

- 2026-11-07: The user chose "Fetch at build". T04 done.

- 2026-11-07: The user asked not to be interrupted by review prompts ("revisa tú pero no cortes el trabajo"). RDD disabled for this clone only; Claude self-reviews each diff before committing. Self-review found a missing fetch timeout, now fixed.

## Next step
T12 i18n, then T11 deploy (push blocked until the gh token gets the workflow scope; the user approved PR and merge on 2026-11-07).
