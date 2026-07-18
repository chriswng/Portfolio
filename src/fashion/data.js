// ============================================================================
// SEVENFOLD — data layer.
// All editorial copy, model factors and demo datasets for the fashion
// intelligence platform live here, never inline in components.
//
// HONESTY NOTE, load-bearing: every physical factor below is an indicative
// estimate assembled from published life cycle assessment literature ranges
// (fibre LCAs, mill energy studies, IMO/ICAO freight factors, public grid
// intensity data), rounded hard and simplified so they can be manipulated
// live. They support decisions and intuition. They are not an audit, and the
// UI says so in plain sight. Brands are fictional composites, not real firms.
// ============================================================================

// ---------------------------------------------------------------------------
// Dyes. Natural dye palette; hex values are the site palette, not a claim
// about real vat chemistry. "undyed" is a real decision, not a null state:
// skipping the vat removes most of the wet-processing hotspot.
// ---------------------------------------------------------------------------
export const DYES = [
  { id: 'indigo', name: 'Vat indigo', hex: '#33487A', deep: '#26365C' },
  { id: 'madder', name: 'Madder red', hex: '#A6503F', deep: '#84392C' },
  { id: 'weld',   name: 'Weld yellow', hex: '#C2A238', deep: '#9A7E24' },
  { id: 'walnut', name: 'Walnut brown', hex: '#5C4633', deep: '#463525' },
  { id: 'undyed', name: 'Undyed, as woven', hex: null, deep: null },
];

// ---------------------------------------------------------------------------
// Fabrics. One row per fabric the builder and the material lab share.
//   ef        kg CO2e per kg of finished fibre, cradle to spinning gate
//   waterL    litres per kg of fibre (irrigated where relevant)
//   waterRain litres per kg if rain fed (cotton family only)
//   microMg   microfibre shed, mg per wash, indicative machine wash figure
//   stretch   0..1 how far it gives before fray (elastane-free assumptions)
//   recovery  0..1 how much it springs back
//   wearsMod  multiplier on garment life expectancy
//   decayYr   years to substantially break down buried in active soil
//   loop      'mono' closes a fibre recycling loop, 'jam' blocks it,
//             'hard' is technically possible but rarely done
//   base      undyed (greige) colour
// Sources are indicative ranges from published fibre LCAs and shedding
// studies; treat every number as a fair estimate, not a measurement.
// ---------------------------------------------------------------------------
export const FABRICS = [
  {
    id: 'cotton', name: 'Cotton', kindLabel: 'natural, conventional',
    ef: 5.0, waterL: 7000, waterRain: 2400, microMg: 10,
    stretch: 0.28, recovery: 0.75, wearsMod: 1.0, decayYr: 0.6, loop: 'mono',
    base: '#E8DFC9', weave: 'plain',
    read: 'Thirsty in the field, honest at end of life. Irrigation is the swing factor.',
  },
  {
    id: 'orgcotton', name: 'Organic cotton', kindLabel: 'natural, certified growing',
    ef: 3.2, waterL: 5500, waterRain: 2100, microMg: 10,
    stretch: 0.28, recovery: 0.75, wearsMod: 1.0, decayYr: 0.6, loop: 'mono',
    base: '#EAE2CE', weave: 'plain',
    read: 'Lower input growing, similar thirst. The certificate is about the field, not the factory.',
  },
  {
    id: 'linen', name: 'Linen', kindLabel: 'natural, bast fibre',
    ef: 2.1, waterL: 650, waterRain: 650, microMg: 6,
    stretch: 0.14, recovery: 0.55, wearsMod: 1.15, decayYr: 0.4, loop: 'mono',
    base: '#DCD2B6', weave: 'slub',
    read: 'Rain fed flax, small footprint, creases with pride and outlives trends.',
  },
  {
    id: 'hemp', name: 'Hemp', kindLabel: 'natural, bast fibre',
    ef: 1.9, waterL: 500, waterRain: 500, microMg: 6,
    stretch: 0.12, recovery: 0.5, wearsMod: 1.2, decayYr: 0.4, loop: 'mono',
    base: '#D6CCAE', weave: 'slub',
    read: 'The quiet achiever. Low water, low input, gets softer for a decade.',
  },
  {
    id: 'wool', name: 'Merino wool', kindLabel: 'natural, protein fibre',
    ef: 21.0, waterL: 1250, waterRain: 1250, microMg: 12,
    stretch: 0.42, recovery: 0.9, wearsMod: 1.25, decayYr: 1.5, loop: 'hard',
    base: '#E4DCCB', weave: 'knit',
    read: 'Heavy at the farm gate, then repays it: fewer washes, long life, full breakdown.',
  },
  {
    id: 'poly', name: 'Polyester', kindLabel: 'synthetic, virgin',
    ef: 5.4, waterL: 60, waterRain: 60, microMg: 260,
    stretch: 0.5, recovery: 0.95, wearsMod: 1.1, decayYr: 500, loop: 'mono',
    base: '#E9E7DE', weave: 'tight',
    read: 'Cheap, strong, nearly waterless to make, and it never really leaves.',
  },
  {
    id: 'rpet', name: 'Recycled polyester', kindLabel: 'synthetic, bottle derived',
    ef: 2.4, waterL: 45, waterRain: 45, microMg: 260,
    stretch: 0.48, recovery: 0.93, wearsMod: 1.05, decayYr: 500, loop: 'hard',
    base: '#E7E5DC', weave: 'tight',
    read: 'Half the carbon of virgin, same shedding, and bottles only recycle once this way.',
  },
  {
    id: 'blend', name: 'Poly-cotton 65/35', kindLabel: 'blend, workhorse',
    ef: 5.1, waterL: 2500, waterRain: 950, microMg: 95,
    stretch: 0.36, recovery: 0.85, wearsMod: 1.05, decayYr: 80, loop: 'jam',
    base: '#E8E3D2', weave: 'plain',
    read: 'Durable and easy to press. Two fibres married so tightly no recycler can divorce them.',
  },
  {
    id: 'lyocell', name: 'Lyocell', kindLabel: 'regenerated cellulose',
    ef: 2.6, waterL: 320, waterRain: 320, microMg: 9,
    stretch: 0.3, recovery: 0.8, wearsMod: 0.95, decayYr: 0.8, loop: 'mono',
    base: '#E6DFCC', weave: 'smooth',
    read: 'Wood pulp spun in a closed solvent loop. Gentle drape, honest ending.',
  },
];

