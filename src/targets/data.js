// The Target Tracker (/targets/). Every word and every number on the page
// lives here, not in the components. Australian English, no em dashes, plain
// and dry: the page's job is to put a company's claimed line next to its
// reported emissions and let the distance between the two speak.
//
// DATA HONESTY. Each company carries its own sources with access dates, its
// own verification date, and a status:
//   'sourced'    every figure read from a company report or an equivalent
//                published disclosure
//   'partial'    the commitment is sourced but the emissions series has gaps
//   'unverified' the commitment is sourced and the emissions series could not
//                be verified, so `reported` is empty and no chart is drawn
// A year that could not be verified is omitted. Nothing is interpolated into
// a reported series, and no claimed line is drawn for a company that has not
// stated an absolute path.

export const META = {
  navLabel: 'Targets',
  // Single source of truth for the last-updated stamp, rendered top and bottom.
  updated: '27 July 2026',
  cadence: 'Reviewed twice a year, after the annual reporting season and again when the Clean Energy Regulator publishes its NGER data. Each company also carries its own verified date, because reports land at different times. If the dates are old, treat the numbers as old.',
  // The vertical rule drawn on every chart.
  nowYear: 2026,
};

export const INTRO = {
  tag: 'The tracker',
  kicker: 'ASX50 · corporate net zero',
  title: ['Everyone has a target.', 'Fewer have a line'],
  sub: 'A target year is easy to announce and hard to check. This page does the checking. For each of the largest listed companies in Australia it draws the trajectory the company itself has claimed, from its stated base year through its interim targets to its net zero date, and then plots the Scope 1 and 2 emissions it has actually reported on top of it.',
  read: 'Every card reads the same way. The dashed line is what the company said it would do. The solid line is what it has reported. The sentence underneath states the distance between them in the latest reported year, with no adjective attached.',
  scroll: 'Scroll',
};

// How to read a chart, rendered next to a tiny static demo.
export const READING = {
  tag: 'How to read it',
  title: ['Three marks,', 'nothing else'],
  lead: 'The charts carry no axes and no gridlines on purpose. There are only three things on them, and each one means exactly one thing.',
  items: [
    {
      key: 'claimed',
      label: 'Dashed line',
      body: 'The claimed path. It runs from the company\'s stated base year and baseline, through any absolute interim target, down to zero in its net zero year. It is drawn straight between those points because that is all the company has committed to, not because anyone expects the real path to be straight.',
    },
    {
      key: 'reported',
      label: 'Solid line with dots',
      body: 'Reported Scope 1 and 2 emissions, one dot per reporting year, taken from the company\'s own disclosures. Years that could not be verified are left out rather than filled in, so a gap in the line is a gap in the record.',
    },
    {
      key: 'now',
      label: 'Vertical rule',
      body: 'The present year. Everything to the left of it is history and everything to the right of it is a claim. Most of these lines are still almost entirely claim.',
    },
  ],
  note: 'Where a company has set only an intensity target, there is no absolute path to draw and the chart shows the reported line alone.',
};

// Verification status for a company's numbers.
export const STATUS = {
  sourced: 'Sourced figures',
  partial: 'Partial series',
  unverified: 'Series unverified',
};

// How the latest reported year reads against the claimed line.
export const TRACK = {
  ahead: 'Ahead of its line',
  on: 'On its line',
  behind: 'Behind its line',
  na: 'Not assessable',
};

