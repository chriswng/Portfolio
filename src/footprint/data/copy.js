// All editorial copy for the Life Footprint page. Words live here, not in
// components. Australian English, no em dashes, Chris's voice.

export const META = {
  navLabel: 'Footprint',
  title: 'Life Footprint',
};

export const INTRO = {
  tag: 'Life Footprint Dashboard',
  h1a: 'Scope 1, 2 and 3',
  h1b: 'of me.',
  paras: [
    'I spend my working week building GHG inventories and decarbonisation pathways for large organisations. This page points the same discipline at my own life. Every flight, every bill, every parcel and every dinner: logged, dated and priced in carbon, on published factors, with a written basis of preparation and the awkward numbers left in.',
    'It is also a tool, not a confession booth. Run your own audit below. You get the same hotspot analysis, abatement cost curve and pathway model I build for organisations, sized for one human, and your data never leaves this browser.',
  ],
  chips: ['No account', 'No server', 'Data stays in your browser', 'Export any time'],
  ctaStart: 'Start your own audit',
  ctaExample: 'See the worked example',
  disc: 'FY2026 worked example · quantities from bills, meter reads and a year of transactions · estimates labelled in the log',
};

export const MODE = {
  example: 'You are viewing the worked example: my FY2026 audit. Your own audit is private to this browser.',
  mine: 'You are viewing your audit. It lives only in this browser; export a backup any time.',
  switchToMine: 'My audit',
  switchToExample: 'Worked example',
  startCta: 'Start your own audit',
  resumeNote: 'Your audit auto-saves here as you edit.',
};

export const DASH = {
  tag: '01 / The audit',
  title: ['One year,', 'honestly counted.'],
  sub: 'The reporting period is the Australian financial year. Bills spread across the months they cover, flights land in the month they happened, and every line in the log carries its factor and source. Method in the basis of preparation below.',
  kpis: {
    total: 'total',
    aus: 'of the Australian average',
    budget: 'of the 2030 lifestyle budget',
    largest: 'largest single entry',
  },
  scopes: [
    { n: '1', title: 'Scope 1 of me', body: 'Fuel burned on my behalf at home: the gas under the hot water and the cooktop. Direct emissions, my name on them. No car this year, so no petrol line.' },
    { n: '2', title: 'Scope 2 of me', body: 'Purchased electricity for a small flat that runs on surprisingly little. Location-based on the state grid factor; GreenPower would move it market-based.' },
    { n: '3', title: 'Scope 3 of me', body: 'Everything I cause but do not combust: flights, trains, rideshare, freight, food, and the fuel supply chains. As in every inventory I have built, this is where the tonnes hide.' },
  ],
  trendTitle: 'The year, month by month',
  trendSub: 'tCO₂-e per month, stacked by category. Bills are spread across the months they cover; point events land where they happened.',
  worstLabel: 'worst month',
  catTitle: 'Where the year went',
  catSub: 'Annual tCO₂-e by category, share of total.',
};

export const HOTSPOTS = {
  tag: '02 / Hotspots',
  title: ['Where the tonnes', 'actually are.'],
  sub: 'Categories ranked by annual tCO₂-e. The top two decide whether any plan works; the rest is housekeeping. My rule for clients holds for me: chase the big wedges, not the guilt.',
  flightCallout: 'No car, a frugal flat, trains everywhere. And none of it matters next to the flying: the itineraries are the footprint, and the plan below has to start there or it is theatre.',
  genericCallout: 'The top categories above are the plan. Everything else is housekeeping.',
};

export const PLAN = {
  tag: '03 / The plan',
  title: ['Reduction,', 'not offsets.'],
  sub: 'This is the part most footprint apps skip. Each action is priced against my audited numbers, not a national average: an estimated annual reduction, a rough net cost or saving, an effort rating, and a stated basis. Offsets are deliberately absent; they belong on the residual, not on the plan.',
  maccTitle: 'A personal marginal abatement cost curve',
  maccSub: 'Dollars per tonne against tonnes abated per year. Bar width is the annual reduction; bars below the line pay you. Each bar is the action alone at current factors; the pathway resolves overlaps.',
  maccNote: 'Options greyed out in the table are not applicable to this audit: no car means no EV bar, and a rented apartment makes solar and appliance swaps landlord problems. The method says so rather than pretending.',
  scenarioTitle: 'The pathway',
  scenarioSub: 'Toggle actions and watch the pathway rebuild. Grid decarbonisation runs in the background on published projections, actions phase in by effort, and interactions resolve in sequence so shared kilowatt hours are never counted twice.',
  budgetLabel: '1.5°C lifestyle budget · 2.5 t by 2030',
  bauLabel: 'Frozen habits (audited year repeats)',
  planLabel: 'With the plan',
  tableTitle: 'The abatement library, with its homework',
  tableSub: 'Every reduction estimate and cost basis, stated. Effort is honest: low is a phone call, high is a changed life.',
  toggleOn: 'In the plan',
  toggleOff: 'Off',
  na: 'N/A here',
};