// ---------------------------------------------------------------------------
// Garment types. Area is fabric consumed including cutting loss allowance.
// ---------------------------------------------------------------------------
export const GARMENT_TYPES = [
  { id: 'tee', name: 'Tee', area: 0.85, gsmMin: 120, gsmMax: 280, gsmDefault: 180,
    price: 45, wearsBase: 90, cut: 'a short sleeve tee' },
  { id: 'hoodie', name: 'Hoodie', area: 1.7, gsmMin: 240, gsmMax: 520, gsmDefault: 340,
    price: 110, wearsBase: 150, cut: 'a fleece backed hoodie' },
  { id: 'jeans', name: 'Jeans', area: 1.6, gsmMin: 280, gsmMax: 480, gsmDefault: 400,
    price: 140, wearsBase: 230, cut: 'a five pocket jean' },
];

// ---------------------------------------------------------------------------
// Origins. Grid intensity is an indicative national average, kg CO2e per kWh.
// Distance is a rough freight distance to Melbourne in km. Map cells index
// into WORLD_MASK below (col, row).
// ---------------------------------------------------------------------------
export const ORIGINS = [
  { id: 'vn', name: 'Vietnam',    grid: 0.68, km: 7900,  cell: [51, 12],
    note: 'Coal heavy grid, deep garment expertise, short sea leg to Australia.' },
  { id: 'cn', name: 'China',      grid: 0.64, km: 9200,  cell: [52, 10],
    note: 'The full supply chain in one country, on a grid that is decarbonising unevenly.' },
  { id: 'bd', name: 'Bangladesh', grid: 0.74, km: 9300,  cell: [48, 10],
    note: 'Gas and coal power most mills. Labour cost pressure is the industry story here.' },
  { id: 'in', name: 'India',      grid: 0.77, km: 9800,  cell: [45, 11],
    note: 'Cotton at the doorstep, one of the most carbon intense grids in the trade.' },
  { id: 'tr', name: 'Türkiye',    grid: 0.44, km: 14600, cell: [38, 7],
    note: 'Closer to European buyers than to you. Mid intensity grid, strong denim craft.' },
  { id: 'pt', name: 'Portugal',   grid: 0.17, km: 17600, cell: [30, 7],
    note: 'Wind and hydro do the wet processing. The distance is the price you pay.' },
  { id: 'au', name: 'Australia',  grid: 0.63, km: 600,   cell: [56, 19],
    note: 'Almost no freight, honest labour law, a grid still burning coal for now.' },
];

