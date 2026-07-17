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

## Annual refresh checklist

1. NGA Factors (new edition ~August): Tables 1, 5, 6, 9 → `factors.js`
   ELECTRICITY, GAS, ROAD_FUELS; bump FACTOR_SET id.
2. UK conversion factors (new edition ~June): flights (all bands/cabins),
   freight air/sea/HGV.
3. Re-check the flagged single-mirror values against the primary workbooks.
4. Refresh seed profile with the new financial year's bills and itineraries.
5. Benchmarks: EDGAR annual report, DCCEEW quarterly inventory.