// Every other label, chip and piece of interface text on the page.
export const UI = {
  unit: 'Mt',
  score: {
    tag: 'The scoreboard',
    title: ['What the fifty', 'have promised'],
    lead: 'Four counts, taken across every company on this page. Each company counts once, whatever its size, so this is a count of commitments and not a measure of tonnes.',
    items: [
      { key: 'netZero', label: 'have committed to a net zero year for their own operations' },
      { key: 'interim', label: 'back it with an absolute 2030 era interim target, not an intensity one' },
      { key: 'atOrAhead', label: 'are at or ahead of their own claimed line in the latest reported year' },
      { key: 'behindNa', label: 'are behind their line, or could not be assessed against one' },
    ],
    note: 'A company counts as assessable only when it has stated an absolute path and reported at least one year of emissions against it.',
  },
  ledger: {
    tag: 'The ledger',
    kicker: 'Company by company',
    title: ['The claimed line', 'and the record'],
    lead: 'Filter by sector, sort by how far the reported line sits from the claimed one, and read each company on its own terms. The status chip on every card says how much of it is sourced.',
    sectorLabel: 'Filter by sector',
    sectorAll: 'All sectors',
    sortLabel: 'Sort the ledger',
    sorts: [
      { id: 'name', label: 'Company name' },
      { id: 'year', label: 'Net zero year, soonest first' },
      { id: 'gapWorst', label: 'Gap, furthest behind first' },
      { id: 'gapBest', label: 'Gap, furthest ahead first' },
    ],
    trackLabel: 'Filter by tracking status',
    trackAll: 'All',
    countOne: 'company shown',
    countMany: 'companies shown',
    empty: 'No companies match those filters. Clear one of them to see the ledger again.',
  },
  card: {
    targetPrefix: 'Net zero by',
    noTarget: 'No net zero target',
    scopesLabel: 'Covers',
    baseLabel: 'Base year',
    interimLabel: 'Interim',
    scope3Label: 'Scope 3',
    boundaryLabel: 'Boundary',
    verified: 'Verified',
    sourceOne: 'source',
    sourceMany: 'sources',
    methodLink: 'Basis of preparation',
    unverifiedChart: 'The emissions series for this company could not be verified, so no line is drawn',
    noAbsolutePath: 'No absolute path stated',
    interimAbsolute: 'absolute',
    interimIntensity: 'intensity',
    vsLabel: 'vs',
  },
  gap: {
    reported: 'reported against',
    claimed: 'on the claimed line',
    above: 'per cent above the line',
    below: 'per cent below the line',
    onLine: 'inside the five per cent band either side of the line',
    zeroLine: 'the claimed line has reached zero by this year',
    noLine: 'No absolute path has been stated, so there is no line to measure against',
    noData: 'No verified emissions series, so there is nothing to measure',
  },
  flags: {
    offsets: 'Leans on offsets',
    intensity: 'Intensity target',
    aspirational: 'Aspirational wording',
    'sbti-validated': 'SBTi validated',
    'exited-sbti': 'Exited SBTi',
  },
  method: {
    commonHead: 'Sources used across the page',
    perCompanyHead: 'Sources by company',
  },
};

