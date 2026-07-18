// The twelve carbon characters, Wrapped-style: three measured axes, read
// straight off the audit, place every year in exactly one cell.
//
//   Weight  (3): featherweight / middleweight / heavyweight, split at the
//                6.6 t global average and 16 t (EDGAR-basis Australian
//                inventory including the land sink, cited in benchmarks.js).
//   Shape   (2): specialist (top wedge >= 40% of the total) / generalist.
//   Rhythm  (2): spiky (worst month >= 2x the average month) / steady.
//
// 3 x 2 x 2 = 12. The cell names the character; the dominant wedge flavours
// the reading but never changes it. An audit at or under the 2.5 t lifestyle
// budget also carries The Custodian mark, whatever its cell.
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
  comet: [
    '...........##',
    '..........##.',
    '........###..',
    '.......###...',
    '.....###.....',
    '....##.......',
    '.####........',
    '######.......',
    '######.......',
    '.####........',
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

// Axis thresholds. The benchmark lines are the published figures used
// everywhere on this page; HEAVY_T sits on the EDGAR-basis Australian
// inventory including the land sink (see benchmarks.js). The share and
// spike cut-offs are stated editorial rules: they decide which label an
// audit gets, never any number.
export const BUDGET_T = BENCHMARKS.find((b) => b.id === 'budget2030').tco2e;
export const GLOBAL_T = BENCHMARKS.find((b) => b.id === 'global').tco2e;
export const HEAVY_T = 16;
export const SPECIALIST_SHARE = 0.4;
export const SPIKE_MULTIPLE = 2;

// The Custodian: not a cell but a mark, carried by any audit at or under
// the 2.5 t lifestyle budget on top of whatever character it classifies as.
export const CUSTODIAN = {
  id: 'custodian', name: 'The Custodian', hex: '#75821D', stencil: S.shield,
  tagline: 'Inside the 2.5 t lifestyle budget.',
  line: 'Under the 2030 lifestyle budget, which almost nobody is. The models call this the destination; this audit already moved in.',
};

// The roster, one character per cell, ordered for the 3 x 4 matrix:
// weight rows (feather, middle, heavy) by temperament columns
// (specialist-spiky, specialist-steady, generalist-spiky, generalist-steady).
export const CHARACTERS = [
  {
    id: 'spark', name: 'The Spark', hex: '#B5C42B', stencil: S.burst,
    weight: 'feather', shape: 'specialist', rhythm: 'spiky',
    tagline: 'A light year with one bright moment.',
    line: 'Under the global average, and most of it happened in one go. One wedge, one month; the rest of the year barely registers.',
  },
  {
    id: 'hearthkeeper', name: 'The Hearthkeeper', hex: '#75821D', stencil: S.house,
    weight: 'feather', shape: 'specialist', rhythm: 'steady',
    tagline: 'One quiet habit, well in hand.',
    line: 'A light total carried by a single steady wedge, metered along all year. Domestic, consistent, small.',
  },
  {
    id: 'comet', name: 'The Comet', hex: '#0891B2', stencil: S.comet,
    weight: 'feather', shape: 'generalist', rhythm: 'spiky',
    tagline: 'Mostly quiet sky, one visible streak.',
    line: 'A light, varied year that flared once and settled back down. The streak is the story; the rest is background.',
  },
  {
    id: 'featherweight', name: 'The Featherweight', hex: '#B5C42B', stencil: S.feather,
    weight: 'feather', shape: 'generalist', rhythm: 'steady',
    tagline: 'Light, even, nothing to confess.',
    line: 'Below the global average without ceremony. A bit of everything, spread thin, all year.',
  },
  {
    id: 'itinerant', name: 'The Itinerant', hex: '#635BFF', stencil: S.dart,
    weight: 'middle', shape: 'specialist', rhythm: 'spiky',
    tagline: 'Frugal on the ground, undone in bursts.',
    line: 'A tidy, careful life with a handful of sharp exits. One wedge does the damage, and it does it in single days.',
  },
  {
    id: 'regular', name: 'The Regular', hex: '#8A4FBE', stencil: S.fork,
    weight: 'middle', shape: 'specialist', rhythm: 'steady',
    tagline: 'The same order, every week of the year.',
    line: 'One wedge on repeat: the commute, the meter, the menu. Nothing dramatic ever happens, which is exactly how the total gets built.',
  },
  {
    id: 'high-season', name: 'The High Season', hex: '#C7274A', stencil: S.flame,
    weight: 'middle', shape: 'generalist', rhythm: 'spiky',
    tagline: 'An ordinary mix with a hot stretch.',
    line: 'Spread across the categories until one month, when everything happened at once. The year has a season, and the season has a bill.',
  },
  {
    id: 'allrounder', name: 'The Allrounder', hex: '#6E7469', stencil: S.wheel,
    weight: 'middle', shape: 'generalist', rhythm: 'steady',
    tagline: 'A bit of everything, at an even hum.',
    line: 'No single villain and no quiet patch either. The most common shape there is, which is rather the point.',
  },
  {
    id: 'sky-captain', name: 'The Sky Captain', hex: '#635BFF', stencil: S.jet,
    weight: 'heavy', shape: 'specialist', rhythm: 'spiky',
    tagline: 'The big days do the emitting.',
    line: 'A serious total, one dominant wedge, delivered in single days. The everyday barely registers; the events are the inventory.',
  },
  {
    id: 'road-train', name: 'The Road Train', hex: '#B56A00', stencil: S.truck,
    weight: 'heavy', shape: 'specialist', rhythm: 'steady',
    tagline: 'One heavy wedge, hauled all year.',
    line: 'A big total built the slow way: the same dominant wedge, week after week. Nothing spiked. It never needed to.',
  },
  {
    id: 'big-year', name: 'The Big Year', hex: '#C7274A', stencil: S.parcel,
    weight: 'heavy', shape: 'generalist', rhythm: 'spiky',
    tagline: 'Everything, everywhere, then a crescendo.',
    line: 'Heavy across the board with a blowout stretch on top. Diversified, eventful, large.',
  },
  {
    id: 'heavyweight', name: 'The Heavyweight', hex: '#475569', stencil: S.mountain,
    weight: 'heavy', shape: 'generalist', rhythm: 'steady',
    tagline: 'No single villain, just volume.',
    line: 'Every category pulls its weight, steadily, which is exactly the problem. A plan with one line will not do it.',
  },
];

// Matrix layout helpers for the twelve-up grid.
export const WEIGHT_ROWS = ['feather', 'middle', 'heavy'];
export const TEMPERAMENT_COLS = [
  { shape: 'specialist', rhythm: 'spiky' },
  { shape: 'specialist', rhythm: 'steady' },
  { shape: 'generalist', rhythm: 'spiky' },
  { shape: 'generalist', rhythm: 'steady' },
];

// The dominant wedge flavours the reading: one line naming it, one hint
// that is actually actionable for that wedge.
export const WEDGE_FLAVOUR = {
  flight: 'The wedge that decides it: the itineraries.',
  road: 'The wedge that decides it: the kilometres.',
  home: 'The wedge that decides it: the house.',
  diet: 'The wedge that decides it: the table.',
  freight: 'The wedge that decides it: the parcels.',
  none: '',
};
export const WEDGE_HINT = {
  flight: 'One fewer long-haul return moves more than everything else combined.',
  road: 'Occupancy, mode shift, then an EV, in that order of effort.',
  home: 'Electrify the lot. GreenPower is a phone call; solar is a ladder.',
  diet: 'Fewer of the expensive plates. Nobody is taking your dinner.',
  freight: 'Sea shipping cuts the freight line by about ninety percent.',
  none: 'The top two wedges still decide whether the plan works.',
};

export const characterById = (id) => CHARACTERS.find((c) => c.id === id) || CHARACTERS[7];

const cellFor = (weight, shape, rhythm) =>
  CHARACTERS.find((c) => c.weight === weight && c.shape === shape && c.rhythm === rhythm);

// Classification. Reads the three axes off the aggregate and returns the
// matching cell plus the measured values, so the reveal can show the meters
// that produced the verdict rather than asserting it.
export function classifyCharacter(agg) {
  const total = agg.total || 0;

  // Nothing logged classifies as nothing: fall to the neutral cell with the
  // meters zeroed rather than crowning an empty audit.
  if (total <= 0.005) {
    return {
      ...characterById('allrounder'),
      topShare: 0, topGroup: 'none', custodian: false,
      flavour: '', hint: WEDGE_HINT.none,
      axes: {
        weight: { level: 'feather', total: 0 },
        shape: { level: 'generalist', topShare: 0, topGroup: 'none' },
        rhythm: { level: 'steady', spikeX: 0, worstT: 0 },
      },
    };
  }

  const share = (id) => (agg.byCategory[id] || 0) / total;
  const groups = [
    ['flight', share('flight')],
    ['road', share('road')],
    ['diet', share('diet')],
    ['freight', share('freight')],
    ['home', share('electricity') + share('gas') + share('other')],
  ].sort((a, b) => b[1] - a[1]);
  const [topGroup, topShare] = groups[0];

  const weight = total <= GLOBAL_T ? 'feather' : total <= HEAVY_T ? 'middle' : 'heavy';
  const shape = topShare >= SPECIALIST_SHARE ? 'specialist' : 'generalist';

  // Rhythm: the worst month against the average month over the audit window.
  const monthCount = Math.max(1, (agg.months && agg.months.length) || 12);
  const meanMonth = total / monthCount;
  const worstT = (agg.worstMonth && agg.worstMonth.total) || 0;
  const spikeX = meanMonth > 0 ? worstT / meanMonth : 0;
  const rhythm = monthCount > 1 && spikeX >= SPIKE_MULTIPLE ? 'spiky' : 'steady';

  return {
    ...cellFor(weight, shape, rhythm),
    topShare: Math.round(topShare * 100),
    topGroup,
    custodian: total <= BUDGET_T,
    flavour: WEDGE_FLAVOUR[topGroup] || WEDGE_FLAVOUR.none,
    hint: WEDGE_HINT[topGroup] || WEDGE_HINT.none,
    axes: {
      weight: { level: weight, total },
      shape: { level: shape, topShare, topGroup },
      rhythm: { level: rhythm, spikeX, worstT },
    },
  };
}
