# CLAUDE.md — Christopher Wang Portfolio

Premium editorial portfolio for Christopher Wang (Sustainability Advisor),
built as a React + Vite multi-page app and deployed to GitHub Pages.

## Stack

- React 18 + Vite 5, `framer-motion` for motion, `chart.js` for the scenario
  model, `ogl` for the hero aurora (WebGL), plus a hand-written canvas renderer
  (contour field).
- Five pages: the main profile (`index.html` → `src/main.jsx` → `App.jsx`), a
  standalone work-samples page (`work/index.html` → `src/work/main.jsx`) at
  `/work/`, the Life Footprint dashboard (`footprint/index.html` →
  `src/footprint/main.jsx`) at `/footprint/`, its basis of preparation
  (`footprint/method/index.html` → `src/footprint/method/main.jsx`) at
  `/footprint/method/`, and Cost Per Wear, the fashion brand transparency lookup
  (`fashion/index.html` → `src/fashion/main.jsx`) at `/fashion/`.

## Layout

| Path | What lives here |
|---|---|
| `src/components/` | Main-page sections (Hero, Bio, Principles, Ticker, Scenario, Experience, Contact) plus the shared SiteFooter (big lime card with signup + link columns, used by the home and work pages), shared Chrome (nav, grain, scroll progress, skip link), the shared hand-drawn `Icons` set (round line art, one matcha accent shape per glyph, used beside sec-tags on every page), and the `Aurora` (WebGL) + `ContourField` (canvas) hero backdrops, mounted on the home, work, footprint and fashion intros. |
| `src/work/` | Work-samples page: `WorkApp`, `Baseline`, `CaseStudy`, data in `workData.js`, styles in `work.css`. |
| `src/footprint/` | Life Footprint page: calculation engine and factor data in `lib/` and `data/` (keep rigorous; every factor cites its source), the Wrapped-style reveal in `story/` (WebGL carbon field, carbon characters, share cards), guided audit in `Onboarding.jsx`, dashboard sections alongside. Copy lives in `data/copy.js` and `data/storyCopy.js`. |
| `src/footprint/method/` | The basis of preparation page (`/footprint/method/`): the written method plus the live factor tables, rendered from the same factor set the engine prices from. |
| `src/fashion/` | Cost Per Wear (`/fashion/`): fashion brand transparency lookup. `FashionApp.jsx` holds the page spine: lookup, compare, the personal lens ("what you can't know": user-picked concerns read against a brand's disclosure statuses, never a brand ranking), directory, the ownership-map treemap in the dark spotlight band, the tabbed field guide (materials, certifications, regulation, claim check), the signals explainer, and the backlog with its dated change log. Between the directory and the field guide sits the Garment Studio (`Studio.jsx`: carbon footprint estimator with live CO2e particle streams, fabric comparator, supply chain mapper over the dot-matrix world map, circularity scorecard; all studio factors are indicative published-LCA estimates and the UI says so once, plainly). All brand data, studio factors, lens concerns, changelog and editorial copy in `data.js`, styles in `fashion.css` (layered on `global.css` tokens like the footprint pages), intent in `design-notes.md`. Every company shows its real logo via `BrandLogo` (walked through the keyless `LOGO_SOURCES` provider chain by `BRAND_DOMAIN` in `data.js`), with a generated woven-label monogram (`deriveMonogram`/`SEGMENT_STYLE`) as the automatic fallback. |
| `src/data/` | Content and model inputs: `content.js` (all editorial copy, including footer links), `scenario.js` (decarbonisation model). |
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
- **The basis of preparation stays in sync.** The footprint's method page
  (`/footprint/method/`, rendered from `METHOD` in `src/footprint/data/copy.js`
  by `src/footprint/Method.jsx`) is the written record of the model. Any change
  to the footprint engine, factors, abatement options, pathway or forecasting
  logic, boundary or exclusions must update the basis of preparation page in
  the same change. Titles across the site never end in a full stop.
- **Every fashion brand carries a logo.** In Cost Per Wear each company shows its
  real logo through the `BrandLogo` component (`src/fashion/FashionApp.jsx`),
  loaded at runtime by walking the ordered keyless provider chain
  `LOGO_SOURCES` in `src/fashion/data.js` (Google s2 favicons; the earlier
  DuckDuckGo provider was dropped because corporate web filters commonly block
  `icons.duckduckgo.com` as a proxy/anonymiser, which flagged the whole page),
  keyed by the brand's `BRAND_DOMAIN` entry. A load error moves to the next
  provider, and a tiny placeholder response (Google's generic globe) is
  detected by rendered size and treated as a miss. When a domain is missing
  or every provider misses, it falls back to a generated "woven-label" monogram
  (`deriveMonogram()` + `SEGMENT_STYLE`), so every brand always has a mark.
  When adding a brand: add its domain to `BRAND_DOMAIN` (and, for a new
  corporate parent, `GROUP_DOMAIN`) so the real logo resolves, and set its
  `segment` so the monogram fallback reads correctly; add a `MONO_OVERRIDES`
  entry only for a house whose established lettermark differs from the plain
  initials (e.g. Gucci `GG`, Saint Laurent `YSL`). `LOGO_SOURCES` is the single
  swap-point for the logo providers.
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