// PLACEHOLDER — replaced by researched data.
// Structure is final; every figure below is an illustrative stand in so the
// page, the maths and the layout can be built and checked. Do not cite any of
// it. Units are Mt CO2e, Scope 1 and 2, on the company's own reporting basis.
export const COMPANIES = [
  {
    id: 'bhp',
    name: 'BHP',
    ticker: 'BHP',
    sector: 'Materials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1 and 2, operational control',
      baseYear: 2020,
      interim: [
        {
          year: 2030,
          cutPct: 30,
          vsBaseYear: 2020,
          absolute: true,
          note: 'At least 30 per cent below the FY2020 baseline, operational Scope 1 and 2',
        },
      ],
      scope3: 'Scope 3 is covered by goals rather than targets, and the goals sit with customers and shippers rather than with the company itself.',
      flags: ['offsets'],
    },
    baseline: { year: 2020, mt: 16.00 },
    reported: [
      { y: 2020, mt: 16.00 },
      { y: 2021, mt: 15.20 },
      { y: 2022, mt: 12.60 },
      { y: 2023, mt: 11.50 },
      { y: 2024, mt: 11.00 },
      { y: 2025, mt: 10.60 },
    ],
    boundaryNote: 'Scope 2 is market based, reflecting the renewable supply contracts in place at the Queensland and Chilean operations.',
    status: 'sourced',
    verified: '27 July 2026',
    sources: [
      { name: 'Placeholder climate transition action plan', url: 'https://example.com/', accessed: '27 July 2026' },
      { name: 'Placeholder annual report, emissions data tables', url: 'https://example.com/', accessed: '27 July 2026' },
    ],
    note: 'Reported emissions sit well below the claimed line, largely because the cut came early through renewable electricity contracts rather than through the harder diesel and process emissions still ahead.',
  },
  {
    id: 'cba',
    name: 'Commonwealth Bank',
    ticker: 'CBA',
    sector: 'Financials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1 and 2, plus Scope 3 categories 1 to 14 in a separate financed emissions target',
      baseYear: 2020,
      interim: [
        {
          year: 2030,
          cutPct: 55,
          vsBaseYear: 2020,
          absolute: true,
          note: 'A 55 per cent absolute cut on the FY2020 operational baseline',
        },
      ],
      scope3: 'Financed emissions carry sector by sector targets on their own timetable, and they dwarf the operational figures charted here.',
      flags: ['sbti-validated'],
    },
    baseline: { year: 2020, mt: 0.130 },
    reported: [
      { y: 2020, mt: 0.130 },
      { y: 2021, mt: 0.104 },
      { y: 2023, mt: 0.062 },
      { y: 2024, mt: 0.051 },
      { y: 2025, mt: 0.045 },
    ],
    boundaryNote: null,
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      { name: 'Placeholder climate report', url: 'https://example.com/', accessed: '27 July 2026' },
    ],
    note: 'FY2022 is missing from the series because the reported figure was restated and the restated basis could not be reconciled to the other years. The operational footprint is small next to the financed emissions the target chart does not cover.',
  },
  {
    id: 'wow',
    name: 'Woolworths Group',
    ticker: 'WOW',
    sector: 'Consumer Staples',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1 and 2, market based',
      baseYear: 2015,
      interim: [
        {
          year: 2030,
          cutPct: 63,
          vsBaseYear: 2015,
          absolute: true,
          note: 'A 63 per cent absolute cut on the FY2015 baseline',
        },
      ],
      scope3: 'A separate supplier engagement goal covers Scope 3, expressed as a share of suppliers with their own targets rather than as a tonnage.',
      flags: ['sbti-validated'],
    },
    baseline: { year: 2015, mt: 2.05 },
    reported: [
      { y: 2015, mt: 2.05 },
      { y: 2020, mt: 1.72 },
      { y: 2022, mt: 1.55 },
      { y: 2023, mt: 1.44 },
      { y: 2024, mt: 1.36 },
      { y: 2025, mt: 1.30 },
    ],
    boundaryNote: 'Refrigerant emissions are included, which is why the series falls more slowly than the electricity contracting alone would suggest.',
    status: 'sourced',
    verified: '27 July 2026',
    sources: [
      { name: 'Placeholder sustainability report', url: 'https://example.com/', accessed: '27 July 2026' },
      { name: 'Placeholder NGER published data', url: 'https://example.com/', accessed: '27 July 2026' },
    ],
    note: 'The reported line has drifted above the claimed one since 2023. Electricity has done most of the available work and refrigerant leakage is now the larger share of what is left.',
  },
  {
    id: 'santos',
    name: 'Santos',
    ticker: 'STO',
    sector: 'Energy',
    yearBasis: 'CY',
    commitment: {
      netZeroYear: 2040,
      scopes: 'Scope 1 and 2, equity share',
      baseYear: 2019,
      interim: [
        {
          year: 2030,
          cutPct: 30,
          vsBaseYear: 2019,
          absolute: true,
          note: 'A 30 per cent absolute cut on the 2019 equity share baseline',
        },
        {
          year: 2030,
          cutPct: 26,
          vsBaseYear: 2019,
          absolute: false,
          note: 'A parallel intensity target per unit of production, not drawn on the chart',
        },
      ],
      scope3: 'Scope 3 is described as an ambition contingent on customer demand and on carbon capture capacity, and it carries no dated tonnage.',
      flags: ['offsets', 'aspirational'],
    },
    baseline: { year: 2019, mt: 4.30 },
    reported: [
      { y: 2019, mt: 4.30 },
      { y: 2020, mt: 4.15 },
      { y: 2021, mt: 4.62 },
      { y: 2022, mt: 5.10 },
      { y: 2023, mt: 5.05 },
      { y: 2024, mt: 4.90 },
      { y: 2025, mt: 4.85 },
    ],
    boundaryNote: 'Reported on an equity share basis, which is a wider boundary than the operational control figures most of the other companies here use.',
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      { name: 'Placeholder climate transition action plan', url: 'https://example.com/', accessed: '27 July 2026' },
    ],
    note: 'Emissions rose after the base year as new production came online and have only edged down since. The claimed cut now depends almost entirely on carbon capture and on offsets in the second half of the decade.',
  },
];

