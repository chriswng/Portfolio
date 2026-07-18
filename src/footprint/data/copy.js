// All editorial copy for the Life Footprint page. Words live here, not in
// components. Australian English, no em dashes, Chris's voice.

export const META = {
  navLabel: 'Footprint',
  title: 'Life Footprint',
};

export const INTRO = {
  tag: 'Life Footprint Dashboard',
  h1a: 'Scope 1, 2 and 3',
  h1b: 'of me',
  paras: [
    'I build GHG inventories and decarbonisation pathways for large organisations. This page points the same discipline at my own life, and it is a tool, not a confession booth: run your own audit and you get the same hotspot analysis, abatement cost curve and pathway model, sized for one human, with your data never leaving this browser.',
  ],
  chips: ['No account', 'No server', 'Data stays in your browser', 'Export any time'],
  ctaStart: 'Start your own audit',
  ctaExample: 'See the worked example',
  disc: 'FY2026 worked example · quantities from bills, meter reads and a year of transactions · estimates labelled in the log',
};

export const MODE = {
  example: 'You are viewing the worked example: my FY2026 audit. Your own audit is private to this browser.',
  mine: 'You are viewing your audit. It lives only in this browser; export a backup any time.',
  archived: 'You are viewing a closed year, kept exactly as it ended. Restating it is deliberate: export, correct, re-import, and say why.',
  switchToMine: 'My audit',
  switchToExample: 'Worked example',
  startCta: 'Start your own audit',
  resumeNote: 'Your audit auto-saves here as you edit.',
  yearLabel: 'Year',
  freshness: 'Newest entry is {months} months old. The next quarterly bill probably exists; log it and the range tightens.',
};

// The 45-second lane for people assessing the work rather than running an
// audit: four cards that show the craft and end at the method and a
// conversation. Values are computed live from the same aggregates as
// everything else; only the words live here.
export const SKIM = {
  tag: '00 / The short version',
  title: ['Forty-five seconds,', 'if that is all I get'],
  lede: 'Here to assess the work rather than run an audit? This row is the tour: what got measured, how the engine works, what the fixes cost, and where the method lives. Everything links deeper.',
  cards: [
    {
      id: 'number', label: 'The number', href: '#fp-dash', cta: 'See the audit',
      line: 'One year of one life, measured like an organisation. The national average counts a wider basket than this boundary, so the percentage flatters; the method says so.',
    },
    {
      id: 'engine', label: 'The engine', href: '#fp-log', cta: 'Read the log',
      line: 'Every entry stores its activity data, factor, source, scope and data quality. The method tables render from the live factor set, so the words can never drift from the maths.',
    },
    {
      id: 'plan', label: 'The plan', href: '#fp-plan', cta: 'See the curve',
      line: 'A personal marginal abatement cost curve: each action priced against the audited year, not a national average. Offsets and green power products deliberately absent.',
    },
    {
      id: 'method', label: 'The method', href: 'method/', cta: 'Read the basis',
      line: 'A written basis of preparation with the exclusions named and the uncertainty stated, the way an assurer would want it. On its own page, next to the live factor tables.',
    },
  ],
  numberUnit: 'tCO₂-e',
  numberSub: 'of the Australian average',
  engineUnit: 'entries',
  engineSub: 'factor tables, cited inline',
  planUnit: 't/yr',
  planSub: 'biggest single lever',
  methodSub: 'exclusions, named',
  contact: 'This page is how I build inventories when nobody is making me. If your organisation needs the same discipline with more zeroes on it, I am open to that conversation.',
  contactCta: 'Connect on LinkedIn',
  contactProfile: 'The full profile',
};

// Year rollover and the multi-year record.
export const YEARS = {
  rollTitle: '{label} has ended',
  rollBody: 'The reporting period closed on {end}. Close the year and it archives exactly as it stands, factors pinned; the new year opens empty against the factor set in force, with your diet carried over as a forecast.',
  rollCta: 'Close {label} and open the new year',
  rolledToast: '{label} closed and archived. Welcome to {next}.',
  archiveNote: 'Closed {closedAt} on factor set {factorSet}. Entries and their factors are pinned as logged.',
  switcherAria: 'Choose which year to view',
  gapNote: 'Reporting gap: {note}',
};

