// Category shape stencils for the carbon field: when a visitor focuses a
// category on the total reveal, that category's particles gather into a
// recognisable silhouette instead of an abstract cluster. Same '#'-cell
// format as the character emblems in characters.js, rendered through
// lib/emblem.js. Purely visual: nothing here touches a number.

const PLANE = [
  '......#......',
  '.....###.....',
  '.....###.....',
  '....#####....',
  '#############',
  '#############',
  '.....###.....',
  '.....###.....',
  '.....###.....',
  '...#######...',
];

const BOLT = [
  '......####...',
  '.....####....',
  '....####.....',
  '...########..',
  '......####...',
  '.....####....',
  '....####.....',
  '...####......',
  '..####.......',
  '..##.........',
];

const FLAME = [
  '......#......',
  '.....##......',
  '.....###.....',
  '....####.....',
  '...######....',
  '..#######....',
  '..########...',
  '.#########...',
  '.####.####...',
  '.###...###...',
  '..##...##....',
  '...#####.....',
];

const CAR = [
  '....#####....',
  '...#######...',
  '..#########..',
  '.###########.',
  '#############',
  '#############',
  '..##.....##..',
  '.####...####.',
  '..##.....##..',
];

const PARCEL = [
  '#############',
  '######.######',
  '######.######',
  '######.######',
  '#############',
  '######.######',
  '######.######',
  '######.######',
  '#############',
];

const BAG = [
  '....#...#....',
  '...#.....#...',
  '..#########..',
  '..#########..',
  '..#########..',
  '..#########..',
  '..#########..',
  '..#########..',
  '...#######...',
];

const BED = [
  '#............',
  '#............',
  '#..###.......',
  '#..###.######',
  '#############',
  '#############',
  '#...........#',
  '#...........#',
];

// Diet wears the shape of the diet actually picked: a drumstick for the meat
// eaters, a fish for pescetarians, a leaf for the plant-based.
const DRUMSTICK = [
  '...#####.....',
  '..#######....',
  '.#########...',
  '.#########...',
  '..#######....',
  '....####.....',
  '......##.....',
  '.......##....',
  '........##...',
  '.........##..',
  '........####.',
  '........####.',
];

const FISH = [
  '....#####....',
  '..########...',
  '.#########.#.',
  '##########.##',
  '.#########.#.',
  '..########...',
  '....#####....',
];

const LEAF = [
  '......#......',
  '.....###.....',
  '....#####....',
  '...#######...',
  '..####.####..',
  '..###.#.###..',
  '.####.#.####.',
  '.###..#..###.',
  '..##..#..##..',
  '...#..#..#...',
  '......#......',
  '......#......',
];

const ASTERISK = [
  '#....#....#',
  '.#...#...#.',
  '..#..#..#..',
  '...#.#.#...',
  '....###....',
  '#####.#####',
  '....###....',
  '...#.#.#...',
  '..#..#..#..',
  '.#...#...#.',
  '#....#....#',
];

const DIET_SHAPES = {
  highMeat: DRUMSTICK,
  medMeat: DRUMSTICK,
  lowMeat: DRUMSTICK,
  pescetarian: FISH,
  vegetarian: LEAF,
  vegan: LEAF,
};

// The shape map the total reveal hands the carbon field: one stencil per
// category that can appear, with diet resolved from the audit's diet type.
export function categoryShapes(dietType) {
  return {
    electricity: BOLT,
    gas: FLAME,
    flight: PLANE,
    road: CAR,
    freight: PARCEL,
    diet: DIET_SHAPES[dietType] || LEAF,
    goods: BAG,
    hotel: BED,
    other: ASTERISK,
  };
}
