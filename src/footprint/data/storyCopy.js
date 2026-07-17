// Editorial copy for the reveal story, the guided audit and the share cards.
// Words live here, not in components. Australian English, no em dashes,
// Chris's voice. Most strings come in two voices: 'example' narrates my
// FY2026 worked example, 'own' narrates the visitor's audit back to them.

export const CHROME = {
  skip: 'Skip to the dashboard',
  sound: { on: 'Sound on', off: 'Sound off', label: 'Ambient sound' },
  replay: 'Replay the reveal',
  home: './',
  progressLabel: 'Story progress',
};

export const CHAPTERS = [
  { id: 'st-cover', label: 'Open' },
  { id: 'st-year', label: 'The year' },
  { id: 'st-guess', label: 'The guess' },
  { id: 'st-total', label: 'The number' },
  { id: 'st-scopes', label: 'Three scopes' },
  { id: 'st-hotspots', label: 'Hotspots' },
  { id: 'st-months', label: 'Worst month' },
  { id: 'st-bench', label: 'Context' },
  { id: 'st-needle', label: 'The needle' },
  { id: 'st-outro', label: 'The audit' },
];

export const COVER = {
  tag: 'Life Footprint',
  h1a: 'Scope 1, 2 and 3',
  h1b: 'of me.',
  sub: {
    example:
      'I build GHG inventories for large organisations. This is the same discipline pointed at my own life: a year of flights, bills, parcels and dinners, priced in carbon on published factors, told properly.',
    own:
      'Your year of flights, bills, parcels and dinners, priced in carbon on published factors. Logged in your browser, and nowhere else. Told properly.',
  },
  start: 'Start your own audit',
  startNote: 'Ten minutes, your bills, no account.',
  scrollCue: 'Scroll to dive in',
};

export const YEAR = {
  tag: '01 · The year',
  headline: { example: 'Twelve months.', own: 'Your twelve months.' },
  sub: {
    example: 'entries: every itinerary, meter read and parcel, dated, factored and priced.',
    own: 'entries: everything you logged, dated, factored and priced.',
  },
  // Suffixes for the streaming ticker rows.
  tickerAria: 'A stream of the individual log entries behind this audit.',
};

export const GUESS = {
  tag: '02 · Call it',
  headline: { example: 'Before the reveal: call it.', own: 'You saw the pieces. Call it.' },
  sub: {
    example: 'A year of me, in tonnes of CO₂-e. Flights included. What does one human add up to?',
    own: 'Your whole year, in tonnes of CO₂-e, before the spreadsheet tells you. Trust your gut.',
  },
  unit: 'tCO₂-e',
  lockIn: 'Lock it in',
  noIdea: 'No idea, just show me',
  sliderLabel: 'Your guess in tonnes of CO2-e per year',
};

// Verdicts by relative error. `within` is the upper bound of |error| / actual.
export const GUESS_VERDICTS = [
  { within: 0.06, text: 'Auditor-grade instinct. Frankly suspicious.' },
  { within: 0.18, text: 'Close. The spreadsheet respects you.' },
  { within: 0.40, text: 'Warm. Most people land further out.' },
  { within: 1.00, text: 'A long way out, and completely normal. Carbon hides.' },
  { within: Infinity, text: 'Way out. This is exactly why audits beat vibes.' },
];
export const GUESS_RESULT = {
  under: 'You were {d} t under.',
  over: 'You were {d} t over.',
  exact: 'You called it exactly. Take the rest of the day off.',
  playAgain: 'Guess again',
};

export const TOTAL = {
  tag: '03 · The number',
  kicker: { example: 'My FY2026 total', own: 'Your total' },
  unit: 'tonnes CO₂-e',
  line: {
    example: 'Every flight, bill, parcel and dinner. Counted, not confessed.',
    own: 'Every line you logged, factored and added up. No rounding away the awkward bits.',
  },
};

export const SCOPES = {
  tag: '04 · Three scopes',
  headline: 'One life, three scopes.',
  items: [
    {
      n: '1',
      name: 'Scope 1 of me',
      line: {
        example: 'Fuel burned on my behalf at home. The gas under the hot water and the cooktop.',
        own: 'Fuel burned directly on your behalf: gas, petrol, your name on the flame.',
      },
    },
    {
      n: '2',
      name: 'Scope 2 of me',
      line: {
        example: 'Purchased electricity for a small flat that runs on surprisingly little.',
        own: 'The electricity you buy, at your state grid factor.',
      },
    },
    {
      n: '3',
      name: 'Scope 3 of me',
      line: {
        example: 'Everything I cause but do not combust. Flights, trains, freight, food.',
        own: 'Everything you cause but do not combust. This is where the tonnes hide.',
      },
    },
  ],
  punch: {
    example: 'of my year is scope 3. Same as every inventory I have ever built.',
    own: 'of your year is scope 3. Welcome to every corporate inventory ever written.',
  },
};

export const HOTSPOTS_ST = {
  tag: '05 · Hotspots',
  rankWord: 'Hotspot',
  headline: { example: 'Where my tonnes actually are.', own: 'Where your tonnes actually are.' },
  ofYear: 'of the year',
  punch: {
    example: 'The top wedge is the plan. Everything else is housekeeping.',
    own: 'Your top wedge is your plan. Everything else is housekeeping.',
  },
};

