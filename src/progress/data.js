// All editorial copy and every number for Australia's Climate Progress
// (/progress/). Words and figures live here, not in components. Australian
// English, no em dashes, Chris's voice: plain, direct, a little dry, honest
// about what is not on track.
//
// DATA HONESTY (this page's whole point). Every metric carries:
//   - value + the period it covers ("data to")
//   - a source id resolving to SOURCES (name, detail, url, accessed)
//   - a `status`: 'sourced' (read straight from a cited release),
//     'derived' (arithmetic shown in the method), or 'estimate' (a benchmark
//     that is a recommendation or a range, labelled as such).
// A figure that could not be verified to citation grade is not shown as a
// confident number; where it matters it is described qualitatively and the
// method says so. Nothing here blends the live grid snapshot with the annual
// figures: they are different quantities and stay apart.

export const META = {
  navLabel: 'Progress',
  // Single source of truth for the last-updated stamp, rendered top and bottom.
  updated: '21 July 2026',
  cadence: 'Reviewed quarterly, as the national inventory and the market data refresh. A stale tracker is worse than none, so the date above is the honest test of it.',
  live: {
    label: 'On the grid right now',
    building: 'Reading the live grid mix',
    // Shown only when fetchNemSnapshot() returns live data.
    renewLabel: 'renewables',
    coalLabel: 'coal',
    asOf: 'as of',
    note: 'A live snapshot of the five NEM regions, generation share this minute. It is a different quantity from the annual figures below and is never mixed into them. WA and the NT are not in the NEM, so they are not in this number.',
  },
};

export const INTRO = {
  tag: 'The tracker',
  kicker: 'Australia · climate transition',
  title: ['What is actually', 'changing'],
  sub: 'Doom is easy and cheerleading is worse. This is the middle path: a handful of real numbers on Australia\'s energy transition, each one shown against where it was and where the target needs it to be. The gap is stated plainly. Where the number is genuinely moving, that is the hope. Where it is not, the page says so.',
  read: 'Each chapter reads the same way. First the reference point, quietly: what it was, or what the target needs. Then the number as it stands now. Then one sentence on the gap between them.',
  scroll: 'Scroll',
};

// Sources, resolved by id from each metric. name + detail + url + accessed.
export const SOURCES = {
  openelectricity: {
    name: 'OpenElectricity (OpenNEM)',
    detail: 'Generation-share analysis of AEMO NEM dispatch data, published by the Open Electricity project.',
    url: 'https://openelectricity.org.au/analysis/40-renewable-and-rising-how-the-nems-transition-stacks-up-in-q1-2025',
    accessed: '21 July 2026',
  },
  aemo_qed: {
    name: 'AEMO Quarterly Energy Dynamics',
    detail: 'AEMO\'s quarterly review of the NEM: generation mix, demand and prices.',
    url: 'https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/data-nem/data-dashboard-nem',
    accessed: '21 July 2026',
  },
  aer_som: {
    name: 'AER State of the Energy Market 2025',
    detail: 'Australian Energy Regulator, NEM chapter: renewable and fossil generation shares by year.',
    url: 'https://www.aer.gov.au/industry/registers/resources/reviews/state-energy-market-2025',
    accessed: '21 July 2026',
  },
  aes_2020: {
    name: 'Australian Energy Statistics (DCCEEW)',
    detail: 'National electricity generation by fuel type, 2020 (all Australia, a wider boundary than the NEM).',
    url: 'https://www.energy.gov.au/energy-data/australian-energy-statistics/electricity-generation',
    accessed: '21 July 2026',
  },
  cca_82: {
    name: 'Climate Change Authority / AEMO Draft 2026 ISP',
    detail: 'On the AEMO draft 2026 Integrated System Plan, projects operating by 2030 reach about 75 per cent renewable NEM supply; the Climate Change Authority puts the pipeline roughly 8 GW short of the 82 per cent target.',
    url: 'https://www.climatechangeauthority.gov.au/',
    accessed: '21 July 2026',
  },
  evc_2025: {
    name: 'Electric Vehicle Council / VFACTS',
    detail: 'EV sales and new-car market share for calendar 2025, reported January 2026 from FCAI VFACTS data.',
    url: 'https://electricvehiclecouncil.com.au/media-releases/ev-sales-hit-record-highs-in-2025-with-38-rise-and-new-monthly-record-in-december/',
    accessed: '21 July 2026',
  },
  nev_strategy: {
    name: 'National EV Strategy context (Climateworks Centre)',
    detail: 'The 60 per cent of new-car sales by 2030 figure is a modelled trajectory recommended to realise Australia\'s EV potential, not a legislated sales target. Australia has no binding EV sales target.',
    url: 'https://climateworkscentre.org/resource/accelerating-ev-uptake-policies-to-realise-australias-electric-vehicle-potential/',
    accessed: '21 July 2026',
  },
  cer_lgc: {
    name: 'Clean Energy Regulator',
    detail: 'Annual renewable capacity added to the grid, large and small scale combined.',
    url: 'https://cer.gov.au/markets/reports-and-data/quarterly-carbon-market-reports',
    accessed: '21 July 2026',
  },
  nga_dec25: {
    name: 'National Greenhouse Gas Inventory Quarterly Update, December 2025 (DCCEEW)',
    detail: 'Emissions for the year to December 2025, all sectors including land use (LULUCF), against the June 2005 base year for the 43 per cent target.',
    url: 'https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-gas-inventory-quarterly-update-december-2025',
    accessed: '21 July 2026',
  },
  cec_rooftop: {
    name: 'Clean Energy Council / Clean Energy Regulator',
    detail: 'Cumulative rooftop solar capacity and installation count to the end of 2025.',
    url: 'https://cleanenergycouncil.org.au/news-resources/rooftop-solar-and-storage-report-july-to-dec-2025',
    accessed: '21 July 2026',
  },
};

