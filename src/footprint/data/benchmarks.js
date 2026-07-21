// Benchmarks used to contextualise a personal total. Each carries its basis,
// because the comparisons are only honest if the boundaries are named:
// this tool's boundary (household energy, personal travel, freight, diet) is
// narrower than the national accounting behind the averages. Rendered
// directly in the Basis of Preparation.

export const BENCHMARKS = [
  {
    id: 'budget2030',
    label: '1.5°C lifestyle benchmark',
    kind: 'lifestyle',
    tco2e: 2.5,
    basis: 'A 1.5°C-aligned lifestyle benchmark, not a national target: where an average person\'s footprint needs to be by 2030 to hold warming near 1.5°C. From 1.5-Degree Lifestyles (IGES, Aalto University and D-mat, 2019; Hot or Cool Institute 2021 update): 2.5 t a person by 2030, 1.4 t by 2040, 0.7 t by 2050. It is a consumption-based lifestyle figure, the same kind this calculator estimates.',
    url: 'https://hotorcool.org/1-5-degree-lifestyles-report/',
  },
  {
    id: 'global',
    label: 'World average per person',
    kind: 'national',
    tco2e: 6.6,
    basis: 'National per-capita emissions of all greenhouse gases, world total, 2023: 6.59 t CO2-e (EDGAR / JRC, excludes land use). This is territorial accounting across whole economies, so it is broader than a personal lifestyle footprint.',
    url: 'https://edgar.jrc.ec.europa.eu/report_2024',
  },
  {
    id: 'aus',
    label: 'Australian average per person',
    kind: 'national',
    tco2e: 22.3,
    basis: 'National per-capita emissions of all greenhouse gases, Australia, 2024: 22.3 t CO2-e (EDGAR / JRC, excludes land use). Including the land sink, the national inventory works out nearer 16 t a person. Territorial accounting across the whole economy, so it counts far more than a personal footprint.',
    url: 'https://edgar.jrc.ec.europa.eu/',
  },
];

export const BUDGET_2030 = BENCHMARKS[0];
export const AUS_AVG = BENCHMARKS[2];

// Boundary caveat shown wherever a benchmark comparison appears.
export const BENCHMARK_CAVEAT =
  'Boundary note: this counts household energy, personal travel, freight and diet, plus the optional goods, hotel and new-build home basket if you added it. National per-capita figures still cover a wider boundary, so any total here understates a full consumption footprint.';
