// All editorial copy for the Life Footprint page. Words live here, not in
// components. Australian English, no em dashes, Chris's voice.

export const META = {
  navLabel: 'Footprint',
  title: 'Your Carbon Footprint',
};

export const INTRO = {
  tag: 'Your Carbon Footprint',
  h1a: 'My year of',
  h1b: 'carbon emissions',
  paras: [
    'I measure carbon for a living, so I pointed the same maths at my own year. This is a plain-English carbon calculator and a visual case study in one: see where a real year of flights, power, food and freight actually goes, then run your own. Your answers stay in this browser.',
  ],
  chips: ['No account', 'No server', 'Stays in your browser', 'Export any time'],
  ctaStart: 'Calculate your own',
  ctaExample: 'See my worked example',
  disc: 'FY2026 example · quantities from bills, meter reads and a year of records · estimates are labelled',
};

export const MODE = {
  example: 'You are viewing my worked example: Chris\'s FY2026 carbon emissions. Anything you calculate stays private to this browser.',
  mine: 'You are viewing your own footprint. It lives only in this browser; export a backup any time.',
  archived: 'You are viewing a closed year, kept exactly as it ended.',
  switchToMine: 'My footprint',
  switchToExample: 'The worked example',
  startCta: 'Calculate your own',
  resumeNote: 'Your answers auto-save here as you edit.',
  yearLabel: 'Year',
  freshness: 'Newest entry is {months} months old. Add your next quarterly bill and the range tightens.',
};

// Year rollover and the multi-year record.
export const YEARS = {
  rollTitle: '{label} has ended',
  rollBody: 'The reporting period closed on {end}. Close the year and it is kept exactly as it stands; the new year opens empty, with your diet carried over as an estimate.',
  rollCta: 'Close {label} and open the new year',
  rolledToast: '{label} closed. Welcome to {next}.',
  archiveNote: 'Closed {closedAt}. Entries are kept as they were.',
  switcherAria: 'Choose which year to view',
  gapNote: 'Reporting gap: {note}',
};

export const DASH = {
  tag: '01 / The detail',
  title: ['The working', 'numbers'],
  sub: 'The reveal above is the short version. This is the detail behind it: the exact totals, the year month by month, and the split by category. The reporting period is the Australian financial year (July to June).',
  kpis: {
    total: 'total',
    range: '{low} to {high} t, allowing for estimates',
    aus: 'of the Australian average',
    budget: 'of the 1.5°C lifestyle benchmark',
    largest: 'biggest single item',
  },
  trendTitle: 'The year, month by month',
  trendSub: 'tCO₂-e per month, stacked by category. Bills spread across the months they cover; dated trips land where they happened; undated estimates spread evenly.',
  trendEmpty: 'No month-by-month story yet: every item here is a typical-year estimate spread evenly, so the months would all read the same. Add a real date to a flight or a bill and this chart starts talking.',
  worstLabel: 'worst month',
  catTitle: 'By category',
  catSub: 'Annual tCO₂-e by category, and its share of the total. The biggest one or two decide most of the result.',
  flightCallout: 'No car, a modest apartment, transit everywhere, and none of it matters next to the flying. The flights are the footprint, so any real plan has to start there.',
  genericCallout: 'The biggest categories above are where the reductions are. Working on the largest ones does the most.',
};

export const PLAN = {
  tag: '02 / Cut it down',
  title: ['The biggest practical', 'reductions'],
  sub: 'Each change here is worked out against the real numbers above, not a national average. Pick the ones that fit your life and watch the line move toward the benchmark. Offsets and green-power products are left out on purpose: they shuffle certificates, they do not remove the emissions.',
  scenarioTitle: 'Where it goes from here',
  scenarioSub: 'Two lines. The lower one is where your choices take you; the upper dashed one is where you stay if nothing changes. They sit together until you switch a change on. The grid keeps getting cleaner in the background either way, and bigger changes take longer to phase in.',
  budgetLabel: '1.5°C lifestyle benchmark · 2.5 t a person',
  bauLabel: 'If nothing changes',
  planLabel: 'With your changes',
  tableTitle: 'Pick your changes',
  tableSub: 'Turn a change on and the chart beside it rebuilds. Each card shows what changes, roughly how much it saves a year, and how hard it is.',
  toggleOn: 'Chosen',
  toggleOff: 'Add this',
  na: 'Not relevant here',
  ofYear: 'of this year',
  reductionLabel: 'a year',
  whyLabel: 'Why it matters',
  effortLabel: 'Difficulty',
  carouselLabel: 'Reduction options',
  prev: 'Previous options',
  next: 'More options',
  impact: {
    label: 'Your choices so far',
    none: 'Nothing chosen yet. Add a change and watch the line pull away from "if nothing changes".',
    line: '{n} change{s} on. By 2030 you land at {at2030} t, down {pct}% from the {bau2030} t you reach if nothing changes',
    over: '{gap} t over the 2.5 t benchmark',
    within: 'inside the 2.5 t benchmark',
  },
};

