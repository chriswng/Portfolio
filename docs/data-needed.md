# Data needed: the combined sourcing list

One list of every document worth downloading to firm up the site's tools, with
direct links where they exist, what to pull from each, and the exact file and
field in the repo it updates. This file combines and supersedes the three
earlier lists (`docs/data-sourcing.md` for the four tools,
`src/targets/data-gaps.md` for the Target Tracker, and
`docs/footprint-research/international-verification-needed.md` for the
footprint's US and NZ factors), and adds the footprint's 2026 factor-refresh
cycle. The research trail with per-factor extraction notes stays in
`docs/footprint-research/factor-sources.md`; the fashion page's provenance and
attribution record stays in `docs/data-sources/README.md`.

## How to use this

You do not need to touch code. For each item below, either:

1. **Download the file** (or copy the exact figure and its as-at date) and hand
   it back in a session pointed at this file, and the data file gets updated
   and re-verified, or
2. update the field yourself in the named data file and bump its `accessed` /
   `VERIFIED` / `LAST_UPDATED` / `META.updated` date in the same edit.

Every number on these pages carries a source and a date on purpose. The one
rule that never bends: if a figure cannot be verified to the source, it stays
named-but-marked (`pending`, `estimate`, or left out), never invented. So a
partial pass is fine. Firm up what you can, and the rest keeps its honest flag.

**Why downloads matter.** These tools were assembled in environments where the
general web (and file downloads) could not be reached; an August 2026 re-check
confirmed the build proxy still blocks every primary publisher (gov.uk,
dcceew.gov.au, epa.gov, eia.gov, edgar.jrc.ec.europa.eu, rba.gov.au and the
rest). Values were verified against search snippets, not the source files. A
proper download moves a figure from "verified via search" to "read from the
primary document", which is the standard this site holds itself to.

## Priority at a glance

| Priority | Page | What it unblocks |
|---|---|---|
| **1 — highest** | `/super/` | Replaces every `pending` holding weighting with a real figure. The single biggest gap on the site. |
| 2 | `/targets/` | 26 of the 50 companies have no verified emissions series; each report unlocks or thickens a card. |
| 3 | `/footprint/` | The 2026 factor refresh (DESNZ 2026 is out; NGA 2026 lands about now) plus the queued US and NZ verifications. `/daily/` inherits most of this automatically. |
| 4 | `/grid/` | Confirms the live factors against the actual workbooks; adds earlier years to the Explorer; picks up the 2025-26 state residual mix factors. |
| 5 | `/progress/` | Moves each chapter's number from search-verified to primary-source-read; enables the quarterly refresh. |
| 6 | `/daily/` | Three items priced from external estimates rather than the site's own factor engine. |
| Ongoing | Live feed | Confirm the OpenNEM live path returns data in a real browser. |

---

## 1. Super Fund Holdings (`/super/`) — the priority

**The gap.** Under section 1017BB of the Corporations Act, every fund must
publish the full holdings of each investment option twice a year, as a CSV or
PDF, within 90 days of 31 December and 30 June. The current cycle is **holdings
as at 31 December 2025**, published by around the end of March 2026 (and the
**30 June 2026 cycle** lands by the end of September 2026, so if you are
reading this after then, grab the newer file). In the build those CSVs could
not be opened, so in `src/super/data.js` every fund's `topHoldings` is marked
`topHoldingsConf: 'pending'` and every flagged holding's `weighting` reads "not
verified this cycle". Reading the CSVs replaces all of that with real numbers.

**Two numbers, not one.** When you open a CSV, a holding like Commonwealth Bank
shows up with a weight. Capture **both** its weight in the *whole option* and,
if the file breaks it out, its weight in the *Australian shares sleeve*. They
are very different (a name that is ~8% of the equities sleeve is only a few %
of the whole option). The tool shows the whole-option figure and notes the
sleeve figure. This distinction is the thing most likely to trip up a reader.

### Per fund: download these three things

For each fund, grab (a) the **portfolio holdings disclosure** file for the
named default option, (b) the current **investment guide / PDS** for the
strategic asset allocation, and (c) the **sustainability / climate page** to
capture the marketing line verbatim. Links below are the disclosure landing
pages already cited in `src/super/data.js` (`fund.disclosure.url`). From each
landing page, pick the CSV/PDF for the specific default option named.

| Fund | Default option (in the data) | Disclosure page |
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

> If a link has moved, search "*[fund name]* portfolio holdings disclosure";
> every fund is legally required to publish one, so it exists. Note the exact
> as-at date printed on the file; it goes into `fund.disclosure.asOf`.

### What each download updates

- **Holdings CSV →** `FUNDS[n].topHoldings` (replace the shared placeholder
  list with the option's actual top listed holdings) and `topHoldingsConf`
  (change `'pending'` to `'sourced'`). For each flagged company, fill
  `flagged[].weighting` with the real whole-option weight and set `conf` to
  `'sourced'`.
- **Investment guide / PDS →** `FUNDS[n].saa` (replace the indicative ranges
  with the published strategic allocation), `saaConf` (`'indicative'` →
  `'sourced'`), and `growthDefensive`.
- **Sustainability page →** `FUNDS[n].marketing[].quote`. Capture the wording
  **verbatim** and note the page; then the `quote` confidence chip ("Position,
  not verbatim", `CONFIDENCE.quote`) can be upgraded. Ideally save a dated
  snapshot (screenshot or archive.org link) so the exact wording is provable.

### Cross-checks worth doing while you are in there

- **Market Forces fund profiles** for the fossil-fuel holdings view and any
  change in a stake between cycles:
  - AustralianSuper Balanced: https://www.marketforces.org.au/superfunds/australiansuper-balanced/
  - UniSuper Balanced: https://www.marketforces.org.au/superfunds/unisuper-balanced/
  - "$33bn in fossil fuel expansion": https://www.marketforces.org.au/top-australian-super-funds-invest-33-billion-in-fossil-fuel-expansion/
- **APRA MySuper product-level statistics** (option design context, not
  holdings): https://www.apra.gov.au/quarterly-superannuation-statistics
- **Whitehaven / Woodside substantial-holding notices** (ASX announcements) to
  date AustralianSuper's stake precisely; the data currently states 11.8% of
  Whitehaven as at February 2026, and a substantial-holder notice is the
  primary source for that.

### New funds to add once sourceable

Queued in `COPY.backlog.queued`: AMP, HUB24, Brighter Super, Spirit Super, NGS
Super, and Australian Ethical (as a screened contrast). Each needs the same
three documents. AMP's disclosure page:
https://www.amp.com.au/superannuation/portfolio-holdings

### When you update `/super/`, also

- Bump `VERIFIED` in `src/super/data.js` to the new date, and add a dated line
  to `CHANGELOG` describing what changed (the change log is public and is the
  corrections trail).
- The method page (`/super/method/`) renders its source table from the same
  `FUNDS` data, so it updates automatically. No separate edit needed.

---

## 2. Target Tracker (`/targets/`)

The tracker was compiled from search corroboration only, leaving 26 of the 50
companies with an unverified emissions series and a further batch with only
one or two years. Each document below closes a specific gap: hand the PDF (or
its emissions table) over and the matching card upgrades from `unverified` or
`partial` toward `sourced` in `src/targets/data.js`, with the in-page basis of
preparation updated in the same change.

### 2a. Unlocks a whole card (series currently empty)

One emissions table each is enough.

- **Santos (STO)** – Climate Transition Action Plan and annual data:
  https://www.santos.com/sustainability/ctap/ and the latest Annual Report
  data tables. Need: equity Scope 1 and 2 by calendar year, 2020 to 2025.
  Sources conflicted (5.24 vs about 4.37 Mt for 2024) so nothing was charted;
  the company claims its 2030 target of 4.1 Mt or lower was reached in 2025
  and the claim is currently untestable on the page.
- **APA Group (APA)** – 2025 Climate Transition Plan:
  https://www.apa.com.au/news/asx-and-media-releases/apa-releases-2025-climate-transition-plan
  Need: absolute tonnes for the gas infrastructure portfolio, FY21 baseline
  and FY22 to FY25. APA reports percentages only in what search could reach.
- **Brambles (BXB)** – 2025 Sustainability Review:
  https://www.brambles.com/Content/cms/FY25-Results/pdf/Sustainability/Brambles-2025-Sustainability-Review.pdf
  Need: the Scope 1 and 2 split (the combined 1.29 Mt Scope 1+2+3 total is
  corroborated but useless against its 42% Scope 1 and 2 target).
- **NAB, Westpac, ANZ, Macquarie** – each bank's climate report or
  sustainability data pack (September year end; Macquarie 31 March):
  NAB https://www.nab.com.au/content/dam/nab/documents/reports/corporate/2023-climate-report.pdf
  and successors; Westpac Climate Transition Plan and the December 2025
  Sustainability Update; ANZ 2025 Climate Report; Macquarie FY25
  Sustainability Report. Need: operational Scope 1 and 2 (market based) by
  year. All four are unverified on the page today.
- **Evolution Mining (EVN)** – Sustainability Report 2025:
  https://evolutionmining.com/wp-content/uploads/2025/11/evolution-mining-sustainability-report-web.pdf
  Need: the adjusted FY2020 baseline tonnage and the market based series FY23
  to FY25 (the company restated FY23 and FY24 after a miscalculation, so take
  the FY25 report's restated numbers).
- **Aristocrat Leisure (ALL)** – FY25 Sustainability Report:
  https://s25652.pcdn.co/wp-content/uploads/2025/12/FY25_Sustainability_Report.pdf
  Need: any absolute Scope 1 and 2 tonnage. SBTi validated targets with no
  public tonnage reachable by search is the current state.
- **James Hardie (JHX)** – Sustainability Report FY2025:
  https://assets.ctfassets.net/dzi2asncd44t/5jWpMtnrYu30RiNoEVBDge/30b8ef93fac91e8cd6e6f7abd4dcc229/JHX_Sustainability_Report_FY2025_FINAL.pdf
  Need: absolute Scope 1 and 2 by year (CY2021 baseline and since). The 14%
  below baseline claim is corroborated, the tonnes are not.
- **ALS (ALQ)** and **Computershare (CPU)** – ALS Sustainability Report 2025
  and Computershare Sustainability Report FY25 (URLs on the cards). Need:
  absolute Scope 1 and 2 series. For Computershare also confirm the 2042 net
  zero year and the 89.3% by 2030 figure, which are single sourced.
- **QBE, IAG, Suncorp, ASX** – latest sustainability or climate disclosure
  reports (URLs on the cards). Need: operational Scope 1 and 2 by year, and
  for Suncorp a definitive base year (2018 vs FY2020 conflicts in public
  material).
- **Cochlear (COH)** – Annual Report 2025 sustainability section. Need:
  absolute tonnes behind the stated 71% cut from FY2019.
- **Stockland (SGP)** and **GPT (GPT)** – FY25 Environmental Management
  Approach (Stockland) and Climate and Nature Disclosure Statement data
  tables (GPT). Need: gross Scope 1 and 2 tonnage, not the net of offsets
  position. GPT's third party numbers did not reconcile so nothing was used.
- **Medibank (MPL)** – Sustainability Summary 2025 and the re-baselined
  FY2021 inventory when published. Need: gross Scope 1 and 2 by year behind
  the net zero claim.
- **Newmont (NEM)** – the post-Newcrest re-baselined inventory when Newmont
  publishes it (expected in the 2025 sustainability report). Until then the
  card is honestly unassessable.
- **Light & Wonder (LNW)** – any CSR document with Scope 1 and 2 tonnage; the
  2024 Annual Report has none reachable by search.

### 2b. Thickens a thin series (one or two years today)

- **Fortescue (FMG)** – FY22 Climate Change Report (or FY25 Climate
  Transition Plan appendix) for the FY2021 baseline absolute; the Real Zero
  target currently has no verified starting point on the card.
- **Qantas (QAN)** – FY25 Sustainability Report data tables for FY2020 to
  FY2024, plus the net (after credits) figures the target is actually set on.
- **Wesfarmers (WES)** – FY2020 group Scope 1 and 2 baseline and the FY2025
  figure, from the 2025 Annual Report climate disclosures.
- **Coles (COL)** – 2025 Sustainability Report emissions table for absolute
  tonnes FY2021 to FY2025 (only a rounded FY2020 figure is on the card), and
  which year the 71.4% reduction claim attaches to.
- **Telstra (TLS)** – Bigger Picture Sustainability Report data pack for the
  FY2019 Scope 1 and 2 baseline (the circulating 3.97 Mt figure is all
  scopes) and FY2025.
- **Woolworths (WOW)** – F25 Sustainability Report data table for the F25
  absolute figure on the F23 SBTi basis, plus confirmation the F24 figure is
  market based.
- **Northern Star (NST)** – FY22 to FY24 Scope 1 and 2 from the ESR data
  packs, to fill the gap between baseline and FY25.
- **South32 (S32)** – ESG databook figures to replace the two third party
  compiled points on the card.
- **Amcor (AMC)** – the restated post-Berry baseline when FY26 reporting
  lands; the card says figures before and after FY2025 are not comparable.
- **Transurban (TCL)**, **ResMed (RMD)**, **WiseTech (WTC)**, **Xero (XRO)**,
  **The Lottery Corporation (TLC)**, **Goodman (GMG)**, **Scentre (SCG)**,
  **Sigma (SIG)** – each needs its earlier years from the reports already
  named on its card; Sigma's first combined Chemist Warehouse period report
  (new 30 June year end) replaces the stale January 2023 point.
- **CBA** – Sustainability Reporting Appendix for FY21 to FY25 operational
  tonnage (only the FY2020 baseline is verified, which the page correctly
  refuses to assess).
- **Woodside (WDS)** – 2020 to 2022 net equity values to complete the series,
  from the Scope 1 and 2 page or CTAP progress reports.

### 2c. Resolves a recorded conflict or restatement

- **Rio Tinto (RIO)** – Climate Change Report 2025: the restated 2018
  baseline (34.5 Mt in 2023 reporting vs the 32.6 Mt originally published).
  The card discloses the discrepancy; the report resolves it.
- **CSL (CSL)** and **Sonic Healthcare (SHL)** – the next annual reports, to
  pin the restated base years (both companies' stated percentage progress
  implies a base year different from the published tonnage).
- **Soul Pattinson (SOL)** – FY2025 statutory annual report, to check the
  apparent 2025 restructure (different reporting entity and ABN) and whether
  the reporting boundary changed.

### 2d. Cross-checking infrastructure (improves everything at once)

- **Clean Energy Regulator NGER data** – the published corporate emissions
  and energy CSV:
  https://cer.gov.au/markets/reports-and-data/national-greenhouse-and-energy-reporting-data
  One download cross-checks every Australian operation on the page.
- **SBTi target dashboard export** – https://sciencebasedtargets.org/companies-taking-action
  Confirms or corrects the sbti-validated flags, including the two ambiguous
  cases (Xero "aligned with", Computershare "aligned with"). A prior export
  already sits at `docs/data-sources/sbti-companies-taking-action.xlsx`; a
  fresh one supersedes it.
- **Climate Action 100+ Net Zero Company Benchmark** company assessments –
  https://www.climateaction100.org/progress/net-zero-company-benchmark/
  Corroborates scope coverage and aspirational wording flags for the large
  emitters.
- **S&P DJI ASX 50 constituent list** at the September 2026 rebalance – the
  quarterly index announcement, to keep the fifty current. The method page
  commits to checking this each review.

---

## 3. Life Footprint (`/footprint/`)

Two parts: the 2026 annual factor refresh (new this cycle), and the standing
US and NZ verification list carried over from the July 2026 build. Everything
lands in `src/footprint/data/factors.js` unless noted, with
`docs/footprint-research/factor-sources.md` recording each closure and the
basis of preparation (`/footprint/method/`, from `METHOD` in
`src/footprint/data/copy.js`) updated in the same change. When a refresh
lands, bump `FACTOR_SET.id` and `FACTOR_SET.updated`: the vintage-pinning
machinery exists precisely so a refresh never silently re-prices history.
`/daily/` prices most of its Guess-the-Footprint pool from these same tables,
so it inherits the refresh automatically.

### 3a. The 2026 factor refresh

Publication status as checked 11 August 2026 (search-level; the build proxy
blocks every publisher below, so none of this could be read from the primary
file):

- **DESNZ/DEFRA 2026 conversion factors: published, June 2026.** The current
  flight, freight and hotel factors cite the 2025 edition because the 2026
  edition could not be reached at build time; it now exists and should be
  read. Note: DESNZ republished the 2026 flat file after an error where some
  values (including some hotel-stay countries) appeared as 0 instead of
  blank, so download the republished version. Search corroboration suggests
  aviation carried over from 2025 essentially unchanged, so expect
  confirmation more than change; freight and hotels need actual reading.
  - **Download:** the condensed set (XLSX) at
    https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026
  - **Read:** per-passenger-km aviation by haul and cabin, with and without
    RF (→ `FLIGHT_FACTORS`); air and sea freight per tonne-km (→
    `FREIGHT_MODES.air` / `.sea`; the pathway model now derives its
    sea-shift residual from these, so this one table refresh reaches
    everything); national rail per passenger-km (→ `ROAD_MODES.pt`); **local
    bus per passenger-km** (new, see 3b); hotel stay per room-night by
    country (→ `HOTEL.countries`, and check whether a **New Zealand row**
    exists yet, which would close a stated proxy).
- **NGA Factors 2026 (DCCEEW): not yet published as at 11 August 2026**,
  expected around August 2026. When it lands:
  - **Download:** the workbook from
    https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors
  - **Read:** state scope 2 and scope 3 electricity factors (→
    `ELECTRICITY` AU rows, mirrored in `LOCATION_FACTORS` in
    `src/grid/data.js`), natural gas per GJ scope 1 and 3 (→ `GAS`), and
    liquid fuel combustion and fuel-cycle factors (→ `ROAD_FUELS`).
- **US grid: eGRID2024 appears stalled.** EPA listed January 2026 for
  eGRID2024 but never posted it, and secondary reporting (Cornerstone Data,
  March 2026) says production is paused. **eGRID2023 rev2 (12 June 2025)
  remains the current edition**, so the eGRID2023 request in 3c stands as
  written. The engine currently prices US audits at the EIA 2023 national
  average; if EIA publishes a 2024 average before eGRID moves, that is the
  cheaper interim bump.
- **EDGAR 2025 report (data year 2024): published September 2025.** The
  benchmarks (`src/footprint/data/benchmarks.js`) mix vintages (world 2023,
  AU/US 2024); one read of the 2025 booklet aligns all four rows to data
  year 2024. Search corroboration: world 6.6 t/cap; Australia surfaced
  inconsistently (22.3 and 23.3 both seen), the US as 17.3, and NZ not at
  all, so the booklet must be read, not trusted from snippets.
  - **Download:** https://edgar.jrc.ec.europa.eu/booklet/GHG_emissions_of_all_world_countries_booklet_2025report.pdf
  - **Read:** t CO₂-e per capita, all GHG excl. LULUCF, 2024, for World,
    Australia, United States, New Zealand. Record the exact column used
    (NZ's biogenic methane makes the all-GHG vs CO₂-only distinction a 2x
    difference).
- **Currency bridges.** The NZ goods bridge (`GOODS_FX_BY_COUNTRY.NZ.rate`,
  0.5873 USD per NZD) is the IRD rolling 12-month average **to July 2025**,
  a year staler than the AU rate. Refresh from the IRD overseas currency
  tables (https://www.ird.govt.nz/international-tax/business/overseas-currency)
  to the 12-month average ending June or July 2026, and re-check the AU rate
  from the RBA/ATO annual FY2026 table at the same time
  (https://www.ato.gov.au/tax-rates-and-codes/foreign-exchange-rates-annual-2026-financial-year).
- **EV consumption citation.** `ROAD_FUELS.ev.kWhPerKm` is 0.16 and is the
  one uncited factor in the set; real-world Australian testing runs higher.
  The **AAA Real-World Testing Program** (https://realworld.org.au,
  federally funded, on-road, consumption reported including AC charging
  losses) is the citable source: search-level figures put a Tesla Model Y LR
  at 0.167 and a BYD Atto 3 at 0.171 kWh/km. Pull the vehicle results pages,
  pick a defensible fleet-representative figure, and cite it in
  `ROAD_SOURCE` (the `ev-switch` abatement card and the pathway model read
  the same constant, so one change carries through).

### 3b. Add a bus mode (closes a known understatement)

All public transport is priced at the UK national-rail factor (0.035
kg/pkm) even though the seed data itself says "trains and buses". The DEFRA
workbook carries a local-bus factor (~0.10 kg/pkm in the 2025 edition, about
3x the rail proxy) in the same table the rail figure comes from, so a cited
bus mode costs nothing extra to source. From the same 2026 download as 3a:
read the local bus per-passenger-km figure, add `ROAD_MODES.bus`, let the
onboarding travel step split or pick the mode, and update the method page's
road table and its rail-proxy paragraph in the same change.

### 3c. United States (carried from the July 2026 build)

**P1 · eGRID2023 state-level electricity factors.** The single biggest gap:
the tool prices every US audit at one national average (0.37 kg CO₂-e/kWh); a
real grid runs from roughly a fifth of that (hydro-heavy WA, VT) to well over
double (coal-heavy WV, WY, KY, ND).

- **Download:** eGRID2023 data file (xlsx), latest revision (rev2, June 2025).
  - Data hub: https://www.epa.gov/egrid/download-data
  - Summary tables (PDF cross-check): https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.pdf
  - Release notes: https://www.epa.gov/system/files/other-files/2025-06/egrid2023_release_notes.txt
- **Read:** the `ST` (state) sheet, column **state total output emission
  rate, CO₂e, lb/MWh**, all 50 states + DC. Convert:
  `kg/kWh = lb_per_MWh × 0.45359237 / 1000`.
- **Also read:** the US grid gross loss factor (%) for the scope 3 line (we
  assume ~5%).
- **Lands in:** replace the single `ELECTRICITY.US` row with state rows; the
  region picker in `Onboarding.jsx` lights up automatically once more than
  one US row exists. Move the "state factors queued" note out of
  `METHOD.exclusions` when done.

**P1 · US natural gas and motor fuels (EPA GHG Emission Factors Hub).**
Shipped from the decade-stable 40 CFR Part 98 defaults via search;
high-confidence but should be read from the workbook once.

- **Download:** the Hub's current edition from
  https://www.epa.gov/climateleadership/ghg-emission-factors-hub (2025 xlsx:
  https://www.epa.gov/system/files/other-files/2025-01/ghg-emission-factors-hub-2025.xlsx;
  check for a newer edition first).
- **Read:** stationary natural gas kg CO₂/MMBtu (≈53.06) plus CH₄ and N₂O and
  the GWP set (AR5: CH₄ 28, N₂O 265), against our 0.05034 kg CO₂-e/MJ;
  mobile kg CO₂/gallon for gasoline (≈8.78) and diesel (≈10.21), against our
  2.32 and 2.70 kg/L. Convert MMBtu → MJ at 1,055.06; gallon → L at 3.78541;
  therm → MJ at 105.505.
- **Lands in:** `GAS_INTL.US`, `ROAD_FUELS_INTL.US`.

**P3 · US household energy presets (EIA).** Coarse onboarding starting points
only. Electricity: https://www.eia.gov/tools/faqs/faq.php?id=97&t=3 (≈10,800
kWh/yr); gas: https://www.eia.gov/consumption/residential/ (all-household
average therms/yr). Lands in `ENERGY_PRESETS.US` in `data/copy.js`.

### 3d. New Zealand (carried from the July 2026 build)

**P1 · MfE grid electricity factor and its T&D-loss factor.** Shipped at
0.073 kg CO₂-e/kWh with scope 3 losses at zero, so the line understates
slightly.

- **Download / read:** the Measuring Emissions Catalogue, section 5
  (https://measuringemissionsguide.environment.govt.nz/5_purchased_energy.html;
  2025 PDF:
  https://measuringemissionsguide.environment.govt.nz/files/Measuring-Emissions-Catalogue-2025-v3.pdf;
  check the root for a 2026 edition). Read Table 5.2 (annual grid average,
  kg CO₂-e/kWh) and the separate transmission-and-distribution losses
  factor.
- **Lands in:** `ELECTRICITY.NZ` (`s2`, `s3`).

**P2 · NZ reticulated natural gas.** Shipped on the Australian NGA combustion
factor as a stated proxy; NZ runs a few per cent higher. Read the Catalogue's
stationary-energy natural gas figure (kg CO₂-e per kWh or GJ) plus any
published upstream/T&D gas factor (MBIE supplies the T&D loss). Lands in
`GAS_INTL.NZ`.

**P2 · NZ petrol, diesel (and LPG) per litre.** Also a stated AU proxy;
search-level cross-checks put petrol ≈2.31, diesel ≈2.68 kg CO₂/L. Read the
Catalogue's travel section
(https://measuringemissionsguide.environment.govt.nz/7_travel.html), note
whether the figure is combustion-only or includes upstream. Lands in
`ROAD_FUELS_INTL.NZ`.

**P2 · NZ per-capita GHG benchmark.** Shipped as 14.6 t, derived (inventory
gross ÷ population), not read directly. Prefer the EDGAR 2025 booklet row
(same basis as the AU/US rows; see 3a); pick the **all-GHG** figure, since
NZ's biogenic methane makes the CO₂-only cut misleadingly low, and record the
column. Lands in `BENCHMARKS` id `nz` in `data/benchmarks.js`.

**P2 · NZ hotel per-room-night factor.** NZ was not in the 2025 DEFRA hotel
table, so NZ home nights use the Australian figure (35) as a stated proxy.
Check the DESNZ 2026 hotel tab for a New Zealand row (see 3a); alternatively
a Cornell/Greenview country average. Lands in `HOTEL.countries.NZ`.

**P3 · NZ household electricity preset.** MBIE "Energy in New Zealand"
residential average
(https://www.mbie.govt.nz/building-and-energy/energy-and-natural-resources/energy-statistics-and-modelling/),
EECA / Gen Less as a cross-check. Lands in `ENERGY_PRESETS.NZ`.

**P3 · NZ domestic flight factor.** MfE publishes an NZ domestic aviation
factor (RF ×1.7); only worth swapping in if NZ domestic sectors should price
on the local figure instead of the DEFRA bands.

### 3e. Standing queue (excluded until sourceable)

These stay out of the model rather than ship unchecked numbers, per the
method page's exclusions list: household waste to landfill, pets (dog and cat
food), the embodied emissions of building or buying a car, mains water
supply, an Australian spend-based (EEIO) factor set to replace the US EPA
one (candidates: IELab / Australian EEIO work; for NZ, Manaaki Whenua /
Stats NZ EEIO tables), and a published Australian rail per-passenger-km
figure to replace the UK proxy. Any of these read from a primary source is
welcome and slots straight into the same factors-plus-method pattern.

---

## 4. Grid Intensity (`/grid/`)

### 4a. NGA Factors (location-based Scope 2)

- **Current edition read against:** NGA 2025. Direct download (XLSX):
  https://www.dcceew.gov.au/sites/default/files/documents/national-greenhouse-account-factors-2025.xlsx
  (publication page:
  https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2025).
- **Extract:** Table 1, Scope 2 electricity factors by state/territory
  (kg CO₂-e/kWh). Confirm each value in `LOCATION_FACTORS` in
  `src/grid/data.js`: NSW/ACT 0.64, VIC 0.78, QLD 0.67, SA 0.22, TAS 0.20,
  WA (SWIS) 0.50, NT (DKIS) 0.56. These also back the footprint engine
  (`src/footprint/data/factors.js`), so a change here is mirrored there.
- **When NGA 2026 publishes** (expected about now; see 3a), the new workbook
  supersedes this and both pages refresh together.
- **Updates:** `LOCATION_FACTORS`, `NGA_SOURCE`.

### 4b. Residual mix factor (market-based Scope 2)

- **Publication page:** Clean Energy Regulator, *Voluntary market-based
  Scope 2 emissions guideline*:
  https://cer.gov.au/document/voluntary-market-based-scope-2-emissions-guideline
- **Extract:** the residual mix factor. The data currently holds the 2024-25
  national figure, **0.81 kg CO₂-e/kWh** (`RMF` in `src/grid/data.js`).
- **The change worth catching:** state-level residual mix factors are being
  introduced from the **2025-26** reporting year. When published, they
  replace the single national `RMF` with a per-state set (the code and the
  `yearNote` already flag this as coming). This is the highest-value grid
  update.
- **Updates:** `RMF`, `RMF_SOURCE`, `EXPLORER_YEARS`.

### 4c. Earlier years for the Explorer year selector

- **Where:** the DCCEEW NGA page carries prior editions (2024, 2023...):
  https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors
  and the CER guideline carries prior residual mix factors.
- **Extract:** the state Scope 2 factors and the national RMF for each
  earlier year wanted in the dropdown. The Explorer ships one verified
  edition on purpose; each earlier year sourced to the workbook adds an
  option.
- **Updates:** add entries to `EXPLORER_YEARS` in `src/grid/data.js` (each
  with its own `locationSource`, `rmf`, `rmfSource`).

### 4d. Optional: replace the indicative fallback curves

- The offline fallback daily-intensity curves (`TYPICAL_CURVES` in
  `src/grid/data.js`) are hand-built indicative shapes, labelled as such in
  the UI. To make them real, pull a representative recent day of 5-minute
  regional intensity per NEM region from OpenElectricity and average a
  typical weekday shape: https://explore.openelectricity.org.au/
- **Updates:** `TYPICAL_CURVES` (and drop the "hand-built" caveat). Low
  priority; they only drive the answer when the live feed is down.

---

## 5. Australia's Climate Progress (`/progress/`)

Each chapter in `src/progress/data.js` (`CHAPTERS`) carries a `sources` list
resolving to the `SOURCES` map. Download the primary source behind each to
move it from search-verified to read-from-source, and to run the quarterly
refresh. When you refresh, bump `META.updated` (it renders top and bottom of
the page) and each chapter's `period`.

| Chapter | Number in the data | Primary source to download | Link |
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

1. **The emissions % below 2005 is LULUCF-sensitive.** The headline moved
   through the year as the land sector was revised (≈28.5% to Jun-2025,
   ≈27.4% to Sep-2025, 24.5% to Dec-2025). Confirm the 24.5% against the
   actual Dec-2025 release PDF, and if the **without-LULUCF** figure reaches
   citation grade, it can be added (it is deliberately omitted now, per the
   method section). Newer quarterly updates supersede this row as they land.
2. **The 2020 renewables reference is all-Australia, not NEM.** The "about a
   quarter in 2020" reference point is on the wider all-Australia boundary
   (Australian Energy Statistics), and the copy says so. A clean NEM-only
   2020 figure would let that reference sit on the same boundary as the
   reveal. Source: https://www.energy.gov.au/energy-data/australian-energy-statistics

### Updates

`CHAPTERS[].reveal` / `reference` / `gap` values, `SOURCES[].accessed`,
`META.updated`, and each chapter's `period` in `src/progress/data.js`.

---

## 6. Sustainability Daily (`/daily/`)

Most of the Guess-the-Footprint pool (27 of 33 items) is priced live from the
site's own footprint factor tables (`src/footprint/data/factors.js` and
`equivalences.js`), so those move automatically when the footprint factors
refresh (section 3) and need nothing here. Only the items priced from
external estimates are worth firming up; they are flagged `estimate: true`
and carry a caveat in the UI.

| Item (`GUESS_POOL` id in `src/daily/data.js`) | Current basis | Better source to download |
|---|---|---|
| `netflix-year` | Carbon Trust ~55 g/hour, 2 h/day assumption | Carbon Trust streaming update (confirm current figure): https://www.carbontrust.com/our-work-and-impact/guides-reports-and-tools/carbon-impact-of-video-streaming |
| `dog-year` | Alexander et al. 2022, 10 kg dry-food dog | Paper: https://www.nature.com/articles/s41598-022-22631-0 |
| `beer` | 0.5 kg placeholder, packaging-dependent | A primary per-litre beverage LCA (e.g. Poore & Nemecek 2018 drinks data) to replace the placeholder |

**Greenwash-or-Not** claims are composites (never attributed to a real
company) and their reasoning reuses the ACCC eight principles already in
`src/fashion/data.js`. No downloads needed unless the ACCC updates its
guidance:
- ACCC green claims guidance: https://www.accc.gov.au/business/environmental-claims-and-sustainability/greenwashing
- ASIC greenwashing guidance: https://asic.gov.au/regulatory-resources/financial-services/how-to-avoid-greenwashing-when-offering-or-promoting-sustainability-related-products/

### Updates

`GUESS_POOL[].kg` / `source` / `note` for the three external items in
`src/daily/data.js`.

---

## 7. Live feed verification (ongoing, not a download)

The shared OpenNEM client (`src/lib/opennem.js`) powers the `/grid/` live
view and the `/progress/` live garnish. It could not be exercised from the
build environment, so its parsing is written defensively and every failure
path is labelled honestly. **On the live site, open `/grid/` in a real
browser and confirm a live number appears** (state selector → a gCO₂-e/kWh
figure with a "Live, as of HH:MM" stamp, not the "live feed unavailable"
fallback). If it always shows the fallback:

- Check the browser console for a CORS or network error against
  `data.openelectricity.org.au` / `data.opennem.org.au`.
- Confirm the v3 JSON path in `fetchRegionJson()` still matches
  OpenElectricity's current public file layout (they rebranded from OpenNEM;
  the client already tries both hosts).
- The endpoints in use are the public per-region 7-day power files documented
  at https://explore.openelectricity.org.au/

No key is required for the public data files. If OpenElectricity later
requires an API key, that becomes a build-time decision (the site ships no
secrets), and the honest fallback already covers the meantime.

---

## How to hand results back

Drop the files (or paste the exact figures with their as-at dates) into a
session and point at this document. Each figure goes into the named data file
with its source and access date; statuses (`pending` → `sourced`,
`estimate` → verified) and dates (`VERIFIED`, `META.updated`,
`FACTOR_SET.id`) update in the same change; and the matching methodology
page or basis of preparation is updated alongside, per the repo convention.
For the footprint specifically, record each closure in
`docs/footprint-research/factor-sources.md` (value read, exact
file/sheet/cell, download date) so the research trail stays complete.
