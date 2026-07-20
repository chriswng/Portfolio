// Editorial copy for the reveal story, the guided audit and the share cards.
// Words live here, not in components. Australian English, no em dashes,
// Chris's voice. Most strings come in two voices: 'example' narrates my
// FY2026 worked example, 'own' narrates the visitor's audit back to them.

export const CHROME = {
  skip: 'Skip to the dashboard',
  replay: 'Replay the reveal',
  progressLabel: 'Story progress',
  next: 'Next:',
  keepScrolling: 'Keep scrolling',
};

export const CHAPTERS = [
  { id: 'st-cover', label: 'Open' },
  { id: 'st-year', label: 'The year' },
  { id: 'st-guess', label: 'Reference points' },
  { id: 'st-total', label: 'The number' },
  { id: 'st-scopes', label: 'Where it comes from' },
  { id: 'st-hotspots', label: 'Hotspots' },
  { id: 'st-months', label: 'Worst month' },
  { id: 'st-bench', label: 'In context' },
  { id: 'st-character', label: 'Your result' },
  { id: 'st-needle', label: 'Cut it down' },
  { id: 'st-outro', label: 'Share' },
];

export const COVER = {
  tag: 'Your Carbon Footprint',
  eyebrow: 'A carbon footprint calculator',
  h1a: 'My year of',
  h1b: 'carbon emissions',
  sub: {
    example:
      'I measure carbon for a living, so I pointed the same maths at my own year: every flight, power bill, parcel and dinner, added up honestly.',
    own:
      'Your year, measured in carbon: flights, power, food and deliveries. It stays in this browser and nowhere else.',
  },
  // Sets the expectation the home page never does: this is a scroll-through,
  // not another landing page. Every dot behind the words is ten kilograms.
  meta: '{n} chapters · scroll or tap through · every dot is 10 kg of carbon',
  start: 'Calculate your own',
  startNote: 'About ten minutes, your bills, no account.',
  scrollCue: 'Scroll to begin',
};

export const YEAR = {
  tag: '01 · The year',
  headline: { example: 'Twelve months', own: 'Your twelve months' },
  sub: {
    example: 'trips, bills and meals, each with its own number.',
    own: 'items built from your answers, each with its own number.',
  },
  // Suffixes for the streaming ticker rows.
  tickerAria: 'A stream of the individual items behind this footprint.',
};

// Reference points shown before the total, so the number lands with context
// instead of arriving cold. Three published benchmarks, most-to-least.
export const GUESS = {
  tag: '02 · Reference points',
  headline: { example: 'Three numbers to hold on to', own: 'Three numbers to hold on to' },
  sub: {
    example: 'Before you see my total, here is what a year of carbon looks like for other people. Keep these in mind.',
    own: 'Before your total, here is what a year of carbon looks like for other people. Keep these in mind.',
  },
  refs: [
    { id: 'aus', label: 'Australian average', unit: 't a person', note: 'per person, all greenhouse gases' },
    { id: 'global', label: 'World average', unit: 't a person', note: 'per person, all greenhouse gases' },
    { id: 'budget', label: '1.5°C lifestyle benchmark', unit: 't a person', note: 'where a fair share needs to be by 2030' },
  ],
  cont: 'See where I land',
  contOwn: 'See where you land',
};

export const TOTAL = {
  tag: '03 · The number',
  chipsLabel: 'Tap a category to see its share light up in the field behind the number',
  chipsHint: 'Tap a category: the glowing dots are its share of the total.',
  kicker: { example: 'My FY2026 carbon emissions', own: 'Your year in carbon' },
  unit: 'tonnes CO₂-e',
  // Cute, accurate aside explaining the "-e" the first time it appears.
  eNote: 'CO₂-e means "carbon dioxide equivalent". It lets different greenhouse gases sit in one number, like converting currencies before you add them up.',
  line: {
    example: 'Every flight, power bill, parcel and dinner, added up.',
    own: 'Everything you entered, added up. The awkward bits left in.',
  },
};

