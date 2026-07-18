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
  next: 'Next:',
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
  { id: 'st-character', label: 'Your character' },
  { id: 'st-needle', label: 'The needle' },
  { id: 'st-outro', label: 'The audit' },
];

export const COVER = {
  tag: 'Life Footprint',
  h1a: 'Scope 1, 2 and 3',
  h1b: 'of me',
  sub: {
    example:
      'I measure carbon for big organisations. This is the same maths pointed at my own life: a year of flights, bills, parcels and dinners, honestly added up.',
    own:
      'Your year, measured in carbon: flights, power, food, deliveries. It stays in this browser and nowhere else.',
  },
  start: 'Start your own audit',
  startNote: 'Ten minutes, your bills, no account.',
  assessor: 'Here to assess the work, not run one? The 45-second version',
  scrollCue: 'Scroll to dive in',
};

export const YEAR = {
  tag: '01 · The year',
  headline: { example: 'Twelve months', own: 'Your twelve months' },
  sub: {
    example: 'entries in the log. Every flight, bill and dinner, each with its own number.',
    own: 'entries built from your answers, each with its own number.',
  },
  // Suffixes for the streaming ticker rows.
  tickerAria: 'A stream of the individual log entries behind this audit.',
};

export const GUESS = {
  tag: '02 · Guess',
  headline: { example: 'Guess my number', own: 'Guess your number' },
  sub: {
    example: 'One person, one year: every flight, power bill, meal and delivery. How many tonnes of carbon? Have a guess.',
    own: 'How many tonnes did your year add up to? Have a guess.',
  },
  unit: 'tonnes',
  lockIn: 'Lock it in',
  noIdea: 'Skip the guess',
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
  chipsLabel: 'Gather a category in the particle field',
  kicker: { example: 'My FY2026 total', own: 'Your year in carbon' },
  unit: 'tonnes CO₂-e',
  line: {
    example: 'Every flight, bill, parcel and dinner. Counted, not confessed.',
    own: 'Everything you logged, added up. The awkward bits left in.',
  },
};

export const SCOPES = {
  tag: '04 · Three scopes',
  headline: 'One life, three buckets',
  gloss: 'Carbon accountants call the buckets scopes. In plain words: what you burn, the power you buy, and everything made or moved for you.',
  items: [
    {
      n: '1',
      name: 'Scope 1',
      plain: { example: 'What I burn', own: 'What you burn' },
      line: {
        example: 'The gas under my hot water and cooktop. Fuel burned at home, in my name.',
        own: 'Gas and petrol burned directly by you.',
      },
    },
    {
      n: '2',
      name: 'Scope 2',
      plain: { example: 'The power I buy', own: 'The power you buy' },
      line: {
        example: 'Electricity for a small flat that runs on surprisingly little.',
        own: 'Your electricity, at your state grid factor.',
      },
    },
    {
      n: '3',
      name: 'Scope 3',
      plain: { example: 'Everything else', own: 'Everything else' },
      line: {
        example: 'Flights, trains, deliveries, food. Made or moved for me by someone else.',
        own: 'Flights, transport, deliveries, food. Made or moved for you by someone else.',
      },
    },
  ],
  punch: {
    example: 'of my year is bucket three. Same as every company I have ever audited.',
    own: 'of your year is bucket three. Same as almost everyone.',
  },
};

export const HOTSPOTS_ST = {
  tag: '05 · Hotspots',
  rankWord: 'Hotspot',
  headline: { example: 'Where my tonnes actually are', own: 'Where your tonnes actually are' },
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
    own: 'in one month. Bills spread out evenly; big trips spike.',
  },
  chartAria: 'One small bar per month; the worst month, {name} at {t} tonnes, is highlighted.',
};

export const BENCH_ST = {
  tag: '07 · Context',
  headline: { example: 'How my year compares', own: 'How your year compares' },
  rows: {
    you: { example: 'This audit', own: 'Your audit' },
    aus: 'Australian average',
    global: 'World average',
    budget: '2030 climate budget',
  },
  tiles: {
    aus: 'of the Australian average',
    global: 'of the world average',
    budget: 'of the 2030 climate budget',
  },
  line: {
    example: 'Under the Australian average, still miles over the 2030 budget of 2.5 tonnes a person. Closing that gap is the plan below.',
    own: 'The 2030 budget of 2.5 tonnes a person is the line that matters. The plan below is how you move toward it.',
  },
  // Personal overshoot day: the date the 2.5 t budget ran out at this pace.
  overshoot: {
    kicker: 'Budget day',
    line: {
      example: 'At my pace, the whole 2030 budget was spent by {date}. Day {day} of 365; the rest of the year ran on borrowed carbon.',
      own: 'At your pace, the 2030 budget was spent by {date}. Day {day} of 365; everything after ran on borrowed carbon.',
    },
    within: 'The 2.5 t budget outlasted the whole year. That almost never happens.',
  },
  caveat: 'The averages count more things than this audit does (clothes, gadgets, services), so the true gap is bigger, not smaller.',
};

