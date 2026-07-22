/* Browser-side renderer for the share thumbnails. Runs inside headless
   Chromium; reads the card spec from window.CARD and paints a 1200x630
   canvas (#c). One draw routine, one look, so every page's card is a
   sibling of the others. See scripts/og/cards.mjs for the specs and
   scripts/og/generate.mjs for the harness. */
(function () {
  const W = 1200, H = 630;
  const INK = '#F4F6EE';
  const MID = '#9AA694';
  const DIM = '#C2CAB6';
  const BG = '#171C13';
  const LIME = '#C9E04A';
  const MATCHA = '#B5C42B';
  const RULE = 'rgba(244,246,238,0.10)';

  const DISP = '"Space Grotesk", sans-serif';
  const MONO = '"JetBrains Mono", monospace';
  const SANS = '"Inter", sans-serif';

  // Category accents, cycled for the chips and the mesh highlight nodes.
  const PAL = ['#635BFF', '#FF9500', '#B5C42B', '#FF3B60', '#22B8CF', '#A46BD8'];

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // The site mark: an outer ring cut by a horizontal slot (from emblem.js).
  function drawMark(ctx, cx, cy, r, color, lineWidth) {
    const g = r * 0.2, a = Math.asin(g / r);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.arc(cx, cy, r, -a, -(Math.PI - a), true);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r, a, Math.PI - a, false);
    ctx.stroke();
    ctx.restore();
  }

  // A giant faint monogram, right-aligned, bleeding toward the edge. An
  // optional subscript (CO2) drops below the baseline.
  function drawGhost(ctx, g) {
    if (!g) return;
    const endX = g.endX == null ? 1178 : g.endX;
    const gap = 10;
    ctx.save();
    ctx.fillStyle = 'rgba(244,246,238,0.055)';
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.font = `700 ${g.size}px ${DISP}`;
    const wText = ctx.measureText(g.text).width;
    if (g.sub) {
      ctx.font = `700 ${g.subSize}px ${DISP}`;
      const wSub = ctx.measureText(g.sub).width;
      const startX = endX - (wText + gap + wSub);
      ctx.font = `700 ${g.size}px ${DISP}`;
      ctx.fillText(g.text, startX, g.baseline);
      ctx.font = `700 ${g.subSize}px ${DISP}`;
      ctx.fillText(g.sub, startX + wText + gap, g.subBaseline);
    } else {
      ctx.fillText(g.text, endX - wText, g.baseline);
    }
    ctx.restore();
  }

  // A dotted mesh network over the right side: nodes joined to near
  // neighbours, a few tinted with the category accents. Kept clear of the
  // headline block so no bright node lands on the type.
  function drawMesh(ctx, seed, excludeX, excludeY) {
    const rnd = mulberry32(seed >>> 0);
    const X0 = 636, X1 = 1188, Y0 = 58, Y1 = 512, N = 30;
    const nodes = [];
    let guard = 0;
    while (nodes.length < N && guard++ < 6000) {
      const x = X0 + rnd() * (X1 - X0);
      const y = Y0 + rnd() * (Y1 - Y0);
      if (x < excludeX && y < excludeY) continue;
      nodes.push({ x, y });
    }
    const accents = ['#635BFF', '#22B8CF', '#FF3B60', '#A46BD8', '#FF9500'];
    nodes.forEach((n, i) => {
      n.big = i % 4 === 0;
      n.col = i % 6 === 2 ? accents[(i / 3) % accents.length | 0] : MATCHA;
    });

    const LINK = 168;
    ctx.save();
    ctx.lineWidth = 1;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d > LINK) continue;
        const a = 0.16 * (1 - d / LINK);
        ctx.strokeStyle = `rgba(181,196,43,${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
    nodes.forEach((n) => {
      const r = n.big ? 4.6 : 2.8;
      ctx.globalAlpha = n.col === MATCHA ? (n.big ? 0.62 : 0.34) : 0.7;
      ctx.fillStyle = n.col;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fill();
      if (n.big) {
        ctx.globalAlpha = n.col === MATCHA ? 0.16 : 0.2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();
  }

  function draw() {
    const card = window.CARD;
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');

    // Surface + a warm lime bloom top-right, a faint indigo one bottom-left.
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    let g = ctx.createRadialGradient(1010, -30, 0, 1010, -30, 760);
    g.addColorStop(0, 'rgba(181,196,43,0.15)');
    g.addColorStop(1, 'rgba(181,196,43,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    g = ctx.createRadialGradient(80, 660, 0, 80, 660, 560);
    g.addColorStop(0, 'rgba(99,91,255,0.09)');
    g.addColorStop(1, 'rgba(99,91,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    drawGhost(ctx, card.ghost);

    // Headline metrics decide where the mesh may not go.
    const hSize = 82;
    ctx.font = `700 ${hSize}px ${DISP}`;
    const hW = Math.max(
      ctx.measureText(card.headline[0]).width,
      ctx.measureText(card.headline[1]).width,
    );
    const excludeX = card.excludeX == null ? Math.min(880, 70 + hW + 28) : card.excludeX;
    drawMesh(ctx, card.meshSeed, excludeX, 344);

    ctx.textBaseline = 'alphabetic';

    // Header: mark + eyebrow.
    drawMark(ctx, 84, 84, 13, MATCHA, 3.5);
    ctx.textAlign = 'left';
    ctx.letterSpacing = '5px';
    ctx.font = `500 22px ${MONO}`;
    ctx.fillStyle = LIME;
    ctx.fillText(card.eyebrow[0], 116, 92);
    const eyeW = ctx.measureText(card.eyebrow[0]).width;
    ctx.fillStyle = MID;
    ctx.fillText(card.eyebrow[1], 116 + eyeW, 92);
    ctx.letterSpacing = '0px';

    // Headline: line 1 ink, line 2 lime.
    ctx.font = `700 ${hSize}px ${DISP}`;
    ctx.fillStyle = INK;
    ctx.fillText(card.headline[0], 70, 220);
    ctx.fillStyle = LIME;
    ctx.fillText(card.headline[1], 70, 306);

    // Supporting lines.
    ctx.fillStyle = DIM;
    ctx.font = `400 25px ${SANS}`;
    ctx.fillText(card.support[0], 72, 384);
    ctx.fillText(card.support[1], 72, 418);

    // Chips: what the tool covers, no personal numbers. Colours cycle PAL.
    let x = 74;
    const cy = 480;
    ctx.font = `600 22px ${SANS}`;
    card.chips.forEach((label, i) => {
      ctx.fillStyle = PAL[i % PAL.length];
      ctx.beginPath();
      ctx.arc(x + 7, cy - 7, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = INK;
      ctx.fillText(label, x + 22, cy);
      x += 22 + ctx.measureText(label).width + 30;
    });

    // Footer rule + lines.
    ctx.strokeStyle = RULE;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(72, 548);
    ctx.lineTo(1128, 548);
    ctx.stroke();

    ctx.fillStyle = MID;
    ctx.font = `400 22px ${SANS}`;
    ctx.fillText(card.footer || 'Run your own · ten minutes · data stays in your browser', 72, 592);
    ctx.fillStyle = LIME;
    ctx.font = `500 21px ${MONO}`;
    ctx.textAlign = 'right';
    ctx.fillText(card.url, 1128, 592);

    window.__done = true;
  }

  document.fonts.ready.then(draw).catch(draw);
})();
