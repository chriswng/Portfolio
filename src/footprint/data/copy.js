// All editorial copy for the Life Footprint page. Words live here, not in
// components. Australian English, no em dashes, Chris's voice.

export const META = {
  navLabel: 'Footprint',
  title: 'Your Carbon Footprint',
};

export const INTRO = {
  tag: 'Your Carbon Footprint',
  h1a: 'Calculate your year of',
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
  tag: '02 / What if',
  title: ['Replay the year', 'differently'],
  sub: 'A sandbox, not a pledge. Every change here is priced against the real numbers above, not a national average: flip one on and see the year you could have had, and the decade that follows. Offsets and green-power products are left out on purpose: they shuffle certificates, they do not remove the emissions.',
  scenarioTitle: 'Where it goes from here',
  scenarioSub: 'Two lines. The lower one is the version of the year you just built, carried forward; the upper dashed one is where things stay if nothing changes. They sit together until you switch a change on. The grid keeps getting cleaner in the background either way, and bigger changes take longer to phase in.',
  budgetLabel: '1.5°C lifestyle benchmark · 2.5 t a person',
  bauLabel: 'If nothing changes',
  planLabel: 'With your changes',
  tableTitle: 'Flip the switches',
  tableSub: 'Turn a change on and the chart beside it rebuilds. Each card shows what changes, roughly how much it would save in a year, and how hard it would be. Nothing here is a commitment; it is a working model of your own year.',
  toggleOn: 'On',
  toggleOff: 'Try it',
  na: 'Not relevant here',
  ofYear: 'of this year',
  reductionLabel: 'a year',
  whyLabel: 'Why it matters',
  effortLabel: 'Difficulty',
  carouselLabel: 'Reduction options',
  prev: 'Previous options',
  next: 'More options',
  impact: {
    label: 'Switched on so far',
    none: 'Nothing switched on yet. Flip a change and watch the line pull away from "if nothing changes".',
    line: '{n} change{s} on. By 2030 this version of you lands at {at2030} t, down {pct}% from the {bau2030} t on the do-nothing line',
    over: '{gap} t over the 2.5 t benchmark',
    within: 'inside the 2.5 t benchmark',
    saves: 'about ${n} a year back in your pocket',
    costs: 'about ${n} a year net, upfront costs spread out',
    evens: 'roughly cost-neutral over the year',
  },
  // The cost curve view: each change alone, cheapest abatement first.
  chartViewLabel: 'Chart view',
  costTab: 'Cost curve',
  pathTab: 'Pathway',
  costTitle: 'What each change costs',
  costSub: 'Every change on its own, cheapest first. Bar width is the tonnes it saves a year; height is the cost per tonne, and anything below the line pays for itself. The pathway view sequences them; this ranks them by value.',
  costMoneyNote: 'Indicative net annual figure across your chosen changes, savings and outlays combined. Upfront costs (an EV, solar, a heat pump) are spread over their life; the basis for each is on its card.',
};