// The one dark band: a few companies worth reading twice.
export const SPOTLIGHTS = {
  ids: ['santos', 'wow'],
  tag: 'Worth a second look',
  kicker: 'Two cases',
  title: ['Where the gap', 'is a decision'],
  lead: 'Most of the distance on these charts is not a measurement problem. It is the result of a choice about what the company will do first and what it will leave until the target year is close.',
  items: [
    {
      id: 'santos',
      head: 'A baseline that was never the peak',
      body: 'Emissions rose for three years after the stated base year and have not returned to it. Everything the target claims now has to happen in the back half of the decade, and the plan for it rests on capture and on offsets rather than on production. That is a legitimate strategy and it is also a much later, much less certain one than the line implies.',
    },
    {
      id: 'wow',
      head: 'The easy tonnes are spent',
      body: 'Renewable electricity contracts did the early work and did it quickly, which is why the line fell fast to 2023. What is left is refrigerant leakage and transport, neither of which can be contracted away in a single year. The flattening is the shape of a company that has finished the cheap half of its target.',
    },
  ],
};

// The clear-eyed close, progress style: both columns true at once.
export const SUMMARY = {
  tag: 'The honest read',
  kicker: 'What the ledger adds up to',
  title: ['Well stated,', 'thinly evidenced'],
  lead: 'Reading every card in one sitting leaves two impressions, and they do not cancel each other out.',
  moving: {
    head: 'What is genuinely there',
    items: [
      'Nearly every company on this list has a dated net zero commitment for its own operations, which was not true five years ago.',
      'Most of them now publish a Scope 1 and 2 series that can be read year on year without reconstructing it from scratch.',
      'The companies that contracted renewable electricity early have real, verifiable falls in reported emissions behind them.',
      'Several targets are externally validated, which at least fixes the boundary and the base year in place.',
    ],
  },
  short: {
    head: 'What the charts do not support',
    items: [
      'A dashed line is a claim, and on most of these cards the claim covers far more years than the record does.',
      'Base years are often chosen where emissions were already high, which flatters every cut measured from them.',
      'Interim targets are frequently intensity based, so output can grow while the ratio improves and the tonnage does not.',
      'Scope 3 sits outside almost every chart here, and for the energy and financial companies it is where nearly all the emissions are.',
    ],
  },
  close: 'None of this is an accusation. A company can be behind its own line for defensible reasons and still be doing more than a company comfortably ahead of a soft one. What the page insists on is that the claim and the record be shown at the same size, on the same axis, with the date on both. Check the date at the top. If it has not moved, do not trust the lines.',
};

// Common sources. Per company sources live on each company object and are
// listed separately in the method section.
export const SOURCES = {
  cer_nger: {
    name: 'Clean Energy Regulator, published NGER data',
    detail: 'Corporate emissions and energy data reported under the National Greenhouse and Energy Reporting scheme, used to cross check company reported Scope 1 and 2 figures for Australian operations.',
    url: 'https://cer.gov.au/markets/reports-and-data/national-greenhouse-and-energy-reporting-data',
    accessed: '27 July 2026',
  },
  ca100: {
    name: 'Climate Action 100+ Net Zero Company Benchmark',
    detail: 'Independent assessment of target coverage, ambition and alignment for the largest listed emitters, used to corroborate scope coverage and to flag aspirational wording.',
    url: 'https://www.climateaction100.org/progress/net-zero-company-benchmark/',
    accessed: '27 July 2026',
  },
  sbti: {
    name: 'Science Based Targets initiative, target dashboard',
    detail: 'The public register of validated targets, used only to set the validated and exited flags on a company card.',
    url: 'https://sciencebasedtargets.org/companies-taking-action',
    accessed: '27 July 2026',
  },
};