// Playful one-liners per category, used on story bars and share cards.
export const CATEGORY_QUIPS = {
  flight: { example: 'The itineraries. Obviously.', own: 'The itineraries. It is almost always the itineraries.' },
  diet: { example: 'Dinner, priced per day.', own: 'Dinner, priced per day.' },
  freight: { example: 'The awkward category: parcels.', own: 'The awkward category: parcels.' },
  electricity: { example: 'A frugal flat, counted anyway.', own: 'The metered life.' },
  gas: { example: 'Hot showers, on the meter.', own: 'Hot showers, on the meter.' },
  road: { example: 'Trains mostly, and it shows.', own: 'Wheels on the ground.' },
  other: { example: 'The junk drawer.', own: 'The junk drawer.' },
};

export const MONTHS_ST = {
  tag: '06 · The worst month',
  kicker: 'Worst month',
  line: {
    example: 'in one month. The year started as it meant to continue.',
    own: 'in one month. Point events land where they happen; bills spread across what they cover.',
  },
  chartAria: 'Twelve small bars, one per month, with the worst month highlighted.',
};

export const BENCH_ST = {
  tag: '07 · Context',
  headline: 'Context, honestly.',
  rows: {
    you: { example: 'This audit', own: 'Your audit' },
    aus: 'Australian average',
    global: 'Global average',
    budget: '1.5°C budget, 2030',
  },
  line: {
    example: 'Under the national average, miles over the budget. The gap is not a rounding error; it is a decision I have not made yet.',
    own: 'The benchmarks carry a wider boundary than this audit, so the honest comparison is even less flattering. The budget line is the one that matters.',
  },
  caveat: 'National figures carry a wider boundary than this audit, so totals here understate a full consumption footprint.',
};

export const NEEDLE = {
  tag: '08 · The needle',
  headline: 'What would actually move it.',
  sub: {
    example: 'Each action priced against my audited numbers, not a national average. Ranked by tonnes, not by vibes.',
    own: 'Each action priced against your audited numbers, not a national average. Ranked by tonnes, not by vibes.',
  },
  perYear: 't / yr',
  saves: 'pays you',
  costs: 'costs',
  punch: 'One decision beats fifty habits.',
  cta: 'Open the full plan',
};

export const OUTRO = {
  tag: '09 · The audit',
  headline: { example: 'That is the story.', own: 'That is your story.' },
  sub: {
    example: 'The full audit lives below: every entry, every factor, the abatement cost curve and the basis of preparation. Rigour in the numbers, and now you have seen the shape of them.',
    own: 'Your full audit lives below: every entry, every factor, your own cost curve and pathway. It saves to this browser as you edit.',
  },
  explore: 'Explore the full audit',
  start: 'Start your own audit',
  again: 'Watch it again',
};

export const SHARE_ST = {
  button: 'Save this card',
  copied: 'Card saved.',
  copyLink: 'Copy link',
  linkCopied: 'Link copied.',
  shareAria: 'Share this moment',
  // Card footers and titles by moment.
  site: 'itschriswang.github.io/Portfolio/footprint',
  method: 'Scope 1, 2 and 3 of me · published factors, no offsets',
  cards: {
    total: { example: 'MY YEAR IN CARBON', own: 'MY YEAR IN CARBON' },
    hotspot: { example: 'HOTSPOT №1', own: 'MY HOTSPOT №1' },
    guess: { example: 'I CALLED IT', own: 'I CALLED IT' },
    bench: { example: 'IN CONTEXT', own: 'IN CONTEXT' },
    needle: { example: 'THE PLAN', own: 'MY PLAN' },
  },
};

export const OB = {
  title: 'Your audit',
  intro: 'Five short steps. Rough numbers now, real bills later. Everything stays in this browser.',
  liveNote: 'priced live on published factors',
  soFar: 'Your year so far',
  soFarSr: 'About {t} tonnes per year so far.',
  stepOf: 'Step {n} of {total}',
  perYear: 't / yr',
  flightAdded: [
    'That one is {t} t on its own.',
    '{t} t. Now your #{rank} line.',
    'Another {t} t. The itineraries add up.',
  ],
  flightTop: '{t} t. That flight just became your #1 hotspot.',
  stepLabels: ['You', 'Home energy', 'Getting around', 'Flights', 'Food & parcels'],
  done: {
    title: 'Your audit is live.',
    sub: 'Saved to this browser, priced on the same factors as everything else on this page. Now the good part.',
    watch: 'Watch your reveal',
    skip: 'Straight to the dashboard',
  },
  approx: '≈ {t} t/yr',
  approxEach: '≈ {t} t each',
};

export const DASH_EXTRA = {
  compare: {
    vsExample: "Overlay Chris's FY2026",
    vsOwn: 'Overlay your audit',
    note: 'Same boundary, same factors, different life. Diamonds mark the overlaid audit.',
    overlaid: 'Overlaid: {label}, {t} t total.',
  },
  replayChip: 'Replay the reveal',
};

// Strings drawn onto the canvas share cards.
export const CARD_TEXT = {
  tonnes: 'TONNES CO₂-E · ',
  ofYear: '% OF THE YEAR',
  guessLabel: 'THE GUESS',
  auditLabel: 'THE AUDIT',
  benchNote: 'National figures carry a wider boundary than this audit.',
};

// Small helpers shared by story components.
export const fill = (tpl, vals) => tpl.replace(/\{(\w+)\}/g, (_, k) => String(vals[k] ?? ''));
