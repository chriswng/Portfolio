# CLAUDE.md — Christopher Wang Portfolio

Premium editorial portfolio for Christopher Wang (Sustainability Advisor),
built as a React + Vite multi-page app and deployed to GitHub Pages.

## Stack

- React 18 + Vite 5, `framer-motion` for motion, `chart.js` for the scenario
  model, `ogl` for the hero aurora (WebGL), plus hand-written canvas renderers
  (contour field, warming stripes).
- Three pages: the main profile (`index.html` → `src/main.jsx` → `App.jsx`), a
  standalone work-samples page (`work/index.html` → `src/work/main.jsx`) at
  `/work/`, and the Life Footprint dashboard (`footprint/index.html` →
  `src/footprint/main.jsx`) at `/footprint/`.

## Layout

| Path | What lives here |
|---|---|
| `src/components/` | Main-page sections (Hero, Bio, Principles, Ticker, Scenario, Experience, Contact, StripesFooter) plus shared Chrome (nav, grain, scroll progress, skip link). |
| `src/work/` | Work-samples page: `WorkApp`, `Baseline`, `CaseStudy`, data in `workData.js`, styles in `work.css`. |
| `src/footprint/` | Life Footprint page: calculation engine and factor data in `lib/` and `data/` (keep rigorous; every factor cites its source), the Wrapped-style reveal in `story/` (WebGL carbon field, carbon characters, share cards), guided audit in `Onboarding.jsx`, dashboard sections alongside. Copy lives in `data/copy.js` and `data/storyCopy.js`. |
| `src/data/` | Content and model inputs: `content.js` (all editorial copy), `scenario.js` (decarbonisation model), `stripes.js` (warming-stripes series). |
| `src/hooks/` | `useMagnetic` — cursor-follow interaction. |
| `src/utils/` | `media.js` — `prefersReducedMotion()` / `canHover()` guards. |
| `src/styles/global.css` | Design tokens + all main-page styles. |
| `public/` | Shared static assets (logos, favicon, og-image, robots.txt, sitemap.xml). |
| `docs/` | Non-app material: `skill-reference/` and `career-record/`. Not built or deployed. |

## Conventions

- **Design tokens** (colours, fonts, easing, z-index) live in `:root` in
  `global.css`. Neutrals are intentionally tinted toward the matcha brand hue at
  low chroma — do not "restore" cool-blue slate values; the green lean is
  deliberate and contrast is held to the original lightness.
- **All editorial copy is data**, not JSX. Add or edit words in `src/data/`,
  never inline in components.
- **Motion respects preferences.** Gate every animation/loop on
  `prefersReducedMotion()` and cursor-only interactions on `canHover()` (both
  from `src/utils/media.js`). Canvas/WebGL loops must pause off-screen via
  `IntersectionObserver` and clean up on unmount.
- **Accessibility:** keep the skip link first, `aria-current` on the active nav
  link, decorative canvases `aria-hidden`, and purely visual motion (e.g. the
  cycling role text) hidden from assistive tech with a static `.sr-only` label.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/ (also the CI check)
npm run preview  # preview the production build
```

Run `npm run build` before committing — it is the only automated gate.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes `dist/` to
GitHub Pages on push to `main`. `base: './'` in `vite.config.js` keeps asset
paths relative so both the domain root and a `/Portfolio/` sub-path work.

## Writing rules (for any site copy)

Australian English. No em dashes. No en dash clause separators in prose. Active
voice. Written in Chris's voice.

## Career record

Chris's separate career-achievement record and its DOCX rebuild notes live in
`docs/career-record/` — that is a personal document workflow, unrelated to the
website build. Leave it out of anything that ships in `dist/`.