// Destination pin for the freight route.
export const DEST = { name: 'Melbourne', cell: [57, 20] };

// ---------------------------------------------------------------------------
// A coarse dot map of the world, 64 columns by 23 rows, equirectangular-ish,
// latitude 85 N at row 0 down to 60 S. '#' is land. It is a stylised chart,
// not cartography; hubs above index into it.
// ---------------------------------------------------------------------------
export const WORLD_MASK = [
  '................................................................',
  '.......###.........#####..........##############................',
  '..#######*#........######......###################.#............',
  '.##########.........####.....######################..##.........',
  '..#########..........##....#..######################.###........',
  '...########...............###.#####################..##.........',
  '....######.................####.####################.##.........',
  '.....####.....................#######..####..######..#..........',
  '......##.......................######..#####.#####..............',
  '.......#........................#####...#######.##..............',
  '................#....................#...######..##.#............',
  '...............####..............####....#####...#.##...........',
  '...............######............#####....##....##..#...........',
  '................#######..........#####.....#....##.###..........',
  '................######...........####..........####..##.........',
  '.................####............###..........#######...........',
  '.................###.............##...........########..........',
  '..................##.............#............########..........',
  '..................##..........................#######...........',
  '..................#............................#####.#..........',
  '..................#.................................#...........',
  '...................................................#............',
  '................................................................',
];

// ---------------------------------------------------------------------------
// Supply chain stages for the long road. Weight is the share of the scroll
// the stage occupies; the dye house deliberately takes the most, because it
// costs the most. Copy is what the HUD shows while you are in the stage.
// ---------------------------------------------------------------------------
export const STAGES = [
  { id: 'fibre', name: 'Fibre', weight: 0.14,
    hud: 'Grown or extruded. For cotton, the irrigation decision starts here and never stops mattering.' },
  { id: 'spin', name: 'Spinning and knitting', weight: 0.13,
    hud: 'Fibre becomes yarn becomes cloth. Steady electricity, all grid, runs the mill.' },
  { id: 'dye', name: 'The dye house', weight: 0.3,
    hud: 'The hotspot. Tonnes of water heated to a simmer to fix colour. Most of the energy your garment will ever use in production is spent in this shed.' },
  { id: 'make', name: 'Cut and sew', weight: 0.14,
    hud: 'Hands and machines. Modest energy, most of the labour story, all of the craft.' },
  { id: 'freight', name: 'Freight', weight: 0.17,
    hud: 'Sea freight barely registers per garment. Put the same box on a plane and watch.' },
  { id: 'retail', name: 'Retail', weight: 0.12,
    hud: 'Packed, lit, shelved. The last metres are short but never free.' },
];

// ---------------------------------------------------------------------------
// Model constants. Rounded, indicative, and labelled as such in the UI.
// ---------------------------------------------------------------------------
export const FACTORS = {
  spinKwhPerKg: 3.4,        // yarn prep, spinning, knitting or weaving
  dyeThermalPerKg: 2.2,     // kg CO2e per kg, boiler fuel for hot wet processing
  dyeElecKwhPerKg: 3.2,     // pumps, jets, drying, grid powered
  dyeWaterLPerKg: 120,      // process water for dye and finish
  undyedFactor: 0.12,       // greige goods still get scoured, then skip the vat
  renewableDyeFactor: 0.28, // heat recovery plus contracted renewables
  makeKwhPerKg: 1.6,        // cut, sew, press
  trimsKg: 0.25,            // threads, labels, zips, buttons, flat allowance
  seaPerKgKm: 0.000012,     // container sea freight per kg per km
  airPerKgKm: 0.00085,      // long haul air freight per kg per km
  roadPerKgKm: 0.00011,     // domestic road leg
  retailKg: 0.28,           // packaging, DC and store overhead allowance
  cutLoss: 0.85,            // 15 percent of cloth becomes offcut
  washesPerWearCycle: 5,    // one wash per five wears for shedding maths
};

// Wear odometer breakeven habit: a fair garment earns its keep against this.
export const BREAKEVEN_WEARS = 30;

// ---------------------------------------------------------------------------
// Circularity mods you can drag onto the garment in the loop module.
// ---------------------------------------------------------------------------
export const LOOP_MODS = [
  { id: 'mono', name: 'Re-spec to one fibre',
    blurb: 'Swap the blend for a single fibre construction so a recycler can actually take it.' },
  { id: 'spares', name: 'Repair spares in the hem',
    blurb: 'Buttons, patch cloth and thread sewn inside. Repair becomes the easy choice.' },
  { id: 'seams', name: 'Unpickable seams',
    blurb: 'Design for disassembly. Trims come off clean, panels part without shredding.' },
];