// The assurance-style audit pack: one document with the method, the factors
// and the log, built in the browser from the live data.
export const PACK = {
  cta: 'Download the audit pack',
  ctaExample: 'Download this worked example as an audit pack',
  note: 'One self-contained document: basis of preparation, factor tables, uncertainty statement, the full log. Open it anywhere; print it to PDF if an assurer wants a file.',
  fileTitle: 'Life Footprint audit pack',
  generated: 'Generated',
  factorSetLabel: 'Factor set',
  periodLabel: 'Reporting period',
  totalLabel: 'Total',
  rangeLabel: 'Range at stated confidence bands',
  scopeLabel: 'By scope',
  categoryLabel: 'By category',
  logTitle: 'Activity log',
  qualityLabel: 'Quality',
  pastTitle: 'Closed years',
  packDisclaimer: 'Prepared from the live page data at generation time. The page is the primary record; this document is a convenience copy for review.',
};

export const DASH = {
  tag: '01 / The audit',
  title: ['One year,', 'honestly counted'],
  sub: 'The reporting period is the Australian financial year. Bills spread across the months they cover, dated entries land in the month they happened, and guided-audit estimates spread evenly across the year until real bills and itineraries replace them. Every line in the log carries its factor and source; the method lives on the basis of preparation page.',
  kpis: {
    total: 'total',
    range: '{low} to {high} t at the stated quality bands',
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
  trendSub: 'tCO₂-e per month, stacked by category. Bills are spread across the months they cover; dated point events land where they happened; undated estimates spread evenly.',
  worstLabel: 'worst month',
  catTitle: 'Where the year went',
  catSub: 'Annual tCO₂-e by category, share of total. The top two wedges decide whether any plan works; the rest is housekeeping.',
  flightCallout: 'No car, a frugal flat, trains everywhere. And none of it matters next to the flying: the itineraries are the footprint, and the plan below has to start there or it is theatre.',
  genericCallout: 'The top categories above are the plan. Everything else is housekeeping.',
};

export const PLAN = {
  tag: '02 / The plan',
  title: ['The decarbonisation', 'plan'],
  sub: 'This is the part most footprint apps skip. Each action is priced against the audited numbers above, not a national average: an estimated annual reduction, a rough net cost or saving, an effort rating, and a stated basis. Offsets and green power products are deliberately absent: market instruments move the paperwork, not the physics, so nothing here earns a bar unless it removes real activity or real fuel.',
  maccTitle: 'A personal marginal abatement cost curve',
  maccSub: 'Dollars per tonne against tonnes abated per year. Bar width is the annual reduction; bars below the line pay you. Each bar is the action alone at current factors; the pathway resolves overlaps.',
  maccNote: 'Options greyed out among the cards are not applicable to this audit: no car means no EV bar, and a rented apartment makes solar and appliance swaps landlord problems. The method says so rather than pretending.',
  scenarioTitle: 'The pathway',
  scenarioSub: 'Grid decarbonisation runs in the background on published projections, actions phase in by effort, and interactions resolve in sequence so shared kilowatt hours are never counted twice.',
  budgetLabel: '1.5°C lifestyle budget · 2.5 t by 2030',
  bauLabel: 'Frozen habits (audited year repeats)',
  planLabel: 'With the plan',
  tableTitle: 'Build the plan',
  tableSub: 'Toggle an action and the impact readout and pathway rebuild in place. Every card states its reduction, cost basis and effort; effort is honest: low is a phone call, high is a changed life.',
  toggleOn: 'In the plan',
  toggleOff: 'Add to plan',
  na: 'N/A here',
  ofYear: 'of the audited year',
  carouselLabel: 'Abatement options',
  prev: 'Previous options',
  next: 'More options',
  impact: {
    label: 'Your plan so far',
    none: 'Nothing enabled yet. Add an action and watch this line move.',
    line: '{n} action{s} on · {at2030} t at 2030 against {bau2030} t with frozen habits · down {pct}%',
    over: '{gap} t over the 2.5 t budget',
    within: 'inside the 2.5 t budget',
  },
};

export const LOG = {
  tag: '03 / The log',
  title: ['Every entry,', 'dated and priced'],
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
  table: {
    head: ['Date', 'Entry', 'Category', 'Activity', 'Factor', 'Scope', 'tCO₂-e'],
    empty: 'No entries yet. Add one below or run the guided audit.',
  },
  exampleNote: {
    body: 'This log is the worked example, so it is read-only. Your own log is editable, private to your browser, and starts with one click.',
    cta: 'Start your own audit',
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
    presetNote: 'Rough starting points for a whole household per quarter. Gas-heated homes in the southern states often run well above these. Swap in your real bills whenever you find them.',
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
    customOpt: 'Custom distance…',
    cabins: { economy: 'Economy', premium: 'Premium', business: 'Business', first: 'First' },
    oneWay: 'One way',
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
  tag: 'Life Footprint / Basis of preparation',
  title: ['The method,', 'in writing'],
  sub: 'Every number on the Life Footprint page traces to this one. It is written the way I would write it for an external assurer, because a footprint without a basis of preparation is a vibe.',
  backToDash: 'Back to the dashboard',
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
      'The reporting period is the Australian financial year. The audited year here is FY2026 (July 2025 to June 2026). Entries snapshot their factor at logging time and record which factor set priced them; a factor refresh (the NGA Factors update each August) applies to new entries, and any restatement of a prior year is done explicitly, not silently.',
      'Years now roll over. Closing a year archives it exactly as it stands, entries and pinned factors included, and opens the next twelve months against the factor set in force. A closed year is never re-priced by a refresh. Restating one is deliberate by construction: export your data, correct the closed year in the file, re-import it, and record why. The restatement rule is the organisational one, sized down: material errors are corrected and said out loud; factor updates apply forward, not backward.',
      'One honest gap: we moved apartments in late July 2025, so the first weeks of the year have no home energy data. The audit carries the gap rather than inventing a number for it.',
    ],
  },
  uncertainty: {
    title: 'Uncertainty, stated',
    paras: [
      'Every entry carries a data quality tier, and every tier carries a band: metered or billed at ±5%, forecast at ±15%, estimated at ±30%. The bands are summed entry by entry with no correlation credit, which is the cautious end of the published error-propagation approaches: the honest worst case each way. The result is the range shown beside the total.',
      'Two things the range is not. It is not a confidence interval in the statistical sense; the band widths are stated assumptions of this method, sized from the tier framework in the GHG Protocol uncertainty guidance rather than measured error distributions. And it never moves the central estimate: better data narrows the range, it does not flatter the number.',
    ],
  },
  sensitivity: {
    title: 'Sensitivity: radiative forcing',
    para: 'Flights are priced with radiative forcing at the published 1.7 multiplier, which counts the non-CO₂ warming effects of burning fuel at altitude. Reasonable inventories disagree on this. Without it, the flights line would read {flights} t and the year {total} t. The with-RF basis is deliberate: leaving warming out because it is not carbon dioxide is a lawyer’s answer, not an accountant’s.',
  },
  sensitivityBasis: 'Computed live from {label}, the audit on the dashboard.',
  factorsTitle: 'Emission factors in force',
  factorsSub: 'The tables below are the live factor set the calculator prices from, not a copy of it.',
  marketBased: {
    title: 'Market-based instruments',
    paras: [
      'Grid electricity is reported location-based by default. Accredited GreenPower, where selected, nets the scope 2 generation attribute to zero for the covered share, market-based. Where the two bases differ the audit shows the market-based figure and each electricity entry names its GreenPower share beside the location-based factor table, so the other basis stays recoverable from the same line: the GHG Protocol dual-reporting rule sized for one meter. Scope 3 fuel-cycle and network losses are conservatively retained in full either way. No offsets are netted against anything, anywhere on this page.',
    ],
  },
  quality: {
    title: 'Estimation and data quality',
    paras: [
      'Entries carry one of three quality tiers, now a structured field on every line of the log: metered or billed (meter reads, bill quantities, actual itineraries), estimated (bank transactions turned into litres, kilometres or parcels at stated conversion rates, and survey answers from the guided audit), and forecast (a metered daily average extended to an unbilled period). Spend conversion is a screening tool borrowed from organisational scope 3 practice: good enough to find hotspots, not good enough to hide behind, which is why flights and energy always ask for the real quantity.',
      'The tiers do work. Each one carries the uncertainty band described below, so replacing a survey answer with a real bill visibly tightens the range on the total.',
    ],
  },
  plan: {
    title: 'How the plan is modelled',
    paras: [
      'Each abatement option is a function applied to my audited activity, so reductions are personal, not generic. The cost curve shows each option standalone at current factors. The pathway applies enabled options in a declared order (behaviour first, then electrification, then supply measures) so interactions resolve instead of double counting: an EV adds charging load before rooftop solar acts on whatever load remains. Options phase in by effort. Grid decarbonisation runs in the background in both the frozen-habits line and the plan, on a stylised trajectory from published projections, because the grid improving is not my virtue.',
      'The plan carries only physical reductions. Offsets and green power products are excluded as abatement by construction: they are market instruments that retire certificates rather than remove activity, so they belong in market-based reporting (stated above), never on the cost curve. Audited GreenPower purchases still price the scope 2 line, because reporting what was bought is accounting, not abatement.',
      'The budget line is the published 1.5°C lifestyle target of 2.5 tCO₂-e per person by 2030 (1.4 by 2040, 0.7 by 2050). The gap between my pathway and that line is not a modelling problem.',
    ],
  },
  character: {
    title: 'How the carbon character is assigned',
    paras: [
      'Three measurements, read straight off the audit, place every year in one of twelve cells. Weight: at or under the 6.6 t global average is featherweight, over 16 t is heavyweight, between the two is middleweight. Shape: a year with 40% or more of its total in one wedge (flights, road, home energy, diet or freight) is a specialist; otherwise a generalist. Rhythm: a year whose worst month carries at least twice the average month is spiky; otherwise steady. The cell names the character; the biggest wedge flavours the reading but never changes it.',
      'An audit at or under the 2.5 t lifestyle budget also unlocks The Pacifist Run, whatever its cell. The 2.5 t and 6.6 t lines are the same published benchmarks used everywhere on this page, and 16 t sits on the EDGAR-basis Australian inventory including the land sink. The 40% share and the 2× spike are stated editorial cut-offs, not published science: they decide which label you get, never any number.',
    ],
  },
  exclusions: {
    title: 'Exclusions and limitations, named',
    items: [
      'General purchased goods and services (clothing, electronics, entertainment, health): the largest gap in this boundary. National consumption averages put the excluded basket at several tonnes per person per year, so totals here understate a full consumption footprint and the benchmarks say so where they appear. The screening basis is chosen (US EPA supply chain factors v1.3, spend-based, clearly labelled screening); its per-category values enter at the next verification pass, because this page does not publish a factor it has not checked against the source.',
      'Hotel nights: counted in no category yet. The source is identified (the UK Government conversion factors publish a per-night figure by country, Australia included); the values enter at the next verification pass rather than from memory. Until then the nights stay a named exclusion.',
      'Rideshare deadheading (the car driving to me, empty): excluded, understates rideshare by roughly a third.',
      'Tenant energy in an investment property (my personal Category 13, downstream leased assets): no activity data, excluded, noted with a straight face.',
      'Public transport uses a UK rail factor as an indicative proxy pending a published NSW per-passenger-km figure.',
      'Diet factors are UK LCA means standardised per 2,000 kcal: coarse, labelled indicative, and still the right order of magnitude.',
      'Employer emissions (office, work systems) belong to my employer’s inventory, not this one. I already count the work flights I book myself.',
      'EV kilometres are priced at grid factors on the assumption the charging is not already inside a logged electricity bill. If you charge at home on a metered bill, log the kilometres or the kilowatt hours, not both.',
    ],
  },
  versionTitle: 'Factor set',
  refresh: {
    title: 'Factor refresh workflow, in writing',
    paras: [
      'Factors refresh on a written routine, not on vibes. Each August when the NGA Factors publish: re-check electricity, gas and road fuels against the new tables, bump the factor set id, and re-verify the flagged single-mirror values against the primary workbooks. Each June when the UK conversion factors publish: flights, freight, and the identified-but-unshipped hotel table. New factors price new entries only; every logged entry keeps the factor and the factor set id it was priced under, and closed years are never re-priced.',
      'The research trail for every value, including the ones that did not make it in, lives in the repository next to the code.',
    ],
  },
};