export const SCOPES = {
  tag: '04 · Where it comes from',
  headline: 'Three places emissions come from',
  gloss: {
    example: 'Companies sort their emissions into Scope 1, 2 and 3: what they burn, the energy they buy, and everything caused by their choices further down the chain. The same three buckets work for a person.',
    own: 'Companies sort their emissions into Scope 1, 2 and 3: what they burn, the energy they buy, and everything else their choices cause. The same three buckets work for a person.',
  },
  items: [
    {
      n: '1',
      name: 'Scope 1 · what you burn',
      plain: { example: 'Fuel I burn myself', own: 'Fuel you burn yourself' },
      line: {
        example: 'The gas heating my water and cooktop. If I had a car, the petrol I burned would sit here too.',
        own: 'Gas burned at home, and petrol if you drive. Fuel you light directly.',
      },
    },
    {
      n: '2',
      name: 'Scope 2 · energy you buy',
      plain: { example: 'Electricity I buy', own: 'Electricity you buy' },
      line: {
        example: 'The electricity for my apartment. A power station burns the fuel; the emissions are still mine.',
        own: 'Your electricity. A power station burns the fuel on your behalf.',
      },
    },
    {
      n: '3',
      name: 'Scope 3 · everything else',
      plain: { example: 'Caused by me, made elsewhere', own: 'Caused by you, made elsewhere' },
      line: {
        example: 'Flights, food, freight, rideshare, goods and services. Caused by my choices, but the emissions happen somewhere else.',
        own: 'Flights, food, freight, rideshare, goods and services. Your choices, emitted somewhere else.',
      },
    },
  ],
  punch: {
    example: 'of my year is Scope 3: things my choices set in motion, but that happen out of sight.',
    own: 'of your year is Scope 3: things your choices set in motion, but that happen out of sight.',
  },
};

export const HOTSPOTS_ST = {
  tag: '05 · Hotspots',
  rankWord: 'Hotspot',
  headline: { example: 'Where the tonnes actually are', own: 'Where your tonnes actually are' },
  ofYear: 'of the year',
  punch: {
    example: 'A few categories decide almost everything. Working on the biggest ones is how I cut my carbon the most.',
    own: 'A few categories decide almost everything. Working on the biggest ones is how you cut your carbon the most.',
  },
};

// Playful one-liners per category, used on story bars and share cards.
export const CATEGORY_QUIPS = {
  flight: { example: 'The flights. Almost always the flights.', own: 'The flights. It is almost always the flights.' },
  diet: { example: 'Dinner, added up over a year.', own: 'Dinner, added up over a year.' },
  freight: { example: 'Parcels, and how they travel.', own: 'Parcels, and how they travel.' },
  electricity: { example: 'The apartment on the meter.', own: 'Your electricity on the meter.' },
  gas: { example: 'Hot water and the cooktop.', own: 'Hot water and the cooktop.' },
  road: { example: 'Trains, buses and rideshare.', own: 'Wheels on the ground.' },
  other: { example: 'Everything else.', own: 'Everything else.' },
  goods: { example: 'The stuff, tallied up.', own: 'Clothes, gadgets and the rest.' },
  hotel: { example: 'Nights away from home.', own: 'Nights away from home.' },
};

export const MONTHS_ST = {
  tag: '06 · The worst month',
  kicker: 'Worst month',
  line: {
    example: 'in a single month, almost all of it flights. One month of travel outweighed the rest of the year.',
    own: 'in a single month. Bills spread out evenly; big trips spike.',
  },
  chartAria: 'One small bar per month; the worst month, {name} at {t} tonnes, is highlighted.',
};

