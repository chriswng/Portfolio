// Emission factor set for the Life Footprint Dashboard.
// Single source of truth: the calculation engine prices entries from these
// tables, and the Basis of Preparation section renders them directly, so the
// method page can never drift from the numbers actually used.
//
// Factors are snapshotted onto entries when they are logged, so a future
// factor refresh never silently rewrites history (re-saving an entry
// re-prices it). Research notes and verification status for every value:
// docs/footprint-research/factor-sources.md.

export const FACTOR_SET = {
  id: 'CW-PF-2026.1',
  updated: 'July 2026',
  note: 'Electricity, gas and transport fuels: DCCEEW NGA Factors 2025 (August 2025). Aviation: UK Government GHG Conversion Factors 2026. Refreshed when new editions publish.',
};

// Canonical category order: identity colours and stack order everywhere.
// Palette validated for CVD separation and contrast (dataviz six checks).
export const CATEGORIES = [
  { id: 'electricity', label: 'Electricity', color: 'var(--fp-electricity)', hex: '#75821D' },
  { id: 'flight', label: 'Flights', color: 'var(--fp-flight)', hex: '#635BFF' },
  { id: 'road', label: 'Road & rail', color: 'var(--fp-road)', hex: '#B56A00' },
  { id: 'freight', label: 'Freight', color: 'var(--fp-freight)', hex: '#0891B2' },
  { id: 'gas', label: 'Gas', color: 'var(--fp-gas)', hex: '#C7274A' },
  { id: 'diet', label: 'Diet', color: 'var(--fp-diet)', hex: '#8A4FBE' },
  { id: 'other', label: 'Other', color: 'var(--fp-other)', hex: '#6E7469' },
];

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[6];

// ---------------------------------------------------------------------------
// Electricity: DCCEEW National Greenhouse Accounts Factors 2025, Table 1.
// Scope 2 = generation attribute of purchased electricity (location-based).
// Scope 3 = fuel extraction plus transmission and distribution losses.
// kg CO2-e per kWh.
// ---------------------------------------------------------------------------
export const ELECTRICITY_SOURCE = {
  name: 'DCCEEW, Australian National Greenhouse Accounts Factors 2025',
  detail: 'Table 1: scope 2 and scope 3 emission factors for purchased electricity by state. Published August 2025; replaces the 2024 workbook.',
  url: 'https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2025',
};

// label: the full state or territory name, used consistently everywhere the
// visitor picks a place (guided audit) and on the method factor table. grid:
// the named interconnected system the factor applies to, shown only on the
// method table where the region detail belongs. ACT sits on the NSW grid.
export const ELECTRICITY = {
  NSW: { label: 'New South Wales & ACT', s2: 0.64, s3: 0.03 },
  VIC: { label: 'Victoria', s2: 0.78, s3: 0.09 },
  QLD: { label: 'Queensland', s2: 0.67, s3: 0.09 },
  SA: { label: 'South Australia', s2: 0.22, s3: 0.04 },
  WA: { label: 'Western Australia', grid: 'SWIS grid', s2: 0.50, s3: 0.06 },
  TAS: { label: 'Tasmania', s2: 0.20, s3: 0.03 },
  NT: { label: 'Northern Territory', grid: 'Darwin-Katherine (DKIS)', s2: 0.56, s3: 0.09 },
};

// Stylised grid decarbonisation trajectory used only by the pathway model:
// annual multiplicative decline applied to the scope 2 factor, floored.
export const GRID_DECLINE = {
  ratePerYear: 0.92,
  floor: 0.05,
  source: 'Stylised from DCCEEW, Australia’s emissions projections 2024 (electricity sector decline to 2035 under the 82% renewables trajectory), flattened to a single annual rate.',
};

// ---------------------------------------------------------------------------
// Natural gas (residential pipeline). NGA Factors 2025, Tables 5 and 6.
// Scope 1 combustion 51.53 kg CO2-e/GJ; scope 3 (metro) varies by state.
// Converted to kg CO2-e per MJ.
// ---------------------------------------------------------------------------
export const GAS_SOURCE = {
  name: 'DCCEEW, Australian National Greenhouse Accounts Factors 2025',
  detail: 'Table 5 (natural gas distributed in a pipeline, scope 1 combined CO2, CH4, N2O: 51.53 kg CO2-e/GJ) and Table 6 (scope 3 fuel-cycle, metropolitan, by state).',
  url: 'https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2025',
};