export const ONBOARD = {
  title: 'Calculate your footprint',
  intro: 'Five quick steps. Rough answers are fine; you can put real bills in later. Everything stays in this browser.',
  steps: ['You', 'Home energy', 'Getting around', 'Flights', 'Food & parcels'],
  you: {
    title: 'About you',
    sub: 'Where you live sets your power mix, and we split shared home energy across the people who live there.',
    state: 'Where do you live?',
    household: 'How many adults share your home? (counting you)',
    householdNote: 'We split shared home energy across the adults at home, so you are only counted for your share. Two adults means half of each bill is yours.',
    dwelling: 'Your place',
    dwellingHouse: 'House I own or could put solar on',
    dwellingApartment: 'Apartment or rental',
  },
  energy: {
    title: 'Home energy',
    sub: 'Best case: read the kWh and MJ straight off a power and gas bill. No bills nearby? Start with a typical home and nudge it.',
    presetLabel: 'No bills nearby? Start with a typical home',
    presetNote: 'Rough starting points, sized to your household: each adult adds their share, so a busier home reads higher. The figures below are the whole-home total per quarter for the number of adults you set. Gas-heated homes down south often run well above these. Swap in your real bills whenever you find them.',
    kwh: 'Electricity, kWh per quarter (whole home)',
    mj: 'Gas, MJ per quarter (0 if no gas)',
    // {n}/{s} filled with the household size in the component.
    splitNote: 'These are whole-home figures. We count your share: split evenly across the {n} adult{s} at home. Change the number of adults back on the first step.',
    splitNoteSolo: 'These are whole-home figures. With one adult at home, the whole bill is yours.',
    greenpower: 'Is your electricity on GreenPower?',
    greenpowerNote: 'GreenPower is an optional 100% renewable add-on some electricity plans include. If you have never heard of it, you are almost certainly not on it, so choose No or Not sure.',
    gpNo: 'No',
    gpUnsure: 'Not sure',
    gpHalf: 'Partly (50%)',
    gpFull: 'Yes, 100%',
  },
  travel: {
    title: 'Getting around',
    sub: 'Rough weekly figures are fine; you can put real numbers in later.',
    car: 'Car kilometres per week (0 if car-free)',
    fuelType: 'Car fuel',
    occupancy: 'People in the car, on average (counting you)',
    occupancyNote: 'We split car emissions across everyone in the car, the same way we split the home bills. Two people halves your share.',
    rideshare: 'Rideshare spend per week, $',
    pt: 'Public transport spend per week, $',
    // {cap} filled with the state cap in the component.
    ptCapNote: 'In {state}, {label} is ${cap} a week, so we will not count more than that unless you say so. Spending past the cap does not buy more travel.',
    ptOverride: 'Count my full spend anyway',
    ptCapApplied: 'Counting up to ${cap} a week',
  },
  flights: {
    title: 'Your flights, one trip at a time',
    sub: 'Think through a typical year: holidays, work trips, weddings. Add a card for each trip, pick where it went, and edit any of them whenever you like.',
    from: 'From',
    to: 'To',
    pickTo: 'Choose a destination',
    pickFrom: 'Choose a starting city',
    when: 'When',
    whenAny: 'Sometime in the year',
    whenNote: 'Optional. Give a trip its month and your month-by-month chart and worst-month reveal come alive; leave it open and it spreads evenly across the year.',
    cabins: { economy: 'Economy', premium: 'Premium', business: 'Business', first: 'First' },
    // Retained for the activity log's simple quick-add route picker.
    customOpt: 'Custom distance…',
    oneWay: 'One way',
    roundTrip: 'Return',
    cabin: 'Cabin',
    trip: 'Trip',
    passengers: 'Seats you paid for',
    passengersNote: 'Usually just you. Bump it up only if you are counting seats you booked for others.',
    add: 'Add a flight',
    addAnother: 'Add another flight',
    remove: 'Remove',
    tripLabel: 'Flight {n}',
    listTitle: 'Your flights',
    none: 'No flights yet. Flew somewhere this year? Add a card for each trip.',
    // Distance is shown (not carbon) so the estimate feels transparent.
    dist: '≈ {km} km each way',
    sameCities: 'Pick two different cities.',
    sourceSummary: 'How this is estimated',
    sourceBody: 'Flight emissions are estimated from the route distance and published UK Government (DESNZ) emissions factors, with an uplift for the extra warming of burning fuel at altitude. It is an estimate, not an airline-specific figure.',
  },
  food: {
    title: 'Food and parcels',
    sub: 'Pick the diet that sounds most like your week. Rough is fine.',
    diet: 'Your diet, honestly',
    dietHints: {
      highMeat: 'Meat most meals, or big serves daily',
      medMeat: 'A standard serve most days',
      lowMeat: 'Small serves, a few times a week',
      pescetarian: 'Fish, but no other meat',
      vegetarian: 'No meat or fish',
      vegan: 'No animal products',
    },
    parcels: 'Parcels delivered per month',
    intlOrders: 'Overseas orders per month (the ones that arrive by air)',
  },
  finish: 'See my footprint',
  back: 'Back',
  next: 'Next',
  cancel: 'Cancel',
};

