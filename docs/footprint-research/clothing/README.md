# Clothing LCA sources — provenance and attribution

The life cycle assessment (LCA) and emission-factor documents in this folder
inform two parts of the site:

- the **Cost Per Wear Garment Studio** (`/fashion/`) — the carbon estimator, fabric
  comparator, supply chain mapper and circularity scorecard, whose factors live
  in `STUDIO_FIBRES`, `ORIGINS` and `STUDIO_FACTORS` in `src/fashion/data.js`;
- the **Life Footprint** clothing category (`/footprint/`), which prices
  garments on the ADEME per-item factors.

The honesty note above the studio factor tables names the same anchor sources,
and the footer Sources list on the fashion page links them. This folder is
reference material only. Like everything under `docs/`, it is **not built or
deployed** — none of it ships in `dist/`.

## Principle

The studio's numbers are indicative estimates, rounded hard and labelled as
such in the UI once, plainly. They are not a product footprint or an audit.
Where a single authoritative, directly-comparable factor exists (freight, grid,
the petrol-car equivalence), the studio uses it; where the literature gives a
range (per-fibre carbon, mill energy), it takes a rounded mid-range value.
Every source below is a freely available publication, retained here as working
provenance and credited to its author. Report titles and content belong to
their respective owners.

## Sources

| Source | File | Official link | What it grounds |
|---|---|---|---|
| **DESNZ & Defra — UK Government GHG conversion factors for company reporting, 2026** (full set) | `../ghg-conversion-factors-2026-full-set.xlsx` (parent folder; shared with the footprint model) | https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting | `STUDIO_FACTORS` freight (container ship 0.0161, long-haul air freight incl. radiative forcing 0.899, average laden HGV 0.104 kg CO2e/tonne.km) and the average petrol-car equivalence (0.162 kg CO2e/km). Published under the Open Government Licence. |
| **Sandin, Roos, Spak, Zamani & Peters — Environmental assessment of Swedish clothing consumption: six garments, sustainable futures** (Mistra Future Fashion 2019:05, RISE) | `mistra-sandin-2019-six-garments.pdf` | https://mistrafuturefashion.com/ | Cradle-to-grave stage structure; wet treatment as the single largest process (the 2.2 kg CO2e/kg dye-house thermal factor matches the report's ~30 MJ/kg fossil-fired bath); cutting loss (15–20%, studio uses the 15% low end); the "double the garment's life, roughly halve its impact" finding behind the circularity scorecard. |
| **ADEME (Lhotellier, Lees, Bossanne, Pesnel) — Modélisation et évaluation ACV de produits de consommation et biens d'équipement** (2018; rapport + synthèse) | `ademe-base-empreinte-consumer-products.zip` | https://librairie.ademe.fr/ | Per-fibre carbon (virgin cotton yarn 8.7, virgin polyester 12.8, recycled polyester 7.8 kg CO2e/kg) and per-garment cradle-to-grave totals used to sense-check `STUDIO_FIBRES.ef` and the estimator's output ranges. The zip holds the 186-page rapport and the 25-page synthèse. |
| **WRAP — Valuing Our Clothes: the cost of UK fashion** (July 2017) | `wrap-valuing-our-clothes-2017.pdf` | https://wrap.org.uk/resources/report/valuing-our-clothes-cost-uk-fashion | UK use-phase and garment-life context: average garment life 3.3 years; washing and care ~a third of clothing's carbon footprint; extending active life reduces carbon, water and waste. Supports the durability and use-phase framing in the studio and materials copy. |

## How the studio factors reconcile

- **Freight and petrol car** are taken directly from Defra 2026 (the numbers
  above). The 2026 edition cut the UK grid factor ~26% on a revised
  methodology; the studio uses per-country production grids in `ORIGINS`, not
  the UK grid, so that revision does not flow through the estimator.
- **Dye-house heat** (`dyeThermalPerKg` 2.2) equals Mistra's 30 MJ/kg of
  fossil (light-fuel-oil) boiler heat, the reason wet treatment dominates.
- **Per-fibre carbon** in `STUDIO_FIBRES.ef` is fibre-to-spinning-gate and
  sits inside the published spread: ADEME's yarn-stage figures are higher
  because they include spinning, which the studio adds separately via
  `spinKwhPerKg` and the origin grid, so a cotton fibre of 5.0 plus spinning on
  an Indian grid lands near ADEME's 8.7 yarn figure.
- **Per-country grid intensities** in `ORIGINS` are current national-average
  generation factors, kept in preference to ADEME's older, higher values.

## Not affiliated

The site is an independent, non-commercial reference project. It is not
affiliated with, sponsored by, or endorsed by WRAP, Mistra Future Fashion,
RISE, ADEME, DESNZ, Defra, or any brand named on the page. If something here is
wrong, it can be corrected.
