# Life Footprint accuracy audit and coverage extension, July 2026

This is the audit behind the July 2026 factor change (branch
`claude/footprint-accuracy-audit-fkzqjz`). It has three parts: an accuracy
audit of the existing factors, a set of new surveyable categories, and a
scored shortlist. What actually shipped is marked; what could not be verified
to this page's standard is queued, not guessed.

## The hard constraint this session

The build sandbox reaches package registries and web-search snippets, but the
egress proxy returns 403 (CONNECT policy denial) for every government host:
`dcceew.gov.au`, `gov.uk`, `abs.gov.au`, `epa.nsw.gov.au`, `rba.gov.au`, and
also for most academic full-text hosts (MDPI, PMC, ScienceDirect, Zenodo). So
"verified" here means one of two things:

1. Read directly from a **primary workbook already saved in this folder**
   (the DEFRA 2025 full set, the US EPA Supply Chain CSV, the RBA F11.1
   exchange-rate series). This is the strong tier and is what shipped.
2. Corroborated only across **web-search snippets** of a named source. This is
   the weak tier: good enough to document and queue, not to ship a number
   from, per the no-invented-factors rule.

Four research passes (transport, diet, consumption input-output, new
categories) ran against this constraint. Their findings are folded in below.

---

## Part 1: accuracy audit of existing factors

### 1.1 Flight vintage mislabel (shipped fix, strong)

- **Current:** the code cited "UK Government (DESNZ / DEFRA) GHG Conversion
  Factors **2026**" for every flight and the FACTOR_SET note.
- **Finding:** the flight values in the code match the DEFRA **2025** full-set
  workbook cell for cell (domestic 0.22928, short-haul economy 0.12576,
  long-haul business 0.33940, first 0.46814, and so on). The workbook held
  here is stamped "Year: 2025, next publication June 2026". The 2026 edition
  could not be reached to verify, and the shipped numbers are the 2025 ones.
  So the label overstated the vintage and did not match its own numbers.
- **Better source + URL:** the 2025 edition it actually uses,
  https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2025
- **New value:** no number changes; the citation now reads 2025 and the method
  says the numbers match that workbook and the 2026 edition was not reachable.
- **Uncertainty:** none introduced. This is a provenance correction.

### 1.2 Domestic flight band applied to Australian sectors (audited, kept)

- **Current:** DEFRA domestic (to/from UK) average-passenger factor 0.229 kg
  CO2-e per passenger-km, with radiative forcing, applied to Australian
  domestic sectors.
- **Finding:** no cleanly published Australian domestic per-passenger-km factor
  exists on a reachable host. Deriving one from BITRE (11,116 Gg CO2-e domestic
  aviation over ~71.1 billion revenue passenger-km, 2018-19) gives about
  **0.156 kg CO2-e per pkm on a CO2-only basis**. Australian domestic sectors
  are long and cruise-dominated, so per km they are more efficient than short
  UK hops; but once a standard radiative-forcing uplift (about 1.7 to 1.9) is
  added, the Australian figure lands around 0.27 to 0.30, in the same zone as
  DEFRA-with-RF 0.229.
- **Better source + URL:** BITRE Australian Infrastructure and Transport
  Statistics Yearbook, transport energy and environment chapter,
  https://www.bitre.gov.au/publications (gov host, not reachable this session).
- **New value:** unchanged. The DEFRA-with-RF domestic factor is a defensible
  proxy; the method now says so and names the BITRE cross-check. Swapping to a
  BITRE-derived Australian factor is queued (it needs the primary table read,
  and a documented RF choice).
- **Uncertainty:** aviation per-km carries roughly +/-30% across aircraft and
  load factors regardless of source; the band is unchanged.

### 1.3 Public transport uses a UK rail proxy, with a note pointing the wrong way (shipped fix, strong on the correction)

- **Current:** 0.035 kg CO2-e per pkm, the UK national-rail factor, with a note
  that "TfNSW renewable procurement likely lowers the real figure".
