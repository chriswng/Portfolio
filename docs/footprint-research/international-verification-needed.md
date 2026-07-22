# International factors: what to download and verify

The United States and New Zealand support in the Life Footprint calculator
(`nga2025-ukghg2025-intl1` factor set, July 2026) was built in an environment
whose outbound network could not reach the primary publishers
(`epa.gov`, `eia.gov`, `environment.govt.nz`,
`measuringemissionsguide.environment.govt.nz`, `mbie.govt.nz`,
`edgar.jrc.ec.europa.eu` all returned proxy `403`s). Every non-Australian
value therefore shipped from search-indexed corroboration of the primary
source, or as an explicitly stated proxy, and each is flagged in
`factor-sources.md`.

This file is the shopping list to close those flags. Download each source,
read the named cell or table, and either confirm the shipped value or replace
it. Everything here plugs into `src/footprint/data/factors.js` unless noted.
Nothing below is a code change on its own: it is the evidence a code change
needs.

**Priority key:** P1 blocks accuracy for a common audit; P2 tightens a value
already close; P3 is a nice-to-have that currently rides a reasonable proxy.

---

## United States

### P1 · eGRID2023 state-level electricity factors

The single biggest gap. The tool prices every US audit at one national
average (0.37 kg CO₂-e/kWh); a real grid runs from roughly a fifth of that
(hydro-heavy WA, VT) to well over double (coal-heavy WV, WY, KY, ND). State
factors are what make a US footprint honest.

- **Download:** eGRID2023 data file (xlsx), latest revision.
  - Data hub: https://www.epa.gov/egrid/download-data
  - Data explorer: https://www.epa.gov/egrid/data-explorer
  - Summary tables (PDF, quick cross-check): https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.pdf
  - Release notes: https://www.epa.gov/system/files/other-files/2025-06/egrid2023_release_notes.txt
- **Read:** the `ST` (state) sheet. Column: **state total output emission
  rate, CO₂e, lb/MWh**. All 50 states + DC.
- **Convert:** `kg/kWh = lb_per_MWh × 0.45359237 / 1000`.
- **Also read:** the US **grid gross loss factor** (%) for the scope 3
  transmission-and-distribution line (Summary Tables, or the EPA GHG Emission
  Factors Hub "grid gross loss" note). We currently assume ~5%.
- **Lands in:** replace the single `ELECTRICITY.US` row with a set of
  state rows (`country: 'US'`), and turn on the US region picker in
  `Onboarding.jsx` (the `regionsForCountry('US').length > 1` branch already
  handles the UI once more than one US row exists). Move the "state factors
  queued" note out of `METHOD.exclusions` when done.

### P1 · US natural gas and motor fuels (EPA GHG Emission Factors Hub)

Currently shipped from the decade-stable 40 CFR Part 98 defaults via search;
these are high-confidence but should be read from the actual workbook once.

- **Download:** GHG Emission Factors Hub, current edition (xlsx + PDF).
  - Landing page: https://www.epa.gov/climateleadership/ghg-emission-factors-hub
  - 2025 xlsx: https://www.epa.gov/system/files/other-files/2025-01/ghg-emission-factors-hub-2025.xlsx
  - 2025 PDF: https://www.epa.gov/system/files/documents/2025-01/ghg-emission-factors-hub-2025.pdf
  - (Check for a newer edition on the landing page before using 2025.)
- **Read:**
  - Stationary combustion, natural gas: **kg CO₂ / MMBtu** (≈53.06), plus
    **g CH₄ / MMBtu** and **g N₂O / MMBtu**, and the **GWP set** the Hub
    states (AR5: CH₄ 28, N₂O 265). We ship 0.05034 kg CO₂-e/MJ.
  - Mobile combustion: **kg CO₂ / gallon** for motor gasoline (≈8.78) and
    diesel (≈10.21). We ship 2.32 and 2.70 kg/L.