// End of life fates, arranged around the loop.
export const FATES = [
  { id: 'resale', name: 'Resale' },
  { id: 'repair', name: 'Repair and keep' },
  { id: 'takeback', name: 'Brand take-back' },
  { id: 'recycle', name: 'Fibre recycling' },
  { id: 'landfill', name: 'Landfill' },
];

// ---------------------------------------------------------------------------
// Brands. Sixteen fictional composites of recognisable industry archetypes.
// Metrics are 0 to 100, illustrative demo data only. takeBack feeds the loop
// module; disclosure feeds the verdict's trust factor.
// ---------------------------------------------------------------------------
export const BRAND_METRICS = [
  { id: 'climate', name: 'Climate targets' },
  { id: 'disclosure', name: 'Disclosure quality' },
  { id: 'labour', name: 'Labour commitments' },
  { id: 'circularity', name: 'Circularity practice' },
];

export const BRANDS = [
  { id: 'hartline', name: 'Hartline Basics', archetype: 'premium direct to consumer basics',
    climate: 64, disclosure: 82, labour: 66, circularity: 48, takeBack: false,
    read: 'Publishes factory lists and per garment footprints. Targets are honest but unambitious.' },
  { id: 'vult', name: 'VULT', archetype: 'ultra fast fashion platform',
    climate: 18, disclosure: 12, labour: 15, circularity: 8, takeBack: false,
    read: 'Ten thousand new lines a week. Discloses almost nothing and grows anyway.' },
  { id: 'northloom', name: 'Northloom', archetype: 'outdoor co-operative',
    climate: 86, disclosure: 88, labour: 84, circularity: 90, takeBack: true,
    read: 'Repair centres, lifetime warranty, science based targets it is actually tracking.' },
  { id: 'casaferro', name: 'Casa Ferro', archetype: 'luxury fashion house',
    climate: 52, disclosure: 30, labour: 55, circularity: 35, takeBack: false,
    read: 'Beautiful garments built to last decades. Tells you nearly nothing about how.' },
  { id: 'wattle', name: 'Wattle & Grey', archetype: 'Australian mid market retailer',
    climate: 55, disclosure: 60, labour: 62, circularity: 40, takeBack: true,
    read: 'Solid modern slavery reporting, early take-back trial, grid heavy supply chain.' },
  { id: 'drapers', name: 'Drapers Guild', archetype: 'heritage made to order tailor',
    climate: 70, disclosure: 45, labour: 80, circularity: 72, takeBack: false,
    read: 'Makes to order so nothing is unsold. Small enough that nobody audits it.' },
  { id: 'ombra', name: 'OMBRA Athletic', archetype: 'performance activewear',
    climate: 58, disclosure: 64, labour: 58, circularity: 30, takeBack: false,
    read: 'Serious about recycled polyester, quiet about what sheds off it in the wash.' },
  { id: 'fieldtheory', name: 'Field Theory', archetype: 'bast fibre specialist',
    climate: 80, disclosure: 74, labour: 70, circularity: 78, takeBack: true,
    read: 'Linen and hemp only, dyes little, publishes its mill energy bills.' },
  { id: 'secondstitch', name: 'Second Stitch', archetype: 'resale marketplace',
    climate: 90, disclosure: 70, labour: 50, circularity: 96, takeBack: false,
    read: 'Sells nothing new. The footprint of its garments was mostly spent years ago.' },
  { id: 'klara', name: 'Klara Modehaus', archetype: 'European high street chain',
    climate: 48, disclosure: 66, labour: 52, circularity: 38, takeBack: true,
    read: 'Long glossy reports, a bin at the door, volumes that keep rising.' },
  { id: 'bassline', name: 'Bassline Denim', archetype: 'denim specialist',
    climate: 68, disclosure: 72, labour: 60, circularity: 62, takeBack: true,
    read: 'Laser finishing and foam dye cut its water hard. Still ships everything twice.' },
  { id: 'peony', name: 'Peony Haul', archetype: 'social commerce ultra discounter',
    climate: 10, disclosure: 6, labour: 10, circularity: 5, takeBack: false,
    read: 'Priced so low that returns go to landfill. The haul video is the product.' },
  { id: 'truenorth', name: 'True North Workwear', archetype: 'durability first workwear',
    climate: 60, disclosure: 55, labour: 75, circularity: 66, takeBack: false,
    read: 'Triple stitched and rebuildable. Durability is its whole sustainability policy.' },
  { id: 'velvette', name: 'Velvette', archetype: 'occasionwear label',
    climate: 30, disclosure: 25, labour: 40, circularity: 12, takeBack: false,
    read: 'Dresses photographed once. The single wear problem wearing sequins.' },
  { id: 'monostudio', name: 'Mono Studio', archetype: 'design for disassembly lab',
    climate: 76, disclosure: 68, labour: 65, circularity: 92, takeBack: true,
    read: 'One fibre per garment, seams that unpick. Designed backwards from the recycler.' },
  { id: 'cloudknit', name: 'Cloudknit', archetype: 'knit to order start-up',
    climate: 72, disclosure: 58, labour: 68, circularity: 70, takeBack: false,
    read: 'Knits your size when you order. Zero inventory, zero markdown landfill.' },
];

