// The twelve carbon characters. Every audit classifies to exactly one,
// from the audit's real shape: the total against published benchmarks and
// which category dominates. Rules run in order; the first match wins, the
// last two catch everything else, so coverage is total by construction.
//
// Emblems are coarse dot stencils ('#' cells). The WebGL field morphs its
// particles into them; the same stencils draw the static badges and share
// cards, so the character looks identical everywhere.

import { BENCHMARKS } from './benchmarks';

const S = {
  shield: [
    '....#####....',
    '..#########..',
    '.###########.',
    '.###########.',
    '.###########.',
    '..#########..',
    '...#######...',
    '....#####....',
    '.....###.....',
    '......#......',
  ],
  feather: [
    '..........##.',
    '.........###.',
    '.......#####.',
    '......#####..',
    '.....#####...',
    '...#####.....',
    '..#####......',
    '.####........',
    '.##..........',
    '.#...........',
  ],
  parcel: [
    '.####...####.',
    '.####...####.',
    '.####...####.',
    '#############',
    '#############',
    '.####...####.',
    '.####...####.',
    '.####...####.',
  ],
  jet: [
    '......#......',
    '.....###.....',
    '.....###.....',
    '#############',
    '#############',
    '.....###.....',
    '.....###.....',
    '....#####....',
  ],
  dart: [
    '##...........',
    '#####........',
    '########.....',
    '############.',
    '########.....',
    '#####........',
    '##...........',
  ],
  truck: [
    '########.....',
    '########.....',
    '#############',
    '#############',
    '#############',
    '.##.......##.',
    '.##.......##.',
  ],
  wheel: [
    '....#####....',
    '..##..#..##..',
    '.#....#....#.',
    '.#..#####..#.',
    '.#....#....#.',
    '..##..#..##..',
    '....#####....',
  ],
  flame: [
    '......#......',
    '.....##......',
    '....###......',
    '...#####.....',
    '..#######....',
    '..########...',
    '.#########...',
    '.#########...',
    '..#######....',
    '...#####.....',
  ],
  house: [
    '......#......',
    '....#####....',
    '..#########..',
    '.###########.',
    '.###########.',
    '.###########.',
    '.####...####.',
    '.####...####.',
  ],
  fork: [
    '..#..#..#..',
    '..#..#..#..',
    '..#..#..#..',
    '..#..#..#..',
    '...#####...',
    '.....#.....',
    '.....#.....',
    '.....#.....',
    '.....#.....',
  ],
  mountain: [
    '......#......',
    '.....###.....',
    '....#####....',
    '...#######...',
    '..#########..',
    '.###########.',
    '#############',
  ],
  burst: [
    '#.....#.....#',
    '.#....#....#.',
    '..#...#...#..',
    '...#..#..#...',
    '....#.#.#....',
    '.....###.....',
    '....#.#.#....',
    '...#..#..#...',
    '..#...#...#..',
    '.#....#....#.',
    '#.....#.....#',
  ],
};