// Compact pointer to the basis of preparation, which lives on its own page.
export const METHOD_LINK = {
  tag: '04 / Basis of preparation',
  title: ['The method,', 'in writing'],
  body: 'Every number above traces to a written basis of preparation: the boundary, the factor tables in force, the uncertainty bands, and the exclusions named. It lives on its own page, rendered from the same live factor set the calculator prices from, so the words can never drift from the maths.',
  cta: 'Read the basis of preparation',
  factorLine: 'Factor set {id} · updated {updated}',
};

// Transient UI feedback, previously inline in components.
export const TOASTS = {
  entryAdded: 'Entry added and priced.',
  nothingSelected: 'Nothing selected to add.',
  csvAdded: '{n} estimate{s} added from the CSV.',
  shareCopied: 'Share link copied. Summary only; the log stays here.',
  sharePrompt: 'Copy your share link:',
  auditDeleted: 'Audit deleted from this browser.',
  auditLive: 'Your audit is live. It saves to this browser as you edit.',
  backupImported: 'Backup imported.',
};

export const SHARE = {
  bannerTitle: 'You are looking at a shared snapshot',
  bannerBody: 'Someone ran their audit and shared the summary. Totals and categories only; their log stayed in their browser.',
  provenance: 'The numbers come from a cited-factor engine with a written method.',
  provenanceCta: 'Read the basis of preparation',
  cta: 'Start your own audit',
  dismiss: 'View the full page',
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