export const LOG = {
  tag: '04 / The log',
  title: ['Every entry,', 'dated and priced.'],
  sub: 'The activity log behind every chart above. Each entry stores its activity data, unit, factor, source and scope at the time it was logged. Estimates and forecasts say so in their notes.',
  addTitle: 'Add an entry',
  importTitle: 'Import a year from your bank CSV',
  importSub: 'Export a CSV from your banking app (or fill the template) and drop it here. It is read in this browser and never uploaded. Dollars become activity only where that is honest: fuel to litres, fares to kilometres, orders to parcels. Flights and energy bills come back as a checklist instead, because distance and kilowatt hours beat dollars every time. Groceries and dining are counted only as a diet sanity check.',
  templateCta: 'Download the CSV template',
  controls: {
    title: 'Your data, your file',
    body: 'Your audit saves automatically to this browser as you edit. It is not sent anywhere; there is no server to send it to. Export a JSON backup before switching devices, and import it on the other side.',
    export: 'Export my data',
    import: 'Import a backup',
    share: 'Copy a share link',
    shareNote: 'The link encodes a summary only: totals, categories and the plan headline. The raw log never travels.',
    reset: 'Delete my audit from this browser',
    resetConfirm: 'Delete your audit from this browser? Export a backup first if you want to keep it.',
  },
};

export const ONBOARD = {
  title: 'Start your own audit',
  intro: 'Five quick steps. Rough answers are fine; you can put real bills in later. Everything stays in this browser.',
  steps: ['You', 'Home energy', 'Getting around', 'Flights', 'Food & parcels'],
  you: {
    title: 'About you',
    sub: 'Where you live sets your electricity factors, and adults at home split the bills.',
    state: 'Where do you live?',
    household: 'How many adults live at your place? (including you)',
    householdNote: 'Power and gas get split evenly between the adults at home. Two adults means half of each bill counts as yours.',
    dwelling: 'Your place',
    dwellingHouse: 'House I own or could put solar on',
    dwellingApartment: 'Apartment or rental',
  },
  energy: {
    title: 'Home energy',
    sub: 'Best case: read the kWh and MJ straight off a power and gas bill. No bills handy? Start from a typical home and adjust.',
    presetLabel: 'No bills handy? Start from a typical home',
    presetNote: 'Rough starting points for a whole household per quarter. Swap in your real bills whenever you find them.',
    kwh: 'Electricity, kWh per quarter (whole household)',
    mj: 'Gas, MJ per quarter (0 if no gas)',
    greenpower: 'Is your electricity on GreenPower?',
    greenpowerNote: 'GreenPower is an optional 100% renewable add-on some electricity plans include. If you have never heard of it, you are almost certainly not on it: pick No.',
    gpNo: 'No / not sure',
    gpHalf: 'Partly (50%)',
    gpFull: 'Yes, 100%',
  },
  travel: {
    title: 'Getting around',
    sub: 'Rough weekly figures are fine; the log can take real numbers later.',
    car: 'Car kilometres per week (0 if car-free)',
    fuelType: 'Car fuel',
    occupancy: 'People in the car, on average (including you)',
    occupancyNote: 'Car emissions are split per person in the car, the same way the household bills are split. Two people halves your share.',
    rideshare: 'Rideshare spend per week, $',
    pt: 'Public transport spend per week, $',
  },
  flights: {
    title: 'Your flights, one trip at a time',
    sub: 'Think through a typical year: holidays, work trips, weddings. Pick a route, press add, and it joins your list below. Repeat for every trip.',
    route: 'Route',
    custom: 'Custom distance, km one way',
    cabin: 'Cabin',
    return: 'Return trip',
    add: 'Add this flight',
    added: 'Added. Add your next trip, or press Next.',
    listTitle: 'Your flights',
    subtotal: 'Flights so far',
    remove: 'Remove',
    none: 'No flights in the list yet. If you flew this year, add each trip above.',
  },
  food: {
    title: 'Food and parcels',
    sub: 'Pick the diet that sounds most like your week. Each option shows roughly what it adds over a year.',
    diet: 'Your diet, honestly',
    dietHints: {
      highMeat: 'Meat at most meals',
      medMeat: 'Meat about once a day',
      lowMeat: 'Meat a few times a week',
      pescetarian: 'Fish, but no other meat',
      vegetarian: 'No meat or fish',
      vegan: 'No animal products',
    },
    parcels: 'Parcels delivered per month',
    intlOrders: 'Overseas orders per month (the ones that arrive by air)',
  },
  finish: 'Build my audit',
  back: 'Back',
  next: 'Next',
  cancel: 'Cancel',
};