// ---------------------------------------------------------------------------
// The claim desk. Lexicon first: vague terms that trigger cross examination,
// absolutes that get struck through, and terms that demand a qualifier.
// Modelled on the ACCC's guidance for environmental claims: be specific,
// have evidence, qualify honestly, do not overstate.
// ---------------------------------------------------------------------------
export const VAGUE_TERMS = [
  { re: /\bsustainab(le|ly|ility)\b/gi, term: 'sustainable',
    ask: 'Sustaining what, measured how? Name the impact and the number.' },
  { re: /\beco[- ]?friendly\b/gi, term: 'eco-friendly',
    ask: 'Friendly compared with what? Every garment has a footprint.' },
  { re: /\bgreen\b/gi, term: 'green',
    ask: 'Green is a colour. Which impact fell, and by how much?' },
  { re: /\bconscious\b/gi, term: 'conscious',
    ask: 'Consciousness is not a supply chain attribute. What changed in the product?' },
  { re: /\bnatural(ly)?\b/gi, term: 'natural',
    ask: 'Natural is not the same as low impact. Crude oil is natural.' },
  { re: /\bethical(ly)?\b/gi, term: 'ethical',
    ask: 'Whose code, audited by whom, and when was the last audit?' },
  { re: /\bresponsibl[ey]\b/gi, term: 'responsible',
    ask: 'Responsible to what standard? Point to it.' },
  { re: /\bclean\b/gi, term: 'clean',
    ask: 'Clean of what? Name the substance or drop the word.' },
  { re: /\bkind (to|on) the planet\b/gi, term: 'kind to the planet',
    ask: 'The planet has not been consulted. State the measured impact instead.' },
  { re: /\bplanet[- ](positive|friendly)\b/gi, term: 'planet positive',
    ask: 'A net positive claim needs extraordinary evidence. Where is it?' },
  { re: /\bocean[- ]positive\b/gi, term: 'ocean positive',
    ask: 'What does the ocean gain, in what unit, verified by whom?' },
  { re: /\bguilt[- ]free\b/gi, term: 'guilt-free',
    ask: 'Feelings are not a metric. State what the garment actually does.' },
  { re: /\bearth[- ]friendly\b/gi, term: 'earth-friendly',
    ask: 'Friendly how? Pick an impact, state the change.' },
];

export const ABSOLUTE_TERMS = [
  { re: /\b100%\s*(sustainable|eco[- ]?friendly|green|recyclable|biodegradable)\b/gi,
    term: 'the 100% absolute',
    ask: 'Absolute claims fail on the first exception. Strike it or prove every unit.' },
  { re: /\bzero\s*(impact|waste|emissions?|carbon)\b/gi, term: 'zero',
    ask: 'Nothing made at scale is zero anything. Show the boundary or strike it.' },
  { re: /\b(fully|completely|totally)\s+(sustainable|recyclable|biodegradable|circular)\b/gi,
    term: 'a totalising qualifier',
    ask: 'Fully, completely and totally are doing unpaid work here. Strike them.' },
  { re: /\bclimate[- ]positive\b/gi, term: 'climate positive',
    ask: 'Beyond neutral is a bold accounting position. Publish the ledger or strike it.' },
];

