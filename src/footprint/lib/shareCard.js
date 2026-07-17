// Canvas share cards: every story moment can be saved as a 1080x1350 PNG
// composed for social. Drawn by hand on a dark brand surface; bars are
// single-hue matcha (magnitude, labelled in text) so the dark card needs no
// separate palette validation. Uses the Web Share API where it exists and
// falls back to a straight download.

import { SHARE_ST, CARD_TEXT, NEEDLE } from '../data/storyCopy';

const W = 1080;
const H = 1350;
const INK = '#F4F6EE';
const MID = '#9AA694';
const MATCHA = '#B5C42B';
const BG = '#171C13';
const RULE = 'rgba(244,246,238,0.16)';

const DISP = '"Space Grotesk", sans-serif';
const MONO = '"JetBrains Mono", monospace';
const SANS = '"Inter", sans-serif';

async function ensureFonts() {
  if (!document.fonts || !document.fonts.load) return;
  try {
    await Promise.all([
      document.fonts.load(`700 300px ${DISP}`),
      document.fonts.load(`500 30px ${MONO}`),
      document.fonts.load(`400 34px ${SANS}`),
    ]);
  } catch { /* draw with fallbacks */ }
}

function roundedBar(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  ctx.fill();
}

function frame(ctx, title, fy) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
  // A faint bloom in the top corner so the card is not flat black.
  const g = ctx.createRadialGradient(W * 0.85, -60, 0, W * 0.85, -60, 700);
  g.addColorStop(0, 'rgba(181,196,43,0.14)');
  g.addColorStop(1, 'rgba(181,196,43,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = MATCHA;
  ctx.font = `500 34px ${MONO}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('./', 84, 118);
  ctx.fillStyle = MID;
  ctx.font = `500 27px ${MONO}`;
  ctx.textAlign = 'right';
  ctx.fillText(fy.toUpperCase(), W - 84, 112);
  ctx.textAlign = 'left';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = INK;
  ctx.font = `500 30px ${MONO}`;
  ctx.fillText(title, 84, 208);
  ctx.letterSpacing = '0px';
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(84, 240);
  ctx.lineTo(W - 84, 240);
  ctx.stroke();
}

function footer(ctx) {
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(84, H - 168);
  ctx.lineTo(W - 84, H - 168);
  ctx.stroke();
  ctx.fillStyle = MID;
  ctx.font = `400 26px ${SANS}`;
  ctx.fillText(SHARE_ST.method, 84, H - 108);
  ctx.fillStyle = MATCHA;
  ctx.font = `500 24px ${MONO}`;
  ctx.fillText(SHARE_ST.site, 84, H - 62);
}

function bigNumber(ctx, value, unit, y, size = 320) {
  ctx.fillStyle = INK;
  ctx.font = `700 ${size}px ${DISP}`;
  const num = String(value);
  ctx.fillText(num, 78, y);
  const w = ctx.measureText(num).width;
  ctx.fillStyle = MATCHA;
  ctx.font = `700 52px ${DISP}`;
  ctx.fillText(unit, 78 + w + 26, y - 14);
}

// Labelled matcha bars, widths proportional to the max value.
function bars(ctx, rows, top, opts = {}) {
  const { barH = 34, gap = 78, maxW = W - 168 - 260 } = opts;
  const max = Math.max(...rows.map((r) => r.t), 0.001);
  rows.forEach((r, i) => {
    const y = top + i * gap;
    ctx.fillStyle = INK;
    ctx.font = `600 30px ${SANS}`;
    ctx.fillText(r.label, 84, y);
    ctx.fillStyle = r.dim ? 'rgba(181,196,43,0.38)' : MATCHA;
    roundedBar(ctx, 84, y + 16, Math.max(10, (r.t / max) * maxW), barH, 5);
    ctx.fillStyle = MID;
    ctx.font = `500 28px ${MONO}`;
    ctx.textAlign = 'right';
    ctx.fillText(r.value ?? r.t.toFixed(1) + ' t', W - 84, y + 44);
    ctx.textAlign = 'left';
  });
}

const PAINTERS = {
  total(ctx, d) {
    bigNumber(ctx, d.total, 't', 560);
    ctx.fillStyle = MID;
    ctx.font = `500 30px ${MONO}`;
    ctx.fillText(CARD_TEXT.tonnes + d.fy.toUpperCase(), 84, 622);
    bars(ctx, d.cats.slice(0, 5), 760);
  },
  hotspot(ctx, d) {
    ctx.fillStyle = MID;
    ctx.font = `500 34px ${MONO}`;
    ctx.fillText('№' + d.rank, 84, 360);
    ctx.fillStyle = INK;
    ctx.font = `700 120px ${DISP}`;
    ctx.fillText(d.label, 78, 480);
    bigNumber(ctx, d.t, 't', 850, 300);
    ctx.fillStyle = MATCHA;
    ctx.font = `500 32px ${MONO}`;
    ctx.fillText(d.pct + CARD_TEXT.ofYear, 84, 920);
    ctx.fillStyle = MID;
    ctx.font = `400 34px ${SANS}`;
    ctx.fillText(d.quip, 84, 1010);
  },
  guess(ctx, d) {
    ctx.fillStyle = MID;
    ctx.font = `500 32px ${MONO}`;
    ctx.fillText(CARD_TEXT.guessLabel, 84, 400);
    ctx.fillStyle = INK;
    ctx.font = `700 170px ${DISP}`;
    ctx.fillText(d.guess + ' t', 78, 560);
    ctx.fillStyle = MID;
    ctx.font = `500 32px ${MONO}`;
    ctx.fillText(CARD_TEXT.auditLabel, 84, 720);
    ctx.fillStyle = MATCHA;
    ctx.font = `700 170px ${DISP}`;
    ctx.fillText(d.actual + ' t', 78, 880);
    ctx.fillStyle = INK;
    ctx.font = `400 40px ${SANS}`;
    ctx.fillText(d.verdict, 84, 1010);
  },
  bench(ctx, d) {
    bars(ctx, d.rows, 420, { gap: 150, barH: 44 });
    ctx.fillStyle = MID;
    ctx.font = `400 28px ${SANS}`;
    ctx.fillText(CARD_TEXT.benchNote, 84, 1080);
  },
  needle(ctx, d) {
    d.actions.slice(0, 3).forEach((a, i) => {
      const y = 430 + i * 220;
      ctx.fillStyle = MATCHA;
      ctx.font = `700 84px ${DISP}`;
      ctx.fillText('-' + a.t + ' t', 84, y);
      ctx.fillStyle = INK;
      ctx.font = `600 36px ${SANS}`;
      ctx.fillText(a.action, 84, y + 56);
      ctx.fillStyle = MID;
      ctx.font = `500 28px ${MONO}`;
      ctx.fillText(a.cost, 84, y + 104);
    });
    ctx.fillStyle = INK;
    ctx.font = `400 38px ${SANS}`;
    ctx.fillText(NEEDLE.punch, 84, 1120);
  },
};

export async function drawShareCard(kind, data) {
  await ensureFonts();
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  frame(ctx, data.title, data.fy);
  PAINTERS[kind](ctx, data);
  footer(ctx);
  return canvas;
}

export async function shareCard(kind, data, filename) {
  const canvas = await drawShareCard(kind, data);
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
  if (!blob) return false;
  const file = new File([blob], filename, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return true;
    } catch (err) {
      // The user closed the share sheet: not an error, but not "saved" either.
      if (err && err.name === 'AbortError') return false;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return true;
}