- **Finding:** the note pointed the wrong way for a location-based tool. On the
  physical NSW grid (0.64 scope 2 + 0.03 scope 3 kg per kWh, far more
  coal-heavy than the UK grid), the real Sydney rail figure is **higher** than
  the proxy, about **0.074 to 0.079 kg CO2-e per pkm** (Sydney Trains and NSW
  TrainLink 2018-19 operational emissions over passenger-km; secondary source,
  Leon Arundell's analysis of TfNSW and ABS data). Only on a **market-based**
  basis, crediting Sydney Trains' 100% renewable electricity contracts (LGC
  purchase from 2021, a $1.9bn Snowy Energy PPA from 2027), does the figure
  fall close to zero.
- **Better source + URL:** an Australian per-pkm figure would come from a TfNSW
  or Sydney Trains sustainability report (gov host, not reachable). The
  renewable contracts are widely reported, for example
  https://reneweconomy.com.au/sydney-trains-goes-zero-emissions-with-renewable-certificate-deal/
- **New value:** the factor stays 0.035 as an explicit, indicative proxy,
  because the best Australian number is secondary-source and public transport
  is a small line (NSW spend is capped at the $50 Opal cap first). The note now
  discloses both bases honestly, consistent with the method's own scope 2
  dual-reporting rule.
- **Uncertainty:** wide and now stated: the location-based figure is about
  twice the proxy, the market-based figure is near zero.

### 1.4 Diet is a coarse per-day-by-type estimate on UK data (audited, kept)

- **Current:** Scarborough et al. 2014 (UK, GWP100 LCA, 2000 kcal), six diet
  types from high-meat 7.19 to vegan 2.89 kg CO2-e per day.
- **Finding:** there is **no Australian source that gives a by-diet-type
  gradient** (high-meat to vegan) to replace Scarborough. The Australian
  literature reports either an average-diet figure or gradients by
  diet-quality, not by diet identity. The two headline Australian numbers are
  not comparable to Scarborough or to each other: Hendrie et al. 2014 gives
  **14.5 kg CO2-e per day** for the average diet but on a top-down EEIO
  boundary; Ridoutt et al. 2021 gives **3.4 kg CO2-e per day** but on the GWP*
  metric. Both anchor the size and direction; neither can re-base the gradient.
- **Better source + URL:** Hendrie et al. 2014, Nutrients 6(1):289,
  https://doi.org/10.3390/nu6010289 ; Ridoutt et al. 2021, Nutrients 13(4):1122,
  https://doi.org/10.3390/nu13041122 (both snippet-only this session).
- **New value:** unchanged. The method note is sharpened to say the Australian
  studies agree on direction but sit on different accounting boundaries, so they
  anchor rather than replace. Re-basing on Australian data is queued and, on
  current evidence, is not possible without mixing incompatible metrics.
- **Uncertainty:** diet already carries a wide band (estimated tier, +/-30%);
  unchanged.

### 1.5 Goods screening: US EEIO on Australian spend via one FX bridge (partly fixed, strong on FX)

- **Current:** US EPA Supply Chain factors (kg CO2-e per 2022 USD, with
  margins) times an "indicative market" AUD/USD rate of 0.65 that was
  explicitly "not the RBA or ATO figure".
- **Finding on the FX bridge:** the RBA F11.1 daily series is saved here. The
  calendar-2025 daily average AUD/USD is **0.6449** (251 trading days, low
  0.598, high 0.672). So the bridge can now be the RBA figure, not a
  third-party stand-in.
- **Finding on the factors themselves:** an Australian input-output equivalent
  exists and is the right long-term replacement: the University of Sydney / ISA
  and IELab **spend-based emission factors** (kg CO2-e per AUD, ISAPC
  classification, the set the Climate Active scheme uses). A free CC-BY-SA 2019
  basic-price version is on Zenodo (record 15524908); current-year
  purchaser-price factors are via FootprintLab. Adopting it would **remove the
  FX bridge entirely** (already AUD-denominated). But the per-category numbers
  could not be read this session (all hosts 403), so the swap is queued.