export const GAS = {
  s1_per_MJ: 0.05153,
  // Metro scope 3 by state, kg CO2-e per MJ (TAS uses VIC, NT uses WA per NGA note).
  s3_per_MJ: { NSW: 0.0131, VIC: 0.0040, QLD: 0.0088, SA: 0.0107, WA: 0.0041, TAS: 0.0040, NT: 0.0041 },
};

export const gasS3 = (state) => GAS.s3_per_MJ[state] ?? GAS.s3_per_MJ.NSW;

// ---------------------------------------------------------------------------
// Road transport. NGA Factors 2025, Table 9 (cars and light commercial
// vehicles), converted to kg CO2-e per litre via published energy contents.
// ---------------------------------------------------------------------------
export const ROAD_SOURCE = {
  name: 'DCCEEW, Australian National Greenhouse Accounts Factors 2025',
  detail: 'Table 9, cars and light commercial vehicles: petrol 67.62 kg CO2-e/GJ scope 1 and 17.2 scope 3 at 34.2 GJ/kL; diesel 70.41 and 17.3 at 38.6 GJ/kL. Converted to per litre. A hybrid burns petrol at the petrol factors; only the default consumption differs (4.5 L/100km, indicative real-world figure for current hybrids).',
  url: 'https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2025',
};

export const ROAD_FUELS = {
  petrol: { label: 'Petrol', s1_per_L: 2.31, s3_per_L: 0.59, defaultL100km: 7.0 },
  hybrid: { label: 'Hybrid (petrol)', s1_per_L: 2.31, s3_per_L: 0.59, defaultL100km: 4.5 },
  diesel: { label: 'Diesel', s1_per_L: 2.72, s3_per_L: 0.67, defaultL100km: 6.5 },
  ev: { label: 'Electric (grid-charged)', s1_per_L: 0, s3_per_L: 0, kWhPerKm: 0.16 },
};

// Car-free ground transport, per passenger-km. Someone else's vehicle, so
// scope 3 in a personal inventory.
export const ROAD_MODES = {
  rideshare: {
    label: 'Rideshare / taxi',
    perKm: 0.232,
    source: 'Derived: petrol car at 8.0 L/100km fleet average on the NGA 2025 factors above, fuel cycle included. Deadheading between fares excluded and noted as an understatement.',
  },
  pt: {
    label: 'Public transport (rail, indicative)',
    perKm: 0.035,
    source: 'UK Government GHG Conversion Factors, national rail per passenger-km. Indicative for Sydney electric rail; TfNSW renewable procurement likely lowers the real figure.',
  },
};

// ---------------------------------------------------------------------------
// Flights: distance-based, per passenger-km. UK Government (DESNZ/DEFRA)
// GHG Conversion Factors 2026 (June 2026), business travel: air, WITH
// radiative forcing at the AR6-based 1.7 multiplier. Without-RF figures are
// shown in the method as with-RF divided by 1.7 and labelled derived.
// Cross-check methodology: ICAO Carbon Emissions Calculator (CO2 only, no RF,
// route-specific fuel burn), which reads materially lower.
// ---------------------------------------------------------------------------
export const FLIGHT_SOURCE = {
  name: 'UK Government (DESNZ / DEFRA) GHG Conversion Factors 2026, business travel: air',
  detail: 'Per passenger-km by haul and cabin, radiative forcing included (1.7 multiplier per the 2025-26 methodology). Great-circle distance uplifted 8% per the DEFRA method. Domestic band applied to Australian domestic sectors as a stated proxy; ICAO calculator used as cross-check.',
  url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026',
};