export const NEEDLE = {
  tag: '09 · The needle',
  headline: 'What would actually move it',
  sub: {
    example: 'The three changes that would cut the biggest share of my actual year, not of a national average. Ranked by size, not by vibes.',
    own: 'The three changes that would cut the biggest share of your actual year, not of a national average. Ranked by size, not by vibes.',
  },
  ofYear: 'of the year',
  perYear: 't / yr',
  perTonne: 'a tonne',
  saves: 'saves you about',
  costs: 'costs about',
  punch: 'One decision beats fifty habits.',
  cta: 'Open the full plan',
};

export const OUTRO = {
  tag: '10 · The audit',
  headline: { example: 'That is the story', own: 'That is your story' },
  sub: {
    example: 'The working audit is below: every entry with its source, the plan with its costs, and the method one click away.',
    own: 'Your working audit is below: every entry, your plan, and what each fix would save. It saves in this browser as you edit.',
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
  linkedin: 'LinkedIn banner (PNG)',
  // Card footers and titles by moment.
  site: 'itschriswang.github.io/Portfolio/footprint',
  method: 'Home energy, travel, freight and diet · published factors, no offsets',
  cards: {
    total: { example: 'MY YEAR IN CARBON', own: 'MY YEAR IN CARBON' },
    hotspot: { example: 'HOTSPOT №1', own: 'MY HOTSPOT №1' },
    guess: { example: 'I CALLED IT', own: 'I CALLED IT' },
    bench: { example: 'IN CONTEXT', own: 'IN CONTEXT' },
    needle: { example: 'THE PLAN', own: 'MY PLAN' },
    character: { example: 'MY CARBON CHARACTER', own: 'MY CARBON CHARACTER' },
  },
};

export const CHARACTER_ST = {
  tag: '08 · The character',
  kicker: { example: 'My audit classifies as', own: 'Your audit classifies as' },
  headline: 'Twelve shapes a footprint takes',
  sub: {
    example: 'Three measurements decide it: how big the year is, how concentrated, and how it arrived. Mine reads like this.',
    own: 'Three measurements decide it: how big the year is, how concentrated, and how it arrived. Yours reads like this.',
  },
  // The three meters, shown filling before the emblem forms. Each axis has a
  // label, a plain-words gloss, a name per level, and a reading template.
  axes: {
    weight: {
      label: 'Weight',
      gloss: 'the size of the year',
      levels: { feather: 'Featherweight', middle: 'Middleweight', heavy: 'Heavyweight' },
      reading: '{t} t',
      ticks: [
        { label: '6.6 t · world avg' },
        { label: '16 t' },
      ],
    },
    shape: {
      label: 'Shape',
      gloss: 'how concentrated',
      levels: { specialist: 'Specialist', generalist: 'Generalist' },
      reading: '{share}% in the top wedge',
      tickLabel: '40%',
    },
    rhythm: {
      label: 'Rhythm',
      gloss: 'how it arrived',
      levels: { spiky: 'Spiky', steady: 'Steady' },
      reading: 'worst month {x}× the average',
      tickLabel: '2×',
    },
  },
  metersAria: 'Three meters: weight {weight}, shape {shape}, rhythm {rhythm}.',
  badge: {
    kicker: 'Achievement unlocked',
    note: 'Inside the 2.5 t lifestyle budget. The rarest ending in the game.',
  },
  topEntry: 'Biggest single line: {label}, {t} t on its own.',
  matrixTitle: 'The whole taxonomy',
  matrixCols: [
    ['One wedge', 'in bursts'],
    ['One wedge', 'steady'],
    ['Spread', 'in bursts'],
    ['Spread', 'steady'],
  ],
  matrixRows: { feather: 'Under 6.6 t', middle: '6.6 to 16 t', heavy: 'Over 16 t' },
  matrixAria: 'The twelve characters as a grid: three weight rows by four temperament columns. Yours is {name}.',
  othersNote: 'Assigned by rule, not by quiz: three measured axes, twelve cells. The thresholds are stated in the basis of preparation, next to everything else.',
  yoursFlag: 'you',
};

export const OB = {
  title: 'Your audit',
  intro: 'Five short steps. Rough numbers now, real bills later. Everything stays in this browser.',
  liveNote: 'priced live on published factors',
  soFar: 'Your year so far',
  soFarSr: 'About {t} tonnes per year so far.',
  stepOf: 'Step {n} of {total}',
  perYear: 't / yr',
  perTonne: 'a tonne',
  flightAdded: [
    'That one is {t} t on its own.',
    '{t} t. Now your #{rank} line.',
    'Another {t} t. The itineraries add up.',
  ],
  flightTop: '{t} t. That flight just became your #1 hotspot.',
  stepLabels: ['You', 'Home energy', 'Getting around', 'Flights', 'Food & parcels'],
  done: {
    title: 'Your audit is live',
    sub: 'Saved to this browser, priced on the same factors as everything else on this page. The reveal tells you the rest: where it lands, what shape it takes, what would move it.',
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
  characterLabel: 'Profile',
};

// Strings drawn onto the canvas share cards.
export const CARD_TEXT = {
  tonnes: 'TONNES CO₂-E · ',
  ofYear: '% OF THE YEAR',
  guessLabel: 'THE GUESS',
  auditLabel: 'THE AUDIT',
  benchNote: 'National figures carry a wider boundary than this audit.',
  counted: 'SELF-COUNTED',
};

// Small helpers shared by story components.
export const fill = (tpl, vals) => tpl.replace(/\{(\w+)\}/g, (_, k) => String(vals[k] ?? ''));