// In-page basis of preparation, in the footprint method style.
export const METHOD = {
  tag: 'Basis of preparation',
  title: ['How this tracker', 'is built'],
  sub: 'What is counted, how the claimed line is drawn, what the tracking labels mean, and everything this page deliberately leaves out. If a figure could not be read from a published disclosure, it is not on a card.',
  blocks: [
    {
      icon: 'list',
      title: 'What is counted',
      paras: [
        'Every figure charted is Scope 1 and 2 emissions on the company\'s own reporting basis, in Mt CO2e. Scope 2 is market based where the company discloses it, and where only a location based figure exists that is noted on the card.',
        'Financial years are labelled by the year they end in. A company that reports on a calendar year is labelled CY and its years are not shifted to line up with anyone else\'s.',
        'Where the reported series and the target sit on different boundaries, for example equity share against operational control, the card says so rather than quietly reconciling them.',
      ],
    },
    {
      icon: 'target',
      title: 'How the claimed line is drawn',
      paras: [
        'The line starts at the company\'s stated base year and baseline level, passes through any absolute interim target, and ends at zero in the stated net zero year. It is straight between those anchors because those anchors are all the company has committed to.',
        'Intensity targets are not drawn. An intensity target says nothing about a tonnage on its own, and converting one into tonnes would require a production forecast this page does not have. Where a company\'s only interim target is an intensity one, the chart shows the reported line alone and says so.',
        'An interim target cut from a base year other than the one the baseline is held on is skipped rather than estimated, because pricing it would need that other year\'s level.',
        'A company with no stated net zero year, or no verifiable baseline, gets no claimed line at all.',
      ],
    },
    {
      icon: 'chart',
      title: 'What the tracking labels mean',
      paras: [
        'The label compares one number against one number: the latest reported year against the claimed line interpolated to that same year. Inside five per cent either way reads as on the line, below reads as ahead, above reads as behind.',
        'The five per cent band is a judgement, not a standard. It exists because a single reporting year is a noisy way to judge a path that runs to 2050, and a company should not be labelled behind for a rounding difference.',
        'Not assessable means exactly that: no claimed line, no reported year, or a reported year that falls outside the claimed line\'s range. It is not a judgement about the company.',
      ],
    },
    {
      icon: 'book',
      title: 'Sources and verification',
      paras: [
        'Company reports come first: the annual report, the sustainability or climate report, and the climate transition action plan where one exists. Clean Energy Regulator NGER data is used to cross check Australian operational figures.',
        'Climate Action 100+ and the Science Based Targets initiative register are used only to corroborate scope coverage and to set the validated, exited and aspirational flags. They are never the source of an emissions number.',
        'Where two sources conflict, the company\'s most recent report is used and the conflict is named in the card note. Where a series has been restated, the restated basis is used consistently across all years.',
      ],
    },
    {
      icon: 'clock',
      title: 'Freshness',
      paras: [
        'Every company carries its own verified date, because annual reports land at different times of the year and a page level date would hide that.',
        'The page level date at the top and the bottom comes from one field, so it cannot drift apart. The review cadence is twice yearly, after the reporting season and again when NGER data publishes.',
      ],
    },
    {
      icon: 'globe',
      title: 'What this is not',
      paras: [
        'This is not a ranking and there is no score. Two companies with the same distance from their own line can have set targets of wildly different ambition, and the page will not pretend otherwise.',
        'It is not a forecast. Nothing here predicts whether a target will be met; it only shows the distance between the claim and the record so far.',
        'The scoreboard counts companies, not tonnes. One large emitter behind its line matters far more for the atmosphere than several small ones ahead of theirs, and a count cannot show that.',
        'Scope 3 is outside the charts. For the energy companies and the banks on this list that is where most of the emissions are, and the cards say so in words because the numbers are not comparable enough to plot.',
      ],
    },
  ],
};

export const FOOT = {
  name: 'Chris Wang · 2026',
  back: 'Back to profile',
};
