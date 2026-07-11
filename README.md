# Christopher Wang — Portfolio

Premium editorial portfolio for Christopher Wang (Sustainability Advisor),
rebuilt as a React + Framer Motion single-page application with Vite.

## Stack

- **React 18** + **Vite 5**
- **Framer Motion** — scroll/velocity parallax, character-split staggered
  headers, magnetic CTAs, spring-physics drawers
- **Chart.js** — interactive decarbonisation scenario model
- Hand-written canvas renderers (contour field, warming stripes)

Colour and type tokens are unchanged from the original site (Space Grotesk /
Inter / JetBrains Mono; matcha / indigo / berry / amber / slate palette).

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Structure

- `src/components/` — section components + shared chrome (nav, grain, scroll progress, skip link)
- `src/data/` — content, scenario model, warming-stripes data
- `src/hooks/` — magnetic interaction
- `src/utils/` — shared helpers (`media.js`: reduced-motion / hover guards)
- `work/` + `src/work/` — the standalone work-samples page (served at `/work/`)
- `public/` — shared static assets: logos, favicon, social og-image, robots.txt, sitemap.xml
- `docs/` — non-app material (skill reference, career record); not built or deployed

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes `dist/`
to GitHub Pages on push to `main`.

> One-time setup: in repository **Settings → Pages → Build and deployment**,
> set **Source** to **GitHub Actions** (switching off the classic branch deploy).