export const QUALIFIER_TERMS = [
  { re: /\brecyclable\b/gi, term: 'recyclable',
    demand: 'In which stream, in which country, and what share is actually recycled today?' },
  { re: /\bbiodegradable\b/gi, term: 'biodegradable',
    demand: 'Under what conditions, and in how long? A landfill is not a compost heap.' },
  { re: /\bcompostable\b/gi, term: 'compostable',
    demand: 'Home or industrial composting? Name the standard.' },
  { re: /\brecycled\b/gi, term: 'recycled',
    demand: 'What percentage, of which component, certified by whom?' },
  { re: /\bcarbon[- ]neutral\b/gi, term: 'carbon neutral',
    demand: 'Reduced or offset? Which scopes, whose offsets, what vintage?' },
  { re: /\borganic\b/gi, term: 'organic',
    demand: 'Certified to which scheme, and what share of the fibre?' },
  { re: /\brenewable\b/gi, term: 'renewable',
    demand: 'What share of energy, contracted how, over what period?' },
  { re: /\bplastic[- ]free\b/gi, term: 'plastic-free',
    demand: 'Product, packaging or both? Polyester is plastic.' },
  { re: /\bup to\b/gi, term: 'up to',
    demand: 'Up to includes zero. State the typical figure, not the ceiling.' },
  { re: /\bplant[- ]based\b/gi, term: 'plant-based',
    demand: 'What share is plant derived, and what carries the rest?' },
  { re: /\bwe plant a tree\b/gi, term: 'tree planting',
    demand: 'Survival rate, land tenure, and is it additional to what would grow anyway?' },
];

// Signals that a claim carries actual evidence.
export const EVIDENCE_PATTERNS = [
  /\b\d+(\.\d+)?\s*(%|percent|kg|g|litres?|l\b|kwh|tonnes?)/i,
  /\b(gots|grs|oeko[- ]?tex|fsc|bluesign|fair\s?trade|b corp|iso\s?14|climate active)\b/i,
  /\b(audit(ed)?|verif(y|ied|ication)|certif(y|ied|ication)|third[- ]party|independent)/i,
  /\b(report|published|publish|data|methodology|footprint)\b/i,
  /\b(20\d\d)\b/,
  /\bcompared (with|to)\b/i,
  /\bscope\s?[123]/i,
];

// The rack of specimen claims you can feed the desk.
export const SPECIMEN_CLAIMS = [
  'Made with 100% sustainable materials.',
  'Our most eco-friendly collection yet.',
  'Carbon neutral since 2022.',
  'Kind to the planet, kind to you.',
  'This tee is 60% recycled polyester, certified to GRS, and we publish the audit.',
  'Fully recyclable.',
  'Natural fibres, naturally better.',
  'We plant a tree for every order.',
  'Sewn in a mill running on 82% contracted wind power, audited in 2025.',
  'Conscious collection: made with more sustainable cotton.',
  'Ocean positive. Guilt-free by design.',
  'Cut from organic cotton certified to GOTS, 41% less irrigation than our 2020 baseline.',
];

// Stamp verdicts for the desk.
export const CLAIM_VERDICTS = {
  sound: { id: 'sound', label: 'SOUND', line: 'Specific, evidenced, qualified. It would survive a regulator having a slow day.' },
  vague: { id: 'vague', label: 'VAGUE', line: 'Not false, just empty. Every flagged word needs a number or a name behind it.' },
  risk:  { id: 'risk', label: 'HIGH RISK', line: 'Overclaimed and unsubstantiated. In Australia this is how you meet the ACCC.' },
};

