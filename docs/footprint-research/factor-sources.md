# Factor sources and verification status

Research trail for the factor set in `src/footprint/data/factors.js`
(set id CW-PF-2026.1, July 2026). Values were verified against
search-indexed content of the primary publishers plus faithful data mirrors,
with multiple independent cross-checks; the primary workbooks (both free
downloads) should be re-checked at the annual refresh. Verification flags
below follow that research.

## Electricity: DCCEEW NGA Factors 2025 (published August 2025)

Table 1, kg CO2-e/kWh, location-based.

| Region | Scope 2 | Scope 3 |
|---|---|---|
| NSW/ACT | 0.64 | 0.03 |
| VIC | 0.78 | 0.09 |
| QLD | 0.67 | 0.09 |
| SA | 0.22 | 0.04 |
| WA (SWIS) | 0.50 | 0.06 |
| TAS | 0.20 | 0.03 |
| NT (DKIS) | 0.56 | 0.09 |

- Publication: https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2025
- Scope 2 values corroborated by 3+ independent sources. **Flag:** the scope 3
  column rests on a single faithful mirror of the workbook; confirm against
  Table 1 at refresh.
- No 2026 edition exists as of July 2026; next expected ~August 2026.

## Gas: NGA 2025 Tables 5 and 6

- Scope 1: 51.53 kg CO2-e/GJ (CO2 51.4 + CH4 0.1 + N2O 0.03) = 0.05153 kg/MJ.
- Scope 3 metro by state (kg/GJ): NSW 13.1, VIC 4.0, QLD 8.8, SA 10.7, WA 4.1.
  TAS uses VIC and NT uses WA per the NGA confidentiality note.
- **Flag:** Table 6 values single-mirror provenance; magnitudes consistent
  with prior editions.

## Road fuels: NGA 2025 Table 9 (cars and light commercial vehicles)

Current editions no longer split pre/post-2004 light vehicles.

- Petrol: scope 1 67.62 kg/GJ, scope 3 17.2 kg/GJ at 34.2 GJ/kL
  → 2.31 / 0.59 kg CO2-e per litre.
- Diesel: 70.41 / 17.3 at 38.6 GJ/kL → 2.72 / 0.67 kg per litre.
- **Flag:** per-litre figures are arithmetic derivations (NGA publishes per GJ).

Derived modes in the tool:
- Rideshare/taxi 0.232 kg/km = petrol car at 8.0 L/100km fleet average,
  fuel cycle included; deadheading excluded (understates, noted on page).
- Public transport 0.035 kg/pkm = UK Government national rail factor,
  indicative proxy pending a published NSW per-pkm figure.

## Flights: UK Government (DESNZ/DEFRA) GHG Conversion Factors 2026 (June 2026)

Per passenger-km, WITH radiative forcing (1.7 multiplier, AR6-based; reduced
from 1.9 in the 2025 methodology). The 2025 edition carried a large one-off
correction replacing COVID-era load factors (passenger factors down 16-42%);
2026 carries those forward essentially unchanged.

| Band | Economy | Premium | Business | First |
|---|---|---|---|---|
| Domestic (average passenger) | 0.229 | – | – | – |
| Short-haul intl (<3,700 km) | 0.126 | – | 0.189 | – |
| Long-haul intl (>=3,700 km) | 0.117 | 0.187 | 0.339 | 0.468 |

- Class multipliers: premium 1.6x, business 2.9x, first 4.0x (cabin
  floor-space allocation). **Flag:** short-haul business ~1.5x is
  2024-vintage methodology knowledge.
- Without-RF = with-RF / 1.7 (derived; 2024 calibration pair verified:
  long-haul economy 0.20011 RF / 0.11812 no-RF).
- Distance bands are DEFRA's UK definitions; the tool applies the domestic
  band to Australian domestic sectors as a stated proxy and notes ICAO's
  calculator (route-specific fuel burn, CO2 only, no RF) as the cross-check.