// Freshness labels for the status flag beside each number.
export const STATUS = {
  sourced: 'Sourced figure',
  derived: 'Derived here',
  estimate: 'Benchmark / estimate',
};

// The scroll-driven chapters. Each: a reference point first, then the reveal,
// then one plain sentence on the gap. `reveal.value` is the number the
// CountUp animates to; formatting is decimals + prefix/suffix.
export const CHAPTERS = [
  {
    id: 'coal',
    icon: 'flame',
    tag: 'Coal',
    kicker: 'Chapter 01 · NEM generation',
    reference: {
      label: 'For the whole life of the National Electricity Market',
      value: 'Coal ran the grid',
      note: 'Black and brown coal supplied the majority of NEM generation every year until recently. In 2020 coal was about 54 per cent of Australia\'s electricity generation.',
    },
    reveal: {
      value: 1, decimals: 0, prefix: '', suffix: '',
      big: 'A first',
      label: 'September 2025 was the first month ever in which renewables out-generated coal across the NEM.',
    },
    gap: 'Coal is still the single largest fuel over a full year, but its quarterly output hit an all-time low in the December 2025 quarter, down about 5 per cent on the year before. The direction is real. The fleet is not gone.',
    period: 'Month and quarter to December 2025',
    status: 'sourced',
    sources: ['openelectricity', 'aemo_qed', 'aes_2020'],
  },
  {
    id: 'renewables',
    icon: 'bolt',
    tag: 'Renewables',
    kicker: 'Chapter 02 · NEM generation',
    reference: {
      label: 'Five years ago',
      value: 'About a quarter',
      note: 'Renewables supplied roughly a quarter of Australia\'s electricity generation in 2020, on the wider all-Australia boundary. The 2030 target is 82 per cent of the NEM from renewables.',
    },
    reveal: {
      value: 51, decimals: 0, prefix: '', suffix: '%',
      label: 'renewables share of NEM supply in the December 2025 quarter, including storage, up from 46 per cent a year earlier',
      sub: 'Over the full year 2024 renewables were 39 per cent of NEM generation. The share first passed 40 per cent of annual supply during 2025.',
    },
    gap: 'The target is 82 per cent by 2030. On AEMO\'s draft 2026 plan the projects committed today reach about 75 per cent by 2030, and the Climate Change Authority puts the pipeline roughly 8 GW short. Halfway there on a quarterly basis, with the hardest stretch left.',
    period: 'Quarter to December 2025; full year 2024',
    status: 'sourced',
    sources: ['openelectricity', 'aer_som', 'cca_82'],
  },
  {
    id: 'ev',
    icon: 'car',
    tag: 'Electric cars',
    kicker: 'Chapter 03 · New-car sales',
    reference: {
      label: 'Five years ago',
      value: 'Under 1%',
      note: 'Battery-electric cars were less than 1 per cent of new-car sales in 2020. A modelled path to net zero has them near 60 per cent of new sales by 2030.',
    },
    reveal: {
      value: 8.3, decimals: 1, prefix: '', suffix: '%',
      label: 'battery-electric share of new-car sales in 2025, with more than 103,000 sold',
      sub: 'Counting plug-in hybrids as well, the electric share was 13.1 per cent in 2025, up from about 9.5 per cent in 2024.',
    },
    gap: 'From under 1 per cent to 8 per cent in five years is a real climb. The 60 per cent by 2030 figure is a recommended trajectory, not a law, and there is no binding sales target. At the current pace the country is well short of that line.',
    period: 'Calendar year 2025',
    status: 'sourced',
    sources: ['evc_2025', 'nev_strategy'],
  },
  {
    id: 'build',
    icon: 'chart',
    tag: 'Build rate',
    kicker: 'Chapter 04 · Renewable capacity added',
    reference: {
      label: 'What the target needs',
      value: 'A sustained, higher rate',
      note: 'The 82 per cent target needs new wind and solar built and connected year after year, not in one good year. The pipeline is judged against that run rate, not a single number.',
    },
    reveal: {
      value: 7, decimals: 0, prefix: '~', suffix: ' GW',
      label: 'renewable capacity added to the grid in 2025, large and small scale combined',
      sub: 'That follows a similar build in 2024. Two solid years, close to a record run rate.',
    },
    gap: 'Steady, but not yet closing the gap. On the draft 2026 ISP the committed pipeline lands near 75 per cent by 2030, and the Climate Change Authority estimates it is roughly 8 GW short of what 82 per cent needs. The build has to lift, not just hold.',
    period: 'Calendar years 2024 and 2025',
    status: 'sourced',
    sources: ['cer_lgc', 'cca_82'],
  },
  {
    id: 'emissions',
    icon: 'globe',
    tag: 'National emissions',
    kicker: 'Chapter 05 · All sectors',
    reference: {
      label: 'Where the straight line says we should be',
      value: '~34% below',
      note: 'A straight line from the 2005 base year to a 43 per cent cut by 2030 passes through roughly 34 per cent below by 2025. That is the pace the target implies.',
    },
    reveal: {
      value: 24.5, decimals: 1, prefix: '', suffix: '% below',
      label: 'where emissions actually were in the year to December 2025, against the June 2005 base year',
      sub: 'Total emissions were 458.9 Mt CO2-e, down 2.1 per cent on the year before, all sectors including land use.',
    },
    gap: 'The target is 43 per cent below 2005 by 2030. At about 24 per cent below, Australia sits roughly 10 percentage points behind the straight line to that target, with five years to close it. Emissions are falling, just not fast enough. The land sector heavily shapes this number, which is why the method spells out how it is counted.',
    period: 'Year to December 2025',
    status: 'sourced',
    sources: ['nga_dec25'],
  },
  {
    id: 'rooftop',
    icon: 'house',
    tag: 'Rooftop solar',
    kicker: 'Chapter 06 · Installed base',
    reference: {
      label: 'A decade ago',
      value: 'A niche',
      note: 'Rooftop solar was a fringe of the grid. It is now one of the largest single sources of generating capacity in the country.',
    },
    reveal: {
      value: 28.3, decimals: 1, prefix: '', suffix: ' GW',
      label: 'of rooftop solar installed by the end of 2025, across about 4.3 million homes and small businesses',
      sub: 'On the Clean Energy Council\'s read, Australia is on track to meet its 2030 rooftop solar target.',
    },
    gap: 'This is the metric that is genuinely ahead. Households built it faster than any policy asked them to, and it now carries a real share of daytime demand. Not everything is behind. This one is not.',
    period: 'To end of 2025',
    status: 'sourced',
    sources: ['cec_rooftop'],
  },
];

