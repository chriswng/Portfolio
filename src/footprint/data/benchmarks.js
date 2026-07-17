// Benchmarks used to contextualise a personal total. Each carries its basis,
// because the comparisons are only honest if the boundaries are named:
// this tool's boundary (household energy, personal travel, freight, diet) is
// narrower than the national accounting behind the averages. Rendered
// directly in the Basis of Preparation.

export const BENCHMARKS = [
  {
    id: 'budget2030',
    label: '1.5°C lifestyle budget, 2030',
    tco2e: 2.5,
    basis: 'IGES, Aalto University and D-mat, 1.5-Degree Lifestyles (2019; Hot or Cool Institute 2021 update): per-person lifestyle target of 2.5 t by 2030, then 1.4 t by 2040 and 0.7 t by 2050 on a 1.5°C pathway.',
    url: 'https://hotorcool.org/1-5-degree-lifestyles-report/',
  },
  {
    id: 'global',
    label: 'Global average per person',
    tco2e: 6.6,
    basis: 'All greenhouse gases per capita, 2023: 6.59 t CO2-e (EDGAR / JRC, excludes land use). CO2 only is about 4.7 t (Global Carbon Budget).',
    url: 'https://edgar.jrc.ec.europa.eu/report_2024',
  },
  {
    id: 'aus',
    label: 'Australian average per person',
    tco2e: 22.3,
    basis: 'All greenhouse gases per capita, 2024: 22.3 t CO2-e (EDGAR / JRC, excludes land use). Including the land sink, the national inventory works out nearer 16 t a person.',
    url: 'https://edgar.jrc.ec.europa.eu/',
  },
];

export const BUDGET_2030 = BENCHMARKS[0];
export const AUS_AVG = BENCHMARKS[2];

// Boundary caveat shown wherever a benchmark comparison appears.
export const BENCHMARK_CAVEAT =
  'Boundary note: this audit counts household energy, personal travel, freight and diet. It excludes the wider basket of goods and services inside national per-capita figures, so any total here understates a full consumption footprint.';