// Typical-home starting points for the energy step, expressed PER ADULT per
// quarter. The whole-home figure the engine prices from is kwhPerAdult times
// the number of adults at home, so a busier home reads higher rather than
// splitting one fixed number ever thinner. At the default two adults these
// reproduce the long-standing whole-home defaults (e.g. an apartment at 1,100
// kWh); the per-capita share stays realistic as the household grows.
// Deliberately coarse: they exist so someone without a bill in reach can still
// finish, and the note tells them to swap in real numbers later.
export const ENERGY_PRESETS = [
  { id: 'aptSmall', label: 'Small apartment', kwhPerAdult: 350, mjPerAdult: 0 },
  { id: 'apt', label: 'Apartment', kwhPerAdult: 550, mjPerAdult: 1250 },
  { id: 'house', label: 'House', kwhPerAdult: 800, mjPerAdult: 2750 },
  { id: 'houseLarge', label: 'Large house', kwhPerAdult: 1150, mjPerAdult: 4500 },
];

export const METHOD = {
  tag: 'Your Carbon Footprint / How it works',
  title: ['How the', 'calculator works'],
  sub: 'A plain explanation of what this calculator counts, where the numbers come from, and how to read the result. The tables further down are the exact factors it uses.',
  backToDash: 'Back to the calculator',
  boundary: {
    title: 'What it includes',
    paras: [
      'The calculator covers the things a person controls or pays for directly: home electricity and gas, personal travel on the ground, flights, parcel deliveries, and diet. It groups them the way companies do, translated to a person: Scope 1 is fuel you burn yourself (home gas, and petrol if you drive), Scope 2 is the electricity you buy, and Scope 3 is everything else your choices cause but that happens elsewhere.',
      'Shared home energy is split evenly between the adults in the home: two adults means half of each bill counts as yours. Shared car trips are split the same way, by the average number of people in the car. Rideshare and public-transport factors are already per passenger, so they need no split.',
    ],
  },
  period: {
    title: 'The reporting period',
    paras: [
      'The reporting period is the Australian financial year, July to June. The worked example is FY2026 (July 2025 to June 2026).',
      'Timing is honest about what is known. Dated trips land in the month they happened, bills spread across the months they cover, and rough typical-year estimates spread evenly rather than being given made-up dates. The month-by-month chart and the worst-month reveal only appear once real dates give them something to show.',
    ],
  },
  sources: {
    title: 'Where the numbers come from',
    paras: [
      'Australian electricity, gas and road-fuel factors are from the Australian Government (DCCEEW) National Greenhouse Accounts Factors. Flights and freight use the UK Government conversion factors, published by DESNZ and still widely known as the DEFRA factors, because they are the most complete public source for aviation by distance and cabin.',
      'Diet is an estimate, not a precise figure: it uses published per-day values by diet type, and the same direction shows up in Australian studies. Public transport uses a UK rail factor as a stand-in until a published NSW per-passenger figure is available. Every factor and its source is in the tables below.',
    ],
  },
  quality: {
    title: 'How results are calculated',
    paras: [
      'Each item is activity times a factor: kilowatt-hours times the grid factor, litres times the fuel factor, passenger-kilometres times the flight factor, and so on. Flights include the extra warming effect of burning fuel at altitude, which reasonable calculators treat differently, so this one reads a little higher than a CO₂-only figure.',
      'Where a real bill or itinerary is not to hand, the calculator estimates: it turns spend into litres, kilometres or parcels at stated rates, or extends a metered daily average over an unbilled period. Public-transport spend is capped at the state weekly fare cap first (in NSW, the $50 Opal cap), because spending past the cap buys no extra travel. Estimates are labelled, and replacing one with a real number tightens the range shown next to the total. Green power, where you have it, lowers your purchased-electricity figure; no offsets are subtracted anywhere.',
    ],
  },
  interpret: {
    title: 'How to read the result',
    paras: [
      'The total is compared against three published benchmarks: the Australian and world per-person averages, and a 1.5°C-aligned lifestyle benchmark of 2.5 t a person by 2030. The two averages are national figures that count whole economies, so they are broader than a personal footprint. The 2.5 t figure is a lifestyle benchmark of the same kind this calculator estimates.',
      'Because this calculator leaves out the wider basket of goods and services (clothing, electronics, services), any total here understates a full consumption footprint. So the gap to the benchmark is if anything larger than it looks, not smaller.',
    ],
  },
  plan: {
    title: 'How the reductions are modelled',
    paras: [
      'Each reduction is worked out against your own numbers, not a national average, so the estimate fits your year. When you choose several, the calculator applies them in a sensible order (behaviour first, then switching to electric, then rooftop solar on the load that remains) so they add up without double-counting. Bigger changes take a year or two to fully phase in.',
      'The background grid keeps getting cleaner in both lines, because that happens whether or not you act. Offsets and green-power products are left out of the reductions on purpose: they retire certificates rather than remove the activity.',
    ],
  },
  character: {
    title: 'How the "result" label is worked out',
    paras: [
      'The playful result at the end is read from three things: how big the year is (small, medium or large, split at the 6.6 t world average and 16 t), how much sits in one category (40% or more in one is "focused"), and whether it came in spikes (a worst month at least twice an average month). That gives twelve labels. A year at or under the 2.5 t benchmark also earns a rare bonus label.',
      'The 40% and 2× cut-offs are editorial choices for the labels only. They never change any number.',
    ],
  },
  factorsTitle: 'The factors it uses',
  factorsSub: 'These tables are the exact factors the calculator prices from.',
  exclusions: {
    title: 'What it leaves out, and optional extras',
    groups: [
      {
        head: 'Outside the boundary',
        items: [
          'Employer emissions (your office, work systems) belong to your employer\'s footprint, not your personal one. Work flights you book yourself are still counted.',
          'Anything owned but rented to others (for example an investment property\'s energy) sits in the tenant\'s footprint.',
        ],
      },
      {
        head: 'Left out because reliable data is unlikely',
        items: [
          'Rideshare "deadheading" (the car driving empty to reach you): hard to know, so rideshare here is a slight underestimate.',
          'The exact split of some shared or one-off spending, which is estimated rather than measured.',
        ],
      },
      {
        head: 'Optional extras you could add',
        items: [
          'Goods and services (clothing, electronics, entertainment, health) and hotel nights are the biggest things not counted by default. They can be estimated with a few extra questions if you want a fuller picture; the simple calculator leaves them out to stay quick.',
        ],
      },
    ],
  },
};