// Bands: domestic (within Australia, DEFRA domestic average-passenger proxy),
// short-haul international (< 3,700 km), long-haul international (>= 3,700 km).
// kg CO2-e per passenger-km, with RF.
export const FLIGHT_FACTORS = {
  domestic: {
    label: 'Domestic',
    withRF: { economy: 0.229, premium: 0.229, business: 0.229, first: 0.229 },
    noCabinSplit: true,
  },
  shortIntl: {
    label: 'Short-haul international',
    withRF: { economy: 0.126, premium: 0.126, business: 0.189, first: 0.189 },
  },
  longIntl: {
    label: 'Long-haul international',
    withRF: { economy: 0.117, premium: 0.187, business: 0.339, first: 0.468 },
  },
};

export const FLIGHT_RF_MULTIPLIER = 1.7;
export const FLIGHT_DISTANCE_UPLIFT = 1.08;

// Great-circle distances (km, one way) for the route picker.
export const FLIGHT_ROUTES = [
  { id: 'SYD-MEL', label: 'Sydney to Melbourne', km: 706, band: 'domestic' },
  { id: 'SYD-BNE', label: 'Sydney to Brisbane', km: 750, band: 'domestic' },
  { id: 'SYD-PER', label: 'Sydney to Perth', km: 3278, band: 'domestic' },
  { id: 'SYD-AYQ', label: 'Sydney to Uluru', km: 2024, band: 'domestic' },
  { id: 'MEL-ADL', label: 'Melbourne to Adelaide', km: 643, band: 'domestic' },
  { id: 'SYD-AKL', label: 'Sydney to Auckland', km: 2156, band: 'shortIntl' },
  { id: 'SYD-DPS', label: 'Sydney to Denpasar', km: 4630, band: 'longIntl' },
  { id: 'SYD-SIN', label: 'Sydney to Singapore', km: 6288, band: 'longIntl' },
  { id: 'SYD-ICN', label: 'Sydney to Seoul', km: 8317, band: 'longIntl' },
  { id: 'SYD-HND', label: 'Sydney to Tokyo', km: 7823, band: 'longIntl' },
  { id: 'SYD-MNL', label: 'Sydney to Manila', km: 6264, band: 'longIntl' },
  { id: 'SYD-LAX', label: 'Sydney to Los Angeles', km: 12051, band: 'longIntl' },
  { id: 'SYD-LHR', label: 'Sydney to London', km: 17016, band: 'longIntl' },
];

export function flightBandForKm(km, international) {
  if (!international) return 'domestic';
  return km < 3700 ? 'shortIntl' : 'longIntl';
}

// ---------------------------------------------------------------------------
// Freight. kg CO2-e per tonne-km by mode, plus an indicative per-parcel
// figure for people who count parcels rather than tonne-km.
// Air and sea kept at the fully verified 2024-edition cells with the vintage
// stated: the 2026 edition revised air downward, so this reads conservative.
// ---------------------------------------------------------------------------
export const FREIGHT_SOURCE = {
  name: 'UK Government (DESNZ / DEFRA) GHG Conversion Factors, freighting goods',
  detail: 'Air: long-haul dedicated freighter with RF, 2024 edition (verified cell; the 2026 edition revised air freight down, so this is conservative). Sea: container ship average. Road: average laden HGV. Per-parcel: indicative order-of-magnitude from courier corporate disclosures (0.4 to 1.2 kg CO2-e per parcel; Siragusa et al. 2022).',
  url: 'https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting',
};

export const FREIGHT_MODES = {
  road: { label: 'Road (HGV avg laden)', perTonneKm: 0.108 },
  air: { label: 'Air (long-haul, with RF)', perTonneKm: 1.10 },
  sea: { label: 'Sea (container)', perTonneKm: 0.016 },
  parcel: { label: 'Parcel (indicative, each)', perParcel: 0.75 },
};

// ---------------------------------------------------------------------------
// Diet: per-day factors by diet type, from published LCA meta-analysis.
// Deliberately coarse and labelled indicative: diet LCA carries wide ranges
// and the source is UK consumption data, standardised to 2,000 kcal.
// ---------------------------------------------------------------------------
export const DIET_SOURCE = {
  name: 'Scarborough et al. 2014, Climatic Change 125:179-192',
  detail: 'Dietary GHG of meat-eaters, fish-eaters, vegetarians and vegans in the UK (n = 55,504), kg CO2-e per day standardised to 2,000 kcal. Indicative: UK LCA basis, wide ranges. Scarborough et al. 2023 (Nature Food) confirms the gradient on Poore & Nemecek LCA data (vegans about 25% of high meat-eaters).',
  url: 'https://doi.org/10.1007/s10584-014-1169-1',
};

