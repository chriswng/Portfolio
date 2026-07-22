# Data sourcing checklist — the four tools

A working list of every document worth downloading to firm up the four tools
(`/grid/`, `/daily/`, `/super/`, `/progress/`), with direct links where they
exist, what to pull from each, and the exact file and field in the repo it
updates. This is the research trail, in the same spirit as the footprint
method page's "still queued, because the numbers could not be verified" list.

## How to use this

You do not need to touch code. For each item below, either:

1. **Download the file** (or copy the exact figure and its as-at date) and hand
   it back to me, and I will update the data file and re-verify, or
2. update the field yourself in the named `data.js` and bump its `accessed` /
   `VERIFIED` / `LAST_UPDATED` / `META.updated` date in the same edit.

Every number on these pages carries a source and a date on purpose. The one
rule that never bends: if a figure cannot be verified to the source, it stays
named-but-marked (`pending`, `estimate`, or left out), never invented. So a
partial pass is fine. Firm up what you can, and the rest keeps its honest flag.

**A note on how these were built.** The tools were assembled in an environment
where the general web (and file downloads) could not be reached. Values were
verified against search snippets, not the source files themselves. That is why
the disclosure CSVs, the NGA workbook and the fund pages below are all worth a
proper download: it moves a figure from "verified via search" to "read from the
primary document", which is the standard this site holds itself to.

## Priority at a glance

| Priority | Tool | What it unblocks |
|---|---|---|
| **1 — highest** | `/super/` | Replaces every `pending` holding weighting with a real figure. The single biggest gap on any of the four tools. |
| 2 | `/grid/` | Confirms the live factors against the actual workbooks; adds earlier years to the Explorer; picks up the 2025-26 state residual mix factors. |
| 3 | `/progress/` | Moves each chapter's number from search-verified to primary-source-read; enables the quarterly refresh. |
| 4 | `/daily/` | Firms up the handful of items priced from external estimates rather than the site's own factor engine. |
| Ongoing | Live feed | Confirm the OpenNEM live path actually returns data in a real browser (it could not be tested from the build environment). |

---

## 1. Super Fund Holdings (`/super/`) — the priority

**The gap.** Under section 1017BB of the Corporations Act, every fund must
publish the full holdings of each investment option twice a year, as a CSV or
PDF, within 90 days of 31 December and 30 June. The current cycle is **holdings
as at 31 December 2025**, published by around the end of March 2026. In the
build those CSVs could not be opened, so in `src/super/data.js` every fund's
`topHoldings` is marked `topHoldingsConf: 'pending'` and every flagged holding's
`weighting` reads "not verified this cycle". Reading the CSVs replaces all of
that with real numbers.

**Two numbers, not one.** When you open a CSV, a holding like Commonwealth Bank
shows up with a weight. Capture **both** its weight in the *whole option* and,
if the file breaks it out, its weight in the *Australian shares sleeve* — they
are very different (a name that is ~8% of the equities sleeve is only a few % of
the whole option). The tool will show the whole-option figure and note the
sleeve figure. This distinction is the thing most likely to trip up a reader, so
it matters.

### Per fund: download these three things

For each fund, grab (a) the **31 Dec 2025 portfolio holdings disclosure** file
for the named default option, (b) the current **investment guide / PDS** for the
strategic asset allocation, and (c) the **sustainability / climate page** to
capture the marketing line verbatim. Links below are the disclosure landing
pages already cited in `src/super/data.js` (`fund.disclosure.url`). From each
landing page, pick the CSV/PDF for the specific default option named.

| Fund | Default option (in the data) | Disclosure page (get the 31 Dec 2025 file) |
|---|---|---|
| AustralianSuper | Balanced (MySuper) | https://www.australiansuper.com/investments/what-we-invest-in |
| Australian Retirement Trust | Lifecycle Strategy (Balanced Pool) | https://www.australianretirementtrust.com.au/investments/portfolio-holdings |
| Rest | Core Strategy (MySuper) | https://rest.com.au/investments/how-we-invest/portfolio-holdings |
| Hostplus | Balanced (MySuper) | https://hostplus.com.au/investment/managing-your-investment/portfolio-holdings-disclosure |
| HESTA | Balanced Growth (MySuper) | https://www.hesta.com.au/members/investments/how-hesta-invests/portfolio-holdings |
| Aware Super | FutureSaver MySuper Lifecycle (High Growth) | https://aware.com.au/member/what-we-offer/investments/what-we-invest-in/portfolio-holdings-disclosure |
| Cbus | Growth (MySuper) | https://www.cbussuper.com.au/super/my-investment-options/portfolio-holdings-disclosure |
| UniSuper | Balanced (MySuper) | https://www.unisuper.com.au/investments/how-we-invest/portfolio-holdings |
| Vanguard Super | Lifecycle (MySuper) | https://www.vanguard.com.au/super/help-and-resources/forms-and-documents |
| Colonial First State | FirstChoice Employer, CFS Lifestage | https://www.cfs.com.au/personal/resources/funds-and-performance/portfolio-holdings.html |

