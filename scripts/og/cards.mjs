// Share-thumbnail specs, one per page. The generator (generate.mjs) renders
// each to public/<out> at 1200x630 using the shared routine in draw.js.
//
// Copy rules follow the site: Australian English, no em dashes, active voice,
// headlines do not end in a full stop. Lead the headline with what the page
// IS so the link preview markets it. Keep support lines short enough to sit
// in the left column (roughly 52 characters); chips are what the tool covers,
// never personal numbers. `ghost` is the big faint monogram behind the mesh.
//
// Home (/) and Work (/work/) intentionally keep the profile card
// (public/og-image.png); they are about Chris, not a single tool.

export const CARDS = [
  {
    out: 'og-footprint.png',
    eyebrow: ['LIFE FOOTPRINT', '  ·  WEIGH YOUR YEAR'],
    headline: ["What's your", 'carbon footprint?'],
    support: [
      'Flights, power, food and freight, priced on published',
      'factors. Clear numbers, no guesswork, just yours.',
    ],
    chips: ['Flights', 'Driving', 'Home', 'Food', 'Freight', 'Stuff'],
    ghost: { text: 'CO', sub: '2', size: 400, subSize: 268, baseline: 348, subBaseline: 452, endX: 1178 },
    url: 'itschriswang.com/footprint',
    footer: 'Run your own · quick estimate in a minute · data stays in your browser',
    meshSeed: 20260722,
    excludeX: 812,
  },
  {
    out: 'og-fashion.png',
    eyebrow: ['COST PER WEAR', '  ·  BRAND TRANSPARENCY'],
    headline: ["What's behind", 'the label?'],
    support: [
      "Look up a brand's disclosures, materials and owners.",
      'Compare the claims, then judge for yourself.',
    ],
    chips: ['Disclosure', 'Materials', 'Owners', 'Claims', 'Carbon'],
    ghost: { text: 'CPW', size: 300, baseline: 392, endX: 1178 },
    url: 'itschriswang.com/fashion',
    footer: 'Look up any brand · compare · data stays in your browser',
    meshSeed: 4210,
  },
  {
    out: 'og-grid.png',
    eyebrow: ['GRID INTENSITY', '  ·  LIVE NEM CARBON'],
    headline: ['Run it now,', 'or wait?'],
    support: [
      'See how clean the grid is right now, and when to',
      'run the big loads for the least carbon.',
    ],
    chips: ['NSW', 'VIC', 'QLD', 'SA', 'TAS'],
    ghost: { text: 'kWh', size: 300, baseline: 392, endX: 1178 },
    url: 'itschriswang.com/grid',
    footer: 'Live NEM data · updates every few minutes',
    meshSeed: 5030,
  },
  {
    out: 'og-daily.png',
    eyebrow: ['SUSTAINABILITY DAILY', '  ·  TWO GAMES'],
    headline: ['Two climate games,', 'fresh every day'],
    support: [
      'Guess the footprint. Spot the greenwash. Keep a',
      'streak going. A ten-second daily habit.',
    ],
    chips: ['Guess the Footprint', 'Greenwash or Not'],
    ghost: { text: '?', size: 470, baseline: 430, endX: 1140 },
    url: 'itschriswang.com/daily',
    footer: 'New puzzles daily · streaks stay in your browser',
    meshSeed: 7220,
  },
  {
    out: 'og-super.png',
    eyebrow: ['SUPER FUND HOLDINGS', '  ·  WHAT YOU OWN'],
    headline: ["Where's your", 'super invested?'],
    support: [
      "The default option's real holdings and sector mix,",
      "next to each fund's own green marketing.",
    ],
    chips: ['Energy', 'Banks', 'Mining', 'Property', 'Tech'],
    ghost: { text: '$', size: 470, baseline: 440, endX: 1140 },
    url: 'itschriswang.com/super',
    footer: 'Default options · sources dated · verified per fund',
    meshSeed: 9010,
  },
  {
    out: 'og-progress.png',
    eyebrow: ["AUSTRALIA'S CLIMATE", '  ·  PROGRESS VS TARGET'],
    headline: ['Is Australia', 'on track?'],
    support: [
      'Grid mix, EV sales, new capacity and emissions,',
      'each read against the 2030 target.',
    ],
    chips: ['Grid', 'EV sales', 'Capacity', 'Emissions', 'Target'],
    ghost: { text: '2030', size: 300, baseline: 392, endX: 1178 },
    url: 'itschriswang.com/progress',
    footer: 'Reviewed quarterly · sources dated in the method',
    meshSeed: 3030,
  },
  {
    out: 'og-targets.png',
    eyebrow: ['TARGET TRACKER', '  ·  ASX50 NET ZERO'],
    headline: ['Fifty promises,', 'one ledger'],
    support: [
      "Each ASX50 company's claimed path to net zero,",
      'plotted against what it reported.',
    ],
    chips: ['Net zero', 'Interim targets', 'Reported', 'The gap'],
    ghost: { text: '2050', size: 300, baseline: 392, endX: 1178 },
    url: 'itschriswang.com/targets',
    footer: 'Company disclosures · flagged where unverified',
    meshSeed: 2050,
  },
];