- **Convert:** MMBtu → MJ at 1,055.06; gallon → L at 3.78541; therm →
  MJ at 105.505 (the therm figure is what US bills read in).
- **Lands in:** `GAS_INTL.US`, `ROAD_FUELS_INTL.US`.
- **Note to record:** whether the Hub tabulates CH₄/N₂O per gallon (useful,
  we currently omit the <1% per-mile figures and say so).

### P2 · US per-capita GHG benchmark (EDGAR 2025)

Shipped as ~17.3 t; one secondary read gave 17.7 for an adjacent vintage.

- **Download / read:**
  - EDGAR 2025 report, per-capita view: https://edgar.jrc.ec.europa.eu/report_2025?vis=ghgpop
  - Booklet PDF (country table): https://edgar.jrc.ec.europa.eu/booklet/GHG_emissions_of_all_world_countries_booklet_2025report.pdf
- **Read:** United States, **t CO₂-e per capita, all GHG excl. LULUCF,
  2024**.
- **Lands in:** `BENCHMARKS` id `us` in `data/benchmarks.js`.

### P3 · US household energy presets (EIA)

Coarse onboarding starting points only; a skipped step adds nothing, so this
is low stakes.

- **Electricity:** EIA average annual residential consumption:
  https://www.eia.gov/tools/faqs/faq.php?id=97&t=3 (≈10,800 kWh/yr).
- **Natural gas:** EIA RECS residential consumption:
  https://www.eia.gov/consumption/residential/ (want the all-household
  average therms/yr, not a single dwelling segment).
- **Lands in:** `ENERGY_PRESETS.US` in `data/copy.js`.

### P3 · US public-transport fare structures

Only needed if we ever add a US fare cap (we deliberately don't, and count
spend as given). No single national cap exists; would be per-agency.

---

## New Zealand

### P1 · MfE grid electricity factor and its T&D-loss factor

Shipped at 0.073 kg CO₂-e/kWh with scope 3 (losses) set to zero, so the line
currently understates slightly.

- **Download / read:**
  - Section 5 (live): https://measuringemissionsguide.environment.govt.nz/5_purchased_energy.html
  - Catalogue 2025 PDF: https://measuringemissionsguide.environment.govt.nz/files/Measuring-Emissions-Catalogue-2025-v3.pdf
  - Catalogue 2026 root (check which is current): https://measuringemissionsguide.environment.govt.nz/index.html
- **Read:**
  - **Table 5.2** — annual grid-average purchased electricity,
    **kg CO₂-e/kWh** (and Table 5.3 for the quarterly series if you want the
    latest quarter).
  - The **separate transmission-and-distribution losses factor**
    (kg CO₂-e/kWh) — this is the scope 3 line we currently leave at zero.
- **Lands in:** `ELECTRICITY.NZ` (`s2`, `s3`).

### P2 · NZ reticulated natural gas (combustion + fuel-cycle)

Shipped using the Australian NGA combustion factor as a stated proxy; NZ runs
a few per cent higher.

- **Download / read:** MfE Catalogue, section 5 / stationary energy, natural
  gas: **kg CO₂-e per kWh or per GJ**, plus any published upstream/T&D gas
  factor (MBIE supplies the gas T&D-loss factor).
- **Convert:** kWh → MJ at 3.6; GJ → MJ at 1,000.
- **Lands in:** `GAS_INTL.NZ`.

### P2 · NZ petrol, diesel (and LPG) per litre

Shipped using the Australian NGA combustion + fuel-cycle factors as a stated
proxy. Search-level cross-checks: petrol ≈2.31, diesel ≈2.68 kg CO₂/L.

- **Download / read:** MfE Catalogue section 7 (travel) / liquid fuels
  appendix: **kg CO₂-e per litre**, and note whether the published figure is
  combustion-only or includes upstream (we keep a separate fuel-cycle line).
  - Section 7: https://measuringemissionsguide.environment.govt.nz/7_travel.html