> If a link has moved, search "*[fund name]* portfolio holdings disclosure" —
> every fund is legally required to publish one, so it exists. Note the exact
> as-at date printed on the file; it goes into `fund.disclosure.asOf`.

### What each download updates

- **Holdings CSV →** `FUNDS[n].topHoldings` (replace the shared placeholder list
  with the option's actual top listed holdings) and `topHoldingsConf` (change
  `'pending'` to `'sourced'`). For each flagged company, fill `flagged[].weighting`
  with the real whole-option weight and set `conf` to `'sourced'`.
- **Investment guide / PDS →** `FUNDS[n].saa` (replace the indicative ranges with
  the published strategic allocation), `saaConf` (`'indicative'` → `'sourced'`),
  and `growthDefensive`.
- **Sustainability page →** `FUNDS[n].marketing[].quote`. Capture the wording
  **verbatim** and note the page; then the `quote` confidence chip
  ("Position, not verbatim", `CONFIDENCE.quote`) can be upgraded, and ideally
  save a dated snapshot (screenshot or archive.org link) so the exact wording is
  provable.

### Cross-checks worth doing while you are in there

- **Market Forces fund profiles** — useful for the fossil-fuel holdings view and
  for any change in a stake between cycles. Profiles used in the data:
  - AustralianSuper Balanced: https://www.marketforces.org.au/superfunds/australiansuper-balanced/
  - UniSuper Balanced: https://www.marketforces.org.au/superfunds/unisuper-balanced/
  - "$33bn in fossil fuel expansion" analysis: https://www.marketforces.org.au/top-australian-super-funds-invest-33-billion-in-fossil-fuel-expansion/
- **APRA MySuper product-level statistics** (for option design / context, not
  holdings): https://www.apra.gov.au/quarterly-superannuation-statistics
- **Whitehaven / Woodside substantial-holding notices** (ASX announcements) if
  you want to date AustralianSuper's stake precisely — the data currently states
  11.8% of Whitehaven as at February 2026; a substantial-holder notice is the
  primary source for that.

### New funds to add once sourceable

Queued in `COPY.backlog.queued`: AMP, HUB24, Brighter Super, Spirit Super, NGS
Super, and Australian Ethical (as a screened contrast). Each needs the same
three documents. AMP's disclosure page:
https://www.amp.com.au/superannuation/portfolio-holdings

### When you update `/super/`, also

- Bump `VERIFIED` in `src/super/data.js` to the new date, and add a dated line to
  `CHANGELOG` describing what changed (the change log is public and is the
  corrections trail).
- The method page (`/super/method/`) renders its source table from the same
  `FUNDS` data, so it updates automatically. No separate edit needed.

---

## 2. Grid Intensity (`/grid/`)

### 2a. National Greenhouse Accounts Factors 2025 (location-based Scope 2)

- **Direct download (XLSX, ~93 KB):**
  https://www.dcceew.gov.au/sites/default/files/documents/national-greenhouse-account-factors-2025.xlsx
- **Publication page:**
  https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2025
- **Extract:** Table 1, Scope 2 electricity emission factors by state/territory
  (kg CO2-e/kWh). Confirm each value in `LOCATION_FACTORS` in `src/grid/data.js`:
  NSW/ACT 0.64, VIC 0.78, QLD 0.67, SA 0.22, TAS 0.20, WA (SWIS) 0.50, NT (DKIS)
  0.56. These also back the footprint engine (`src/footprint/data/factors.js`),
  so a change here should be mirrored there.
- **Updates:** `LOCATION_FACTORS`, and confirms `NGA_SOURCE`.

### 2b. Residual mix factor (market-based Scope 2)

- **Publication page:** Clean Energy Regulator, *Voluntary market-based Scope 2
  emissions guideline*:
  https://cer.gov.au/document/voluntary-market-based-scope-2-emissions-guideline
