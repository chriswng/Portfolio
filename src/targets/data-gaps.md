# Target Tracker data gaps: what to download to improve it

The tracker at `/targets/` was compiled in an environment that could search the
web but could not open documents, so every figure rests on what could be
corroborated from search results. That left 26 of the 50 companies with an
unverified emissions series and a further batch with only one or two years.
Everything below is a specific document that closes a specific gap. Download
the PDF (or copy the emissions data table out of it) and hand it over, and the
matching card upgrades from `unverified` or `partial` toward `sourced` in
`src/targets/data.js`, with the method page updated in the same change.

Priority order: section 1 unlocks whole cards, section 2 thickens thin series,
section 3 resolves recorded conflicts, section 4 is cross-checking
infrastructure.

## 1. Unlocks a whole card (series currently empty)

These companies show a commitment but no chart. One emissions table each is
enough.

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
  Sustainability Update; ANZ 2025 Climate Report; Macquarie FY25 Sustainability
  Report. Need: operational Scope 1 and 2 (market based) by year. All four are
  unverified on the page today.
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

## 2. Thickens a thin series (one or two years today)

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

## 3. Resolves a recorded conflict or restatement

- **Rio Tinto (RIO)** – Climate Change Report 2025: the restated 2018
  baseline (34.5 Mt in 2023 reporting vs the 32.6 Mt originally published).
  The card discloses the discrepancy; the report resolves it.
- **CSL (CSL)** and **Sonic Healthcare (SHL)** – the next annual reports, to
  pin the restated base years (both companies' stated percentage progress
  implies a base year different from the published tonnage).
- **Soul Pattinson (SOL)** – FY2025 statutory annual report, to check the
  apparent 2025 restructure (different reporting entity and ABN) and whether
  the reporting boundary changed.

## 4. Cross-checking infrastructure (improves everything at once)

- **Clean Energy Regulator NGER data** – the published corporate emissions
  and energy CSV:
  https://cer.gov.au/markets/reports-and-data/national-greenhouse-and-energy-reporting-data
  One download cross-checks every Australian operation on the page.
- **SBTi target dashboard export** – https://sciencebasedtargets.org/companies-taking-action
  Confirms or corrects the sbti-validated flags, including the two ambiguous
  cases (Xero "aligned with", Computershare "aligned with").
- **Climate Action 100+ Net Zero Company Benchmark** company assessments –
  https://www.climateaction100.org/progress/net-zero-company-benchmark/
  Corroborates scope coverage and aspirational wording flags for the large
  emitters.
- **S&P DJI ASX 50 constituent list** at the September 2026 rebalance – the
  quarterly index announcement, to keep the fifty current. The method page
  commits to checking this each review.

## How to hand it back

Drop the PDFs (or paste the emissions tables) into a session and point at
this file. Each figure goes into `src/targets/data.js` with its source and
access date, the company's status and verified date update, and the basis of
preparation is updated in the same change, per the repo convention.
