# Footprinting improvements: the scored twelve

> **Later, July 2026 accuracy audit.** A second session scored fifteen more
> items (accuracy fixes plus new categories) on the same four axes and shipped
> ten of them, every factor read from a primary workbook held in
> `docs/footprint-research`. That scored table and the full audit live in
> `accuracy-audit-2026.md`. The twelve below are the original design session.

July 2026 session. Twelve candidate improvements to the carbon accounting and
its usefulness, scored 1 to 5 on four axes:

- **Defensibility (D):** 5 = every number citable to a published source as it
  ships. Anything that would require an unverified value is capped at 1 for
  this session, whatever its in-principle merit; the page does not publish a
  factor it has not checked against the source.
- **Audience value (V):** 5 = directly serves a named audience from
  `audience-brief.md` (1 assessors, 2 own-audit runners, 3 shared-link
  arrivals).
- **Effort (E):** 5 = smallest build.
- **Fit (F):** 5 = perfectly at home with static hosting and
  localStorage-only privacy.

A hard environmental fact shaped this session: the build sandbox's egress
proxy allows package registries and search snippets but blocks direct fetches
of gov.uk, dcceew.gov.au, epa.gov and every factor mirror tried (three
research agents, ~60 tool calls). Dataset identities were verified for all
three factor-dependent ideas; their numeric values were not retrievable, so
the no-invented-factors rule disqualifies them from shipping this session.
They are queued, not killed: the exact document, table and in one case the
exact CSV URL are recorded below.

## The table

| # | Idea | D | V | E | F | Σ | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | Uncertainty range on the total from per-entry data quality tiers (metered, forecast, estimated) | 4 | 4 | 4 | 5 | 17 | **Shipped** |
| 2 | Multi-year audits: close the year, archive it verbatim, open the next, explicit restatement rules (FY2027 rollover is due now) | 5 | 5 | 2 | 4 | 16 | **Shipped** |
| 3 | Factor-vintage pinning on every entry plus a written refresh workflow in the method | 5 | 4 | 5 | 5 | 19 | **Shipped** |
| 4 | Downloadable assurance-style audit pack: method, factor tables, uncertainty statement and full log as one self-contained document | 5 | 5 | 3 | 5 | 18 | **Shipped** |
| 5 | Radiative forcing sensitivity: state what flights and the total would read without the 1.7 multiplier, both published bases | 5 | 3 | 5 | 5 | 18 | **Shipped** |
| 6 | Scope 2 dual reporting rule (location vs market based) written into the method | 5 | 3 | 5 | 5 | 18 | **Shipped** |
| 7 | Hotel-nights factor per country (UK Government conversion factors, hotel stay table) | 1* | 4 | 3 | 5 | 13 | **Queued: verification blocked** |
| 8 | Spend-based screening block for the excluded goods and services basket (US EPA Supply Chain GHG Emission Factors v1.3, with margins, stated AUD to USD conversion, labelled screening) | 1* | 5 | 2 | 5 | 13 | **Queued: verification blocked** |
| 9 | Household waste-to-landfill line (DCCEEW NGA Factors waste tables) | 1* | 3 | 3 | 5 | 12 | **Queued: verification blocked** |
| 10 | Bus mode for public transport (UK conversion factors, average local bus) | 1* | 2 | 4 | 5 | 12 | **Rejected** |
| 11 | Per-entry what-if sensitivity (re-price any entry under alternative assumptions) | 4 | 2 | 2 | 5 | 13 | **Rejected** |
| 12 | Side-by-side comparison of two share snapshots | 5 | 2 | 2 | 5 | 14 | **Rejected** |

\* In-principle defensibility is 4 to 5 for all four starred ideas; the
score records what could actually be cited this session.

**Recommendation implemented:** ship 1 to 6 now (six improvements, all fully
citable as shipped); queue 7 to 9 behind a fifteen-minute verification pass
from any machine with ordinary internet access; reject 10 to 12 on the
grounds below.

## The queue (blocked on verification, not on design)

The unblock list, precise enough to action from a phone:

1. **Hotels (idea 7).** UK Government "Greenhouse gas reporting: conversion
   factors 2025" (or 2026, published June 2026), condensed set workbook,
   "Hotel stay" tab: per room-night kg CO2e for Australia, Japan, South
   Korea, Singapore, Philippines, plus the fallback row label. Basis notes
   verified this session: room-night denominated, derived from the Cornell
   Hotel Sustainability Benchmarking Index via the Hotel Footprinting Tool;
   the 2026 methodology paper still cites HSBI 2021 data. UK 2022-edition
   value corroborated at 10.4 kg CO2e per room-night (Circular Ecology,
   single lineage).
2. **Spend screening (idea 8).** US EPA "Supply Chain GHG Emission Factors
   v1.3 by NAICS-6" (2022 USD, AR5, all GHGs), file
   `SupplyChainGHGEmissionFactors_v1.3.0_NAICS_CO2e_USD2022.csv` at
   pasteur.epa.gov (DOI 10.23719/1531143): the "with margins" column for
   apparel, electronics, furniture, appliances, pharmaceuticals, ambulatory
   health, recreation, and food services. Conversion assumption to state:
   calendar 2025 average AUD/USD 0.6449 (exchange-rates.org, single source;
   prefer the RBA or ATO FY2026 average when fetchable). Label the block
   screening, never measurement, and keep it outside the audit total.
3. **Waste (idea 9).** DCCEEW NGA Factors 2025 PDF, waste chapter (Tables 15
   and 16 in the 2023 and 2024 editions; 2025 numbering to confirm):
   landfill factors for MSW, food, garden and green, paper and cardboard,
   plus the landfill-gas-capture wording under the table. NSW EPA fact sheet
   24p4522 (March 2024) is the best Australian-government corroborator for
   the food line.

## The rejects, with reasons

- **Bus mode (10).** Even once verifiable, it fails the audience test: the
  public transport line is already labelled an indicative rail proxy in the
  method, splitting it by mode adds a question the guided audit has to ask
  everyone to serve a distinction that moves almost nothing, and the only
  surfaced value this session was single-source with its edition unstated.
  Revisit only if a published Australian per-passenger-km figure lands.
- **Per-entry what-if (11).** Answers a question no named audience asked.
  The abatement curve already answers "what should I do" at the whole-audit
  level, where the answer is honest about interactions; per-entry toggles
  invite exactly the double-counting the pathway model exists to prevent.
- **Snapshot comparison (12).** The audience is unnamed: two snapshot links
  arriving together is a rare event, and the job ("compare two audits") is
  served by the overlay that now also covers year over year after rollover.
  Complexity without a customer.

## What shipped, mapped to audiences

| Shipped | Audience served |
|---|---|
| Uncertainty range + quality chips | 1 (rigour made visible), 2 (better data visibly tightens the band) |
| Multi-year + rollover + restatement rules | 2 (the return visit now has a job: close FY2026, open FY2027) |
| Vintage pinning + refresh workflow | 1 (assurer's first question answered in writing) |
| Audit pack download | 1 (the artefact an assessor recognises), 2 (a record they can keep) |
| RF sensitivity | 1 (shows the method knows where the bodies are buried) |
| Scope 2 dual reporting | 1 (GHG Protocol literacy, stated not implied) |