- **Extract:** the residual mix factor. The data currently holds the 2024-25
  national figure, **0.81 kg CO2-e/kWh** (`RMF` in `src/grid/data.js`).
- **The change worth catching:** state-level residual mix factors are being
  introduced from the **2025-26** reporting year. When published, they replace
  the single national `RMF` with a per-state set (the code and the `yearNote`
  already flag this as coming). This is the highest-value grid update.
- **Updates:** `RMF`, `RMF_SOURCE`, `EXPLORER_YEARS`.

### 2c. Earlier years for the Explorer year selector

- **Where:** the same DCCEEW NGA page carries prior editions (2024, 2023…):
  https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors
  and the CER guideline carries prior residual mix factors.
- **Extract:** the state Scope 2 factors and the national RMF for each earlier
  year you want in the dropdown. Right now the Explorer ships **one** verified
  edition on purpose; each earlier year you can source to the workbook adds an
  option.
- **Updates:** add entries to `EXPLORER_YEARS` in `src/grid/data.js` (each with
  its own `locationSource`, `rmf`, `rmfSource`).

### 2d. Optional: replace the indicative fallback curves

- The offline fallback daily-intensity curves (`TYPICAL_CURVES` in
  `src/grid/data.js`) are **hand-built indicative shapes**, clearly labelled as
  such in the UI. If you want them to be real, pull a representative recent day
  of 5-minute regional intensity per NEM region from OpenElectricity and average
  a typical weekday shape. Source: https://explore.openelectricity.org.au/
- **Updates:** `TYPICAL_CURVES` (and drop the "hand-built" caveat if they become
  data-derived). Low priority — they only drive the answer when the live feed is
  down, and they are honestly labelled.

---

## 3. Australia's Climate Progress (`/progress/`)

Each chapter in `src/progress/data.js` (`CHAPTERS`) carries a `sources` list
resolving to the `SOURCES` map. Download the primary source behind each to move
it from search-verified to read-from-source, and to run the quarterly refresh.
When you refresh, bump `META.updated` (it renders top and bottom of the page)
and each chapter's `period`.

| Chapter | Number in the data | Primary source to download | Direct-ish link |
|---|---|---|---|
| Coal | First month renewables beat coal (Sep 2025); coal at a quarterly low | AEMO Quarterly Energy Dynamics Q4 2025 | https://www.aemo.com.au/-/media/files/major-publications/qed/2025/qed-q4-2025.pdf |
| Renewables | 51% of NEM in Dec-2025 quarter (from 46%); 39% full-year 2024 | AER State of the Energy Market 2025, ch.2 (NEM) | https://www.aer.gov.au/system/files/2025-08/State%20of%20the%20energy%20market%202025%20-%20Chapter%202%20-%20National%20Electricity%20Market.pdf |
| Renewables target | 82% by 2030; ~75% projected; ~8 GW short | AEMO Draft 2026 ISP + Climate Change Authority | https://aemo.com.au/energy-systems/major-publications/integrated-system-plan-isp and https://www.climatechangeauthority.gov.au/ |
| Electric cars | BEV 8.3% of 2025 sales (>103,000); BEV+PHEV 13.1% (from ~9.5%) | Electric Vehicle Council 2025 EV sales release / FCAI VFACTS | https://electricvehiclecouncil.com.au/reports/ |
| EV 2030 benchmark | ~60% of new sales by 2030 (a modelled recommendation, not a law) | Climateworks Centre EV modelling | https://climateworkscentre.org/resource/accelerating-ev-uptake-policies-to-realise-australias-electric-vehicle-potential/ |
| Build rate | ~7 GW added in 2025 | Clean Energy Regulator quarterly carbon market reports | https://cer.gov.au/markets/reports-and-data/quarterly-carbon-market-reports |
| National emissions | 458.9 Mt, −2.1% y/y, 24.5% below 2005 (incl. LULUCF) | DCCEEW National Greenhouse Gas Inventory Quarterly Update, Dec 2025 | https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-gas-inventory-quarterly-update-december-2025 |
| Rooftop solar | 28.3 GW / ~4.3M systems end-2025 | Clean Energy Council rooftop + storage report (Jul–Dec 2025) | https://cleanenergycouncil.org.au/news-resources/rooftop-solar-and-storage-report-july-to-dec-2025 |

### Two specific things to verify against the primary source