- Great-circle +8% uplift per DEFRA method.
- Collection: https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026

## Freight

- Air long-haul with RF: 1.10 kg/t-km, DEFRA 2024 verified cell. The
  2025/2026 editions revised air freight DOWN (~-18 to -23%), so this reads
  conservative; exact 2026 cell to confirm at refresh.
- Sea container: 0.016 kg/t-km (verified, stable across 2024-2025 quotes).
- Road HGV average laden: 0.108 kg/t-km (DEFRA 2024 baseline; 2026 moved
  +12-13% on lower observed payloads; refresh note).
- Per parcel 0.75 kg CO2-e: order-of-magnitude midpoint of courier corporate
  disclosures (GLS, UPS, DPD, Hermes, PostNL: 0.4-1.2 kg/parcel; Siragusa
  et al. 2022, Sustainability 14(23):16085). Labelled indicative on page.

## Diet

- Scarborough et al. 2014, Climatic Change 125:179-192 (n=55,504, 2,000 kcal
  standardised, kg CO2-e/day): high meat 7.19, medium 5.63, low 4.67,
  pescetarian 3.91, vegetarian 3.81, vegan 2.89. Values verified against the
  open-access paper.
- Scarborough et al. 2023 (Nature Food 4:565-574) confirms the gradient on
  Poore & Nemecek LCA data (vegans ~25% of high meat-eaters).
- Per-kg reference (Poore & Nemecek 2018 via OWID, GWP100 incl. land use):
  beef (beef herd) 99.5, lamb 39.7, cheese 23.9, pork 12.3, poultry 9.9,
  eggs 4.7, rice 4.5, tofu 3.2. Note: the widely quoted "beef ~60" is the
  production-weighted average across beef-herd and dairy-herd systems.

## Benchmarks

- Australia per capita: 22.3 t CO2-e (2024, EDGAR/JRC, all GHG excl LULUCF).
  Including the land sink the national inventory (~436-446 Mt) works out
  ~16 t/person (derived; population denominator approximate).
- Global per capita: 6.59 t CO2-e (2023, EDGAR/JRC, all GHG); CO2-only ~4.7 t.
- 1.5°C lifestyle budget: 2.5 t by 2030, 1.4 by 2040, 0.7 by 2050
  (IGES / Aalto / D-mat 1.5-Degree Lifestyles 2019; Hot or Cool Institute
  2021 update).

## Goods and services: spend-based screening (US EPA Supply Chain Factors v1.3.0)

Optional opt-in module (idea 8 in `improvement-scoring.md`), shipped July 2026.
Base factors: US EPA "Supply Chain GHG Emission Factors v1.3.0 by NAICS-6",
"with margins" column, kg CO2e per 2022 USD of purchaser-price spend, all GHGs
at AR5 GWP-100. File `SupplyChainGHGEmissionFactors_v1.3.0_NAICS_CO2e_USD2022.csv`,
DOI 10.23719/1531143 (pasteur.epa.gov; catalog.data.gov landing page).

Verification: EPA/data.gov and every factor mirror are 403-blocked at the build
environment's egress proxy, but the full 1,016-row CSV was pulled from public
GitHub mirrors and the target rows were cross-checked byte-for-byte across three
independently-hosted copies (all agreed to 3 dp; base + margins = with-margins
held for every row). Rows used (with-margins, kg CO2e/2022 USD):

- Clothing 0.12 = apparel manufacturing NAICS 315 (315220/315240/315280/315990
  all 0.12; USEEIO 315000). Single uniform sector.
- Electronics 0.102 = mean of 334111 computers 0.058, 334220 phones/comms
  0.111, 334310 audio-video 0.081, 335210 small appliances 0.157.
- Entertainment 0.112 = mean of 713940 recreation/gyms 0.235, 512131 cinema
  0.052, 515210 subscription/streaming 0.094, 711211 events/sport 0.067.