- **Lands in:** `ROAD_FUELS_INTL.NZ` (currently aliased to the AU set).

### P2 · NZ per-capita GHG benchmark

Shipped as 14.6 t, **derived** (inventory gross ÷ population), not read
directly.

- **Option A (matches the AU/US rows' EDGAR basis):** EDGAR 2025 per-capita,
  New Zealand, all GHG excl. LULUCF, 2024:
  https://edgar.jrc.ec.europa.eu/booklet/GHG_emissions_of_all_world_countries_booklet_2025report.pdf
- **Option B (national inventory, what we derived from):**
  - NZ Greenhouse Gas Inventory snapshot: https://environment.govt.nz/publications/ (search "Greenhouse Gas Inventory")
  - Gross emissions 2023: 76.4 Mt CO₂-e.
  - Population denominator: Stats NZ https://www.stats.govt.nz/
- **Decision needed:** EDGAR gives NZ ≈6.4 t on the *territorial-CO₂-adjacent*
  cut some tables use, but the *all-GHG* cut including agricultural methane is
  far higher (~15 t) — NZ is unusual because roughly half its emissions are
  biogenic methane. Pick the all-GHG figure so it is comparable to the AU
  (22.3) and US (17.3) rows, and record which EDGAR column it is.
- **Lands in:** `BENCHMARKS` id `nz`.

### P2 · NZ hotel per-room-night factor

NZ is not in the DEFRA hotel-stay table we verified against, so NZ home nights
use the Australian figure (35) as a stated proxy.

- **Check:** the DESNZ/DEFRA **2026** conversion factors "Hotel stay" tab for
  a New Zealand row (the 2025 set expanded to 55 countries; 2026 may add NZ):
  https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting
- Alternatively a Cornell/Greenview country average for NZ if published.
- **Lands in:** `HOTEL.countries.NZ` (add the row; the engine already prices
  destination nights per country).

### P3 · NZ household electricity preset

- MBIE "Energy in New Zealand" (residential average kWh/yr):
  https://www.mbie.govt.nz/building-and-energy/energy-and-natural-resources/energy-statistics-and-modelling/
- EECA / Gen Less household figures as a cross-check.
- **Lands in:** `ENERGY_PRESETS.NZ`.

### P3 · NZ domestic flight factor (optional refinement)

We price all flights on the DEFRA distance/cabin bands. MfE publishes an NZ
domestic aviation factor (national average + by aircraft size, RF ×1.7). Only
worth swapping in if we later want NZ domestic sectors on the local figure.

- Section 7: https://measuringemissionsguide.environment.govt.nz/7_travel.html

---

## Shared / cross-country

### P2 · NZD→USD rate for the goods module

Shipped at 0.5873 (IRD rolling 12-month average to July 2025). Refresh at each
annual update.

- IRD overseas currency rates: https://www.ird.govt.nz/international-tax/business/overseas-currency
- **Lands in:** `GOODS_FX_BY_COUNTRY.NZ.rate`.

### P2 · Spend-based goods factor set (Australia/NZ-specific)

The whole goods module uses the US EPA supply-chain factors bridged by FX for
all three countries. An AU or NZ environmentally-extended input-output factor
set would remove the "US basket applied elsewhere" approximation. Already on
the queued list in the method page; noted here for completeness.

- AU: potential source is the IELab / Australian EEIO work.
- NZ: potential source is the Manaaki Whenua / Stats NZ EEIO tables.

---

## How to hand results back

For each row you close, note in `factor-sources.md`: the value read, the exact
file/sheet/cell, the download date, and drop the corresponding flag. Then the
code change is mechanical — the helpers in `factors.js`
(`electricityFor`, `gasFactorsFor`, `roadFuelFor`, `goodsPerDollar`,
`homeAverageFor`) already route by country, so most closures are a value swap
plus, for the US state table, populating rows and letting the existing region
picker light up.