export const ONBOARD = {
  title: 'Calculate your footprint',
  intro: 'Five quick steps, then an optional sixth. Rough answers are fine; you can put real bills in later. Everything stays in this browser.',
  steps: ['You', 'Home energy', 'Getting around', 'Flights', 'Food & parcels', 'More detail'],
  you: {
    title: 'About you',
    sub: 'Where you live sets your power mix, and we split shared home energy across the people who live there.',
    state: 'Where do you live?',
    household: 'How many adults share your home? (counting you)',
    householdNote: 'We split shared home energy across the adults at home, so you are only counted for your share. Two adults means half of each bill is yours.',
    dwelling: 'Your place',
    dwellingHouse: 'House you own or could put solar on',
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
    // Filled in the component. Exact = NSW's published weekly cap; approx =
    // a derived ceiling for networks that cap by the day, by the trip, or not
    // at all right now. {asOf} dates the approximate figures.
    ptCapNoteExact: 'In {state}, {label} applies, so we will not count more than ${cap} a week unless you override it. Spending past the cap does not buy more travel.',
    ptCapNoteApprox: 'In {state}, fares are capped ({label}), so we will not count more than about ${cap} a week unless you override it. A rough ceiling, current as at {asOf}.',
    ptOverride: 'Count your full spend anyway',
    ptCapApplied: 'Counting up to ${cap} a week',
    ptCapAppliedApprox: 'Counting up to about ${cap} a week',
  },
  flights: {
    title: 'Your flights, one trip at a time',
    sub: 'Think through a typical year: holidays, work trips, weddings. Add a card for each trip, pick where it went, and pop in any hotel nights while you were there.',
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
    // Hotel nights ride with the trip that caused them, so each night is
    // priced at the factor for the country you actually slept in.
    nights: 'Hotel nights there',
    otherNights: 'Hotel nights with no flight attached',
    otherNightsNote: 'Road trips, work stays, weekends away. Counted at the Australian per-room-night factor. Nights on the trips above are priced at the destination country instead.',
    sourceSummary: 'How this is estimated',
    sourceBody: 'Flight emissions are estimated from the route distance and published UK Government (DESNZ) emissions factors, with an uplift for the extra warming of burning fuel at altitude. It is an estimate, not an airline-specific figure. Hotel nights are priced per occupied room-night at the destination country\'s published factor (UK Government DEFRA hotel-stay table), and land in the trip\'s month when you give one.',
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
  // The optional sixth step. Everything here is opt-in and starts at zero, so
  // skipping it (or the whole step) leaves the result unchanged. No average
  // person is ever substituted in: a skipped field counts nothing, and the
  // context chapter's caveat says the total leaves that basket out.
  advanced: {
    title: 'A little more detail',
    sub: 'Optional. The quick survey leaves out the things you buy: clothes, gadgets, going out and health. Pop in rough monthly figures and we will estimate those too, or skip the lot.',
    optional: 'Every field starts at zero and skipping adds nothing: we never swap in an average person\'s spending for yours. Skip it and your total simply leaves this basket out, and the benchmark chapter says so.',
    // Clothing counts items by default: per-garment factors weigh garments,
    // not dollars, so a fast-fashion haul reads as heavy as it is. Spend
    // stays as the fallback for someone who only knows their budget.
    clothingHow: 'Clothing and footwear: how do you want to count it?',
    clothingByItems: 'Count the items',
    clothingByItemsNote: 'Recommended',
    clothingBySpend: 'Count the spend',
    clothingItemsLabel: 'Bought new in the last 12 months',
    clothingItemsNote: 'Each item is priced on a published per-garment life-cycle factor, so ten cheap tees weigh ten times one tee, whatever they cost. Count what you bought new; second-hand pieces carry almost none of this and can be left out.',
    clothing: 'Clothing and footwear, $ a month',
    clothingNote: 'Spend-based, so every dollar carries the same factor: a $300 boutique jacket counts ten times a $30 fast-fashion tee, even though the physical impact of the cheap haul may be no smaller. If that sits badly, count the items instead; it is the more honest measure.',
    electronics: 'Electronics and tech, $ a month',
    electronicsNote: 'New phones, laptops, headphones, consoles, small appliances and accessories, averaged out. A $1,200 phone every two years is $50 a month.',
    entertainment: 'Entertainment and going out, $ a month',
    entertainmentNote: 'Streaming and subscriptions, the gym, gigs, cinema and events. Not meals and drinks: your diet already covers the food.',
    health: 'Health, out of pocket, $ a month',
    healthNote: 'Gap payments, pharmacy, physio, dental: what actually leaves your pocket, not what insurance covers.',
    other: 'Other goods and services, $ a month',
    otherNote: 'The rest of the trolley: furniture and homewares, personal care, haircuts, hobbies, pet things. Leave out rent, groceries and transport; they are counted elsewhere or out of scope.',
    homeQuestion: 'Did you build or buy this home brand new?',
    homeYes: 'Yes, new build',
    homeNo: 'No',
    homeNoNote: 'Or second-hand',
    homeNote: 'Only a home you built or bought new counts here: a new purchase is what pulled that construction into existence. Buy an existing place and you caused no new build, so it adds nothing, which is the point. Leave this off if you rent.',
    homeArea: 'Floor area of your {type}, m²',
    homeAreaNote: 'The upfront carbon locked in when it was built (materials, transport, construction) spread over a 50-year life and split per adult, so it lands as a small yearly share. Indicative only: real homes vary widely, so treat it as a rough screening figure.',
    skip: 'Skip this step',
    sourceSummary: 'How this is estimated',
    sourceBody: 'Clothing counted by item uses published per-garment life-cycle factors (ADEME\'s consumer-products LCA study, the basis of the French national per-item factors), so the physical count carries the number, not the price tag. The spend fields come from how much you spend: dollars times a published spend-based factor (US EPA supply-chain factors, converted to Australian dollars). The home line, when you turn it on, prices the floor area at an indicative per-square-metre upfront (A1-A5) embodied-carbon figure from Australian residential studies, amortised over a 50-year life and split per adult. All of it is a screening estimate for the wider basket the simple survey leaves out, deliberately rough, so treat these as coarse additions rather than precise numbers. A skipped field adds exactly nothing.',
  },
  finish: 'See your footprint',
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
      'An optional detail step adds part of the wider basket the quick survey skips. Clothing is counted by items bought by default, priced on published per-garment life-cycle factors, because spend-based factors weight dollars rather than garments and misread fast fashion; a spend option remains for someone who only knows their budget. Electronics, entertainment, health, and other goods and services are estimated from how much you spend, so they are labelled screening estimates and carry more uncertainty than a metered bill. The same step carries one home line: if you built or bought your home new, its upfront (A1-A5) embodied carbon is counted at an indicative per-square-metre figure, amortised over a 50-year life and split per adult. It is demand-side and new-build only, so a second-hand home adds nothing and buying existing reads as the lower-carbon choice; a rented home is out too. They are all off unless you fill them in, and count as Scope 3. Skipping the step adds nothing: no average-person spending is ever substituted in, so a skipped basket simply stays out of the total. Hotel nights are gathered in the flights step instead: each trip carries its own nights, priced per occupied room-night at the destination country\'s published factor, and nights with no flight attached use the Australian figure.',
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
      'Australian electricity, gas and road-fuel factors are from the Australian Government (DCCEEW) National Greenhouse Accounts Factors. Flights and freight use the UK Government conversion factors 2025 edition, published by DESNZ and still widely known as the DEFRA factors, because they are the most complete public source for aviation by distance and cabin. The flight numbers here match that workbook cell for cell; the June 2026 edition could not be reached to check, so the page cites the edition it can stand behind.',
      'Diet is an estimate, not a precise figure: it uses published UK per-day values by diet type, chosen because they separate the six diet patterns cleanly. Australian studies find the same direction (CSIRO and Ridoutt), but on different accounting boundaries, so they anchor the size rather than replace the numbers. Public transport uses a UK rail factor as a stand-in until a published Australian per-passenger figure is available. On the physical NSW grid the real rail figure is higher than this proxy, because the grid is coal-heavy; measured against Sydney Trains renewable electricity contracts it is close to zero. Public transport is a small line, so the choice barely moves a total. The optional detail is the coarsest part: clothing counted by item uses the ADEME consumer-products LCA study (2018, the basis of the French Base Empreinte per-item textile factors), cross-checked against the Mistra Future Fashion per-garment assessments and the WRAP UK aggregate; the remaining goods and services are a spend-based screening estimate from the US EPA Supply Chain factors converted to Australian dollars; and hotel nights use the UK Government (DEFRA) per-room-night factors by country, priced at the destination country of the trip they belong to. The optional home line uses indicative per-square-metre upfront embodied-carbon figures for Australian dwellings (detached houses from Illankoon et al. 2023; apartments anchored on the GBCA and thinkstep-anz 2021 report), amortised over 50 years; residential figures span a wide range, so it is a screening estimate, not a measured one. All are labelled that way. Every factor and its source is in the tables below.',
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
      'By default this calculator leaves out the wider basket of goods and services, so a core total understates a full consumption footprint. The optional detail step adds a screening estimate of that basket (clothing, electronics, entertainment, health, other); even with it switched on a few things stay out, so the gap to the benchmark is if anything larger than it looks, not smaller.',
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
  equiv: {
    title: 'How the everyday equivalences are worked out',
    paras: [
      'The reveal offers the total re-counted in everyday things: beef burgers, flat whites, hot showers, dryer loads, kilometres of driving, phone charges and a familiar domestic flight. Each is the same tonnes divided by a per-item figure, stated with its assumptions in the table below. They are display conversions only: they never change any number, and the units are deliberately things a person chooses, so the scale of the year lands in decisions rather than abstractions.',
      'Where an equivalence depends on the grid or a fuel it derives live from the same factor tables the calculator prices from, with the NSW grid and metro gas as the stated reference case. The food items use Poore & Nemecek 2018 means, the same source as the per-kilogram reference table. The reveal also invites a guess at the total before it lands; the guess is kept on the page for the comparison and stored nowhere.',
    ],
  },
  factorsTitle: 'The factors it uses',
  factorsSub: 'These tables are the exact factors the calculator prices from.',
  exclusions: {
    title: 'What it still leaves out',
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
        head: 'Not counted, even with the optional detail on',
        items: [
          'Accommodation other than hotels (short-stay rentals, hostels, staying with friends). Hotel nights are counted, but at a country-average factor, not the specific place.',
          'Financial and professional services, and any spending the screening factors above do not cover. The goods estimate is a screening tool, so it catches the shape of the basket, not every dollar.',
          'Still queued, because the numbers could not be verified to this page’s standard in this edition: household waste to landfill, pets (dog and cat food), the embodied emissions of building or buying a car, mains water supply, an Australian spend-based factor set to replace the US one, and a published Australian rail figure to replace the UK proxy. Each stays out rather than ship an unchecked number, and is recorded in the research trail for the next refresh. (Two items queued here previously shipped once their sources were obtained and read: the garment-count clothing option, and the home-embodied line for a new build; both are optional and their factors are in the tables below.)',
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
  // The character verdict carried on the link, when the sharer's audit had one.
  readsAs: 'A year that reads as',
  // The nudge that converts a viewer into a player.
  tease: 'Reckon yours is smaller? Find out.',
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
  name: 'Chris Wang · 2026',
  back: 'Back to profile',
};

// Dashboard furniture previously inline in the component.
export const DASH_UI = {
  worstSuffix: '% of the year in one month',
  benchSummary: 'How the benchmarks are set',
};

export const fmtT = (t, dp = 1) => (Math.round(t * 10 ** dp) / 10 ** dp).toFixed(dp);
