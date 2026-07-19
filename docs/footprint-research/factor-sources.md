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
  indicative proxy pending a published NSW per-pkm figure. **July 2026: note
  corrected.** The old note claimed TfNSW renewable procurement "lowers the real
  figure"; that is a market-based argument inside an otherwise location-based
  tool and points the wrong way for the physical grid. On the NSW grid
  (coal-heavy, 0.67 kg/kWh incl scope 3) the real Sydney rail figure is about
  twice this proxy, roughly 0.074 to 0.079 kg/pkm (Sydney Trains / NSW TrainLink
  2018-19 operational data via Leon Arundell's analysis, secondary source). On a
  market-based basis (Sydney Trains 100% renewable electricity contracts from
  2021, $1.9bn PPA from 2027) it is near zero. The note now states both bases;
  the factor stays 0.035 because the best AU number is secondary-source and PT is
  a small, fare-capped line. A published TfNSW/BITRE per-pkm figure remains
  queued.

## Flights: UK Government (DESNZ/DEFRA) GHG Conversion Factors 2025 edition

Per passenger-km, WITH radiative forcing. **July 2026 correction:** the code
previously cited the "2026" edition, but every shipped value matches the
**2025** full-set workbook (saved as
`docs/footprint-research/ghg-conversion-factors-2025-full-set.xlsx`,
"Business travel- air" tab) cell for cell: domestic average 0.22928, short-haul
economy 0.12576 and business 0.18863, long-haul economy 0.11704, premium
0.18726, business 0.33940, first 0.46814. The workbook is stamped Year 2025,
next publication June 2026. The 2026 edition was not reachable (gov.uk 403), so
the page now cites the edition it can verify. The with-RF to without-RF ratio in
the 2025 workbook is about 1.69 (domestic 0.22928 with, 0.13552 without); the
method still shows the without-RF view as the total divided by 1.7 and labels
it derived.

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
- **July 2026 Australian cross-check (documented, not shipped as numbers).** No
  Australian source gives a by-diet-type gradient to replace Scarborough. The
  two headline AU figures use different boundaries and are not comparable to
  Scarborough or each other: Hendrie et al. 2014 (Nutrients 6(1):289,
  doi 10.3390/nu6010289) reports the average AU diet at 14.5 kg CO2-e/day on a
  top-down EEIO boundary (red meat 8.0/day); Ridoutt et al. 2021 (Nutrients
  13(4):1122, doi 10.3390/nu13041122) reports 3.4 kg CO2-e/day on the GWP*
  metric (ADG-consistent diet -42%). Both anchor size and direction only. All
  snippet-verified (full text 403). The method note now says the AU studies
  agree on direction but sit on different boundaries, so they anchor rather than
  replace. Re-basing on AU data stays queued and, on current evidence, cannot be
  done without mixing metrics.
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

## Wider basket (screening): goods & services, hotels, waste (updated July 2026)

Shipped as the optional "A fuller picture" panel (`src/footprint/data/screening.js`,
set id `epa-scv1.3-defra2025`), kept outside the audited total and labelled
screening throughout.

**July 2026 accuracy-audit update:**
- **FX bridge to RBA.** The AUD/USD rate is now 0.6449, the RBA F11.1 daily
  series averaged over calendar 2025 (read from the RBA workbook saved here,
  251 trading days, low 0.598, high 0.672), replacing the earlier "indicative
  market, not RBA" figure of 0.65.
- **Hotels to DEFRA 2025.** Vintage confirmed against the local 2025 full-set
  workbook; AU 35, JP 39, KR 55.8, SG 24.5, PH 54.3, GB 10.4 are unchanged. The
  country list expanded from 6 to 14 to match the flight picker: ID 62.7,
  TH 43.4, VN 38.5, MY 61.5, CN 53.5, HK 51.5, IN 58.9, US 16.1 added, all read
  from the workbook.
- **Three new goods spend lines**, each read from the EPA v1.3.0 CSV held here,
  "with margins" column, one named NAICS subsector each (the same rule as the
  original seven): banking & insurance 522110 commercial banking 0.059
  (insurance carriers 524126 0.033, noted lower); education 611310 colleges &
  universities 0.14 (schools 611110 0.186, noted higher); home improvements
  236118 residential remodelers 0.211.
- **Waste to landfill line** (new, activity-based like hotels): DEFRA 2025
  "Refuse: household residual waste", landfill column, 497 kg CO2-e/tonne =
  0.497 kg/kg, read from the local workbook. A stated proxy for the preferred
  DCCEEW NGA waste factors (still gov-blocked). Survey asks kg/week to landfill;
  the National Waste Report (~512 kg municipal waste per capita/yr, ~1/3
  landfilled) is the Australian anchor for the hint, not a shipped factor.
- **AU input-output replacement queued.** The University of Sydney / IELab
  spend-based factors (kg CO2-e per AUD, ISAPC, the Climate Active set) would
  replace the US EPA factors and remove the FX bridge. Free CC-BY-SA 2019 basic-
  price version at Zenodo 15524908; current-year purchaser-price via
  FootprintLab. Per-category values not readable this session (all hosts 403). Re-verified in a follow-up session where egress reached
search and package mirrors but the EPA host, gov.uk and the RBA/ATO were all
403; values came from faithful hash-matched mirrors and were confirmed by
independent parses agreeing to the cent (three sourcing agents plus an
adversarial reconciler per target).

Goods & services: US EPA Supply Chain GHG Emission Factors v1.3.0, NAICS-6,
2022 USD, "with margins" column, kg CO2-e per USD (DOI 10.23719/1531143). One
named subsector each, never a group average:
- Clothing & footwear (apparel 315) 0.12; footwear/leather 316 is 0.282, noted
- Electronics & gadgets (audio/video 3343) 0.081; computers 334111 0.058 and
  semiconductors 334413 0.215 differ widely, so not averaged into one
- Household appliances (3352) 0.172
- Furniture & homewares (337) 0.188
- Personal care & cosmetics (325620) 0.194; soap/detergent 0.355 kept out
- Health & medical (health services 621) 0.083; pharma prep 325412 is 0.099
- Recreation & entertainment (arts/recreation 71) 0.086
Food services 722 (0.194) is deliberately excluded: diet already prices food,
and spend-pricing it again would double count. Two independent parses agreed to
0.001 kg; a single authoritative dataset lineage (the GitHub mirrors are
byte-identical copies of the one EPA file, counted as one source, not many).

Currency: 1 AUD ~ 0.65 USD, indicative calendar-2025 market average (Exchange
Rates UK 0.6449, corroborated by exchange-rates.org 0.6451). A market price,
not an emission factor, and NOT the RBA F11.1 or ATO figure (both 403), so it
is labelled indicative. The 2022-USD-versus-current-AUD price change is not
adjusted for (screening). Re-source from RBA F11.1 or ATO at the next refresh.

Hotels: UK Government (DESNZ / DEFRA) hotel-stay set, kg CO2-e per room-night by
country, 2024 edition. Confirmed across three independent transcriptions
(carbonr R `sysdata`, greenlang `business_travels.csv`, nzi-pro Standard UK
template) and identical across the 2022 to 2024 editions; UK also witnessed by
Circular Ecology (10.4). Values: AU 35, JP 39, KR 55.8, SG 24.5, PH 54.3,
UK 10.4 (a UK London row of 11.5 also exists). DEFRA publishes no rest-of-world
row, so "Somewhere else" uses a tool-chosen mid of 40, labelled non-DEFRA. The
2025 and 2026 workbooks were unreachable (403), so 2024 is the stated vintage;
confirm at refresh, since the older ~2019 vintage was far higher (values do
move between methodology revisions).

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

Three additions were designed, scored and then withheld because the build
environment could not verify their values against any source (egress proxy
allows package registries and search snippets only; gov.uk, dcceew.gov.au,
epa.gov and all factor mirrors returned 403). Dataset identities verified;
values not retrieved; nothing shipped from memory. Details and scores in
`improvement-scoring.md`. The unblock list:

**Update, July 2026 accuracy audit: waste now shipped (DEFRA proxy).** The
DEFRA 2025 full-set workbook is now saved in this folder, so the household
residual-waste landfill factor (497 kg CO2-e/t) is read directly and shipped as
a stated proxy, the same way flights and hotels use DEFRA. The preferred
Australian DCCEEW NGA per-stream landfill factors are still gov-blocked and
remain queued to swap in at the next reachable session. See
`accuracy-audit-2026.md` for the full audit and scored shortlist.

**Still queued after the July 2026 audit** (see `accuracy-audit-2026.md`):
- **AU IELab spend factors** to replace US EPA and drop the FX bridge (Zenodo
  15524908 / FootprintLab; per-category values not readable this session).
- **AU rail per-pkm** to replace the UK proxy (TfNSW/Sydney Trains report or
  BITRE; only secondary-source ~0.074-0.079 kg/pkm surfaced).
- **DCCEEW NGA waste factors** to replace the DEFRA waste proxy.
- **Pets** (dog ~770, cat ~310 kg CO2-e/yr, Berners-Lee / Okin 2017): ship as
  indicative once a primary can be held.
- **Vehicle embodied** amortised (ICE ~6-8 t, EV ~10-14 t; Ricardo, Polestar
  LCAs): snippet-only, heavier survey.
- **Mains water** (DEFRA 0.362 kg/kL, held locally): verifiable but tiny
  (~0.07 t/household); deferred on survey-friction grounds, not verification.

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
4. In a session with dcceew.gov.au, epa.nsw.gov.au and abs.gov.au egress: swap
   the DEFRA waste proxy for the NGA Factors waste tables (per-stream landfill
   factors, scope and gas-capture basis) plus an ABS Waste Account per-capita
   to-landfill tonnage. The wider-basket AUD/USD rate is now RBA F11.1
   (cal-2025 average 0.6449, read from the local workbook); refresh it each
   year. Highest-value queued swap: the AU IELab/Climate Active spend factors
   (Zenodo 15524908 / FootprintLab) to replace US EPA and remove the FX step.
5. Refresh seed profile with the new financial year's bills and itineraries.
6. Benchmarks: EDGAR annual report, DCCEEW quarterly inventory.
7. Entries pin their factor set id (`factor_set`); closed years are never
   re-priced. New factors apply forward only.
