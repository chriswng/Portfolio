// Benchmarks used to contextualise a personal total. Each carries its basis,
// because the comparisons are only honest if the boundaries are named:
// this tool's boundary (household energy, personal travel, freight, diet) is
// narrower than the national accounting behind the averages. Rendered
// directly in the Basis of Preparation. `short` is the compact label the
// reveal uses on tiles and reference cards.

export const BENCHMARKS = [
  {
    id: 'budget2030',
    label: '1.5°C lifestyle benchmark',
    short: '1.5°C lifestyle benchmark',
    kind: 'lifestyle',
    tco2e: 2.5,
    basis: 'A 1.5°C-aligned lifestyle benchmark, not a national target: where an average person\'s footprint needs to be by 2030 to hold warming near 1.5°C. From 1.5-Degree Lifestyles (IGES, Aalto University and D-mat, 2019; Hot or Cool Institute 2021 update): 2.5 t a person by 2030, 1.4 t by 2040, 0.7 t by 2050. It is a consumption-based lifestyle figure, the same kind this calculator estimates.',
    url: 'https://hotorcool.org/1-5-degree-lifestyles-report/',
  },
  {
    id: 'global',
    label: 'World average per person',
    short: 'World average',
    kind: 'national',
    tco2e: 6.6,
    basis: 'National per-capita emissions of all greenhouse gases, world total, 2023: 6.59 t CO2-e (EDGAR / JRC, excludes land use). This is territorial accounting across whole economies, so it is broader than a personal lifestyle footprint.',
    url: 'https://edgar.jrc.ec.europa.eu/report_2024',
  },
  {
    id: 'aus',
    label: 'Australian average per person',
    short: 'Australian average',
    kind: 'national',
    country: 'AU',
    tco2e: 22.3,
    basis: 'National per-capita emissions of all greenhouse gases, Australia, 2024: 22.3 t CO2-e (EDGAR / JRC, excludes land use). Including the land sink, the national inventory works out nearer 16 t a person. Territorial accounting across the whole economy, so it counts far more than a personal footprint.',
    url: 'https://edgar.jrc.ec.europa.eu/',
  },
  {
    id: 'us',
    label: 'American average per person',
    short: 'American average',
    kind: 'national',
    country: 'US',
    tco2e: 17.3,
    basis: 'National per-capita emissions of all greenhouse gases, United States, 2024: about 17.3 t CO2-e (EDGAR / JRC 2025 report basis, excludes land use; the primary report could not be reached from this edition\'s environment, so the figure is carried from EDGAR-based republications and marked about). Territorial accounting across the whole economy, so it counts far more than a personal footprint.',
    url: 'https://edgar.jrc.ec.europa.eu/report_2025',
  },
  {
    id: 'nz',
    label: 'New Zealand average per person',
    short: 'New Zealand average',
    kind: 'national',
    country: 'NZ',
    tco2e: 14.6,
    basis: 'Derived: New Zealand gross emissions of all greenhouse gases, 2023, 76.4 Mt CO2-e (NZ Greenhouse Gas Inventory 1990-2023, excludes forestry) over an estimated resident population of about 5.2 million. Agricultural methane carries much of it. Territorial accounting across the whole economy, so it counts far more than a personal footprint.',
    url: 'https://environment.govt.nz/publications/',
  },
];

export const BUDGET_2030 = BENCHMARKS[0];
export const AUS_AVG = BENCHMARKS[2];

// The home-country national average for a settings object's country code,
// falling back to Australia for profiles saved before country support.
export const homeAverageFor = (country) =>
  BENCHMARKS.find((b) => b.country === country) || AUS_AVG;

// Boundary caveat shown wherever a benchmark comparison appears.
export const BENCHMARK_CAVEAT =
  'Boundary note: this counts household energy, personal travel, freight and diet, plus the optional goods, hotel and new-build home basket if you added it. National per-capita figures still cover a wider boundary, so any total here understates a full consumption footprint.';