- **Better source + URL:** RBA F11.1,
  https://www.rba.gov.au/statistics/historical-data.html ; IELab / Climate
  Active spend factors, https://zenodo.org/records/15524908 and
  footprintlab.io.
- **New value:** FX 0.65 to **0.6449 (RBA F11.1, cal-2025 average)**, now cited
  to the RBA. Factor set unchanged (US EPA), read directly from the local CSV.
- **Uncertainty:** goods screening stays at +/-50%. The FX change is a
  provenance and precision fix, not a widening.
- **Cross-check anchor (documented, not shipped as a number):** Wiedmann et al.
  2023 puts the Australian consumption-based footprint around **27 t CO2-e per
  capita**, with about 83% embodied in imports, a useful sanity anchor for the
  whole screen (secondary source).

### 1.6 Freight vintage (audited, kept)

- **Current:** air 1.10 (DEFRA 2024, with RF), sea 0.016, road 0.108, parcel
  0.75, each labelled with its vintage and rationale.
- **Finding:** the DEFRA 2025 cells differ in basis (for example the 2025
  container-ship 8000+ TEU is 0.0127 versus the tool's "average" 0.016; the
  2025 long-haul freight-flight direct cell is 0.899). These are different
  bases, not a like-for-like refresh, and the existing labels are already
  honest and conservative. Freight is not a named soft spot and is a small
  line. Left unchanged; noted for the annual refresh.

### 1.7 Hotels vintage (shipped fix, strong)

- **Current:** DEFRA hotel-stay factors, "2024 edition (2025 and 2026 not
  reachable)".
- **Finding:** the DEFRA 2025 full set is saved here. Australia 35, Japan 39,
  South Korea 55.8, Singapore 24.5, Philippines 54.3 and UK 10.4 are **all
  identical** in the 2025 edition, and the workbook carries many more verified
  countries.
- **New value:** vintage updated to 2025 (verified), and the country list
  expanded from 6 to 14 to cover the destinations the flight picker offers
  (Indonesia 62.7, Thailand 43.4, Vietnam 38.5, Malaysia 61.5, China 53.5,
  Hong Kong 51.5, India 58.9, United States 16.1 added).
- **Uncertainty:** hotels stay at +/-20%.

---

## Part 2: new surveyable categories

Each is added to the live "A fuller picture" screening panel
(`WiderPicture.jsx` + `lib/screening.js` + `data/screening.js`), outside the
audited total, which is the reconciled live pattern. Spend categories join the
goods grid; waste is a single activity input like hotels.

### Shipped (factor read from a primary source held locally)

| Category | Survey question | Factor + source | Scope | Double-count? |
|---|---|---|---|---|
| **Banking & insurance** | "Bank and loan fees and insurance premiums, dollars a year" | 0.059 kg CO2-e/USD, US EPA Supply Chain v1.3.0, NAICS 522110 commercial banking (insurance carriers 0.033 noted lower) | Upstream of financial services | No overlap with core or other goods |
| **Education & courses** | "Tuition, courses, school fees, dollars a year" | 0.14 kg CO2-e/USD, EPA NAICS 611310 colleges & universities (schools 0.186 noted higher) | Upstream of education services | No |
| **Home improvements** | "Renovations and trade work on your home, dollars a year" | 0.211 kg CO2-e/USD, EPA NAICS 236118 residential remodelers | Upstream of construction/repair | Distinct from appliances/furniture goods lines; note steers big items there |
| **Rubbish to landfill** | "Household rubbish to landfill, kg a week (your share of the red bin)" | 0.497 kg CO2-e/kg (497 kg/t), DEFRA 2025 household residual waste, landfill column | Landfill decomposition and gas | No; only landfill counts, not recycling/organics |

All four factors are read from primary files in this folder (the EPA CSV, the
DEFRA 2025 workbook). Waste uses DEFRA as a **stated proxy** for the preferred
Australian DCCEEW NGA waste factors, exactly as flights and hotels already use
DEFRA; the National Waste Report (about 512 kg municipal waste per person a
year, roughly a third landfilled) gives the survey its Australian anchor.