export const BENCH_ST = {
  tag: '07 · In context',
  headline: { example: 'How my year compares', own: 'How your year compares' },
  rows: {
    you: { example: 'My emissions', own: 'Your emissions' },
    aus: 'Australian average',
    global: 'World average',
    budget: '1.5°C lifestyle benchmark',
  },
  tiles: {
    aus: 'of the Australian average',
    global: 'of the world average',
    budget: 'of the 1.5°C lifestyle benchmark',
  },
  line: {
    example: 'Under the Australian average, but still well over the 1.5°C lifestyle benchmark of 2.5 tonnes a person. Cutting the flights is how I close that gap.',
    own: 'The 1.5°C lifestyle benchmark of 2.5 tonnes a person is the line that matters. The next section is how you move toward it.',
  },
  // Explains what the benchmark is and why 1.5°C matters, briefly.
  benchNote: 'The 2.5 t line is a 1.5°C-aligned lifestyle benchmark: where an average person\'s footprint needs to be by 2030 to help hold warming near 1.5°C. Passing 1.5°C means more extreme heat, heavier rain, deeper drought and more damage to ecosystems, so the line is a target to aim under, not a goal to reach later.',
  // Personal overshoot day: the date the 2.5 t budget ran out at this pace.
  overshoot: {
    kicker: 'Budget day',
    line: {
      example: 'At my pace, a whole year of the 2.5 t benchmark was used up by {date}. Day {day} of 365; the rest of the year ran over.',
      own: 'At your pace, a whole year of the 2.5 t benchmark was used up by {date}. Day {day} of 365; everything after ran over.',
    },
    within: 'You stayed inside the 2.5 t benchmark all year. That almost never happens.',
  },
  caveat: 'The national and world averages count a wider basket than the core survey does. The optional detail step adds some of it back (clothes, gadgets, services, hotel nights); even then a few things stay out, so the real gap is if anything bigger, not smaller.',
};

export const NEEDLE = {
  tag: '09 · The needle',
  headline: 'How could I have cut my carbon this year?',
  headlineOwn: 'How could you cut your carbon this year?',
  sub: {
    example: 'The three changes that would cut the biggest share of my actual year, not of a national average. Ranked by size.',
    own: 'The three changes that would cut the biggest share of your actual year, not of a national average. Ranked by size.',
  },
  ofYear: 'of the year',
  perYear: 't / yr',
  punch: 'One big change beats fifty small habits.',
  cta: 'See the full options',
};

export const OUTRO = {
  tag: '10 · Share',
  headline: { example: 'Share the year', own: 'Share your year' },
  sub: {
    example: 'Save a card to post, or send the link. The supporting detail, the reduction options and how it all works are below.',
    own: 'Save a card to post, or send the link. Your working detail and the reduction options are below. It all stays in this browser.',
  },
  galleryLabel: 'Shareable cards',
  explore: 'See the detail below',
  start: 'Calculate your own',
  again: 'Watch it again',
};

export const SHARE_ST = {
  button: 'Share this card',
  copied: 'Card saved.',
  copyLink: 'Copy link',
  linkCopied: 'Link copied.',
  shareAria: 'Share this moment',
  linkedin: 'LinkedIn banner (PNG)',
  // The share sheet: pick a size, preview it, then share or save.
  sheet: {
    title: 'Share this',
    sub: 'Preview it, then send it straight to a story, a post or LinkedIn. Nothing leaves your device until you choose to share.',
    previewAlt: 'Preview of the share image',
    rendering: 'Drawing your card…',
    share: 'Share',
    shareHint: 'Opens your phone’s share sheet: Instagram Story, LinkedIn, Messages.',
    save: 'Save image',
    saveHint: 'Saves the PNG, ready to post yourself.',
    saved: 'Saved to your device.',
    shared: 'Shared.',
    close: 'Close',
    formats: {
      story: 'Instagram story',
      post: 'Square post',
      linkedin: 'LinkedIn',
    },
    formatNote: {
      story: '9:16 · Instagram or TikTok stories',
      post: '4:5 · Instagram, Facebook or a message',
      linkedin: 'Landscape banner sized for the LinkedIn feed',
    },
  },
  // Card footers and titles by moment.
  site: 'itschriswang.com/footprint',
  method: 'Home energy, travel, freight and diet · published factors, no offsets',
  cards: {
    total: { example: 'CARBON EMISSIONS', own: 'CARBON EMISSIONS' },
    hotspot: { example: 'BIGGEST SOURCE', own: 'BIGGEST SOURCE' },
    bench: { example: 'IN CONTEXT', own: 'IN CONTEXT' },
    needle: { example: 'BIGGEST CUTS', own: 'BIGGEST CUTS' },
    character: { example: 'MY CARBON RESULT', own: 'MY CARBON RESULT' },
  },
};