1. **The emissions % below 2005 is LULUCF-sensitive.** The headline moved through
   the year as the land sector was revised (≈28.5% to Jun-2025, ≈27.4% to
   Sep-2025, 24.5% to Dec-2025). Confirm the 24.5% against the actual Dec-2025
   release PDF, and if you can find the **without-LULUCF** figure to citation
   grade, we can add it (it is deliberately omitted now, per the method section).
2. **The 2020 renewables reference is all-Australia, not NEM.** The "about a
   quarter in 2020" reference point is on the wider all-Australia boundary
   (Australian Energy Statistics), and the copy now says so. A clean NEM-only
   2020 figure, if you find one, would let that reference sit on the same
   boundary as the reveal. Source: https://www.energy.gov.au/energy-data/australian-energy-statistics

### Updates

`CHAPTERS[].reveal` / `reference` / `gap` values, `SOURCES[].accessed`,
`META.updated`, and each chapter's `period` in `src/progress/data.js`.

---

## 4. Sustainability Daily (`/daily/`)

Most of the Guess-the-Footprint pool (27 of 33 items) is priced **live from the
site's own footprint factor tables** (`src/footprint/data/factors.js` and
`equivalences.js`), so those move automatically when the footprint factors are
refreshed and need nothing here. Only the items priced from **external
estimates** are worth firming up. They are already flagged `estimate: true` and
carry a caveat in the UI.

| Item (`GUESS_POOL` id in `src/daily/data.js`) | Current basis | Better source to download |
|---|---|---|
| `netflix-year` | Carbon Trust ~55 g/hour, 2 h/day assumption | Carbon Trust streaming update (confirm current figure): https://www.carbontrust.com/our-work-and-impact/guides-reports-and-tools/carbon-impact-of-video-streaming |
| `dog-year` | Alexander et al. 2022, 10 kg dry-food dog | Paper: https://www.nature.com/articles/s41598-022-22631-0 |
| `beer` | 0.5 kg placeholder, packaging-dependent | A primary per-litre beverage LCA (e.g. Poore & Nemecek 2018 drinks data) to replace the placeholder |

**Greenwash-or-Not** claims are composites (never attributed to a real company)
and their reasoning reuses the ACCC eight principles already in
`src/fashion/data.js`. No downloads needed unless the ACCC updates its guidance:
- ACCC environmental/green claims guidance: https://www.accc.gov.au/business/environmental-claims-and-sustainability/greenwashing
- ASIC greenwashing guidance (financial claims): https://asic.gov.au/regulatory-resources/financial-services/how-to-avoid-greenwashing-when-offering-or-promoting-sustainability-related-products/

### Updates

`GUESS_POOL[].kg` / `source` / `note` for the three external items in
`src/daily/data.js`.

---

## 5. Live feed verification (ongoing, not a download)

The shared OpenNEM client (`src/lib/opennem.js`) powers the `/grid/` live view
and the `/progress/` live garnish. It could not be exercised from the build
environment (no outbound web), so its parsing is written defensively and every
failure path is labelled honestly. **On the live site, open `/grid/` in a real
browser and confirm a live number appears** (state selector → a gCO2e/kWh figure
with a "Live, as of HH:MM" stamp, not the "live feed unavailable" fallback). If
it always shows the fallback:

- Check the browser console for a CORS or network error against
  `data.openelectricity.org.au` / `data.opennem.org.au`.
- Confirm the v3 JSON path in `fetchRegionJson()` still matches OpenElectricity's
  current public file layout (they rebranded from OpenNEM; the client already
  tries both hosts).
- The endpoints in use are the public per-region 7-day power files documented at
  https://explore.openelectricity.org.au/ (and the Open Electricity API docs).

No key is required for the public data files. If OpenElectricity later requires
an API key, that becomes a build-time decision (the site ships no secrets), and
the honest fallback already covers the meantime.

---

## Summary: what moves each figure from "estimate" to "sourced"

- **`/super/`**: 10 × (holdings CSV + investment guide + sustainability page),
  31 Dec 2025 cycle. Highest value; turns every `pending` weighting into a real
  number and every marketing line into a verbatim quote.
- **`/grid/`**: the NGA 2025 XLSX and the CER residual-mix guideline (plus the
  2025-26 state RMFs when published, and any earlier years for the dropdown).
- **`/progress/`**: the eight primary sources in the chapter table, re-read each
  quarter, with the LULUCF and boundary caveats confirmed.
- **`/daily/`**: three external-estimate items; everything else already tracks
  the footprint engine.
- **Live feed**: a one-time real-browser confirmation, then leave it to the
  honest fallback.