### Queued (factor only snippet-verified this session, so not shipped)

| Category | Survey question | Best factor + source | Why queued |
|---|---|---|---|
| **Pets** | "Dogs and cats, count" | dog ~770, cat ~310 kg CO2-e/yr (Berners-Lee, *How Bad Are Bananas?*; Okin 2017 PLOS ONE) | Factor is from a book/snippet, no primary held; ship as indicative next refresh |
| **Vehicle embodied (amortised)** | "Car type and years you will keep it" | ICE ~6 to 8 t, EV ~10 to 14 t embodied (Ricardo 2011; Polestar LCAs), amortised over ownership | Values snippet-only from secondary LCA reports; survey is heavier |
| **Home construction embodied** | "Floor area renovated, m²" | ~200 to 230 kg CO2-e/m² (Sun et al. 2023, Buildings) | AU primary but snippet-only; the EPA spend route above ships in its place |
| **Mains water** | "Water use, kL a year" | 0.362 kg CO2-e/kL (DEFRA 2025 supply + treatment, held locally) | Verifiable but tiny (~0.07 t/household); left out to avoid survey friction, documented here |

---

## Part 3: scored shortlist

Same axes as `improvement-scoring.md`: Defensibility, audience Value, Effort
(5 = smallest build), Fit. Defensibility is capped low when the value could not
be verified against a source this session.

| # | Item | D | V | E | F | Σ | Verdict |
|---|---|---|---|---|---|---|---|
| A | Flight vintage 2026 to 2025 (matches the workbook held here) | 5 | 4 | 5 | 5 | 19 | **Shipped** |
| B | Hotels to DEFRA 2025 + expand to 14 flight-picker countries | 5 | 4 | 5 | 5 | 19 | **Shipped** |
| C | FX bridge to RBA F11.1 cal-2025 average 0.6449 | 5 | 3 | 5 | 5 | 18 | **Shipped** |
| D | Public-transport note fixed (location vs market both stated) | 5 | 3 | 5 | 5 | 18 | **Shipped** |
| E | Banking & insurance spend line (EPA 522110, local CSV) | 4 | 4 | 5 | 5 | 18 | **Shipped** |
| F | Education spend line (EPA 611310, local CSV) | 4 | 3 | 5 | 5 | 17 | **Shipped** |
| G | Home-improvements spend line (EPA 236118, local CSV) | 4 | 4 | 5 | 5 | 18 | **Shipped** |
| H | Waste-to-landfill line (DEFRA 2025 factor, local; AU proxy) | 4 | 4 | 4 | 5 | 17 | **Shipped** |
| I | Diet method note sharpened (AU anchors, metric mismatch) | 5 | 2 | 5 | 5 | 17 | **Shipped** |
| J | Domestic-flight method note (BITRE cross-check, kept DEFRA) | 5 | 2 | 5 | 5 | 17 | **Shipped** |
| K | Swap US EPA goods for AU IELab spend factors (drops FX) | 1* | 5 | 2 | 4 | 12 | **Queued: values not readable** |
| L | Pets line (dog 770, cat 310 kg/yr) | 2* | 4 | 4 | 5 | 15 | **Queued: snippet-only factor** |
| M | AU rail per-pkm to replace the UK proxy | 2* | 2 | 4 | 5 | 13 | **Queued: only secondary source** |
| N | Vehicle-embodied amortised line | 2* | 3 | 2 | 4 | 11 | **Queued: snippet-only, heavy survey** |
| O | Mains-water line (DEFRA 0.362, local) | 4 | 1 | 4 | 5 | 14 | **Deferred: tiny, survey friction** |

\* In-principle defensibility is higher; the score records what could be
verified against a source this session.

**Shipped:** A to J, ten changes, every factor read from a primary file held in
this folder. **Queued with precise unblock notes:** K to O, in
`factor-sources.md`. The single highest-value queued item is K (the Australian
IELab spend factor set), which would both replace the US proxy and remove the
currency step; it needs a session that can reach Zenodo or FootprintLab to read
the per-category numbers.
