// Emblem helpers: turn a character's dot stencil into point clouds (for the
// WebGL field to morph into) and draw it as a static dot matrix (badges,
// share cards, reduced-motion fallbacks). One source of shape, three outputs.

// Cells of the stencil as normalized coordinates in [-1, 1], y up.
export function stencilCells(stencil) {
  const rows = stencil.length;
  const cols = Math.max(...stencil.map((r) => r.length));
  const span = Math.max(rows, cols);
  const cells = [];
  stencil.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] === '#') {
        cells.push({
          x: ((c + 0.5) - cols / 2) / (span / 2),
          y: (rows / 2 - (r + 0.5)) / (span / 2),
        });
      }
    }
  });
  return cells;
}

// n jittered targets sampled over the stencil cells, deterministic enough
// for a morph target (particles land in-cell, spread by jitter).
export function stencilPoints(stencil, n) {
  const cells = stencilCells(stencil);
  if (!cells.length) return [];
  const rows = stencil.length;
  const cols = Math.max(...stencil.map((r) => r.length));
  const jitter = 0.85 / Math.max(rows, cols);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const cell = cells[i % cells.length];
    // Halton-ish jitter from the index keeps re-renders stable.
    const a = ((i * 0.618033) % 1) * 2 - 1;
    const b = ((i * 0.754877) % 1) * 2 - 1;
    pts.push({ x: cell.x + a * jitter, y: cell.y + b * jitter });
  }
  return pts;
}

// Draw the stencil as a rounded dot matrix onto a 2D canvas context.
// (x, y) is the top-left of a size x size box; the emblem centres in it.
export function drawEmblemDots(ctx, stencil, { x, y, size, color, alpha = 1 }) {
  const rows = stencil.length;
  const cols = Math.max(...stencil.map((r) => r.length));
  const span = Math.max(rows, cols);
  const cell = size / span;
  const r = cell * 0.34;
  const ox = x + (size - cols * cell) / 2;
  const oy = y + (size - rows * cell) / 2;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  stencil.forEach((row, ri) => {
    for (let ci = 0; ci < row.length; ci++) {
      if (row[ci] !== '#') continue;
      ctx.beginPath();
      ctx.arc(ox + (ci + 0.5) * cell, oy + (ri + 0.5) * cell, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();
}

// The site mark ("The Segmented Split") on a 2D canvas: an outer ring cut
// through by a horizontal slot into two mirrored hemispheres. The React twin
// lives in components/Mark.jsx; keep the proportions (slot ~= 0.2 of radius) in
// sync. (cx, cy) is the ring centre, r its stroke-centreline radius.
export function drawMark(ctx, cx, cy, r, color, lineWidth) {
  const g = r * 0.2; // half-height of the slot, matched to the SVG mask
  const a = Math.asin(g / r);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.arc(cx, cy, r, -a, -(Math.PI - a), true); // top hemisphere, over the top
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r, a, Math.PI - a, false); // bottom hemisphere, under the base
  ctx.stroke();
  ctx.restore();
}

// Lighten a hex colour toward white; the dark story scenes need brighter
// steps than the light-surface palette.
export function lighten(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (v) => Math.round(v + (255 - v) * amount);
  const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
