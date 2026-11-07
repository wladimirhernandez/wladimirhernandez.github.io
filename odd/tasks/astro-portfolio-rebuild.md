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
- Personal public repo: no company code or config. `@solomedia/parity-check` runs from `C:\Users\elwla\Documents\solomedia\parity-check`, with its config and output kept outside this repo.
- Local commits only; push and Pages setup happen at the end, after logging into the personal GitHub account (gh currently uses the company account).
- Fonts must be properly licensed (Suisse Intl is commercial).
- Reference analysis: `.atl/research/this-design-analysis.md` (git-excluded).

## Workflow settings
- TDD: off (source: no project/session config; not requested). Runner: none yet; functional checks are `astro check`, `astro build` and parity-check runs.
- Delivery strategy: ask-on-risk. Forecast: well above 400 authored lines; the chain strategy is pending the user's choice before slicing PRs.
- Branch: `feat/astro-rebuild`.

## Tasks
- [x] T01 — Decide the font: license Suisse Intl or use a free substitute (Switzer / Inter / Geist) with metric tuning. Decision (2026-11-05): Switzer (Fontshare ITF free license), self-hosted, tuned to the Suisse metrics.
- [ ] T02 — Gather content: work experience, Solomedia projects (what may be shown publicly), personal projects, updated bio and socials. _Blocked on the user._
- [x] T03 — Scaffold Astro + Tailwind v4 + GSAP; remove the old Parcel/PostHTML stack; keep the favicons and profile.jpg; add the GitHub Pages workflow (not pushed). Route: inline (no writer trigger). Evidence: astro 7.4.6, tailwind 4.3.4, gsap 3.15.1, TS 6 (`@astrojs/check` does not support TS 7); Node 22.23.4 pinned in `.nvmrc`; `npm run build` gives 0 errors and static `dist/`.
- [ ] T04 — Design tokens and base layout: colours (#000 / #f2f2f0 / #2b2b2b / #1e1e1e), type scale (16/22.4, 36/41.4 with tracking) and the grid (30px gap; breakpoints 800/1024/1380/1744/2104 for 3–7 columns).
- [ ] T05 — Global motion shell: header (`transition:persist`), ClientRouter black-curtain page transition (power3.inOut, 250ms), and the ScrollSmoother lifecycle (>=768px via gsap.matchMedia; init on astro:page-load, kill on astro:before-swap); restore the home scroll position.
- [ ] T06 — Content collections: schemas for projects and experience; seed data from T02.
- [ ] T07 — Home: pinned hero with fade-out, per-column scrubbed parallax grid, 3:5 cards with video/image, card hover (clipPath inset + scale 1.1 + caption, 0.5s power4.inOut), grid/list toggle.
- [ ] T08 — Project page `/work/[slug]`: case study layout and reveal animations.
- [ ] T09 — About page: bio, experience, contact.
- [ ] T10 — Responsive and parity verification: parity-check at several viewports against this.design (layout/motion parity, not content), plus an accessibility pass and `prefers-reduced-motion`.
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

## Next step
T04 (tokens, Switzer self-hosted, base layout); T02 content still needed from the user.
