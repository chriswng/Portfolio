# Christopher Wang — Portfolio

Premium editorial portfolio for Christopher Wang (Sustainability Advisor),
rebuilt as a React + Framer Motion single-page application with Vite.

## Stack

- **React 18** + **Vite 5**
- **Framer Motion** — scroll/velocity parallax, character-split staggered
  headers, magnetic CTAs, spring-physics drawers
- **Chart.js** — interactive decarbonisation scenario model
- Hand-written canvas renderer (contour field)

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
- `src/data/` — content (incl. footer links), scenario model
- `src/hooks/` — magnetic interaction
- `src/utils/` — shared helpers (`media.js`: reduced-motion / hover guards)
- `work/` + `src/work/` — the standalone work-samples page (served at `/work/`)
- `public/` — shared static assets: logos, favicon, social og-image, robots.txt, sitemap.xml
- `docs/` — non-app material (skill reference, career record); not built or deployed

## Public pages and drafts

Public: `/`, `/work/` and `/footprint/` (with `/footprint/method/`). These are
in `sitemap.xml`, indexed by the home page's Tools section (`TOOLS` in
`src/data/content.js`), and linked from the nav and footer.

Drafts: `/targets/`, `/fashion/`, `/super/` (with `/super/method/`), `/grid/`,
`/progress/` and `/daily/`, indexed only by `/lab/`. They are built and deployed like any other
page, but nothing public links to them, they are out of `sitemap.xml`, they
carry `noindex, nofollow`, and each asks for a passphrase before it renders
(`src/components/Gate.jsx`). Their entries live in `PRIVATE_TOOLS` in
`src/data/content.js`.

The passphrase and what the gate is worth are both documented at the top of
`src/lib/gate.js`. In short: it hides the drafts from visitors and search
engines, and it is not security. This is a static build with no server to check
anything, and the repository behind it is public.

To publish a draft: move its entry from `PRIVATE_TOOLS` to `TOOLS` (renumbering
`n` and repicking `span` so both grids still fill their rows), drop the `Gate`
wrapper from its `src/<tool>/main.jsx`, remove the `noindex` meta from its
`index.html`, put its URL back in `public/sitemap.xml` and `public/404.html`,
and restore its footer link in `FOOTER`.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes `dist/`
to GitHub Pages on push to `main`.

> One-time setup: in repository **Settings → Pages → Build and deployment**,
> set **Source** to **GitHub Actions** (switching off the classic branch deploy).