// The clear-eyed close: progress and shortfall in one block, no framing tricks.
export const SUMMARY = {
  tag: 'The honest read',
  kicker: 'Progress and shortfall, together',
  title: ['Moving, and', 'not fast enough'],
  lead: 'Both things are true at once, and the point of this page is to hold them together rather than pick one.',
  moving: {
    head: 'What is genuinely moving',
    items: [
      'Renewables passed half the NEM in the December 2025 quarter, and out-generated coal for a whole month for the first time in September 2025.',
      'Electric cars went from under 1 per cent of new sales to more than 8 per cent in five years.',
      'Rooftop solar reached 28 GW across roughly 4.3 million roofs, ahead of its own 2030 target.',
      'National emissions are about 24 per cent below 2005 and still falling.',
    ],
  },
  short: {
    head: 'What still falls short',
    items: [
      'The 82 per cent renewables target needs about 75 per cent to become 82 per cent, and the committed pipeline sits roughly 8 GW short.',
      'A path to net zero implies EVs near 60 per cent of new sales by 2030; the country is at 8 per cent with no binding target.',
      'Emissions are roughly 10 percentage points behind the straight line to the 43 per cent 2030 goal.',
      'Coal is smaller, but it is not gone, and the last stretch of its retirement is the hardest.',
    ],
  },
  close: 'None of that is doom and none of it is a victory lap. The numbers are moving in the right direction and they are not moving fast enough to hit the stated targets on current settings. The hope in this page comes from the figures themselves, not from how they are framed. Come back next quarter and check the date at the top. If it has not changed, do not trust the numbers.',
};