export const DIET_TYPES = {
  highMeat: { label: 'High meat (100g+ per day)', perDay: 7.19 },
  medMeat: { label: 'Medium meat (50 to 99g)', perDay: 5.63 },
  lowMeat: { label: 'Low meat (under 50g)', perDay: 4.67 },
  pescetarian: { label: 'Pescetarian', perDay: 3.91 },
  vegetarian: { label: 'Vegetarian', perDay: 3.81 },
  vegan: { label: 'Vegan', perDay: 2.89 },
};

// Per-kg reference factors for the method page (not used in pricing).
export const FOOD_PER_KG = {
  source: 'Poore & Nemecek 2018 (Science), GWP100 means including land use, as presented by Our World in Data. Beef shown for the dedicated beef herd; dairy-herd beef is 33.3.',
  rows: [
    ['Beef (beef herd)', 99.5], ['Lamb', 39.7], ['Cheese', 23.9], ['Pork', 12.3],
    ['Poultry', 9.9], ['Eggs', 4.7], ['Rice', 4.5], ['Tofu', 3.2],
  ],
};

// ---------------------------------------------------------------------------
// Data quality tiers and the uncertainty band each carries. The central
// estimate never moves; the tiers only set the width of the range shown
// around the total. Band percentages are stated assumptions of this method
// (the framework is published, the exact widths are editorial), applied to
// each entry and summed without correlation credit: the honest worst case
// each way, screening-grade and labelled as such.
// ---------------------------------------------------------------------------
export const QUALITY_SOURCE = {
  name: 'GHG Protocol, Quantitative Inventory Uncertainty guidance; IPCC 2006 Guidelines Vol 1 Ch 3',
  detail: 'Tier framework per the published guidance (measured data carries materially less uncertainty than proxies or extrapolation). The band widths themselves are stated assumptions of this method, not published values: they size the range, never the central estimate.',
  url: 'https://ghgprotocol.org/sites/default/files/2023-03/ghg-uncertainty.pdf',
};

export const QUALITY_TIERS = {
  metered: {
    label: 'Metered or billed',
    band: 0.05,
    plain: 'Meter reads, bill quantities, actual itineraries.',
  },
  forecast: {
    label: 'Forecast',
    band: 0.15,
    plain: 'A metered daily average extended over an unbilled period.',
  },
  estimated: {
    label: 'Estimated',
    band: 0.30,
    plain: 'Spend conversions, counts from memory, survey answers.',
  },
};

// Default tier per category when an entry does not say otherwise. Flights
// come from itineraries and bills from meters; most of the rest arrives as
// an estimate until a real quantity replaces it.
export const DEFAULT_QUALITY = {
  electricity: 'metered', gas: 'metered', flight: 'metered', other: 'metered',
  road: 'estimated', freight: 'estimated', diet: 'estimated',
};

export const qualityOf = (entry) =>
  QUALITY_TIERS[entry.quality] ? entry.quality : (DEFAULT_QUALITY[entry.category] || 'estimated');

// ---------------------------------------------------------------------------
// Other fuels occasionally logged at home. kg CO2-e per unit shown.
// ---------------------------------------------------------------------------
export const OTHER_SOURCE = {
  name: 'DCCEEW, Australian National Greenhouse Accounts Factors 2025',
  detail: 'LPG per litre (scope 1 plus scope 3); firewood treated as biogenic CO2 with non-CO2 gases only, per NGA treatment.',
  url: 'https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2025',
};

export const OTHER_FUELS = {
  lpg: { label: 'LPG (bottled)', unit: 'L', s1: 1.55, s3: 0.10 },
  firewood: { label: 'Firewood (non-CO2 only)', unit: 'kg', s1: 0.03, s3: 0 },
};
