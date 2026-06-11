# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Christopher Wang, a Sustainability Advisor. Deployed as GitHub Pages at `itschriswang.github.io`. This is a **no-build, no-framework** static site — HTML, CSS, and JS are hand-written and served directly.

## Development

There are no build, lint, or test commands. To preview locally, open the HTML files directly in a browser or serve them with any static file server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Changes are deployed by pushing to the `main` branch (GitHub Pages auto-deploys).

## Architecture

The project has exactly two pages:

- **`index.html`** — Main portfolio (~1900 lines). All CSS is in a `<style>` block (lines ~13–655), all JS is in a `<script>` block at the bottom (lines ~1081–1911).
- **`work/index.html`** — Work samples sub-page (~100KB), same single-file structure.

### CSS Design System (index.html lines 16–43)

CSS custom properties define the entire design token system:
- **Palette:** `--matcha` (#B5C42B), `--indigo`, `--berry`, `--amber` as brand/accent colors; `--primary`/`--secondary`/`--accent` semantic aliases
- **Typography:** Space Grotesk (display), Inter (body), JetBrains Mono (code/labels) — all loaded via Google Fonts CDN
- **Layout:** `--max-width: 960px`, content constrained via `.container` utility

### Page Sections (index.html)

Sections map directly to `id` attributes used for anchor nav:
- `#about` — Hero with animated role cycling and years-of-experience counter
- `#bio` — Biography + "capability pipeline" accordion (5 steps: Raw Data → Calculation → Reporting → Strategy → Communication)
- `#principles` — "My Practice" cards
- `.ticker-band` — Animated sustainability glossary ticker
- `#scenario` — **The most complex section** — interactive decarbonisation scenario model (see below)
- `#experience` — Career timeline
- `#contact` — LinkedIn CTA

### Interactive Scenario Model (`#scenario`)

The decarbonisation model is the centrepiece interactive feature. Key state/data structures in the JS:

- **`SECTOR_PROFILES`** object — defines 4 sectors (infrastructure, property, government, textile retail), each with `FY20`/`FY25`/`FY26` baseline emissions and sector-specific lever definitions
- **`SCN` state object + segmented buttons** — all controls are `.seg-btn` button groups (`data-key`/`data-value`); a click writes to `SCN` and calls `run()` (or `changeSector()` for the profile row)
- **Calculation engine (`run()`)** — recomputes on every lever change; updates the Chart.js stacked-wedge line chart, the dynamic takeaway headline (`#takeaway`), the KPI strip, and contribution bars showing abatement by lever
- **Chart.js 4.4.1** — loaded via CDN; the chart instance is stored in a module-level variable and `.update()`d in place; the legend is custom HTML built by `buildLegend()` (the built-in Chart.js legend is disabled)
- The section is light-themed and laid out as three numbered steps: profile → levers → result

When modifying the scenario model, changes to `SECTOR_PROFILES` data, lever curves, or the calculation logic all live in the same `<script>` block and are tightly coupled to the DOM structure of `#scenario`.

## Key Conventions

- **All styles and scripts are embedded** in each HTML file — no separate `.css` or `.js` files exist
- **No external dependencies except Chart.js** (CDN) and Google Fonts (CDN); do not introduce npm or bundlers
- **Animations** use `@keyframes` + `IntersectionObserver` for entrance effects; the film-grain and contour-field topology overlays are CSS `background` + `::before`/`::after` pseudo-elements
- When adding new sections, follow the existing pattern: semantic HTML landmark → CSS custom properties for theming → JS appended at the bottom of the `<script>` block