- Health 0.094 = mean of 621111 physicians 0.083, 621210 dentists 0.056,
  621300 allied practitioners 0.105, 446110 pharmacy 0.13.
- Other 0.164 = general-merchandise retail NAICS 452 (452311/452210/452319 all
  0.164; USEEIO 452000). Retail-trade sector, so the margins column is 0.

Heterogeneous baskets (electronics, entertainment, health) use an equal-weighted
mean of the named representative commodities, a stated screening assumption;
clothing and other are single uniform sectors. USEEIO is a US model applied to
Australian spend, itself a screening approximation noted on the method page.

Currency and inflation bridge (a 2022-USD factor priced against current-AUD
spend), `GOODS_FX` in `factors.js`. Both sides are now FY2026-based from the
primary sources uploaded to this directory:
- AUD/USD 0.6785 USD per 1 AUD = FY2026 average (1 Jul 2025 to 30 Jun 2026),
  RBA Statistical Table F11.1 daily series (`f11.1-data.csv`), mean of the 251
  trading days; monthly F11 (`f11-data.csv`) cross-checks at 0.6792.
- US CPI-U 2022 to FY2026 = 1.120 (2022 annual average 292.655; FY2026 average
  327.67 over the 11 available months, Oct-2025 absent in the appropriations
  lapse; BLS CPI-U all items series CUUR0000SA0, `SeriesReport-*.xlsx`).
- Effective per-AUD factor = usPerUsd x 0.6785 / 1.120 (= usPerUsd x 0.6058).

Uncertainty tier: `estimated` (±30%). Labelled screening throughout; folded into
the audit total as scope 3 only when the visitor opts in.

### Category palette additions (dataviz CVD checks)

Two identity colours for the optional module: goods `#8E2D6E` (deep plum),
hotel `#1F5F6E` (dark teal). Chosen by a Lab ΔE search over normal plus
deuteranopia/protanopia/tritanopia (Machado matrices) as the two most distinct
additions to the existing seven; both clear white-on-fill contrast (WCAG 7.6
and 7.2). The one soft spot is goods/hotel convergence under deuteranopia
(ΔE ~5.6), no worse than the palette's existing collisions and mitigated by the
legend labels and white segment borders. A gold candidate scored highest on CVD
separation but was rejected for failing white-text contrast (2.25).

## Hotel nights (idea 7): shipped

`HOTEL` in `factors.js`. Per occupied room-night, kg CO2e, by country, read
directly from the DEFRA 2025 full-set "Hotel stay" worksheet
(`ghg-conversion-factors-2025-full-set.xlsx`, uploaded to this directory). The
figures derive from the Greenview Hotel Footprinting Tool / Cornell HSBI. UK
10.4 matches the value corroborated earlier from public prose, so the sheet is
the same lineage. Values used (kg/room-night): Australia 35, Japan 39, South
Korea (DEFRA "Korea") 55.8, Singapore 24.5, Philippines 54.3, Indonesia 62.7,
Thailand 43.4, Vietnam 38.5, Malaysia 61.5, Hong Kong 51.5, China 53.5, India
58.9, UAE 63.8, Qatar 86.2, United States 16.1, Canada 7.4, UK 10.4, France
6.7, Netherlands 14.8, Germany 13.2, Italy 14.3. Full DEFRA range runs Costa
Rica 4.7 to Maldives 152.2 across 38 countries.

The DEFRA "Hotel stay" tab carries no global/average row, so `HOTEL.default`
uses the Australian figure (35, near the table median 32.1) for a country not
listed (e.g. New Zealand, Taiwan). The guided audit prices hotel nights at the
Australian factor as a home-country default; the worked example sets the country
per trip. Edition note: this is the DEFRA 2025 hotel set (Singapore 24.5),
consistent with the 2025 revision; do not mix with 2024 (Singapore 37.3).
Uncertainty tier: `estimated` (±30%).