// Typical-household starting points for the energy step, whole household per
// quarter. Deliberately coarse: they exist so someone without a bill in reach
// can still finish, and the note tells them to swap in real numbers later.
export const ENERGY_PRESETS = [
  { id: 'aptSmall', label: 'Small apartment', kwh: 700, mj: 0 },
  { id: 'apt', label: 'Apartment', kwh: 1100, mj: 2500 },
  { id: 'house', label: 'House', kwh: 1600, mj: 5500 },
  { id: 'houseLarge', label: 'Large house', kwh: 2300, mj: 9000 },
];

export const METHOD = {
  tag: '05 / Basis of preparation',
  title: ['The method,', 'in writing.'],
  sub: 'Every number above traces to this section. It is written the way I would write it for an external assurer, because a footprint without a basis of preparation is a vibe.',
  boundary: {
    title: 'Boundary',
    paras: [
      'The inventory covers the activities a person directly controls or directly purchases: household electricity and gas, personal ground travel, flights, parcel freight, and diet. Scope labels follow GHG Protocol logic translated to a person: scope 1 is fuel I combust (home gas, petrol if I owned a car), scope 2 is purchased electricity, and scope 3 is everything performed by someone else on my behalf, which is most of a modern life.',
      'Shared household consumption (energy) is attributed per adult by equal share. I pay half the bills, I carry half the kilowatt hours. Operational control of the thermostat is contested and has not been material to the result.',
      'Shared kilometres follow the same rule. Car entries carry an average occupancy, and the fuel is divided per occupant: a full car is a different vehicle, emissions-wise, to a solo one. Rideshare and public transport factors are already per passenger, so they need no split.',
    ],
  },
  period: {
    title: 'Reporting period and recalculation',
    paras: [
      'The reporting period is the Australian financial year. The audited year here is FY2026 (July 2025 to June 2026). Entries snapshot their factor at logging time; a factor refresh (the NGA Factors update each August) applies to new entries, and any restatement of a prior year is done explicitly, not silently.',
      'One honest gap: we moved apartments in late July 2025, so the first weeks of the year have no home energy data. The audit carries the gap rather than inventing a number for it.',
    ],
  },
  factorsTitle: 'Emission factors in force',
  factorsSub: 'The tables below are the live factor set the calculator prices from, not a copy of it.',
  marketBased: {
    title: 'Market-based instruments',
    paras: [
      'Grid electricity is reported location-based by default. Accredited GreenPower, where selected, nets the scope 2 generation attribute to zero for the covered share, market-based. Scope 3 fuel-cycle and network losses are conservatively retained in full either way. No offsets are netted against anything, anywhere on this page.',
    ],
  },
  quality: {
    title: 'Estimation and data quality',
    paras: [
      'Entries carry one of three qualities, visible in their notes: metered or billed (meter reads, bill quantities, actual itineraries), spend-converted (bank transactions turned into litres, kilometres or parcels at stated conversion rates), and forecast (a metered daily average extended to an unbilled period). Spend conversion is a screening tool borrowed from organisational scope 3 practice: good enough to find hotspots, not good enough to hide behind, which is why flights and energy always ask for the real quantity.',
    ],
  },
  plan: {
    title: 'How the plan is modelled',
    paras: [
      'Each abatement option is a function applied to my audited activity, so reductions are personal, not generic. The cost curve shows each option standalone at current factors. The pathway applies enabled options in a declared order (behaviour first, then electrification, then supply measures) so interactions resolve instead of double counting: an EV adds charging load before solar and GreenPower act on whatever load remains. Options phase in by effort. Grid decarbonisation runs in the background in both the frozen-habits line and the plan, on a stylised trajectory from published projections, because the grid improving is not my virtue.',
      'The budget line is the published 1.5°C lifestyle target of 2.5 tCO₂-e per person by 2030 (1.4 by 2040, 0.7 by 2050). The gap between my pathway and that line is not a modelling problem.',
    ],
  },
  exclusions: {
    title: 'Exclusions and limitations, named',
    items: [
      'General purchased goods and services (clothing, electronics, entertainment, health): the largest gap in this boundary. National consumption averages put the excluded basket at several tonnes per person per year, so totals here understate a full consumption footprint and the benchmarks say so where they appear.',
      'Hotel nights: counted in no category yet. A per-night factor is a candidate for the next factor set.',
      'Rideshare deadheading (the car driving to me, empty): excluded, understates rideshare by roughly a third.',
      'Tenant energy in an investment property (my personal Category 13, downstream leased assets): no activity data, excluded, noted with a straight face.',
      'Public transport uses a UK rail factor as an indicative proxy pending a published NSW per-passenger-km figure.',
      'Diet factors are UK LCA means standardised per 2,000 kcal: coarse, labelled indicative, and still the right order of magnitude.',
      'Employer emissions (office, work systems) belong to my employer’s inventory, not this one. I already count the work flights I book myself.',
    ],
  },
  versionTitle: 'Factor set',
};