// Compact pointer to the how-it-works page, which lives on its own page.
export const METHOD_LINK = {
  tag: '04 / How it works',
  title: ['How the', 'calculator works'],
  body: 'A plain explanation of what this calculator counts, where the numbers come from, and how to read the result. It lives on its own page, with the exact factor tables it prices from.',
  cta: 'See how it works',
  factorLine: 'Australian factors (DCCEEW) for energy and fuel; UK Government (DESNZ / DEFRA) factors for flights and freight.',
};

// Transient UI feedback, previously inline in components.
export const TOASTS = {
  shareCopied: 'Link copied. It carries a summary only; your details stay here.',
  sharePrompt: 'Copy your share link:',
  auditDeleted: 'Deleted from this browser.',
  auditLive: 'Your footprint is ready. It saves to this browser as you edit.',
  backupImported: 'Backup restored.',
};

export const SHARE = {
  // {who} is a possessive ("Ada’s" or "My"); {label} is the period.
  bannerTitle: '{who} {label} carbon emissions',
  bannerBody: 'Someone shared their footprint summary with you. Totals and categories only; their details stayed in their browser.',
  namePrompt: 'Add a name to the shared page? Leave blank to keep it as "My FY2026 carbon emissions".',
  provenance: 'The numbers come from a calculator built on published factors.',
  provenanceCta: 'See how it works',
  cta: 'Calculate your own',
  dismiss: 'View the full page',
};

// The compact "your data" controls that replace the old activity log. No
// per-item log is shown publicly; these just let someone move or delete their
// own footprint.
export const DATA_CTRL = {
  title: 'Your data',
  body: 'Your footprint saves to this browser as you edit. It is never sent anywhere. Export a backup before switching devices, and restore it on the other side.',
  share: 'Copy a share link',
  export: 'Export a backup',
  import: 'Restore a backup',
  importError: 'That file is not a footprint backup.',
  reset: 'Delete from this browser',
  resetConfirm: 'Delete your footprint from this browser? Export a backup first if you want to keep it.',
};

export const FOOTER = {
  name: 'Christopher Wang · 2026',
  back: 'Back to profile',
};

// Dashboard furniture previously inline in the component.
export const DASH_UI = {
  worstSuffix: '% of the year in one month',
  benchSummary: 'How the benchmarks are set',
};

export const fmtT = (t, dp = 1) => (Math.round(t * 10 ** dp) / 10 ** dp).toFixed(dp);