Note on the earlier block: the environment's egress proxy hard-blocks gov.uk,
its asset CDN and every hotel mirror (403 on CONNECT), and search will not
reproduce individual table cells, so these values could only be obtained once
the DEFRA workbook was uploaded to the repo directly.

## Data quality tiers and uncertainty bands (July 2026 addition)

`QUALITY_TIERS` in `factors.js`: metered/billed ±5%, forecast ±15%,
estimated ±30%, summed per entry with no correlation credit. The tier
framework follows the GHG Protocol quantitative uncertainty guidance and
IPCC 2006 GL Vol 1 Ch 3 (measured data materially tighter than proxies);
the band widths themselves are stated assumptions of this method, declared
as such in the basis of preparation. They size the displayed range only and
never move a central estimate. Change them freely with the method note; no
external value depends on them.

## July 2026 session: verification-blocked queue

**Update (later July 2026):** the spend-screening block (idea 8) and the
hotel-nights factor (idea 7) are both now verified and shipped, see "Goods and
services" and "Hotel nights" above. The EPA CSV was recovered from public
GitHub mirrors and cross-checked three ways; the DEFRA hotel workbook, RBA F11
exchange rates and BLS CPI series were uploaded to `docs/footprint-research/`
and read directly. Waste (idea 9) is still queued.

Three additions were designed, scored and then withheld because the build
environment could not verify their values against any source (egress proxy
allows package registries and search snippets only; gov.uk, dcceew.gov.au,
epa.gov and all factor mirrors returned 403). Dataset identities verified;
values not retrieved; nothing shipped from memory. Details and scores in
`improvement-scoring.md`. The unblock list:

- **Hotel stay** (UK Gov conversion factors, hotel stay tab): AU, JP, KR,
  SG, PH per room-night + fallback row label. Basis verified: room-night,
  Cornell Hotel Sustainability Benchmarking Index via the Hotel
  Footprinting Tool; 2026 methodology still cites HSBI 2021 data, so values
  likely carried forward (confirm, do not assume). UK 2022 = 10.4 kg
  CO2e/room-night (Circular Ecology, single lineage).
- **Spend screening** (EPA Supply Chain GHG Emission Factors v1.3.0,
  NAICS-6, 2022 USD, AR5): with-margins column for the consumer categories;
  CSV at pasteur.epa.gov DOI 10.23719/1531143. AUD/USD to state at ship
  time (calendar 2025 average 0.6449 per exchange-rates.org was the only
  value surfaced; prefer RBA/ATO FY2026).
- **Waste to landfill** (NGA Factors 2025, waste chapter; Tables 15-16 in
  2023/24 editions): MSW, food, garden, paper factors + gas-capture wording.
  NSW EPA fact sheet 24p4522 corroborates the food line.
- Bus (DEFRA average local bus) was scored and rejected on audience value,
  not just verification; see the scoring doc. Note if ever revisited: the
  2024 edition was corrected 30 Oct 2024 (v1.1) for Business Travel - Land
  rounding errors, so 2024 values must come from v1.1.

## Annual refresh checklist

1. NGA Factors (new edition ~August): Tables 1, 5, 6, 9 → `factors.js`
   ELECTRICITY, GAS, ROAD_FUELS; bump FACTOR_SET id.
2. UK conversion factors (new edition ~June): flights (all bands/cabins),
   freight air/sea/HGV.
3. Re-check the flagged single-mirror values against the primary workbooks.
4. Work the verification-blocked queue above: hotels, spend screening,
   waste. Each is design-complete and waiting on numbers.
5. Refresh seed profile with the new financial year's bills and itineraries.
6. Benchmarks: EDGAR annual report, DCCEEW quarterly inventory.
7. Entries pin their factor set id (`factor_set`); closed years are never
   re-priced. New factors apply forward only.