// ---------------------------------------------------------------------------
// Editorial copy, by module. Australian English, plain, active.
// ---------------------------------------------------------------------------
export const COPY = {
  brand: 'SEVENFOLD',
  strap: 'One garment, seven lenses',
  byline: 'A working prototype by Christopher Wang',
  backLink: 'itschriswang.com',

  hero: {
    kicker: 'Sustainable fashion intelligence, in one continuous room',
    headlineA: 'One garment.',
    headlineB: 'Seven lenses.',
    stand: 'Build a single item of clothing, then follow it everywhere it goes: the field, the dye vat, the container ship, your wardrobe, and whatever comes after. Every figure is an indicative estimate from published life cycle studies, and every one of them moves when you pull on it.',
    cue: 'Grab the cloth and pull. Push the garment. Then scroll.',
    srGarment: 'A garment hangs in the centre of the screen. It follows you through the whole page.',
  },

  m1: {
    idx: '01', title: 'Cut and make', sub: 'Build it, and watch the counter watch you',
    lede: 'Drag a fabric onto the blank, set the cloth weight, then drop the garment on a port to choose where it gets made. Carbon dioxide equivalent gathers around it as particles while you work, one mote per 50 grams.',
    disclosure: 'Figures are indicative estimates assembled from published LCA factor ranges. They exist to support decisions, not to audit products.',
    counterHint: 'The total is grabbable. Drag it down and the counter tells you which decision would get you there.',
    weightLabel: 'Cloth weight',
    typeLabel: 'The cut',
    fabricLabel: 'The cloth',
    originLabel: 'Made in',
    streams: {
      fibre: 'Fibre', wet: 'Wet processing', make: 'Cut and sew',
      freight: 'Freight', retail: 'Retail',
    },
    waterLabel: 'Water, cradle to gate',
    scrubApply: 'Apply',
    scrubNone: 'Already below that. Nice problem.',
  },

  m2: {
    idx: '02', title: 'The material lab', sub: 'Nine cloths on the bench',
    lede: 'Pin up to three fabrics into the rigs, pick an instrument, and put them through the same torture at the same time. The data is the animation: nothing here is a chart of a thing, it is the thing.',
    tools: {
      stretch: { name: 'Stretch', hint: 'Drag the swatch corner and feel where it frays' },
      pour: { name: 'Pour', hint: 'Hold to tip the beaker. Litres to make one kilogram' },
      rub: { name: 'Rub', hint: 'Scrub the surface and count what sheds' },
      bury: { name: 'Bury', hint: 'Underground, then drag through two hundred years' },
    },
    runAll: 'Run the full protocol',
    pinHint: 'Pin fabrics from the shelf below. Three rigs, one torture at a time.',
    useThis: 'Cut the garment from this',
    shedUnit: 'mg shed per wash, indicative',
    stretchUnit: 'give before fray',
    waterUnit: 'litres per kg of fibre',
    buryUnit: 'years buried',
    intact: 'still here',
    museum: {
      tag: 'EXHIBIT A', line: 'Polyester swatch, circa 2026. Condition: intact. Loaned by the landfill.',
    },
  },

  m3: {
    idx: '03', title: 'The long road', sub: 'Scroll is the throttle',
    lede: 'Your scroll drives the garment from fibre to shop floor, forwards and backwards, at your speed. The trail behind it is its cumulative footprint. Intervene wherever you like and watch the trail answer.',
    interventions: {
      rainfed: 'Rain fed cotton', irrigated: 'Irrigated cotton',
      gridDye: 'Boiler on the grid', cleanDye: 'Heat recovery and wind',
      dyed: 'Through the vat', undyed: 'Skip the vat, sell it as woven',
      sea: 'By sea', air: 'By air',
    },
    dyeNote: 'This shed is the hotspot. Heating water to fix colour spends more energy than any other step in the garment’s making. The scroll gets heavier in here on purpose.',
    vatLabel: 'Choose the vat',
    cumulative: 'so far',
    stageLabel: 'Stage',
    reducedHint: 'Step through the stages with the buttons, or scrub the journey with the slider.',
  },

  m4: {
    idx: '04', title: 'The loop', sub: 'Eight years later',
    lede: 'The garment is worn now. Drag it toward a fate and watch the loop close, or jam, or snap, depending on decisions you made back at the bench. The score is earned by playing, not calculated by a form.',
    scoreLabel: 'Circularity',
    modsLabel: 'Design changes. Drag one onto the garment, then test a fate again.',
    fateReads: {
      resaleGood: 'Built well enough to sell twice. The loop closes wide.',
      resalePoor: 'Too worn to resell. Nobody pays for pilled cloth.',
      repair: 'Patched and kept. The smallest loop and the strongest one.',
      repairSpares: 'Spares were waiting in the hem. Repaired in an evening.',
      takebackYes: 'The maker takes it back and actually has somewhere to send it.',
      takebackNo: 'No take-back programme exists for this label. The bin at the store is a bin.',
      recycleMono: 'One fibre, clean shred, new yarn. The loop closes.',
      recycleHard: 'Technically recyclable, rarely collected. The loop closes on paper and gapes in practice.',
      recycleJam: 'Two fibres, one seam. The shredder line stops. Blends jam here.',
      landfillNatural: 'Buried. Gone in about a year, methane and all.',
      landfillPoly: 'Buried. Recognisable for centuries. Your grandchildren could fish it out.',
    },
  },

  m5: {
    idx: '05', title: 'The field', sub: 'Sixteen labels, one axis at a time',
    lede: 'Brands cluster and repel along whichever measure you pick. Grab one and drop it on another for a head to head. Drop one on your garment to give it a maker, which the verdict will remember.',
    disclaimer: 'Brands are fictional composites of industry archetypes. All figures are illustrative demo data, not real ratings of real firms.',
    compare: 'Head to head',
    assign: 'Maker of your garment',
    assignHint: 'Drop a label on the garment dock to set its maker',
    close: 'Close',
  },

  m6: {
    idx: '06', title: 'The claim desk', sub: 'Marketing meets cross examination',
    lede: 'Type a claim, or hang one from the rack in the dock. The desk interrogates it word by word, strikes what cannot stand, demands the missing qualifiers, then rewrites it into something that would survive scrutiny.',
    criteria: 'The test, in four questions. Is it specific. Is it substantiated. Is it qualified. Is it proportionate. Drawn from the ACCC’s guidance on environmental and sustainability claims.',
    placeholder: 'Paste or type a marketing claim…',
    interrogate: 'Interrogate',
    rewrite: 'Rewrite it properly',
    myGarment: 'Write an honest claim for my garment',
    rackLabel: 'Or take one from the rack',
    rewriteNote: 'Square brackets are the evidence you still owe. A sound claim is mostly homework.',
  },

  m7: {
    idx: '07', title: 'The verdict', sub: 'Should you buy this thing',
    lede: 'Everything arrives here: the trail it left, the loop it closed or broke, the label it wears. Answer two human questions and let the balance settle. It is a decision aid with opinions, not a conscience.',
    wearsLabel: 'Wears you honestly expect',
    priceLabel: 'Price on the tag',
    replaceLabel: 'Does it replace something you own?',
    replaceYes: 'Replaces one, the old one goes to repair or resale',
    replaceNo: 'Joins the wardrobe alongside everything else',
    perWear: 'per wear',
    weighIt: 'Weigh it up',
    breakeven: 'breakeven against a 30 wear habit',
    forPan: 'For buying it',
    againstPan: 'Against',
    heirloom: 'Five hundred wears. That is not a purchase, that is an heirloom. Look after it.',
    alternativesLabel: 'Cheaper ways to get the same outcome',
    verdicts: {
      wearOut: { label: 'Buy it. Wear it out.',
        line: 'It earns its place at {n} wears and everything after that is profit. Keep it a decade.' },
      commit: { label: 'Buy it only if you mean it.',
        line: 'It breaks even at {n} wears. Below that it is decoration with a footprint.' },
      secondhand: { label: 'Go second hand instead.',
        line: 'Most of this footprint has already been spent by someone else. Same garment, a fraction of the cost.' },
      skip: { label: 'Skip it.',
        line: 'It adds without replacing, and its loop breaks at end of life. The greenest garment tonight is the one you already own.' },
    },
    factors: {
      perWearGood: 'Low carbon per wear', perWearBad: 'High carbon per wear',
      durable: 'Built for years', fragile: 'Built for a season',
      loopClosed: 'Loop closes at end of life', loopBroken: 'Loop breaks at end of life',
      replaces: 'Replaces, not adds', adds: 'Adds to the pile',
      trust: 'Maker shows its work', noTrust: 'Maker hides the numbers',
      water: 'Heavy water debt', microf: 'Sheds in every wash',
    },
    alternatives: {
      secondhand: 'The same {type} second hand: roughly {pct} less production footprint, already paid.',
      repair: 'Repair what it would replace: near zero new footprint, one evening of your time.',
      undyed: 'The undyed version of your build: {delta} kg CO2e lighter, and calico is a look.',
      swap: 'Borrow or swap for the occasion wears. Zero new production, full wardrobe.',
    },
  },

  footer: {
    method: 'Method: factors assembled from published LCA literature, freight factors and public grid intensity data, rounded and simplified so they can be manipulated live. Everything is indicative. Nothing here is assured reporting, a product footprint, or advice about a real brand.',
    ownTest: 'Every sentence on this page went through the desk in module six.',
    made: 'Built by Christopher Wang in Melbourne.',
    top: 'Back to the top',
  },

  egg: {
    line: 'The lowest impact garment is the one already hanging in your wardrobe. This whole page is a long way of saying that.',
    care: 'Wash cold · line dry · repair twice · keep a decade',
  },

  rail: ['Build', 'Lab', 'Road', 'Loop', 'Field', 'Desk', 'Verdict'],
  skip: 'Skip to the builder',
};