// Display order for the twelve-up grid.
export const CHARACTERS = [
  {
    id: 'custodian', name: 'The Custodian', hex: '#75821D', stencil: S.shield,
    tagline: 'Inside the 1.5 degree budget, today.',
    line: 'Under the 2.5 tonne lifestyle budget, which almost nobody is. The models call this the destination; this audit reads like someone who already moved in.',
    hint: 'Hold the line, and publish the method.',
  },
  {
    id: 'featherweight', name: 'The Featherweight', hex: '#B5C42B', stencil: S.feather,
    tagline: 'Under the global average, quietly.',
    line: 'Below the global average without ceremony. Quiet bills, short distances, nothing to confess.',
    hint: 'The remaining wedges are small. Pick one anyway.',
  },
  {
    id: 'parcel-baron', name: 'The Parcel Baron', hex: '#0891B2', stencil: S.parcel,
    tagline: 'The cupboard arrives by air.',
    line: 'The cupboard restocks itself from three time zones away, mostly by aircraft. Distance is not the problem; the altitude is.',
    hint: 'Sea shipping cuts the freight line by about ninety percent.',
  },
  {
    id: 'sky-captain', name: 'The Sky Captain', hex: '#635BFF', stencil: S.jet,
    tagline: 'The passport does the emitting.',
    line: 'A serious total with the passport to explain it. The ground game barely registers; the itineraries are the inventory.',
    hint: 'One fewer long-haul return moves more than everything else combined.',
  },
  {
    id: 'itinerant', name: 'The Itinerant', hex: '#635BFF', stencil: S.dart,
    tagline: 'Frugal on the ground, undone at altitude.',
    line: 'A tidy, careful life that boards a few long-haul flights a year and stops being tidy. The wedge is the itineraries.',
    hint: 'The plan starts at the departure gate or it is theatre.',
  },
  {
    id: 'road-train', name: 'The Road Train', hex: '#B56A00', stencil: S.truck,
    tagline: 'Serious kilometres, seriously counted.',
    line: 'Big country, big kilometres, and a fuel bill that reads like a second rent. The car is the footprint.',
    hint: 'Occupancy, mode shift, then an EV, in that order of effort.',
  },
  {
    id: 'commuter', name: 'The Commuter', hex: '#B56A00', stencil: S.wheel,
    tagline: 'Wheels first, everything else second.',
    line: 'Wheels carry this audit. The distances are ordinary; the frequency is not.',
    hint: 'Half the kilometres have a rail replacement.',
  },
  {
    id: 'furnace', name: 'The Furnace', hex: '#C7274A', stencil: S.flame,
    tagline: 'The house runs hot.',
    line: 'The house does the emitting: heating, hot water, a meter spinning like it has somewhere to be.',
    hint: 'Electrify the lot and this profile changes class.',
  },
  {
    id: 'hearthkeeper', name: 'The Hearthkeeper', hex: '#75821D', stencil: S.house,
    tagline: 'Home is where the kilowatt hours are.',
    line: 'Comfortable, domestic, metered. Home energy leads the audit and the fix list is written on the fuse box.',
    hint: 'GreenPower is a phone call. Solar is a ladder.',
  },
  {
    id: 'long-lunch', name: 'The Long Lunch', hex: '#8A4FBE', stencil: S.fork,
    tagline: 'The footprint is on the table.',
    line: 'The footprint is on the table: good taste, counted honestly, per day.',
    hint: 'Fewer of the expensive plates. Nobody is taking your dinner.',
  },
  {
    id: 'heavyweight', name: 'The Heavyweight', hex: '#475569', stencil: S.mountain,
    tagline: 'No single villain, just volume.',
    line: 'Every category pulls its weight, which is exactly the problem. Diversified, consistent, large.',
    hint: 'A plan with one line will not do it. Take the top three wedges.',
  },
  {
    id: 'allrounder', name: 'The Allrounder', hex: '#6E7469', stencil: S.burst,
    tagline: 'A bit of everything, nothing extreme.',
    line: 'A bit of everything, nothing extreme. The most common shape there is, which is rather the point.',
    hint: 'The top two wedges still decide whether the plan works.',
  },
];

export const characterById = (id) => CHARACTERS.find((c) => c.id === id) || CHARACTERS[11];

const BUDGET_T = BENCHMARKS.find((b) => b.id === 'budget2030').tco2e;
const GLOBAL_T = BENCHMARKS.find((b) => b.id === 'global').tco2e;

// Classification. Shares are of the audited total; 'home' groups household
// energy. Thresholds reference the same published benchmarks the page
// already cites (2.5 t budget, 6.6 t global average).
export function classifyCharacter(agg) {
  const total = agg.total || 0;
  // Nothing logged classifies as nothing: fall to the neutral profile
  // rather than crowning an empty audit The Custodian.
  if (total <= 0.005) return { ...characterById('allrounder'), topShare: 0, topGroup: 'none' };
  const share = (id) => (total > 0 ? (agg.byCategory[id] || 0) / total : 0);
  const flight = share('flight');
  const road = share('road');
  const diet = share('diet');
  const freight = share('freight');
  const home = share('electricity') + share('gas') + share('other');

  let id;
  if (total <= BUDGET_T) id = 'custodian';
  else if (total <= GLOBAL_T) id = 'featherweight';
  else if (freight >= 0.35) id = 'parcel-baron';
  else if (flight >= 0.45) id = total > 15 ? 'sky-captain' : 'itinerant';
  else if (road >= 0.45) id = total > 15 ? 'road-train' : 'commuter';
  else if (home >= 0.45) id = total > 15 ? 'furnace' : 'hearthkeeper';
  else if (diet >= 0.45) id = 'long-lunch';
  else if (total > 15) id = 'heavyweight';
  else id = 'allrounder';

  const dominant = [['flight', flight], ['road', road], ['diet', diet], ['freight', freight], ['home', home]]
    .sort((a, b) => b[1] - a[1])[0];
  return { ...characterById(id), topShare: Math.round(dominant[1] * 100), topGroup: dominant[0] };
}