export const CHARACTER_ST = {
  tag: '08 · Your result',
  kicker: { example: 'My year in carbon is', own: 'Your year in carbon is' },
  // Leads straight with the named result; {name} is filled in the component.
  headline: 'My year in carbon is {name}',
  headlineOwn: 'Your year in carbon is {name}',
  sub: {
    example: 'A playful label for the shape of the year, read from three things: how big it is, how much sits in one category, and whether it came in spikes or evenly.',
    own: 'A playful label for the shape of your year, read from three things: how big it is, how much sits in one category, and whether it came in spikes or evenly.',
  },
  // The three meters, shown filling before the emblem forms. Each axis has a
  // label, a plain-words gloss, a name per level, and a reading template.
  axes: {
    weight: {
      label: 'Size',
      gloss: 'how big the year is',
      levels: { feather: 'Small', middle: 'Medium', heavy: 'Large' },
      reading: '{t} t',
      ticks: [
        { label: '6.6 t · world avg' },
        { label: '16 t' },
      ],
    },
    shape: {
      label: 'Focus',
      gloss: 'how much sits in one category',
      levels: { specialist: 'One big category', generalist: 'Spread out' },
      reading: '{share}% in the biggest category',
      tickLabel: '40%',
    },
    rhythm: {
      label: 'Timing',
      gloss: 'spikes or evenly',
      levels: { spiky: 'Comes in spikes', steady: 'Fairly even' },
      reading: 'worst month {x}× an average month',
      tickLabel: '2×',
    },
  },
  metersAria: 'Three readings: size {weight}, focus {shape}, timing {rhythm}.',
  badge: {
    kicker: 'Rare result',
    note: 'Inside the 2.5 t lifestyle benchmark, which almost nobody is.',
  },
  topEntry: 'Biggest single item: {label}, {t} t on its own.',
  matrixTitle: 'The twelve results',
  matrixCols: [
    ['One category', 'in spikes'],
    ['One category', 'even'],
    ['Spread out', 'in spikes'],
    ['Spread out', 'even'],
  ],
  matrixRows: { feather: 'Under 6.6 t', middle: '6.6 to 16 t', heavy: 'Over 16 t' },
  matrixAria: 'The twelve results as a grid: three size rows by four pattern columns. Yours is {name}.',
  othersNote: 'A bit of fun, worked out from the numbers, not a quiz. The exact cut-offs are on the how-it-works page.',
  yoursFlag: 'you',
};

export const OB = {
  title: 'Your footprint',
  intro: 'Five short steps, then an optional sixth. Rough answers now, real bills whenever you like. Everything stays in this browser, and we keep the final total for the reveal.',
  // Neutral, spoiler-free footer line. The running total is deliberately not
  // shown: seeing it here would spoil the reveal that follows.
  keepForReveal: 'We add it all up at the reveal, not here',
  stepOf: 'Step {n} of {total}',
  // Gentle per-step confirmations, no tonnes: progress, never a total.
  progress: {
    you: 'Basics set',
    energy: 'Home energy added',
    travel: 'Getting-around added',
    flights: { none: 'No flights yet', some: '{n} flight{s} added' },
    food: 'Food and parcels added',
    advanced: 'Optional detail (skip any time)',
  },
  stepLabels: ['You', 'Home energy', 'Getting around', 'Flights', 'Food & parcels', 'More detail'],
  done: {
    title: 'That is everything',
    sub: 'Your footprint is saved to this browser. Now the fun part: your reveal walks you through what it all adds up to, where it lands, and how to cut it down.',
    ready: 'Five sections, done. Nothing left to fill in.',
    watch: 'Watch your reveal',
    skip: 'Straight to the detail',
  },
};

export const DASH_EXTRA = {
  compare: {
    vsExample: "Overlay Chris's FY2026",
    vsOwn: 'Overlay your footprint',
    note: 'Same boundary, same factors, different life. Diamonds mark the overlaid footprint.',
    overlaid: 'Overlaid: {label}, {t} t total.',
  },
  replayChip: 'Replay the reveal',
  characterLabel: 'Result',
};

// Strings drawn onto the canvas share cards.
export const CARD_TEXT = {
  tonnes: 'TONNES CO₂-E · ',
  ofYear: '% OF THE YEAR',
  guessLabel: 'THE GUESS',
  auditLabel: 'THE AUDIT',
  benchNote: 'National figures cover a wider boundary than this calculator.',
  counted: 'SELF-COUNTED',
};

// Small helpers shared by story components.
export const fill = (tpl, vals) => tpl.replace(/\{(\w+)\}/g, (_, k) => String(vals[k] ?? ''));