export const MARKET = {
  tag: '06 / Why this exists',
  title: ['The gap in', 'the app store.'],
  paras: [
    'Before building this I surveyed the consumer footprint-app market properly (the research notes live in the repository). The dominant pattern is a five-question quiz, a country-average number, gamified tips, and an offset subscription as the monetisable action. The market is consolidating around that model rather than deepening it: Wren absorbed Klima in May 2025, and the one government-grade Australian consumer calculator (EPA Victoria’s) has been retired.',
    'The sharper finding: transparency and tracking never co-occur. Every tool that publishes a serious methodology (WWF, UNFCCC and Doconomy, UC Berkeley’s CoolClimate, Carbon Neutral here in Australia) is a one-off quiz. Every tool that tracks real behaviour does it through opaque spend proxies. And nothing consumer-facing anywhere offers a marginal abatement cost view: the nearest neighbours are half of CoolClimate’s ranking engine and a US$149 Excel add-in for professionals.',
  ],
  tableHead: ['Tool', 'Method published', 'Tracks your activity', 'Australian factors', 'Plan, or offsets?'],
  rows: [
    ['Wren (absorbed Klima, 2025)', 'Partly (licensed model)', 'No, quiz', 'No', 'Offset subscription'],
    ['Commons (ex Joro)', 'Blog-level', 'Spend proxy via bank cards', 'No', 'Nudges and cashback'],
    ['Earth Hero', 'Partial, in-app sources', 'Survey refresh', 'No', 'Tips library'],
    ['CoolClimate (UC Berkeley)', 'Peer-reviewed, factors licensed', 'No, detailed quiz', 'No (US)', 'Ranks tonnes and dollars separately'],
    ['WWF UK calculator', 'Full methodology PDF', 'No, quiz', 'No (UK)', 'Generic tips'],
    ['One Small Step (AU)', 'Blog-level, licensed model', 'Habit programmes, self-report', 'AU-localised, not NGA', 'Roadmap to 2 t, no $/t'],
    ['Carbon Neutral (AU)', 'Methodology PDF on NGA', 'No, quiz', 'NGA national average', 'Ends at offsets'],
    ['ClimateClever (AU)', 'Partial', 'Yes, bills (schools-first)', 'AU government factors', 'Action plans, org-shaped'],
    ['CommBank Cogo tracker', 'No', 'Spend proxy', 'AU spend intensities', 'In-app offsets'],
    ['This page', 'Full basis of preparation, factors inline', 'Yes: bills, itineraries, bank CSV', 'NGA 2025, state-resolved', 'Personal MACC and pathway, no offsets'],
  ],
  verdict: 'The whitespace this page sits in: a published NGA-based basis of preparation, ongoing tracking of a person’s own activity data, and an abatement plan priced in dollars per tonne, together. Nothing else in the market combines the three. That is not a boast about the code; it is an indictment of a category that found offsets easier to sell than method.',
};

export const SHARE = {
  bannerTitle: 'You are looking at a shared snapshot',
  bannerBody: 'Someone ran their audit and shared the summary. Totals, categories and plan headline only; their log stayed in their browser.',
  cta: 'Start your own audit',
  dismiss: 'View the full page',
};

export const FOOTER = {
  name: 'Christopher Wang · 2026',
  back: 'Back to profile',
};

export const fmtT = (t, dp = 1) => (Math.round(t * 10 ** dp) / 10 ** dp).toFixed(dp);