// In-page basis of preparation, in the footprint method style.
export const METHOD = {
  tag: 'Basis of preparation',
  title: ['How this tracker', 'is built'],
  sub: 'Every number above, where it comes from, how the gaps are worked out, and what the figures leave out. If a claim here is not backed by a cited release, it is described in words, not dressed up as a precise figure.',
  blocks: [
    {
      icon: 'list',
      title: 'Sources',
      paras: [
        'Grid mix: OpenElectricity (OpenNEM) and AEMO Quarterly Energy Dynamics, both built on AEMO NEM dispatch data. Renewable and fossil shares by year cross-checked against the AER State of the Energy Market 2025.',
        'Electric vehicles: the Electric Vehicle Council\'s reporting of FCAI VFACTS new-car sales for calendar 2025.',
        'Renewable build: the Clean Energy Regulator\'s figures for capacity added to the grid each year.',
        'National emissions: the DCCEEW National Greenhouse Gas Inventory Quarterly Update, December 2025.',
        'Targets and trajectories: the 82 per cent renewables and 43 per cent emissions goals are Australian Government targets; the EV trajectory is a modelled recommendation, and the shortfall figures draw on the AEMO draft 2026 ISP and the Climate Change Authority.',
      ],
    },
    {
      icon: 'bolt',
      title: 'What "share of the NEM" means',
      paras: [
        'The grid figures are generation share of the National Electricity Market, the interconnected system down the east coast and across South Australia and Tasmania. They are shares of electricity generated, not of capacity installed and not of energy consumed.',
        'The NEM is not all of Australia. Western Australia (the SWIS) and the Northern Territory run separate grids and are outside these numbers. That matters, because the national picture is a little more fossil-heavy than the NEM alone. Where a five-years-ago figure could only be found on the wider all-Australia boundary, it is labelled as such rather than passed off as a NEM figure.',
      ],
    },
    {
      icon: 'target',
      title: 'How the gaps are worked out',
      paras: [
        'Emissions straight line: the 43 per cent target runs from the June 2005 base year to 2030. A straight line between those two points passes through about 34 per cent below by 2025 (43 per cent spread evenly across 25 years reaches roughly 34 per cent by year 20). The year to December 2025 sat about 24.5 per cent below, so the gap to the straight line is roughly 10 percentage points. The real pathway is not a straight line, but the straight line is the simplest honest yardstick and it is stated as an approximation, not a forecast.',
        'Renewables gap: the 82 per cent target is compared against the AEMO draft 2026 ISP projection of about 75 per cent from committed projects by 2030, and against the Climate Change Authority\'s estimate that the pipeline is roughly 8 GW short. These are other bodies\' estimates, cited as theirs.',
        'EV gap: 8.3 per cent battery-electric today against a modelled path near 60 per cent of new sales by 2030. That 60 per cent is a recommendation for reaching net zero, not a legislated target, and is labelled that way every time it appears.',
      ],
    },
    {
      icon: 'globe',
      title: 'The land sector, stated plainly',
      paras: [
        'The emissions figure above includes LULUCF: land use, land-use change and forestry. Including the land sector, the year to December 2025 was about 24.5 per cent below June 2005.',
        'This caveat changes the story, so it is not buried. The land sector swings the headline percentage from quarter to quarter as estimates are revised, and the picture without LULUCF differs from the picture with it. A precise without-land figure is not stated here because it was not verified to citation grade for this period; the number shown is the all-sectors figure straight from the December 2025 quarterly update.',
      ],
    },
    {
      icon: 'clock',
      title: 'Freshness and cadence',
      paras: [
        'Each metric carries the period it covers, so a reader can see at a glance how fresh it is. Quarterly grid and inventory data lag real time by a few months by nature; annual figures lag more.',
        'The tracker is reviewed quarterly, when the national inventory and the market data refresh. The last-updated date sits at the top and the bottom of the page, drawn from a single field, so it cannot silently drift. If the date is old, treat the numbers as old.',
      ],
    },
    {
      icon: 'book',
      title: 'What this is not',
      paras: [
        'This is not a forecast and not a model. It is a reading of published figures, lined up against stated targets, with the gap shown. It does not predict whether the targets will be met.',
        'The live grid snapshot, when it loads, is a separate real-time reading of the NEM fuel mix and is never blended into the annual figures. If it fails to load, the page shows nothing live and the dated figures stand on their own.',
      ],
    },
  ],
};

export const FOOT = {
  name: 'Chris Wang · 2026',
  back: 'Back to profile',
};
