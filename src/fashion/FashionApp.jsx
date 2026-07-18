// ============================================================================
// SEVENFOLD — one garment, seven lenses.
// A sustainable fashion intelligence platform built as one continuous world.
// The garment is the protagonist: it is assembled in module one and then
// physically travels through every other module, carrying its state with it.
// All copy and factors live in ./data.js. Interactions are pointer-first
// (drag, scrub, pour, rub, bury), with keyboard and reduced-motion paths for
// every one of them.
// ============================================================================

import React, {
  createContext, useCallback, useContext, useEffect, useId, useMemo,
  useRef, useState,
} from 'react';
import { prefersReducedMotion, canHover } from '../utils/media';
import {
  DYES, FABRICS, GARMENT_TYPES, ORIGINS, DEST, WORLD_MASK, STAGES, FACTORS,
  BREAKEVEN_WEARS, LOOP_MODS, FATES, BRAND_METRICS, BRANDS, VAGUE_TERMS,
  ABSOLUTE_TERMS, QUALIFIER_TERMS, EVIDENCE_PATTERNS, SPECIMEN_CLAIMS,
  CLAIM_VERDICTS, COPY,
} from './data';

// ---------------------------------------------------------------------------
// Small maths + formatting
// ---------------------------------------------------------------------------
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;

const fmtKg = (kg) => (kg >= 100 ? Math.round(kg).toString() : kg >= 10 ? kg.toFixed(1) : kg.toFixed(2));
const fmtInt = (n) => Math.round(n).toLocaleString('en-AU');
const fmtMoney = (n) => '$' + Math.round(n).toLocaleString('en-AU');

// Deterministic rng so particle jitter is stable across renders.
const mulberry32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Critically-tuned spring integrator used everywhere motion matters.
class Spring {
  constructor(x = 0, stiff = 120, damp = 18) {
    this.x = x; this.v = 0; this.t = x; this.stiff = stiff; this.damp = damp;
  }
  step(dt) {
    const a = (this.t - this.x) * this.stiff - this.v * this.damp;
    this.v += a * dt; this.x += this.v * dt;
    return this.x;
  }
  snap(x) { this.x = x; this.t = x; this.v = 0; }
}

const damp = (cur, target, lambda, dt) => lerp(cur, target, 1 - Math.exp(-lambda * dt));

// Catmull-Rom through points, closed, onto a canvas path.
function smoothPath(ctx, pts) {
  const n = pts.length;
  ctx.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
  for (let i = 1; i <= n; i++) {
    const p = pts[i % n]; const nx = pts[(i + 1) % n];
    ctx.quadraticCurveTo(p[0], p[1], (p[0] + nx[0]) / 2, (p[1] + nx[1]) / 2);
  }
  ctx.closePath();
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
function useReducedMotionLive() {
  const [rm, setRm] = useState(prefersReducedMotion);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion:reduce)');
    const on = () => setRm(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return rm;
}

// rAF loop that pauses when `active` is false or the tab is hidden.
function useRaf(cb, active = true) {
  const cbRef = useRef(cb); cbRef.current = cb;
  useEffect(() => {
    if (!active) return undefined;
    let raf = 0; let last = performance.now(); let alive = true;
    const tick = (now) => {
      if (!alive) return;
      const dt = clamp((now - last) / 1000, 0.001, 0.05);
      last = now;
      cbRef.current(dt, now / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const vis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { last = performance.now(); raf = requestAnimationFrame(tick); }
    };
    document.addEventListener('visibilitychange', vis);
    return () => { alive = false; cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', vis); };
  }, [active]);
}

// IntersectionObserver visibility, used to pause off-screen canvas work.
function useOnScreen(ref, rootMargin = '160px') {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setOn(true); return undefined; }
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return on;
}

// Canvas sized to its element with a capped devicePixelRatio.
function useCanvas(ref) {
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return undefined;
    const fit = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      if (r.width === 0 || r.height === 0) return;
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      sizeRef.current = { w: r.width, h: r.height, dpr };
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cv);
    return () => ro.disconnect();
  }, [ref]);
  return sizeRef;
}

// Pointer drag helper: call inside onPointerDown.
function startDrag(e, { move, up }) {
  const el = e.currentTarget;
  const id = e.pointerId;
  try { el.setPointerCapture(id); } catch { /* fine */ }
  const onMove = (ev) => { if (ev.pointerId === id) move(ev); };
  const onUp = (ev) => {
    if (ev.pointerId !== id) return;
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerup', onUp);
    el.removeEventListener('pointercancel', onUp);
    if (up) up(ev);
  };
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onUp);
}

// ---------------------------------------------------------------------------
// The footprint engine. Everything the seven lenses show derives from here.
// ---------------------------------------------------------------------------
const typeById = (id) => GARMENT_TYPES.find((t) => t.id === id);
const fabricById = (id) => FABRICS.find((f) => f.id === id);
const originById = (id) => ORIGINS.find((o) => o.id === id);
const dyeById = (id) => DYES.find((d) => d.id === id);
const brandById = (id) => BRANDS.find((b) => b.id === id) || null;

export function computeFootprint(g) {
  const type = typeById(g.typeId);
  const fab = fabricById(g.fabricId);
  const origin = originById(g.originId);
  const garmentKg = (type.area * g.gsm) / 1000;
  const clothKg = garmentKg / FACTORS.cutLoss;

  const fibre = fab.ef * clothKg;
  const spin = FACTORS.spinKwhPerKg * clothKg * origin.grid;
  let wet = (FACTORS.dyeThermalPerKg + FACTORS.dyeElecKwhPerKg * origin.grid) * clothKg;
  if (g.dyeId === 'undyed') wet *= FACTORS.undyedFactor;
  if (g.dyeEnergy === 'clean') wet *= FACTORS.renewableDyeFactor;
  const make = FACTORS.makeKwhPerKg * garmentKg * origin.grid + FACTORS.trimsKg;
  const perKm = g.freight === 'air' ? FACTORS.airPerKgKm
    : origin.id === 'au' ? FACTORS.roadPerKgKm : FACTORS.seaPerKgKm;
  const freight = garmentKg * origin.km * perKm;
  const retail = FACTORS.retailKg;

  const isCotton = g.fabricId === 'cotton' || g.fabricId === 'orgcotton' || g.fabricId === 'blend';
  const waterPerKg = isCotton && g.irrigation === 'rainfed' ? fab.waterRain : fab.waterL;
  const water = waterPerKg * clothKg + (g.dyeId === 'undyed' ? 12 : FACTORS.dyeWaterLPerKg * clothKg);

  const gsmNorm = (g.gsm - type.gsmMin) / (type.gsmMax - type.gsmMin);
  const wearsCap = Math.round(type.wearsBase * fab.wearsMod * (0.78 + 0.5 * gsmNorm));

  const streams = [
    { id: 'fibre', label: COPY.m1.streams.fibre, kg: fibre + spin, colour: '#7A5F3F' },
    { id: 'wet', label: COPY.m1.streams.wet, kg: wet, colour: g.dyeId === 'undyed' ? '#9A9078' : (dyeById(g.dyeId).hex || '#33487A') },
    { id: 'make', label: COPY.m1.streams.make, kg: make, colour: '#A98E2C' },
    { id: 'freight', label: COPY.m1.streams.freight, kg: freight, colour: '#5A6472' },
    { id: 'retail', label: COPY.m1.streams.retail, kg: retail, colour: '#837B69' },
  ];
  const total = streams.reduce((s, x) => s + x.kg, 0);
  // per supply-chain stage, in road order, for module three
  const road = [
    { id: 'fibre', kg: fibre, colour: '#7A5F3F' },
    { id: 'spin', kg: spin, colour: '#8B7B55' },
    { id: 'dye', kg: wet, colour: g.dyeId === 'undyed' ? '#9A9078' : (dyeById(g.dyeId).hex || '#33487A') },
    { id: 'make', kg: make, colour: '#A98E2C' },
    { id: 'freight', kg: freight, colour: g.freight === 'air' ? '#C86A57' : '#5A6472' },
    { id: 'retail', kg: retail, colour: '#837B69' },
  ];
  return {
    streams, total, water, garmentKg, clothKg, wearsCap, road,
    microMg: fab.microMg,
    perStage: Object.fromEntries(streams.map((s) => [s.id, s.kg])),
  };
}

// Effective material loop after design mods are applied.
export function loopStateOf(g) {
  const fab = fabricById(g.fabricId);
  let loop = fab.loop;
  if (g.mods.includes('mono') && loop === 'jam') loop = 'mono';
  if (g.mods.includes('seams') && loop === 'hard') loop = 'mono';
  return loop;
}

export function computeCircularity(g, fp) {
  const fab = fabricById(g.fabricId);
  const brand = brandById(g.brandId);
  const loop = loopStateOf(g);
  let score = loop === 'mono' ? 34 : loop === 'hard' ? 16 : 5;
  score += clamp((fp.wearsCap / 240) * 24, 4, 24);
  if (g.mods.includes('spares')) score += 12;
  if (g.mods.includes('seams')) score += 10;
  if (brand && brand.takeBack) score += 12;
  if (fab.decayYr < 3) score += 8;
  return Math.round(clamp(score, 0, 100));
}

// A candidate list for the scrubbable counter: which single decision gets
// the total closest to the asked-for number.
export function counterOffers(g, fp, targetKg) {
  const offers = [];
  const test = (label, patch) => {
    const t = computeFootprint({ ...g, ...patch }).total;
    if (t < fp.total - 0.05) offers.push({ label, patch, delta: t - fp.total, lands: t });
  };
  for (const f of FABRICS) if (f.id !== g.fabricId) test(`Cut it from ${f.name.toLowerCase()}`, { fabricId: f.id });
  const type = typeById(g.typeId);
  const lighter = Math.max(type.gsmMin, g.gsm - 60);
  if (lighter < g.gsm) test(`Drop the cloth to ${lighter} gsm`, { gsm: lighter });
  for (const o of ORIGINS) if (o.id !== g.originId) test(`Make it in ${o.name}`, { originId: o.id });
  if (g.freight === 'air') test('Put it back on a ship', { freight: 'sea' });
  if (g.dyeId !== 'undyed') test('Skip the vat, sell it undyed', { dyeId: 'undyed' });
  if (g.dyeEnergy !== 'clean') test('Re-power the dye house', { dyeEnergy: 'clean' });
  if (g.irrigation !== 'rainfed' && (g.fabricId === 'cotton' || g.fabricId === 'orgcotton')) {
    test('Grow the cotton on rain', { irrigation: 'rainfed' });
  }
  offers.sort((a, b) => Math.abs(a.lands - targetKg) - Math.abs(b.lands - targetKg));
  return offers.slice(0, 3);
}

// ---------------------------------------------------------------------------
// Garment geometry. Outlines are normalised: x in [-0.65, 0.65], y in [0, 1].
// ---------------------------------------------------------------------------
const OUTLINES = {
  tee: [
    [-0.42, 0.10], [-0.16, 0.03], [0, 0.135], [0.16, 0.03], [0.42, 0.10],
    [0.62, 0.33], [0.47, 0.45], [0.315, 0.375], [0.305, 0.955], [0, 0.99],
    [-0.305, 0.955], [-0.315, 0.375], [-0.47, 0.45], [-0.62, 0.33],
  ],
  hoodie: [
    [-0.46, 0.14], [-0.21, 0.06], [-0.13, -0.03], [0, -0.075], [0.13, -0.03],
    [0.21, 0.06], [0.46, 0.14], [0.60, 0.50], [0.44, 0.565], [0.335, 0.43],
    [0.335, 0.965], [0, 1.0], [-0.335, 0.965], [-0.335, 0.43], [-0.44, 0.565],
    [-0.60, 0.50],
  ],
  jeans: [
    [-0.285, 0.005], [0.285, 0.005], [0.335, 0.215], [0.295, 0.62],
    [0.255, 0.995], [0.07, 0.995], [0.05, 0.47], [0, 0.405], [-0.05, 0.47],
    [-0.07, 0.995], [-0.255, 0.995], [-0.295, 0.62], [-0.335, 0.215],
  ],
};

// Mix a hex colour toward another. t=0 gives a, t=1 gives b.
function mixHex(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const m = pa.map((v, i) => Math.round(lerp(v, pb[i], t)));
  return `rgb(${m[0]},${m[1]},${m[2]})`;
}

// The garment's current visible colour: greige cloth until it has been
// through the vat (dyeProgress goes 0..1 inside module three's dye house,
// and starts at 1 if you never visit).
function garmentColour(g, dyeProgress = 1) {
  const base = fabricById(g.fabricId).base;
  const dye = dyeById(g.dyeId);
  if (!dye.hex) return base;
  return mixHex(base, dye.hex, 0.88 * clamp(dyeProgress, 0, 1));
}

// Draws the garment. `spec` carries everything visual so the world layer and
// static fallbacks share one renderer.
function drawGarment(ctx, spec) {
  const {
    x, y, h, typeId, gsmNorm, colour, t = 0, wobble = 1, sway = 0,
    rot = 0, worn = 0, alpha = 1,
  } = spec;
  const pts = OUTLINES[typeId];
  const s = h;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;

  const amp = wobble * s * 0.014 * (1.25 - gsmNorm * 0.75);
  const sag = 1 + gsmNorm * 0.035;
  const world = pts.map(([px, py], i) => {
    const drape = py > 0.5 ? (py - 0.5) * 2 : 0;
    const wx = px * s
      + Math.sin(t * 2.1 + i * 1.7) * amp * (0.4 + drape)
      + sway * s * 0.09 * drape;
    const wy = (py * sag - 0.5) * s
      + Math.cos(t * 1.7 + i * 2.3) * amp * 0.5 * drape;
    return [wx, wy];
  });

  ctx.beginPath();
  smoothPath(ctx, world);
  ctx.fillStyle = colour;
  ctx.fill();

  // weave: sparse horizontal grain clipped to the cloth
  ctx.save();
  ctx.clip();
  ctx.globalAlpha = alpha * 0.16;
  ctx.strokeStyle = '#26231D';
  ctx.lineWidth = 0.6;
  const step = 4 + (1 - gsmNorm) * 4;
  for (let gy = -s * 0.55; gy < s * 0.55; gy += step) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.7, gy + Math.sin(t + gy * 0.2) * amp * 0.4);
    ctx.lineTo(s * 0.7, gy + Math.cos(t + gy * 0.17) * amp * 0.4);
    ctx.stroke();
  }
  if (worn > 0) {
    ctx.globalAlpha = alpha * 0.5 * worn;
    ctx.fillStyle = '#EDE7D6';
    const rng = mulberry32(7);
    for (let i = 0; i < 26; i++) {
      ctx.beginPath();
      ctx.arc((rng() - 0.5) * s * 1.1, (rng() - 0.5) * s * 0.95, rng() * s * 0.03 + 1, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();

  // construction details per cut
  ctx.globalAlpha = alpha * 0.55;
  ctx.strokeStyle = '#26231D';
  ctx.lineWidth = 1 + gsmNorm * 2.1;
  ctx.beginPath();
  smoothPath(ctx, world);
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.4;
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (typeId === 'tee') {
    ctx.moveTo(-0.16 * s, (0.05 * sag - 0.5) * s);
    ctx.quadraticCurveTo(0, (0.17 * sag - 0.5) * s, 0.16 * s, (0.05 * sag - 0.5) * s);
  } else if (typeId === 'hoodie') {
    ctx.moveTo(-0.13 * s, (0.02 * sag - 0.5) * s);
    ctx.quadraticCurveTo(0, (0.1 * sag - 0.5) * s, 0.13 * s, (0.02 * sag - 0.5) * s);
    ctx.moveTo(-0.16 * s, (0.62 * sag - 0.5) * s);
    ctx.lineTo(-0.16 * s, (0.86 * sag - 0.5) * s);
    ctx.lineTo(0.16 * s, (0.86 * sag - 0.5) * s);
    ctx.lineTo(0.16 * s, (0.62 * sag - 0.5) * s);
  } else {
    ctx.moveTo(-0.285 * s, (0.09 * sag - 0.5) * s);
    ctx.lineTo(0.285 * s, (0.09 * sag - 0.5) * s);
    ctx.moveTo(0, (0.09 * sag - 0.5) * s);
    ctx.quadraticCurveTo(0.03 * s, (0.25 * sag - 0.5) * s, 0, (0.40 * sag - 0.5) * s);
  }
  ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Particle field for CO2e. One mote is 50 g CO2e. Pooled, deterministic-ish,
// cheap to draw (no shadows, no blurs).
// ---------------------------------------------------------------------------
const MOTE_KG = 0.05;
const MAX_MOTES = 700;

class MoteField {
  constructor() {
    this.motes = [];
    this.rng = mulberry32(1234);
  }
  // keep stream populations proportional to their kg
  settle(streams, cx, cy, radius, dt) {
    const totalWanted = Math.min(MAX_MOTES, Math.round(streams.reduce((s, x) => s + x.kg, 0) / MOTE_KG));
    const wantBy = {};
    const totalKg = Math.max(0.001, streams.reduce((s, x) => s + x.kg, 0));
    for (const s of streams) wantBy[s.id] = Math.round((s.kg / totalKg) * totalWanted);
    const haveBy = {};
    for (const m of this.motes) haveBy[m.stream] = (haveBy[m.stream] || 0) + 1;
    // cull overshoot
    this.motes = this.motes.filter((m) => {
      const want = wantBy[m.stream] ?? 0;
      if ((haveBy[m.stream] || 0) > want && this.rng() < 0.12) {
        haveBy[m.stream] -= 1; return false;
      }
      return true;
    });
    // spawn deficit near the garment edge, a few per frame so growth reads
    for (const s of streams) {
      let deficit = (wantBy[s.id] || 0) - (haveBy[s.id] || 0);
      let burst = Math.min(deficit, 3);
      while (burst-- > 0) {
        const a = this.rng() * TAU;
        this.motes.push({
          stream: s.id, colour: s.colour,
          x: cx + Math.cos(a) * radius * 0.35,
          y: cy + Math.sin(a) * radius * 0.35,
          vx: Math.cos(a) * 30, vy: Math.sin(a) * 30,
          r: 1.1 + this.rng() * 1.7, ph: this.rng() * TAU,
        });
      }
    }
    // orbit physics: drift out, curl around, get pulled back
    for (const m of this.motes) {
      const dx = m.x - cx; const dy = m.y - cy;
      const d = Math.max(12, Math.hypot(dx, dy));
      const pull = (d - radius) * 1.6;
      m.vx += (-dx / d) * pull * dt * 3.2 + (-dy / d) * 26 * dt;
      m.vy += (-dy / d) * pull * dt * 3.2 + (dx / d) * 26 * dt;
      m.vx *= (1 - 1.4 * dt); m.vy *= (1 - 1.4 * dt);
      m.x += m.vx * dt; m.y += m.vy * dt;
    }
  }
  draw(ctx, t) {
    for (const m of this.motes) {
      ctx.globalAlpha = 0.5 + Math.sin(t * 2 + m.ph) * 0.22;
      ctx.fillStyle = m.colour;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  clear() { this.motes.length = 0; }
}

// ---------------------------------------------------------------------------
// World context: one garment, shared by every module, plus an imperative
// channel (refs, not state) for the 60fps layer.
// ---------------------------------------------------------------------------
const WorldCtx = createContext(null);
export const useWorld = () => useContext(WorldCtx);

const DEFAULT_GARMENT = {
  typeId: 'tee', fabricId: 'cotton', gsm: 180, originId: 'vn',
  dyeId: 'indigo', dyeEnergy: 'grid', irrigation: 'irrigated', freight: 'sea',
  mods: [], brandId: null, price: 45, wears: 30, replaces: false,
};

function WorldProvider({ children }) {
  const [g, setG] = useState(DEFAULT_GARMENT);
  const rm = useReducedMotionLive();
  const [hover] = useState(canHover);
  const patch = useCallback((p) => setG((old) => ({ ...old, ...p })), []);
  const fp = useMemo(() => computeFootprint(g), [g]);
  const circ = useMemo(() => computeCircularity(g, fp), [g, fp]);
  const brand = useMemo(() => brandById(g.brandId), [g.brandId]);

  // Imperative world channel. seats: id -> element. override: a module takes
  // possession of the garment's position (road, loop drag, balance pan).
  const world = useRef({
    seats: new Map(), override: null, activeSeat: 'hero',
    dyeProgress: 1, worn: 0, wornTarget: 0, impulse: 0, hidden: false,
  }).current;
  const stateRef = useRef({ g, fp });
  useEffect(() => { stateRef.current = { g, fp }; }, [g, fp]);

  const value = useMemo(() => ({
    g, patch, fp, circ, brand, rm, hover, world, stateRef,
  }), [g, patch, fp, circ, brand, rm, hover, world, stateRef]);
  return <WorldCtx.Provider value={value}>{children}</WorldCtx.Provider>;
}

// A seat is an empty space a module reserves for the travelling garment.
function Seat({ id, className = '', style, children }) {
  const { world } = useWorld();
  const ref = useCallback((el) => {
    if (el) world.seats.set(id, el); else world.seats.delete(id);
  }, [id, world]);
  return (
    <div ref={ref} className={`fs-seat ${className}`} style={style} data-seat={id}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The world layer: a single fixed canvas that draws the garment, its CO2e
// cloud, and the hero pendulum. It never re-renders; it reads refs.
// ---------------------------------------------------------------------------
function WorldLayer() {
  const { rm, world, stateRef } = useWorld();
  const cvRef = useRef(null);
  const size = useCanvas(cvRef);
  const motes = useRef(new MoteField()).current;
  const sx = useRef(new Spring(0, 42, 12)).current;
  const sy = useRef(new Spring(0, 42, 12)).current;
  const ss = useRef(new Spring(240, 60, 16)).current;
  const pend = useRef({ a: 0.12, va: 0 }).current;
  const swayRef = useRef(0);
  const started = useRef(false);

  useRaf((dt, t) => {
    const cv = cvRef.current;
    if (!cv) return;
    const { w, h, dpr } = size.current;
    if (!w) return;
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const { g, fp } = stateRef.current;

    // where does the garment want to be?
    let target = null;
    let mode = 'seat';
    if (world.override) {
      target = world.override; mode = world.override.mode || 'free';
    } else {
      // nearest seat to the viewport centre wins
      let best = null; let bestD = Infinity;
      for (const [id, el] of world.seats) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -300 || r.top > h + 300) continue;
        const cy = r.top + r.height / 2;
        const d = Math.abs(cy - h * 0.5);
        if (d < bestD) { bestD = d; best = { id, r }; }
      }
      if (best) {
        world.activeSeat = best.id;
        const scale = Math.min(best.r.height * 0.72, best.r.width * 0.78, 460);
        target = {
          x: best.r.left + best.r.width / 2,
          y: best.r.top + best.r.height / 2,
          s: scale,
        };
        if (best.id === 'hero') mode = 'hero';
      }
    }
    if (!target) return;

    if (!started.current) {
      sx.snap(target.x); sy.snap(target.y); ss.snap(target.s);
      started.current = true;
    }
    sx.t = target.x; sy.t = target.y; ss.t = target.s;
    if (rm) { sx.snap(target.x); sy.snap(target.y); ss.snap(target.s); }
    else { sx.step(dt); sy.step(dt); ss.step(dt); }

    const gx = sx.x; const gy = sy.x; const gs = ss.x;
    swayRef.current = damp(swayRef.current, clamp(sx.v / 900, -1, 1), 4, dt);
    world.worn = damp(world.worn, world.wornTarget, 2.5, dt);

    const gsmNorm = (() => {
      const ty = typeById(g.typeId);
      return clamp((g.gsm - ty.gsmMin) / (ty.gsmMax - ty.gsmMin), 0, 1);
    })();
    const colour = garmentColour(g, world.dyeProgress);

    // hero pendulum: hangs from a thread and can be shoved
    let rot = 0; let px = gx; let py = gy;
    if (mode === 'hero' && !rm) {
      pend.va += (-Math.sin(pend.a) * 2.6 - pend.va * 0.55) * dt;
      pend.va += world.impulse * dt;
      world.impulse *= Math.exp(-6 * dt);
      pend.a += pend.va;
      rot = pend.a * 0.6;
      const pivotY = gy - gs * 0.82;
      const L = gs * 0.82;
      px = gx + Math.sin(pend.a) * L;
      py = pivotY + Math.cos(pend.a) * L;
      ctx.strokeStyle = 'rgba(38,35,29,0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gx, pivotY);
      ctx.lineTo(px, py - gs * 0.48);
      ctx.stroke();
      ctx.fillStyle = '#26231D';
      ctx.beginPath();
      ctx.arc(gx, pivotY, 2.5, 0, TAU);
      ctx.fill();
    }

    // CO2e cloud follows the garment except where a module suppresses it
    if (!rm && !world.hidden && mode !== 'road') {
      motes.settle(fp.streams, px, py, gs * 0.66, dt);
      motes.draw(ctx, t);
    }
    if (world.hidden) { ctx.globalAlpha = 1; return; }

    drawGarment(ctx, {
      x: px, y: py, h: gs, typeId: g.typeId, gsmNorm, colour,
      t, wobble: rm ? 0 : 1, sway: swayRef.current, rot,
      worn: world.worn,
    });
  }, true);

  return <canvas ref={cvRef} className="fs-world" aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// Cursor: a ring and a word. The word is the tool. Only on fine pointers.
// ---------------------------------------------------------------------------
function CursorLayer() {
  const { hover, rm } = useWorld();
  const ref = useRef(null);
  useEffect(() => {
    if (!hover) return undefined;
    document.documentElement.classList.add('fs-has-cursor');
    const el = ref.current;
    let raf = 0; let x = -100; let y = -100; let cx = -100; let cy = -100;
    let mode = 'default'; let down = false;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      const zone = e.target.closest ? e.target.closest('[data-cursor]') : null;
      mode = zone ? zone.getAttribute('data-cursor') : 'default';
      el.dataset.hidden = '0';
    };
    const dn = () => { down = true; };
    const up = () => { down = false; };
    const out = (e) => { if (!e.relatedTarget) el.dataset.hidden = '1'; };
    const tick = () => {
      cx = damp(cx, x, 30, 1 / 60); cy = damp(cy, y, 30, 1 / 60);
      el.style.transform = `translate(${cx}px, ${cy}px)`;
      el.dataset.mode = down ? 'press' : mode;
      const w = el.querySelector('.word');
      if (w && mode !== 'default') w.textContent = mode;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', dn, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    document.documentElement.addEventListener('mouseleave', out);
    raf = requestAnimationFrame(tick);
    return () => {
      document.documentElement.classList.remove('fs-has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', dn);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('mouseleave', out);
      cancelAnimationFrame(raf);
    };
  }, [hover, rm]);
  if (!hover) return null;
  return (
    <div ref={ref} className="fs-cursor" data-mode="default" data-hidden="1" aria-hidden="true">
      <span className="ring" /><span className="dot" /><span className="word" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chrome: topbar, rail, section shell
// ---------------------------------------------------------------------------
function TopBar({ onSeventh }) {
  const clicks = useRef({ n: 0, last: 0 });
  const onWordmark = (e) => {
    // hidden delight: seven taps on the seven-lens wordmark. Not announced.
    const now = performance.now();
    const c = clicks.current;
    c.n = now - c.last < 900 ? c.n + 1 : 1;
    c.last = now;
    if (c.n >= 7) { c.n = 0; e.preventDefault(); onSeventh(); }
  };
  return (
    <header className="fs-topbar">
      <a
        className="fs-wordmark" href="#top" onClick={onWordmark}
        aria-label={`${COPY.brand}, ${COPY.strap}. Back to the top.`}
      >
        {COPY.brand}
        <small>{COPY.strap}</small>
      </a>
      <a className="fs-back" href="../">
        <span className="full">{COPY.byline} · {COPY.backLink}</span>
        <span className="mini">↑ {COPY.backLink}</span>
      </a>
    </header>
  );
}

function Rail({ active }) {
  return (
    <nav className="fs-rail" aria-label="Modules">
      {COPY.rail.map((label, i) => {
        const id = `m${i + 1}`;
        return (
          <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
            <span className="lbl">{label}</span>
            <span className="pip" aria-hidden="true" />
          </a>
        );
      })}
    </nav>
  );
}

function SecHead({ m }) {
  return (
    <div className="fs-head">
      <p className="fs-idx" data-n={m.idx}>{m.sub}</p>
      <h2 className="fs-title">{m.title}</h2>
      <p className="fs-lede">{m.lede}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero. The garment hangs from a thread and you can shove it. Playing starts
// before reading does.
// ---------------------------------------------------------------------------
function Hero() {
  const { world, rm } = useWorld();
  const onDown = (e) => {
    if (rm) return;
    let lastX = e.clientX;
    startDrag(e, {
      move: (ev) => {
        world.impulse = clamp(world.impulse + (ev.clientX - lastX) * 0.08, -14, 14);
        lastX = ev.clientX;
      },
    });
  };
  return (
    <section className="fs-hero" id="top" aria-label="Introduction">
      <Seat id="hero" className="fs-hero-seat">
        <div
          className="fs-hero-swing" data-cursor="push"
          onPointerDown={onDown}
          role="presentation"
        />
      </Seat>
      <p className="fs-hero-kicker">{COPY.hero.kicker}</p>
      <h1>
        {COPY.hero.headlineA}
        <span className="b">{COPY.hero.headlineB}</span>
      </h1>
      <p className="fs-hero-stand">{COPY.hero.stand}</p>
      <p className="fs-hero-cue"><span className="tick" aria-hidden="true" />{COPY.hero.cue}</p>
      <p className="sr-only">{COPY.hero.srGarment}</p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MODULE 1 — Cut and make. Drag cloth onto the blank, pull the weight, drop
// the garment on a port. The counter is grabbable and negotiates back.
// ---------------------------------------------------------------------------
function SwatchCloth({ fabric, style }) {
  // woven look, no images: layered repeating gradients per weave type
  const base = fabric.base;
  const grain = fabric.weave === 'slub'
    ? `repeating-linear-gradient(0deg, rgba(38,35,29,0.10) 0 1px, transparent 1px 5px), repeating-linear-gradient(90deg, rgba(38,35,29,0.07) 0 1px, transparent 1px 9px)`
    : fabric.weave === 'knit'
      ? `repeating-linear-gradient(45deg, rgba(38,35,29,0.08) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(38,35,29,0.08) 0 2px, transparent 2px 6px)`
      : fabric.weave === 'tight'
        ? `repeating-linear-gradient(0deg, rgba(38,35,29,0.05) 0 1px, transparent 1px 3px)`
        : `repeating-linear-gradient(0deg, rgba(38,35,29,0.08) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(38,35,29,0.05) 0 1px, transparent 1px 4px)`;
  return <div className="cloth" style={{ background: `${grain}, ${base}`, ...style }} aria-hidden="true" />;
}

function ModuleOne() {
  const { g, patch, fp, rm } = useWorld();
  const secRef = useRef(null);
  const onScreen = useOnScreen(secRef);
  const [dragFab, setDragFab] = useState(null);
  const ghostRef = useRef(null);
  const seatBoxRef = useRef(null);
  const [overSeat, setOverSeat] = useState(false);
  const [scrub, setScrub] = useState(null);
  const [offers, setOffers] = useState([]);
  const liveRef = useRef(null);
  const type = typeById(g.typeId);

  // ---- fabric drag (with plain click as the keyboard path)
  const beginSwatchDrag = (fabric) => (e) => {
    if (e.button != null && e.button !== 0) return;
    let moved = false;
    const sx = e.clientX; const sy = e.clientY;
    setDragFab(fabric.id);
    startDrag(e, {
      move: (ev) => {
        if (Math.hypot(ev.clientX - sx, ev.clientY - sy) > 6) moved = true;
        const gh = ghostRef.current;
        if (gh) { gh.style.left = `${ev.clientX}px`; gh.style.top = `${ev.clientY}px`; }
        const box = seatBoxRef.current?.getBoundingClientRect();
        setOverSeat(!!box && ev.clientX > box.left && ev.clientX < box.right
          && ev.clientY > box.top && ev.clientY < box.bottom);
      },
      up: (ev) => {
        const box = seatBoxRef.current?.getBoundingClientRect();
        const inside = !!box && ev.clientX > box.left && ev.clientX < box.right
          && ev.clientY > box.top && ev.clientY < box.bottom;
        if (!moved || inside) patch({ fabricId: fabric.id });
        setDragFab(null); setOverSeat(false); setOffers([]);
      },
    });
  };

  // ---- gsm pull
  const gsmNorm = (g.gsm - type.gsmMin) / (type.gsmMax - type.gsmMin);
  const onGsmDown = (e) => {
    const track = e.currentTarget.getBoundingClientRect();
    const setFrom = (clientX) => {
      const t = clamp((clientX - track.left) / track.width, 0, 1);
      patch({ gsm: Math.round(type.gsmMin + t * (type.gsmMax - type.gsmMin)) });
    };
    setFrom(e.clientX);
    startDrag(e, { move: (ev) => setFrom(ev.clientX) });
  };
  const onGsmKey = (e) => {
    const step = e.shiftKey ? 40 : 10;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { patch({ gsm: clamp(g.gsm + step, type.gsmMin, type.gsmMax) }); e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { patch({ gsm: clamp(g.gsm - step, type.gsmMin, type.gsmMax) }); e.preventDefault(); }
  };

  // ---- counter scrub: drag the number, get offered routes to the target
  const onCounterDown = (e) => {
    const startTotal = fp.total;
    const startX = e.clientX;
    setScrub(startTotal);
    startDrag(e, {
      move: (ev) => {
        const t = clamp(startTotal + (ev.clientX - startX) * (startTotal / 220), startTotal * 0.15, startTotal * 1.6);
        setScrub(t);
        if (t < startTotal - 0.05) setOffers(counterOffers(g, fp, t));
      },
      up: () => setScrub(null),
    });
  };
  const askLess = () => {
    const t = fp.total * 0.7;
    setOffers(counterOffers(g, fp, t));
    if (liveRef.current) {
      liveRef.current.textContent = `Asked the counter for ${fmtKg(t)} kilograms. ${offers.length || 'Some'} routes offered below.`;
    }
  };

  const maxStream = Math.max(...fp.streams.map((s) => s.kg));
  const shownTotal = scrub ?? fp.total;

  return (
    <section className="fs-sec" id="m1" ref={secRef} aria-labelledby="m1-h">
      <div className="fs-sec-inner">
        <div className="fs-head">
          <p className="fs-idx" data-n={COPY.m1.idx}>{COPY.m1.sub}</p>
          <h2 className="fs-title" id="m1-h">{COPY.m1.title}</h2>
          <p className="fs-lede">{COPY.m1.lede}</p>
        </div>

        <div className="fs-m1-grid">
          {/* left: the making decisions */}
          <div>
            <p className="fs-panel-label">{COPY.m1.typeLabel}</p>
            <div className="fs-typerow" role="group" aria-label={COPY.m1.typeLabel}>
              {GARMENT_TYPES.map((t) => (
                <button
                  key={t.id} type="button" className="fs-chip"
                  aria-pressed={g.typeId === t.id}
                  data-cursor="pick"
                  onClick={() => patch({
                    typeId: t.id,
                    gsm: clamp(g.gsm, t.gsmMin, t.gsmMax) === g.gsm && g.typeId === t.id ? g.gsm : t.gsmDefault,
                    price: t.price, wears: Math.min(g.wears, t.wearsBase),
                  })}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <p className="fs-panel-label">{COPY.m1.fabricLabel}</p>
            <div className="fs-swatchbook">
              {FABRICS.map((f) => (
                <button
                  key={f.id} type="button"
                  className={`fs-swatch${g.fabricId === f.id ? ' applied' : ''}`}
                  data-cursor="drag"
                  onPointerDown={beginSwatchDrag(f)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); patch({ fabricId: f.id }); } }}
                  aria-pressed={g.fabricId === f.id}
                  aria-label={`${f.name}, ${f.kindLabel}. ${f.read}`}
                >
                  <SwatchCloth fabric={f} />
                  <span className="nm">{f.name}</span>
                  <span className="kind">{f.kindLabel}</span>
                </button>
              ))}
            </div>

            <div className="fs-gsm">
              <p className="fs-panel-label" id="gsm-label">{COPY.m1.weightLabel}</p>
              <div
                className="fs-gsm-track" data-cursor="pull"
                role="slider" tabIndex={0}
                aria-labelledby="gsm-label"
                aria-valuemin={type.gsmMin} aria-valuemax={type.gsmMax}
                aria-valuenow={g.gsm} aria-valuetext={`${g.gsm} grams per square metre`}
                onPointerDown={onGsmDown} onKeyDown={onGsmKey}
              >
                <div className="fs-gsm-fill" style={{ width: `${gsmNorm * 100}%` }} />
                <div className="fs-gsm-readout">
                  cloth weight
                  <b>{g.gsm} gsm</b>
                  {fmtInt(fp.garmentKg * 1000)} g on the hanger
                </div>
                <span className="fs-gsm-hint">pull the bolt</span>
              </div>
            </div>
          </div>

          {/* centre: the blank */}
          <div className="fs-m1-centre">
            <div ref={seatBoxRef}>
              <Seat id="m1" className="fs-m1-seat" />
            </div>
            <div className={`fs-m1-drop-hint${overSeat ? ' show' : ''}`} aria-hidden="true">
              <span>drop the cloth</span>
            </div>
            <OriginMap onScreenParent={onScreen} />
          </div>

          {/* right: the counter that watches */}
          <aside className="fs-counter" aria-label="Live footprint">
            <p className="fs-panel-label">CO2e, cradle to shop</p>
            <div
              className={`fs-counter-big${scrub ? ' scrubbing' : ''}`}
              data-cursor="scrub"
              onPointerDown={onCounterDown}
              role="img"
              aria-label={`${fmtKg(fp.total)} kilograms of carbon dioxide equivalent, indicative`}
            >
              {fmtKg(shownTotal)}
            </div>
            <p className="fs-counter-unit">kg CO2e, indicative</p>
            <p className="fs-counter-hint">{COPY.m1.counterHint}</p>
            <button type="button" className="fs-chip" onClick={askLess} data-cursor="ask">
              Ask for 30% less
            </button>
            <div className="fs-scrub-offers" aria-live="polite">
              {offers.map((o) => (
                <button
                  key={o.label} type="button" className="fs-offer" data-cursor="apply"
                  onClick={() => { patch(o.patch); setOffers([]); }}
                >
                  <span>{o.label}</span>
                  <span className="d">{o.delta.toFixed(1)} kg → {fmtKg(o.lands)}</span>
                </button>
              ))}
            </div>

            <div className="fs-streams">
              {fp.streams.map((s) => (
                <div className="fs-stream" key={s.id} style={{ color: s.colour }}>
                  <span className="swb" style={{ background: s.colour }} aria-hidden="true" />
                  <span style={{ color: 'var(--ink)' }}>{s.label}</span>
                  <span className="kg">{fmtKg(s.kg)} kg</span>
                  <span className="bar" aria-hidden="true"><i style={{ width: `${(s.kg / maxStream) * 100}%` }} /></span>
                </div>
              ))}
            </div>
            <p className="fs-water">
              {COPY.m1.waterLabel}: <b>{fmtInt(fp.water)} L</b>
              {(g.fabricId === 'cotton' || g.fabricId === 'orgcotton') && (
                <>
                  {' '}·{' '}
                  <button
                    type="button" className="fs-chip" style={{ padding: '0.2rem 0.5rem', fontSize: 9.5 }}
                    aria-pressed={g.irrigation === 'rainfed'}
                    onClick={() => patch({ irrigation: g.irrigation === 'rainfed' ? 'irrigated' : 'rainfed' })}
                  >
                    {g.irrigation === 'rainfed' ? 'rain fed' : 'irrigated'}
                  </button>
                </>
              )}
            </p>
            <p className="fs-note" style={{ marginTop: '1.1rem' }}>{COPY.m1.disclosure}</p>
            <div className="sr-only" aria-live="polite" ref={liveRef} />
          </aside>
        </div>
      </div>

      {dragFab && (
        <div ref={ghostRef} className="fs-drag-ghost" aria-hidden="true">
          <SwatchCloth fabric={fabricById(dragFab)} style={{ height: '100%', margin: 0 }} />
        </div>
      )}
    </section>
  );
}

// The shipping board: a dot-matrix world; drag the garment token onto a port.
function OriginMap({ onScreenParent }) {
  const { g, patch, rm } = useWorld();
  const cvRef = useRef(null);
  const size = useCanvas(cvRef);
  const wrapRef = useRef(null);
  const onScreen = useOnScreen(wrapRef);
  const [dragPos, setDragPos] = useState(null);
  const origin = originById(g.originId);

  const cellPct = (cell) => ({
    left: `${((cell[0] + 0.5) / WORLD_MASK[0].length) * 100}%`,
    top: `${((cell[1] + 0.5) / WORLD_MASK.length) * 100}%`,
  });

  useRaf((dt, t) => {
    const cv = cvRef.current; if (!cv) return;
    const { w, h, dpr } = size.current; if (!w) return;
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cols = WORLD_MASK[0].length; const rows = WORLD_MASK.length;
    const cw = w / cols; const ch = h / rows;
    ctx.fillStyle = 'rgba(216,205,178,0.34)';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (WORLD_MASK[r][c] === '#') {
          ctx.beginPath();
          ctx.arc((c + 0.5) * cw, (r + 0.5) * ch, Math.min(cw, ch) * 0.22, 0, TAU);
          ctx.fill();
        }
      }
    }
    // route: origin -> Melbourne, dashed, with a moving freight glyph
    const a = { x: (origin.cell[0] + 0.5) * cw, y: (origin.cell[1] + 0.5) * ch };
    const b = { x: (DEST.cell[0] + 0.5) * cw, y: (DEST.cell[1] + 0.5) * ch };
    const mid = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - h * 0.16 };
    ctx.strokeStyle = g.freight === 'air' ? '#C86A57' : '#A98E2C';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 5]);
    ctx.lineDashOffset = rm ? 0 : -t * 22;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(mid.x, mid.y, b.x, b.y);
    ctx.stroke();
    ctx.setLineDash([]);
    // glyph slides along the curve
    const tt = rm ? 0.5 : (t * 0.12) % 1;
    const qx = lerp(lerp(a.x, mid.x, tt), lerp(mid.x, b.x, tt), tt);
    const qy = lerp(lerp(a.y, mid.y, tt), lerp(mid.y, b.y, tt), tt);
    ctx.fillStyle = '#F4EFE2';
    ctx.beginPath();
    if (g.freight === 'air') {
      ctx.moveTo(qx, qy - 3.6); ctx.lineTo(qx + 8, qy); ctx.lineTo(qx, qy + 3.6);
      ctx.lineTo(qx + 2.6, qy);
    } else {
      ctx.rect(qx - 5, qy - 2.6, 11, 5.2);
    }
    ctx.fill();
  }, onScreen && onScreenParent);

  const dropOnHub = (clientX, clientY) => {
    const box = cvRef.current.getBoundingClientRect();
    let best = null; let bestD = 44;
    for (const o of ORIGINS) {
      const hx = box.left + ((o.cell[0] + 0.5) / WORLD_MASK[0].length) * box.width;
      const hy = box.top + ((o.cell[1] + 0.5) / WORLD_MASK.length) * box.height;
      const d = Math.hypot(clientX - hx, clientY - hy);
      if (d < bestD) { bestD = d; best = o; }
    }
    if (best) patch({ originId: best.id });
  };

  const tokenPos = dragPos || cellPct(origin.cell);

  return (
    <div ref={wrapRef} style={{ marginTop: '1.1rem' }}>
      <p className="fs-panel-label">{COPY.m1.originLabel}: {origin.name}</p>
      <div className="fs-map" data-cursor="drag">
        <canvas ref={cvRef} style={{ aspectRatio: '64 / 23' }} aria-hidden="true" />
        {ORIGINS.map((o) => (
          <button
            key={o.id} type="button"
            className={`fs-map-hub${g.originId === o.id ? ' on' : ''}`}
            style={cellPct(o.cell)}
            onClick={() => patch({ originId: o.id })}
            aria-pressed={g.originId === o.id}
            aria-label={`Make it in ${o.name}. ${o.note}`}
          >
            <span className="tag">{o.name}</span>
            <span className="pin" aria-hidden="true" />
          </button>
        ))}
        <div
          className="fs-map-hub" style={cellPct(DEST.cell)} aria-hidden="true"
          role="presentation"
        >
          <span className="tag" style={{ top: 'auto', bottom: -14 }}>{DEST.name}</span>
          <span className="pin" style={{ borderRadius: '50%', background: '#C86A57', borderColor: '#C86A57' }} />
        </div>
        <button
          type="button" className="fs-map-token" style={tokenPos}
          aria-label={`Garment token. Currently made in ${origin.name}. Drag onto a port, or use the port buttons.`}
          data-cursor="drag"
          onPointerDown={(e) => {
            const box = cvRef.current.getBoundingClientRect();
            startDrag(e, {
              move: (ev) => setDragPos({
                left: `${clamp(((ev.clientX - box.left) / box.width) * 100, 0, 100)}%`,
                top: `${clamp(((ev.clientY - box.top) / box.height) * 100, 0, 100)}%`,
              }),
              up: (ev) => { dropOnHub(ev.clientX, ev.clientY); setDragPos(null); },
            });
          }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            <path
              d="M8 5 L11 3 L13 4.4 L15 3 L18 5 L22 9 L19 11.6 L17.6 10.4 L17.6 22 L8.4 22 L8.4 10.4 L7 11.6 L4 9 Z"
              fill="#F4EFE2" stroke="#26231D" strokeWidth="1"
            />
          </svg>
        </button>
      </div>
      <p className="fs-origin-note">{origin.note}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MODULE 2 — The material lab. Fabrics are simulated materials: stretch them,
// pour water on them, rub them, bury them. Same torture, three rigs at once.
// ---------------------------------------------------------------------------
const LAB_TOOLS = ['stretch', 'pour', 'rub', 'bury'];

function freshRigSim() {
  return {
    stretch: 0, stretchRest: 0, frayed: false,
    pourLevel: 0, dark: 0, drops: [], puddle: 0,
    rubMg: 0, flakes: [], pile: 0,
    years: 0,
    auto: null, // {t0} timeline start when running the full protocol
  };
}

function Rig({ fabric, tool, autoStamp, onRemove, onUse, rm }) {
  const cvRef = useRef(null);
  const size = useCanvas(cvRef);
  const wrapRef = useRef(null);
  const onScreen = useOnScreen(wrapRef);
  const sim = useRef(freshRigSim()).current;
  const rng = useRef(mulberry32(fabric.id.length * 97 + 5)).current;
  const [read, setRead] = useState('');
  const [years, setYears] = useState(0);
  const [museum, setMuseum] = useState(false);
  const holdRef = useRef(false);

  // reset the rig when the pinned fabric or the instrument changes, so
  // switching to 'stretch' after a burial shows a fresh swatch, not soil
  useEffect(() => {
    Object.assign(sim, freshRigSim());
    setRead(fabric.read); setYears(0); setMuseum(false);
  }, [fabric.id, tool, sim, fabric.read]);

  // the shared protocol: every pinned rig runs the same timeline together
  useEffect(() => {
    if (!autoStamp) return;
    if (rm) {
      sim.stretchRest = fabric.stretch * (1 - fabric.recovery);
      sim.frayed = true; sim.pourLevel = 1; sim.dark = fabric.microMg > 100 ? 0 : 1;
      sim.puddle = fabric.microMg > 100 ? 1 : 0;
      sim.rubMg = fabric.microMg; sim.pile = 1; sim.years = 200; setYears(200);
      setMuseum(fabric.decayYr > 100);
      summarise('bury');
      return;
    }
    sim.auto = { t0: performance.now() / 1000 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStamp]);

  const summarise = (which) => {
    const w = which || tool;
    if (w === 'stretch') {
      setRead(`gave ${Math.round(fabric.stretch * 100)}% before fray · springs back ${Math.round(fabric.recovery * 100)}% · life x${fabric.wearsMod.toFixed(2)}`);
    } else if (w === 'pour') {
      const absorbed = fabric.microMg < 100;
      setRead(`${fmtInt(fabric.waterL)} ${COPY.m2.waterUnit} · ${absorbed ? 'drinks it in' : 'sheds it off the face'}`);
    } else if (w === 'rub') {
      setRead(`≈ ${fmtInt(fabric.microMg)} ${COPY.m2.shedUnit}${fabric.microMg < 20 ? ' · sheds little, and what sheds breaks down' : fabric.microMg > 100 ? ' · plastic lint, straight to the drain' : ''}`);
    } else {
      const gone = sim.years >= fabric.decayYr;
      setRead(`${Math.round(sim.years)} ${COPY.m2.buryUnit} · ${gone ? 'returned to soil' : fabric.decayYr > 100 ? COPY.m2.intact : 'breaking down'}`);
    }
  };

  useRaf((dt, t) => {
    const cv = cvRef.current; if (!cv) return;
    const { w, h, dpr } = size.current; if (!w) return;

    // drive the auto protocol
    if (sim.auto) {
      const at = t - sim.auto.t0;
      if (at < 1.4) {
        const k = at / 1.4;
        sim.stretch = fabric.stretch * 1.18 * (k < 0.7 ? k / 0.7 : 1 - (k - 0.7) / 0.3);
        if (k > 0.68) sim.frayed = true;
        if (k > 0.98) sim.stretchRest = fabric.stretch * (1 - fabric.recovery) * 0.4;
      } else if (at < 3.2) {
        holdRef.current = true; sim.stretch = sim.stretchRest;
      } else if (at < 4.8) {
        holdRef.current = false;
        sim.rubMg = Math.min(fabric.microMg, sim.rubMg + fabric.microMg * dt / 1.4);
        if (fabric.microMg > 20 && sim.flakes.length < 80 && rng() < 0.5) {
          sim.flakes.push({ x: w * (0.3 + rng() * 0.4), y: h * 0.3, vy: 12 + rng() * 30, vx: (rng() - 0.5) * 16 });
        }
      } else if (at < 8.2) {
        const yr = clamp(((at - 4.8) / 3.4) * 200, 0, 200);
        sim.years = yr; setYears(Math.round(yr));
        if (yr >= 199 && fabric.decayYr > 100) setMuseum(true);
      } else {
        sim.auto = null; summarise('bury');
      }
    }

    // pour physics while held
    if (holdRef.current) {
      sim.pourLevel = clamp(sim.pourLevel + dt / 1.6, 0, 1);
      if (sim.drops.length < 26) {
        sim.drops.push({ x: w * 0.5 + (rng() - 0.5) * w * 0.22, y: h * 0.07, vy: 40 + rng() * 60, vx: 0, dead: false });
      }
    }
    const absorbs = fabric.microMg < 100;
    const topY = h * 0.3;
    for (const d of sim.drops) {
      d.vy += 320 * dt; d.y += d.vy * dt; d.x += d.vx * dt;
      if (d.y > topY && d.y < topY + 8 && !d.dead) {
        if (absorbs) { d.dead = true; sim.dark = clamp(sim.dark + 0.05, 0, 1); }
        else { d.vy = -d.vy * 0.24; d.vx = (d.x > w / 2 ? 1 : -1) * (50 + rng() * 60); sim.puddle = clamp(sim.puddle + 0.04, 0, 1); }
      }
    }
    sim.drops = sim.drops.filter((d) => !d.dead && d.y < h + 10);
    for (const f of sim.flakes) { f.vy += 140 * dt; f.y += f.vy * dt; f.x += f.vx * dt; if (f.y > h * 0.9) { f.y = h * 0.9; f.vy = 0; f.vx = 0; } }

    // ------- draw
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const sw = w * 0.72; const sh = h * 0.44;
    const sx0 = (w - sw) / 2; const sy0 = topY;
    const stretch = rm ? sim.stretchRest : sim.stretch + sim.stretchRest;
    // synthetics barely pit even after two centuries; naturals go completely
    const rawDecay = clamp(sim.years / fabric.decayYr, 0, 1);
    const decay = fabric.decayYr > 100 ? rawDecay * 0.18 : rawDecay;

    // soil, if we are underground
    const buried = tool === 'bury' || sim.years > 0;
    if (buried && sim.years > 0) {
      ctx.fillStyle = '#3E3226';
      ctx.fillRect(0, sy0 - 12, w, h - sy0 + 12);
      ctx.fillStyle = 'rgba(232,223,201,0.12)';
      const soilRng = mulberry32(9);
      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.arc(soilRng() * w, sy0 - 12 + soilRng() * (h - sy0), soilRng() * 1.6 + 0.4, 0, TAU);
        ctx.fill();
      }
    }

    // the swatch as woven threads
    const stretchW = sw * (1 + stretch * 0.55);
    const thin = 1 - stretch * 0.5;
    ctx.save();
    ctx.globalAlpha = buried && decay >= 1 ? 0 : 1;
    ctx.fillStyle = fabric.base;
    ctx.fillRect(sx0, sy0, stretchW, sh);
    if (sim.dark > 0) {
      ctx.fillStyle = `rgba(51,72,122,${0.28 * sim.dark})`;
      ctx.fillRect(sx0, sy0, stretchW, sh * clamp(sim.dark + 0.15, 0, 1));
    }
    ctx.strokeStyle = `rgba(38,35,29,${0.4 * thin})`;
    ctx.lineWidth = 0.7;
    const step = fabric.weave === 'tight' ? 4 : 6;
    for (let x = sx0; x <= sx0 + stretchW; x += step * (1 + stretch * 0.55)) {
      ctx.beginPath();
      ctx.moveTo(x, sy0);
      ctx.lineTo(x + Math.sin(t * 2 + x) * (rm ? 0 : 1), sy0 + sh);
      ctx.stroke();
    }
    for (let y = sy0; y <= sy0 + sh; y += step) {
      ctx.beginPath();
      ctx.moveTo(sx0, y);
      ctx.lineTo(sx0 + stretchW, y + (sim.frayed ? Math.sin(y * 3.1) * 1.2 : 0));
      ctx.stroke();
    }
    // decay holes
    if (decay > 0 && decay < 1) {
      const holeRng = mulberry32(31);
      ctx.fillStyle = sim.years > 0 ? '#3E3226' : '#EDE7D6';
      const holes = Math.floor(decay * 130);
      for (let i = 0; i < holes; i++) {
        ctx.beginPath();
        ctx.arc(sx0 + holeRng() * stretchW, sy0 + holeRng() * sh, holeRng() * 7 * decay + 1, 0, TAU);
        ctx.fill();
      }
    }
    if (decay >= 1) {
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = 'rgba(232,223,201,0.5)';
      ctx.strokeRect(sx0, sy0, stretchW, sh);
      ctx.setLineDash([]);
    }
    ctx.restore();

    // fray curls past the limit (not once the cloth itself has gone)
    if ((sim.frayed || stretch > fabric.stretch) && decay < 0.5) {
      ctx.strokeStyle = '#A6503F';
      ctx.lineWidth = 1.1;
      const fr = mulberry32(17);
      for (let i = 0; i < 7; i++) {
        const fx = sx0 + stretchW * (0.15 + fr() * 0.7);
        const fy = sy0 + (fr() > 0.5 ? 0 : sh);
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo(fx + 4, fy + (fy > sy0 ? 7 : -7), fx + (fr() - 0.5) * 10, fy + (fy > sy0 ? 11 : -11));
        ctx.stroke();
      }
    }

    // droplets and shed water
    ctx.fillStyle = '#33487A';
    for (const d of sim.drops) {
      ctx.beginPath(); ctx.arc(d.x, d.y, 2, 0, TAU); ctx.fill();
    }
    if (sim.puddle > 0) {
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.9, sw * 0.42 * sim.puddle + 6, 4, 0, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // microfibre flakes and their sediment
    ctx.fillStyle = fabric.microMg > 100 ? '#8B8E96' : '#9A9078';
    for (const f of sim.flakes) {
      ctx.fillRect(f.x, f.y, 1.6, 1.6);
    }
    if (sim.rubMg > 0) {
      ctx.fillStyle = 'rgba(90,100,114,0.55)';
      const pileH = clamp((sim.rubMg / 260) * 8, 0.5, 8);
      ctx.fillRect(sx0, h * 0.9 + 4, stretchW, pileH);
    }

    // pour beaker hint
    if (tool === 'pour' && !sim.auto) {
      ctx.strokeStyle = 'rgba(38,35,29,0.5)';
      ctx.strokeRect(w * 0.44, h * 0.04, w * 0.12, h * 0.1);
    }
  }, onScreen);

  // pointer behaviour depends on the selected instrument
  const onDown = (e) => {
    if (tool === 'pour') {
      holdRef.current = true;
      startDrag(e, { up: () => { holdRef.current = false; summarise('pour'); } });
    } else if (tool === 'stretch') {
      const startX = e.clientX;
      startDrag(e, {
        move: (ev) => {
          sim.stretch = clamp((ev.clientX - startX) / 160, 0, 0.75);
          if (sim.stretch > fabric.stretch) sim.frayed = true;
        },
        up: () => {
          sim.stretchRest = sim.frayed ? fabric.stretch * (1 - fabric.recovery) * 0.5 : 0;
          sim.stretch = 0; summarise('stretch');
        },
      });
    } else if (tool === 'rub') {
      let lastX = e.clientX;
      startDrag(e, {
        move: (ev) => {
          const d = Math.abs(ev.clientX - lastX); lastX = ev.clientX;
          const gain = fabric.microMg > 100 ? 0.9 : fabric.microMg > 50 ? 0.4 : 0.06;
          sim.rubMg = clamp(sim.rubMg + d * gain, 0, fabric.microMg);
          if (fabric.microMg > 20 && sim.flakes.length < 90 && d > 2) {
            sim.flakes.push({ x: ev.clientX - cvRef.current.getBoundingClientRect().left, y: e.clientY - cvRef.current.getBoundingClientRect().top, vy: 6, vx: (Math.random() - 0.5) * 20 });
          }
        },
        up: () => summarise('rub'),
      });
    }
  };

  const cursorFor = { stretch: 'stretch', pour: 'pour', rub: 'rub', bury: 'scrub' }[tool];

  return (
    <div className="fs-rig" ref={wrapRef}>
      <div className="fs-rig-head">
        <span className="nm">{fabric.name}</span>
        <button type="button" onClick={onRemove} aria-label={`Unpin ${fabric.name}`}>unpin</button>
      </div>
      <canvas
        ref={cvRef} style={{ height: 210 }} data-cursor={cursorFor}
        onPointerDown={onDown}
        role="img"
        aria-label={`${fabric.name} test rig. ${read}`}
      />
      {museum && (
        <div className="fs-museum" role="note">
          <b>{COPY.m2.museum.tag}</b> {COPY.m2.museum.line}
        </div>
      )}
      {tool === 'bury' && (
        <div className="fs-year-scrub show">
          <input
            type="range" min="0" max="200" step="1" value={years}
            aria-label={`Years buried for ${fabric.name}`}
            onChange={(e) => {
              const yr = Number(e.target.value);
              sim.years = yr; setYears(yr); summarise('bury');
              if (yr >= 200 && fabric.decayYr > 100) setMuseum(true); else setMuseum(false);
            }}
          />
          <span className="yr">{years} yrs</span>
        </div>
      )}
      <p className="fs-rig-read" aria-live="polite"><b>{read}</b></p>
      <button type="button" className="fs-chip fs-rig-use" onClick={onUse} data-cursor="apply">
        {COPY.m2.useThis}
      </button>
    </div>
  );
}

function ModuleTwo() {
  const { patch, rm } = useWorld();
  const [pinned, setPinned] = useState(['cotton', 'poly', 'linen']);
  const [tool, setTool] = useState('stretch');
  const [autoStamp, setAutoStamp] = useState(0);

  const togglePin = (id) => {
    setPinned((p) => (p.includes(id) ? p.filter((x) => x !== id)
      : p.length >= 3 ? [...p.slice(1), id] : [...p, id]));
  };

  return (
    <section className="fs-sec fs-lab" id="m2" aria-labelledby="m2-h">
      <div className="fs-sec-inner">
        <div className="fs-head">
          <p className="fs-idx" data-n={COPY.m2.idx}>{COPY.m2.sub}</p>
          <h2 className="fs-title" id="m2-h">{COPY.m2.title}</h2>
          <p className="fs-lede">{COPY.m2.lede}</p>
        </div>

        <div className="fs-tools" role="group" aria-label="Instruments">
          {LAB_TOOLS.map((tl) => (
            <button
              key={tl} type="button" className="fs-chip"
              aria-pressed={tool === tl}
              onClick={() => setTool(tl)}
              data-cursor="pick"
            >
              {COPY.m2.tools[tl].name}
            </button>
          ))}
          <button
            type="button" className="fs-chip" style={{ marginLeft: 'auto', borderStyle: 'solid' }}
            onClick={() => setAutoStamp(Date.now())}
            data-cursor="run"
          >
            {COPY.m2.runAll}
          </button>
          <p className="fs-tool-hint">{COPY.m2.tools[tool].hint}.</p>
        </div>

        <div className="fs-rigs">
          {[0, 1, 2].map((slot) => {
            const id = pinned[slot];
            if (!id) {
              return <div className="fs-rig empty" key={`empty-${slot}`}>{COPY.m2.pinHint}</div>;
            }
            const fabric = fabricById(id);
            return (
              <Rig
                key={id} fabric={fabric} tool={tool} autoStamp={autoStamp} rm={rm}
                onRemove={() => togglePin(id)}
                onUse={() => patch({ fabricId: id })}
              />
            );
          })}
        </div>

        <div className="fs-shelf" role="group" aria-label="Fabric shelf">
          {FABRICS.map((f) => (
            <button
              key={f.id} type="button" className="fs-chip"
              aria-pressed={pinned.includes(f.id)}
              onClick={() => togglePin(f.id)}
              data-cursor="pin"
            >
              <span className="dotc" style={{ background: f.base }} aria-hidden="true" />
              {f.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MODULE 3 — The long road. Scroll is a scrubber that drives the garment
// from fibre to shop floor. The trail behind it is the footprint so far,
// deterministic in p so it runs clean in both directions. The dye house is
// deliberately the heaviest stretch of road.
// ---------------------------------------------------------------------------
const stageAt = (p) => {
  let acc = 0;
  for (let i = 0; i < STAGES.length; i++) {
    const wEnd = acc + STAGES[i].weight;
    if (p <= wEnd || i === STAGES.length - 1) {
      return { i, frac: clamp((p - acc) / STAGES[i].weight, 0, 1) };
    }
    acc = wEnd;
  }
  return { i: STAGES.length - 1, frac: 1 };
};

function drawLandmark(ctx, id, x, y, w, ink, t, opts) {
  ctx.save();
  ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1.4;
  if (id === 'fibre') {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        const px = x - w * 0.3 + c * w * 0.15 + r * 6;
        const py = y - 8 - r * 16;
        ctx.beginPath();
        ctx.moveTo(px, py); ctx.quadraticCurveTo(px - 5, py - 9, px - 7, py - 14);
        ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 1, py - 10, px, py - 16);
        ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 5, py - 9, px + 7, py - 14);
        ctx.stroke();
      }
    }
  } else if (id === 'spin') {
    ctx.beginPath(); ctx.arc(x, y - 34, 22, 0, TAU); ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const a = (t * (opts.rm ? 0 : 0.9)) + (i / 6) * TAU;
      ctx.beginPath(); ctx.moveTo(x, y - 34);
      ctx.lineTo(x + Math.cos(a) * 22, y - 34 + Math.sin(a) * 22); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(x + 22, y - 34); ctx.quadraticCurveTo(x + 60, y - 44, x + 95, y - 30); ctx.stroke();
  } else if (id === 'dye') {
    const vw2 = w * 0.42; const vh = 58;
    ctx.strokeRect(x - vw2, y - vh, vw2 * 2, vh);
    ctx.fillStyle = opts.dyeHex || '#33487A';
    ctx.beginPath();
    ctx.moveTo(x - vw2 + 3, y - vh * 0.55);
    for (let px = -vw2 + 3; px <= vw2 - 3; px += 6) {
      ctx.lineTo(x + px, y - vh * 0.55 + Math.sin(px * 0.24 + t * (opts.rm ? 0 : 3)) * 3);
    }
    ctx.lineTo(x + vw2 - 3, y - 3); ctx.lineTo(x - vw2 + 3, y - 3);
    ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - vw2 - 10, y); ctx.lineTo(x - vw2 - 10, y - vh - 26); ctx.stroke();
  } else if (id === 'make') {
    ctx.strokeRect(x - w * 0.28, y - 34, w * 0.56, 34);
    ctx.beginPath(); ctx.moveTo(x - w * 0.1, y - 34); ctx.lineTo(x - w * 0.1, y - 14); ctx.stroke();
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(x - w * 0.24, y - 10); ctx.lineTo(x + w * 0.24, y - 10); ctx.stroke();
    ctx.setLineDash([]);
  } else if (id === 'freight') {
    if (opts.air) {
      const bob = opts.rm ? 0 : Math.sin(t * 1.6) * 4;
      ctx.beginPath();
      ctx.moveTo(x - 26, y - 58 + bob); ctx.lineTo(x + 22, y - 64 + bob);
      ctx.lineTo(x + 30, y - 60 + bob); ctx.lineTo(x - 18, y - 52 + bob);
      ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - 4, y - 60 + bob); ctx.lineTo(x - 14, y - 44 + bob); ctx.lineTo(x - 2, y - 56 + bob);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(x - 34, y - 26); ctx.lineTo(x + 34, y - 26); ctx.lineTo(x + 24, y - 10); ctx.lineTo(x - 24, y - 10);
      ctx.closePath(); ctx.stroke();
      ctx.strokeRect(x - 18, y - 40, 14, 12); ctx.strokeRect(x - 2, y - 40, 14, 12);
    }
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const wy = y - 4 + i * 5;
      for (let px = -40; px <= 40; px += 10) {
        ctx.quadraticCurveTo(x + px + 3, wy - 3, x + px + 6, wy);
      }
      ctx.stroke();
    }
  } else if (id === 'retail') {
    ctx.beginPath(); ctx.moveTo(x - w * 0.3, y); ctx.lineTo(x - w * 0.3, y - 52);
    ctx.lineTo(x + w * 0.3, y - 52); ctx.lineTo(x + w * 0.3, y); ctx.stroke();
    for (let i = -1; i <= 1; i++) {
      const hx = x + i * w * 0.16;
      ctx.beginPath(); ctx.moveTo(hx, y - 52); ctx.lineTo(hx, y - 44);
      ctx.arc(hx, y - 40, 4, -Math.PI / 2, Math.PI / 2, i % 2 === 0);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function ModuleThree() {
  const { g, patch, fp, rm, world, stateRef } = useWorld();
  const wrapRef = useRef(null);
  const stickyRef = useRef(null);
  const cvRef = useRef(null);
  const size = useCanvas(cvRef);
  const onScreen = useOnScreen(wrapRef, '0px');
  const [stageI, setStageI] = useState(0);
  const [inVat, setInVat] = useState(false);
  const [rmP, setRmP] = useState(0);
  const totalRef = useRef(null);
  const progRef = useRef(null);
  const smooth = useRef({ x: -1, y: 0 }).current;
  const steam = useRef([]).current;
  const rng = useRef(mulberry32(77)).current;

  const isCottonish = g.fabricId === 'cotton' || g.fabricId === 'orgcotton' || g.fabricId === 'blend';

  useRaf((dt, t) => {
    const cv = cvRef.current; const wrap = wrapRef.current;
    if (!cv || !wrap) return;
    const { w, h, dpr } = size.current; if (!w) return;
    const { fp: fpNow, g: gNow } = stateRef.current;

    // progress from scroll (or from the stepper in reduced motion)
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    let p = rm ? rmP : clamp(-rect.top / (rect.height - vh), 0, 1);
    const engaged = rect.top < vh * 0.5 && rect.bottom > vh * 0.5;

    const { i: si, frac } = stageAt(p);
    if (si !== stageI) setStageI(si);

    // cumulative kg at p
    let cum = 0;
    for (let k = 0; k < si; k++) cum += fpNow.road[k].kg;
    cum += fpNow.road[si].kg * frac;
    if (totalRef.current) totalRef.current.textContent = fmtKg(cum);
    if (progRef.current) progRef.current.style.transform = `scaleX(${p})`;

    // world geometry: landmarks along a long road, camera pinned to garment
    const total = w * 5.4;
    let acc = 0;
    const marks = STAGES.map((s) => {
      const cx = (acc + s.weight / 2) * total; acc += s.weight;
      return cx;
    });
    const worldX = p * total;
    const camTarget = worldX - w * 0.44;
    const inDye = si === 2;
    if (si !== 2 && inVat) setInVat(false);
    if (si === 2 && frac > 0.12 && frac < 0.94 && !inVat) setInVat(true);
    if (si === 2 && (frac <= 0.12 || frac >= 0.94) && inVat) setInVat(false);

    // viscous drag through the vat: the camera follows slower, on purpose
    const lam = rm ? 1000 : inDye ? 3.2 : 13;
    if (smooth.x < 0) smooth.x = camTarget;
    smooth.x = damp(smooth.x, camTarget, lam, dt);
    const camX = smooth.x;
    const groundY = (x) => h * 0.66 + Math.sin(x * 0.0021) * 16;

    // dye progress becomes garment colour for the rest of the experience
    if (si > 2 || (si === 2 && frac > 0.4)) {
      world.dyeProgress = si > 2 ? 1 : clamp((frac - 0.4) / 0.45, 0, 1);
    } else if (si <= 1) {
      world.dyeProgress = 0;
    }

    // possess the garment while the road owns the viewport
    if (engaged) {
      const gy = groundY(worldX) - 52;
      const dip = inDye && frac > 0.3 && frac < 0.8 ? 46 : 0;
      world.override = {
        mode: 'road',
        x: worldX - camX,
        y: gy + dip - 60,
        s: 130,
      };
    } else if (world.override && world.override.mode === 'road') {
      world.override = null;
    }

    // ------------------ draw
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const dark = inVat;
    const ink = dark ? 'rgba(216,205,178,0.85)' : 'rgba(38,35,29,0.8)';

    // ground line
    ctx.strokeStyle = dark ? 'rgba(216,205,178,0.4)' : 'rgba(38,35,29,0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let x = -20; x <= w + 20; x += 14) {
      const wx = x + camX;
      const y = groundY(wx);
      if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // landmarks
    STAGES.forEach((s, idx) => {
      const sx = marks[idx] - camX;
      if (sx < -300 || sx > w + 300) return;
      drawLandmark(ctx, s.id, sx, groundY(marks[idx]), 190, ink, t, {
        rm, air: gNow.freight === 'air', dyeHex: dyeById(gNow.dyeId).hex || '#5A6472',
      });
      ctx.fillStyle = dark ? 'rgba(216,205,178,0.6)' : 'rgba(38,35,29,0.55)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(s.name.toUpperCase(), sx, groundY(marks[idx]) + 22);
    });

    // the trail: footprint deposited behind the garment, deterministic in p
    const trailRng = mulberry32(5);
    const maxRate = Math.max(...fpNow.road.map((r0) => r0.kg / (STAGES.find((s) => s.id === r0.id || true) ? 1 : 1)));
    for (let x = 0; x <= worldX; x += 16) {
      const sxx = x - camX;
      if (sxx < -40 || sxx > w + 40) { trailRng(); trailRng(); continue; }
      const st = stageAt(x / total);
      const r0 = fpNow.road[st.i];
      const rate = r0.kg / (STAGES[st.i].weight * total);
      const density = clamp(rate * 5200, 0.25, 7);
      const gy = groundY(x) - 40;
      ctx.fillStyle = r0.colour;
      const n = Math.floor(density) + ((trailRng() < density % 1) ? 1 : 0);
      for (let k = 0; k < n; k++) {
        const jx = (trailRng() - 0.5) * 14;
        const jy = (trailRng() - 0.5) * (14 + density * 7);
        const wob = rm ? 0 : Math.sin(t * 1.4 + x * 0.11 + k) * 2.4;
        ctx.globalAlpha = 0.66;
        ctx.beginPath();
        ctx.arc(sxx + jx, gy + jy + wob - density * 2.4, 1.5 + (density > 3 ? 1.1 : 0), 0, TAU);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // steam in the vat
    if (inVat && !rm) {
      if (steam.length < 46) {
        steam.push({ x: w * 0.44 + (rng() - 0.5) * 120, y: h * 0.6, vy: -(16 + rng() * 26), a: 0.5, r: 2 + rng() * 5 });
      }
      for (const sm of steam) { sm.y += sm.vy * dt; sm.a -= dt * 0.16; sm.r += dt * 5; }
      for (let k = steam.length - 1; k >= 0; k--) if (steam[k].a <= 0) steam.splice(k, 1);
      ctx.fillStyle = '#D8CDB2';
      for (const sm of steam) {
        ctx.globalAlpha = clamp(sm.a, 0, 0.5);
        ctx.beginPath(); ctx.arc(sm.x, sm.y, sm.r, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else if (!inVat) {
      steam.length = 0;
    }
  }, onScreen);

  // release possession if we unmount or leave
  useEffect(() => () => {
    if (world.override && world.override.mode === 'road') world.override = null;
  }, [world]);

  const stage = STAGES[stageI];
  const rmStep = (d) => {
    const targets = [];
    let acc = 0;
    for (const s of STAGES) { targets.push(acc + s.weight / 2); acc += s.weight; }
    const next = clamp(stageI + d, 0, STAGES.length - 1);
    setRmP(targets[next]);
  };

  return (
    <div className="fs-road-wrap" ref={wrapRef} id="m3" style={{ height: rm ? 'auto' : '640vh' }}>
      <div className={`fs-road-sticky${inVat ? ' in-vat' : ''}`} ref={stickyRef} style={rm ? { position: 'relative', height: '100svh' } : undefined}>
        <div className="fs-road-progress" aria-hidden="true"><i ref={progRef} style={{ transform: 'scaleX(0)' }} /></div>
        <canvas ref={cvRef} className="fs-road-canvas" aria-hidden="true" />
        <div className="fs-road-head">
          <p className="fs-idx" data-n={COPY.m3.idx}>{COPY.m3.sub}</p>
          <h2 className="fs-title" style={{ fontSize: 'clamp(1.6rem,3.4vw,2.6rem)' }}>{COPY.m3.title}</h2>
        </div>

        <div className="fs-road-hud">
          <p className="fs-road-stage">{COPY.m3.stageLabel} <b>{stageI + 1} / 6</b></p>
          <p className="fs-road-stagename">{stage.name}</p>
          <p className="fs-road-copy">{stage.hud}</p>

          <div className="fs-road-controls">
            {stageI === 0 && isCottonish && (
              <button
                type="button" className={`fs-switch${g.irrigation === 'rainfed' ? ' on' : ''}`}
                onClick={() => patch({ irrigation: g.irrigation === 'rainfed' ? 'irrigated' : 'rainfed' })}
                data-cursor="flip"
              >
                <span className="st" aria-hidden="true" />
                {g.irrigation === 'rainfed' ? COPY.m3.interventions.rainfed : COPY.m3.interventions.irrigated}
              </button>
            )}
            {stageI === 2 && (
              <>
                <button
                  type="button" className={`fs-switch${g.dyeEnergy === 'clean' ? ' on' : ''}`}
                  onClick={() => patch({ dyeEnergy: g.dyeEnergy === 'clean' ? 'grid' : 'clean' })}
                  data-cursor="flip"
                >
                  <span className="st" aria-hidden="true" />
                  {g.dyeEnergy === 'clean' ? COPY.m3.interventions.cleanDye : COPY.m3.interventions.gridDye}
                </button>
                <button
                  type="button" className={`fs-switch${g.dyeId === 'undyed' ? ' on' : ''}`}
                  onClick={() => patch({ dyeId: g.dyeId === 'undyed' ? 'indigo' : 'undyed' })}
                  data-cursor="flip"
                >
                  <span className="st" aria-hidden="true" />
                  {g.dyeId === 'undyed' ? COPY.m3.interventions.undyed : COPY.m3.interventions.dyed}
                </button>
                <div className="fs-vats" role="group" aria-label={COPY.m3.vatLabel}>
                  {DYES.map((d) => (
                    <button
                      key={d.id} type="button"
                      className={`fs-vat${g.dyeId === d.id ? ' on' : ''}${d.hex ? '' : ' undyed-sw'}`}
                      style={d.hex ? { background: d.hex } : undefined}
                      onClick={() => patch({ dyeId: d.id })}
                      aria-pressed={g.dyeId === d.id}
                      aria-label={d.name}
                      data-cursor="dip"
                    />
                  ))}
                </div>
                <p className="fs-road-note">{COPY.m3.dyeNote}</p>
              </>
            )}
            {stageI === 4 && (
              <button
                type="button" className={`fs-switch${g.freight === 'air' ? ' on' : ''}`}
                onClick={() => patch({ freight: g.freight === 'air' ? 'sea' : 'air' })}
                data-cursor="flip"
              >
                <span className="st" aria-hidden="true" />
                {g.freight === 'air' ? COPY.m3.interventions.air : COPY.m3.interventions.sea}
              </button>
            )}
          </div>

          {rm && (
            <div className="fs-road-stepper show">
              <button type="button" className="fs-chip" onClick={() => rmStep(-1)}>Previous stage</button>
              <button type="button" className="fs-chip" onClick={() => rmStep(1)}>Next stage</button>
              <input
                type="range" min="0" max="1000" value={Math.round(rmP * 1000)}
                aria-label="Journey position"
                onChange={(e) => setRmP(Number(e.target.value) / 1000)}
              />
            </div>
          )}
          {rm && <p className="fs-note" style={{ marginTop: '0.6rem' }}>{COPY.m3.reducedHint}</p>}
        </div>

        <div className="fs-road-total">
          <b><span ref={totalRef}>0</span> kg</b>
          <span className="unit">CO2e {COPY.m3.cumulative}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MODULE 4 — The loop. Drag the worn garment toward a fate; the loop closes,
// jams, or snaps depending on how it was designed. Score is a by-product.
// ---------------------------------------------------------------------------
const FATE_ANGLES = { resale: -90, repair: -26, takeback: 38, recycle: 154, landfill: 90 };

function fateOutcome(g, fp, brand) {
  const fab = fabricById(g.fabricId);
  const loop = loopStateOf(g);
  return {
    resale: fp.wearsCap >= 120
      ? { ok: true, read: COPY.m4.fateReads.resaleGood }
      : { ok: false, read: COPY.m4.fateReads.resalePoor },
    repair: g.mods.includes('spares')
      ? { ok: true, read: COPY.m4.fateReads.repairSpares }
      : { ok: true, read: COPY.m4.fateReads.repair },
    takeback: brand && brand.takeBack
      ? { ok: true, read: COPY.m4.fateReads.takebackYes }
      : { ok: false, read: COPY.m4.fateReads.takebackNo },
    recycle: loop === 'mono'
      ? { ok: true, read: COPY.m4.fateReads.recycleMono }
      : loop === 'hard'
        ? { ok: true, half: true, read: COPY.m4.fateReads.recycleHard }
        : { ok: false, jam: true, read: COPY.m4.fateReads.recycleJam },
    landfill: fab.decayYr > 100
      ? { ok: false, sink: true, read: COPY.m4.fateReads.landfillPoly }
      : { ok: false, sink: true, read: COPY.m4.fateReads.landfillNatural },
  };
}

function ModuleFour() {
  const { g, patch, fp, circ, brand, rm, world } = useWorld();
  const stageRef = useRef(null);
  const cvRef = useRef(null);
  const size = useCanvas(cvRef);
  const onScreen = useOnScreen(stageRef);
  const [armed, setArmed] = useState(null);
  const [read, setRead] = useState('');
  const [played, setPlayed] = useState({});
  const play = useRef(null); // {fate, t0, res}
  const dragging = useRef(false);

  const outcomes = useMemo(() => fateOutcome(g, fp, brand), [g, fp, brand]);

  // the garment reads as worn while this module holds the viewport
  useEffect(() => { world.wornTarget = onScreen ? 0.85 : 0; }, [onScreen, world]);

  const runFate = useCallback((fateId) => {
    const res = outcomes[fateId];
    play.current = { fate: fateId, t0: performance.now() / 1000, res };
    setRead(res.read);
    setPlayed((p) => ({ ...p, [fateId]: res.ok }));
  }, [outcomes]);

  const fatePos = (fateId, box) => {
    const a = (FATE_ANGLES[fateId] * Math.PI) / 180;
    return {
      x: box.width * 0.5 + Math.cos(a) * box.width * 0.395,
      y: box.height * 0.52 + Math.sin(a) * box.height * 0.4,
    };
  };

  useRaf((dt, t) => {
    const cv = cvRef.current; if (!cv) return;
    const { w, h, dpr } = size.current; if (!w) return;
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const cx = w * 0.5; const cy = h * 0.52;
    const R = Math.min(w, h) * 0.34;

    // base loop: dashed until proven
    ctx.strokeStyle = 'rgba(38,35,29,0.3)';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 6]);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
    ctx.setLineDash([]);

    // spokes to fates
    for (const f of FATES) {
      const a = (FATE_ANGLES[f.id] * Math.PI) / 180;
      ctx.strokeStyle = played[f.id] === true ? 'rgba(51,72,122,0.5)'
        : played[f.id] === false ? 'rgba(166,80,63,0.45)' : 'rgba(38,35,29,0.16)';
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * R * 0.42, cy + Math.sin(a) * R * 0.42);
      ctx.lineTo(cx + Math.cos(a) * R * 1.02, cy + Math.sin(a) * R * 1.02);
      ctx.stroke();
    }

    // active fate animation
    const pl = play.current;
    if (pl) {
      const el = (t - pl.t0) / (rm ? 0.01 : 1.7);
      const k = clamp(el, 0, 1);
      const a0 = (FATE_ANGLES[pl.fate] * Math.PI) / 180;
      if (pl.res.sink) {
        // landfill: strata swallow the garment
        const sinkY = cy + R * 0.55;
        ctx.strokeStyle = '#5C4633';
        for (let i = 0; i < 5; i++) {
          ctx.globalAlpha = 0.5 - i * 0.07;
          ctx.lineWidth = 2 + i * 1.5;
          ctx.beginPath();
          ctx.moveTo(cx - R * 0.9, sinkY + 16 + i * 13);
          ctx.lineTo(cx + R * 0.9, sinkY + 16 + i * 13);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        if (!dragging.current) {
          world.override = k < 1 ? {
            mode: 'loop', x: (cv.getBoundingClientRect().left + cx),
            y: cv.getBoundingClientRect().top + cy + R * 0.62 * (k < 0.5 ? k * 2 : 1) * 0.9,
            s: 120 * (1 - k * 0.25),
          } : null;
          if (k >= 1) play.current = null;
        }
      } else {
        // loop attempt: a pulse sweeps the ring from the fate around
        const jamAt = pl.res.jam ? 0.62 : 1;
        const sweep = clamp(k * 1.15, 0, jamAt);
        ctx.strokeStyle = pl.res.ok ? '#33487A' : '#A6503F';
        ctx.lineWidth = 3;
        if (pl.res.half) ctx.setLineDash([7, 7]);
        ctx.beginPath();
        ctx.arc(cx, cy, R, a0, a0 + sweep * TAU);
        ctx.stroke();
        ctx.setLineDash([]);
        if (pl.res.jam && k > 0.56) {
          // the shredder jams: crack marks and a snapped end
          const ja = a0 + jamAt * TAU;
          const jx = cx + Math.cos(ja) * R; const jy = cy + Math.sin(ja) * R;
          const shake = rm ? 0 : Math.sin(t * 40) * 2 * clamp(1 - (k - 0.56) * 3, 0, 1);
          ctx.strokeStyle = '#A6503F';
          ctx.lineWidth = 2;
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(jx + shake, jy);
            ctx.lineTo(jx + shake + Math.cos(ja + i - 1.5) * (10 + i * 4), jy + Math.sin(ja + i - 1.5) * (10 + i * 4));
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(cx, cy, R, ja + 0.12, ja + 0.3);
          ctx.stroke();
        }
        if (pl.res.ok && !pl.res.half && k >= 0.99) {
          ctx.strokeStyle = 'rgba(51,72,122,0.35)';
          ctx.lineWidth = 7;
          ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
        }
        if (k >= 1.15 || (k >= 1 && !pl.res.jam)) { /* keep painted until next */ }
        if (el > 1.6) play.current = null;
      }
    }
  }, onScreen);

  // drag the garment itself toward a fate
  const onGarmentDown = (e) => {
    const stage = stageRef.current.getBoundingClientRect();
    dragging.current = true;
    startDrag(e, {
      move: (ev) => {
        world.override = {
          mode: 'loop',
          x: clamp(ev.clientX, stage.left + 20, stage.right - 20),
          y: clamp(ev.clientY, stage.top + 20, stage.bottom - 20),
          s: 130,
        };
        let best = null; let bestD = 110;
        for (const f of FATES) {
          const p = fatePos(f.id, stage);
          const d = Math.hypot(ev.clientX - (stage.left + p.x), ev.clientY - (stage.top + p.y));
          if (d < bestD) { bestD = d; best = f.id; }
        }
        setArmed(best);
      },
      up: () => {
        dragging.current = false;
        world.override = null;
        if (armedRef.current) runFate(armedRef.current);
        setArmed(null);
      },
    });
  };
  const armedRef = useRef(null);
  useEffect(() => { armedRef.current = armed; }, [armed]);

  const dialC = 2 * Math.PI * 80;

  return (
    <section className="fs-sec" id="m4" aria-labelledby="m4-h">
      <div className="fs-sec-inner">
        <div className="fs-head">
          <p className="fs-idx" data-n={COPY.m4.idx}>{COPY.m4.sub}</p>
          <h2 className="fs-title" id="m4-h">{COPY.m4.title}</h2>
          <p className="fs-lede">{COPY.m4.lede}</p>
        </div>

        <div className="fs-loop-grid">
          <div className="fs-loop-stage" ref={stageRef}>
            <canvas ref={cvRef} aria-hidden="true" />
            <Seat id="m4" style={{ position: 'absolute', inset: '28% 30%', pointerEvents: 'none' }} />
            <div
              style={{ position: 'absolute', left: '38%', top: '34%', width: '24%', height: '36%', touchAction: 'none' }}
              data-cursor="drag"
              onPointerDown={onGarmentDown}
              role="presentation"
            />
            {FATES.map((f) => {
              const a = (FATE_ANGLES[f.id] * Math.PI) / 180;
              return (
                <button
                  key={f.id} type="button"
                  className={`fs-fate${armed === f.id ? ' armed' : ''}${played[f.id] != null ? ' hit' : ''}`}
                  style={{
                    left: `${50 + Math.cos(a) * 39.5}%`,
                    top: `${52 + Math.sin(a) * 40}%`,
                  }}
                  onClick={() => runFate(f.id)}
                  data-cursor="send"
                >
                  {f.name}
                </button>
              );
            })}
            <p className="fs-loop-read" aria-live="polite" style={{ position: 'absolute', left: 0, bottom: -8 }}>
              {read}
            </p>
          </div>

          <aside className="fs-score">
            <p className="fs-panel-label">{COPY.m4.scoreLabel}</p>
            <div className="fs-score-dial">
              <svg width="190" height="190" viewBox="0 0 190 190" aria-hidden="true">
                <circle cx="95" cy="95" r="80" fill="none" stroke="var(--line-soft)" strokeWidth="8" />
                <circle
                  cx="95" cy="95" r="80" fill="none" stroke="var(--indigo)" strokeWidth="8"
                  strokeDasharray={dialC}
                  strokeDashoffset={dialC * (1 - circ / 100)}
                  transform="rotate(-90 95 95)"
                  style={{ transition: 'stroke-dashoffset 0.7s var(--ease-out)' }}
                />
              </svg>
              <div className="fs-score-num" role="img" aria-label={`Circularity score ${circ} out of 100`}>
                {circ}
                <small>of 100</small>
              </div>
            </div>

            <p className="fs-panel-label" style={{ marginTop: '1.4rem' }}>{COPY.m4.modsLabel}</p>
            <div className="fs-mods">
              {LOOP_MODS.map((m) => {
                const on = g.mods.includes(m.id);
                return (
                  <button
                    key={m.id} type="button"
                    className={`fs-mod${on ? ' applied' : ''}`}
                    aria-pressed={on}
                    data-cursor="sew"
                    onClick={() => patch({ mods: on ? g.mods.filter((x) => x !== m.id) : [...g.mods, m.id] })}
                  >
                    <span className="nm">{m.name}{on && <span className="st8">SEWN IN</span>}</span>
                    <span className="bl">{m.blurb}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MODULE 5 — The field. Brands are bodies in a space that reorganises around
// whichever metric you choose. Grab one, drop it on another: head to head.
// Drop it on the garment dock: it becomes the maker.
// ---------------------------------------------------------------------------
function ModuleFive() {
  const { g, patch, rm } = useWorld();
  const arenaRef = useRef(null);
  const onScreen = useOnScreen(arenaRef);
  const [metric, setMetric] = useState('climate');
  const [pair, setPair] = useState(null); // [idA, idB]
  const [selected, setSelected] = useState(null);
  const [dockHot, setDockHot] = useState(false);
  const dockRef = useRef(null);
  const nodes = useRef(null);
  const metricRef = useRef(metric); metricRef.current = metric;

  if (!nodes.current) {
    nodes.current = BRANDS.map((b, i) => ({
      id: b.id, b, x: 40 + (i % 4) * 180, y: 40 + i * 24, vx: 0, vy: 0,
      el: null, grab: null, w: b.name.length * 7.4 + 26, h: 46,
    }));
  }

  useRaf((dt) => {
    const arena = arenaRef.current; if (!arena) return;
    const W = arena.clientWidth; const H = arena.clientHeight;
    const ns = nodes.current;
    const m = metricRef.current;
    for (const n of ns) {
      if (n.grab) {
        n.x = damp(n.x, n.grab.x, 30, dt);
        n.y = damp(n.y, n.grab.y, 30, dt);
        n.vx = 0; n.vy = 0;
        continue;
      }
      const tx = 16 + (n.b[m] / 100) * (W - n.w - 40);
      const ty = H * 0.14 + ((n.b.labour + n.b.disclosure * 2) % 67) / 67 * H * 0.6;
      n.vx += (tx - n.x) * (rm ? 400 : 26) * dt;
      n.vy += (ty - n.y) * (rm ? 400 : 15) * dt;
      n.vx *= Math.exp(-6.5 * dt); n.vy *= Math.exp(-6 * dt);
    }
    // pairwise separation, y-biased so lanes stay readable
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const a = ns[i]; const b = ns[j];
        const dx = (b.x + b.w / 2) - (a.x + a.w / 2);
        const dy = (b.y + b.h / 2) - (a.y + a.h / 2);
        const ox = (a.w + b.w) / 2 + 8 - Math.abs(dx);
        const oy = (a.h + b.h) / 2 + 6 - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          const push = Math.min(ox, oy) * 5.4;
          const sy = dy >= 0 ? 1 : -1; const sx = dx >= 0 ? 1 : -1;
          if (oy < ox) {
            if (!a.grab) a.vy -= sy * push; if (!b.grab) b.vy += sy * push;
          } else {
            if (!a.grab) a.vx -= sx * push * 0.6; if (!b.grab) b.vx += sx * push * 0.6;
          }
        }
      }
    }
    for (const n of ns) {
      if (!n.grab) {
        n.x += n.vx * dt; n.y += n.vy * dt;
        if (rm) { n.vx = 0; n.vy = 0; }
      }
      n.x = clamp(n.x, 4, W - n.w - 4);
      n.y = clamp(n.y, 4, H - n.h - 4);
      if (n.el) n.el.style.transform = `translate(${n.x}px, ${n.y}px)`;
    }
  }, onScreen);

  const beginGrab = (n) => (e) => {
    const arena = arenaRef.current.getBoundingClientRect();
    const startX = e.clientX; const startY = e.clientY;
    let moved = false;
    n.grab = { x: n.x, y: n.y };
    n.el.classList.add('drag');
    startDrag(e, {
      move: (ev) => {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 5) moved = true;
        n.grab = {
          x: clamp(ev.clientX - arena.left - n.w / 2, 0, arena.width - n.w),
          y: clamp(ev.clientY - arena.top - n.h / 2, 0, arena.height - n.h),
        };
        const dock = dockRef.current?.getBoundingClientRect();
        setDockHot(!!dock && ev.clientX > dock.left && ev.clientX < dock.right
          && ev.clientY > dock.top && ev.clientY < dock.bottom);
      },
      up: (ev) => {
        n.el.classList.remove('drag');
        n.grab = null;
        const dock = dockRef.current?.getBoundingClientRect();
        const overDock = !!dock && ev.clientX > dock.left && ev.clientX < dock.right
          && ev.clientY > dock.top && ev.clientY < dock.bottom;
        setDockHot(false);
        if (moved && overDock) { patch({ brandId: n.id }); return; }
        if (moved) {
          // dropped on a sibling? head to head.
          for (const o of nodes.current) {
            if (o.id === n.id) continue;
            const ox = o.x + arena.left; const oy = o.y + arena.top;
            if (ev.clientX > ox - 8 && ev.clientX < ox + o.w + 8
              && ev.clientY > oy - 8 && ev.clientY < oy + o.h + 8) {
              setPair([n.id, o.id]);
              return;
            }
          }
        } else {
          // click: select then compare, which is also the keyboard path
          setSelected((sel) => {
            if (!sel) return n.id;
            if (sel !== n.id) { setPair([sel, n.id]); return null; }
            return null;
          });
        }
      },
    });
  };

  const pairData = pair && pair.map((id) => BRANDS.find((b) => b.id === id));
  const cmpRead = pairData && (() => {
    const [a, b] = pairData;
    const wins = BRAND_METRICS.filter((mm) => a[mm.id] > b[mm.id]).map((mm) => mm.name.toLowerCase());
    const lead = wins.length === 0 ? `${b.name} leads on every measure here`
      : wins.length === BRAND_METRICS.length ? `${a.name} leads on every measure here`
        : `${a.name} leads on ${wins.join(' and ')}; ${b.name} takes the rest`;
    return `${lead}. ${a.read} ${b.read}`;
  })();

  return (
    <section className="fs-sec fs-field" id="m5" aria-labelledby="m5-h">
      <div className="fs-sec-inner">
        <div className="fs-head">
          <p className="fs-idx" data-n={COPY.m5.idx}>{COPY.m5.sub}</p>
          <h2 className="fs-title" id="m5-h">{COPY.m5.title}</h2>
          <p className="fs-lede">{COPY.m5.lede}</p>
        </div>

        <div className="fs-metric-tabs" role="group" aria-label="Sort the field by">
          {BRAND_METRICS.map((m) => (
            <button
              key={m.id} type="button" className="fs-chip"
              aria-pressed={metric === m.id}
              onClick={() => setMetric(m.id)}
              data-cursor="sort"
            >
              {m.name}
            </button>
          ))}
        </div>

        <div className="fs-arena" ref={arenaRef} data-cursor="grab">
          <div ref={dockRef} className={`fs-garment-dock${dockHot ? ' hot' : ''}`}>
            <span>{COPY.m5.assignHint}</span>
            <Seat id="m5" style={{ position: 'absolute', inset: '0 0 22px 0', pointerEvents: 'none' }} />
          </div>
          {BRANDS.map((b) => {
            const n = nodes.current.find((x) => x.id === b.id);
            return (
              <button
                key={b.id} type="button"
                ref={(el) => { n.el = el; }}
                className={`fs-brandtag${g.brandId === b.id ? ' assigned' : ''}`}
                style={{ borderLeftColor: selected === b.id ? 'var(--weld)' : undefined }}
                onPointerDown={beginGrab(n)}
                aria-pressed={selected === b.id}
                aria-label={`${b.name}, ${b.archetype}. ${metric} score ${b[metric]} of 100. ${selected && selected !== b.id ? 'Activate to compare with the selected brand.' : 'Activate to select for a head to head.'}`}
              >
                <span className="nm">{b.name}</span>
                <span className="sc">{b[metric]}</span>
              </button>
            );
          })}
          <div className="fs-arena-axis" aria-hidden="true">
            <span>0 · {BRAND_METRICS.find((m) => m.id === metric).name}</span>
            <span>100</span>
          </div>
        </div>

        {pairData && (
          <div className="fs-compare" role="region" aria-label={COPY.m5.compare}>
            {pairData.map((b) => (
              <div key={b.id}>
                <h3>{b.name}</h3>
                <p className="arch">{b.archetype}</p>
                {BRAND_METRICS.map((m) => (
                  <div className="fs-cmp-row" key={m.id}>
                    <span className="lbl"><span>{m.name}</span><span>{b[m.id]}</span></span>
                    <span className="bar"><i style={{ width: `${b[m.id]}%`, background: b === pairData[0] ? 'var(--indigo)' : 'var(--madder)' }} /></span>
                  </div>
                ))}
                <button
                  type="button" className="fs-chip" style={{ marginTop: '0.7rem' }}
                  aria-pressed={g.brandId === b.id}
                  onClick={() => patch({ brandId: b.id })}
                >
                  {COPY.m5.assign}
                </button>
              </div>
            ))}
            <div className="fs-cmp-vs" aria-hidden="true">vs</div>
            <p className="fs-cmp-read">{cmpRead}</p>
            <button type="button" className="fs-chip" style={{ justifySelf: 'start' }} onClick={() => setPair(null)}>
              {COPY.m5.close}
            </button>
          </div>
        )}

        <p className="fs-note fs-field-note">{COPY.m5.disclaimer}</p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MODULE 6 — The claim desk. A marketing claim faces cross examination:
// vague words questioned one at a time, absolutes struck through, missing
// qualifiers demanded, then a stamped ruling and a proper rewrite.
// ---------------------------------------------------------------------------
function analyseClaim(text) {
  const marks = [];
  const scan = (lexicon, kind) => {
    for (const item of lexicon) {
      item.re.lastIndex = 0;
      let m;
      while ((m = item.re.exec(text)) !== null) {
        marks.push({
          start: m.index, end: m.index + m[0].length, kind,
          term: item.term, ask: item.ask || item.demand,
        });
      }
    }
  };
  scan(ABSOLUTE_TERMS, 'absolute');
  scan(VAGUE_TERMS, 'vague');
  scan(QUALIFIER_TERMS, 'qualifier');
  marks.sort((a, b) => a.start - b.start || b.end - a.end);
  // drop overlaps, keep the earliest and strongest
  const clean = [];
  let lastEnd = -1;
  for (const mk of marks) {
    if (mk.start >= lastEnd) { clean.push(mk); lastEnd = mk.end; }
  }
  // evidence is scanned with struck absolutes removed: the "100%" inside
  // "100% sustainable" is a claim, not a substantiation
  let evidenceText = text;
  for (const item of ABSOLUTE_TERMS) {
    item.re.lastIndex = 0;
    evidenceText = evidenceText.replace(item.re, ' ');
  }
  const evidence = EVIDENCE_PATTERNS.reduce((n, re) => n + (re.test(evidenceText) ? 1 : 0), 0);
  const counts = { absolute: 0, vague: 0, qualifier: 0 };
  for (const mk of clean) counts[mk.kind] += 1;
  const riskScore = counts.absolute * 3 + counts.vague * 1.6 + counts.qualifier - evidence * 1.6;
  let verdict;
  if (counts.absolute > 0 && evidence === 0) verdict = CLAIM_VERDICTS.risk;
  else if (riskScore >= 4) verdict = CLAIM_VERDICTS.risk;
  else if (riskScore <= 0.6 && (evidence > 0 || clean.length === 0)) verdict = CLAIM_VERDICTS.sound;
  else verdict = CLAIM_VERDICTS.vague;
  if (/greenwash/i.test(text)) {
    clean.push({
      start: -1, end: -1, kind: 'meta', term: 'greenwashing',
      ask: 'Saying the word is not doing the deed. The desk checks behaviour, not vocabulary.',
    });
  }
  return { text, marks: clean, evidence, counts, verdict };
}

function shortDemand(ask) {
  const q = ask.split('?')[0];
  return (q.length > 30 ? `${q.slice(0, 30)}…` : q) + '?';
}

function rewriteClaim(text, g, fp) {
  const lower = text.toLowerCase();
  const type = typeById(g.typeId);
  const subject = /tee|t-shirt|t shirt/.test(lower) ? 'tee'
    : /hoodie|fleece/.test(lower) ? 'hoodie'
      : /jean|denim/.test(lower) ? 'jeans'
        : /collection|range|line\b/.test(lower) ? 'collection' : type.name.toLowerCase();
  if (/carbon[- ]neutral|net[- ]zero|climate/.test(lower)) {
    return [
      'We cut absolute scope 1 to 3 emissions by ', ['X%'], ' against a ', ['base year'],
      ' baseline, and retire ', ['named registry'], ' credits for the remainder. The full inventory is published at ', ['link'], '.',
    ];
  }
  if (/recycl/.test(lower)) {
    return [
      `This ${subject} is `, ['X%'], ' recycled ', ['fibre'], ', certified to ', ['GRS or equivalent'],
      '. It is recyclable where ', ['stream'], ' collection exists, which today covers ', ['X%'], ' of households.',
    ];
  }
  if (/tree/.test(lower)) {
    return [
      'We fund ', ['n'], ' seedlings per order through ', ['named programme'], '. ',
      ['X%'], ' survive to year five, audited by ', ['who'], ', on land secured until ', ['year'], '.',
    ];
  }
  if (/organic|natural|cotton/.test(lower)) {
    return [
      `The fibre is `, ['X%'], ' organically grown cotton certified to ', ['GOTS or equivalent'],
      '. Growing it used an estimated ', ['n'], ' litres of water, ', ['X%'], ' less than our ', ['year'], ' baseline.',
    ];
  }
  return [
    `This ${subject} is `, ['fibre and share'], '. Making it produced an estimated ',
    [fmtKg(fp.total)], ' kg CO2e, cradle to shop, on a method we publish at ', ['link'], '.',
  ];
}

function honestClaim(g, fp) {
  const type = typeById(g.typeId);
  const fab = fabricById(g.fabricId);
  const origin = originById(g.originId);
  const fabricLine = g.fabricId === 'orgcotton'
    ? 'organically grown cotton, certified to [scheme]'
    : g.fabricId === 'rpet' ? 'recycled polyester, certified to [GRS or equivalent]'
      : fab.name.toLowerCase();
  const dyeLine = g.dyeId === 'undyed' ? 'sold undyed as woven' : `dyed with ${dyeById(g.dyeId).name.toLowerCase()}`;
  return `This ${type.name.toLowerCase()} is 100% ${fabricLine}, cut and sewn in ${origin.name}, ${dyeLine}, and shipped by ${g.freight}. Making it produced an estimated ${fmtKg(fp.total)} kg CO2e and used about ${fmtInt(fp.water)} litres of water, cradle to shop, modelled on published LCA factors we link in full.`;
}

function ModuleSix() {
  const { g, fp, rm } = useWorld();
  const [claim, setClaim] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [reveal, setReveal] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [rewrite, setRewrite] = useState(null);
  const areaRef = useRef(null);

  const interrogate = (textArg) => {
    const text = (textArg ?? claim).trim();
    if (!text) return;
    if (textArg != null) setClaim(textArg);
    setAnalysis(analyseClaim(text));
    setReveal(0); setRewrite(null); setPhase('exam');
  };

  useEffect(() => {
    if (phase !== 'exam' || !analysis) return undefined;
    const total = analysis.marks.length;
    if (rm) { setReveal(total); setPhase('verdict'); return undefined; }
    if (reveal > total) { setPhase('verdict'); return undefined; }
    const t = setTimeout(() => setReveal((r) => r + 1), reveal === 0 ? 350 : 720);
    return () => clearTimeout(t);
  }, [phase, reveal, analysis, rm]);

  // exam text as segments with progressively revealed markings
  const segments = useMemo(() => {
    if (!analysis) return null;
    const segs = [];
    let cursor = 0;
    analysis.marks.forEach((mk, i) => {
      if (mk.start < 0) return;
      if (mk.start > cursor) segs.push({ plain: analysis.text.slice(cursor, mk.start) });
      segs.push({ mark: mk, i, word: analysis.text.slice(mk.start, mk.end) });
      cursor = mk.end;
    });
    if (cursor < analysis.text.length) segs.push({ plain: analysis.text.slice(cursor) });
    return segs;
  }, [analysis]);

  const currentAsk = analysis && reveal > 0 && reveal <= analysis.marks.length
    ? analysis.marks[reveal - 1] : null;
  const verdict = analysis?.verdict;

  return (
    <section className="fs-sec fs-desk fs-dark" id="m6" aria-labelledby="m6-h">
      <div className="fs-sec-inner">
        <div className="fs-head">
          <p className="fs-idx" data-n={COPY.m6.idx}>{COPY.m6.sub}</p>
          <h2 className="fs-title" id="m6-h">{COPY.m6.title}</h2>
          <p className="fs-lede">{COPY.m6.lede}</p>
        </div>

        <div className="fs-desk-grid">
          <div>
            <div className="fs-dock">
              <label className="sr-only" htmlFor="claim-input">Marketing claim to interrogate</label>
              <textarea
                id="claim-input" ref={areaRef} value={claim}
                placeholder={COPY.m6.placeholder}
                onChange={(e) => setClaim(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) interrogate(); }}
              />
            </div>
            <div className="fs-desk-actions">
              <button type="button" className="fs-chip primary" onClick={() => interrogate()} data-cursor="ask">
                {COPY.m6.interrogate}
              </button>
              <button
                type="button" className="fs-chip"
                disabled={phase !== 'verdict'}
                onClick={() => setRewrite(rewriteClaim(analysis.text, g, fp))}
                data-cursor="mend"
              >
                {COPY.m6.rewrite}
              </button>
              <button
                type="button" className="fs-chip"
                onClick={() => interrogate(honestClaim(g, fp))}
                data-cursor="ask"
              >
                {COPY.m6.myGarment}
              </button>
            </div>

            {segments && (
              <p className="fs-exam" aria-hidden={phase === 'exam' ? 'true' : undefined}>
                {segments.map((s, idx) => {
                  if (s.plain != null) return <span key={idx}>{s.plain}</span>;
                  const revealed = s.i < reveal;
                  const cls = !revealed ? 'w'
                    : s.mark.kind === 'absolute' ? 'w redacted'
                      : s.mark.kind === 'vague' ? 'w vague' : 'w qualifier';
                  return (
                    <React.Fragment key={idx}>
                      <span className={cls}>{s.word}</span>
                      {revealed && s.mark.kind === 'qualifier' && (
                        <span className="caret">{shortDemand(s.mark.ask)}</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </p>
            )}

            <div className="fs-xq">
              {currentAsk && (
                <p><b>{currentAsk.term}:</b> {currentAsk.ask}</p>
              )}
              {phase === 'verdict' && analysis && !currentAsk && analysis.marks.length > 0 && (
                <p><b>{analysis.marks.length}</b> term{analysis.marks.length === 1 ? '' : 's'} questioned · <b>{analysis.evidence}</b> evidence signal{analysis.evidence === 1 ? '' : 's'} found</p>
              )}
            </div>

            <div className="fs-stampzone" aria-live="polite">
              {phase === 'verdict' && verdict && (
                <>
                  <span className={`fs-stamp ${verdict.id}`}>{verdict.label}</span>
                  <p className="fs-stamp-line">{verdict.line}</p>
                </>
              )}
            </div>

            {rewrite && (
              <div className="fs-rewrite">
                <p className="txt">
                  {rewrite.map((part, i) => (
                    typeof part === 'string'
                      ? <span key={i} style={rm ? undefined : { animation: `fs-caret-in 0.3s ${i * 0.05}s var(--ease-out) both` }}>{part}</span>
                      : <span key={i} className="slot" style={rm ? undefined : { animation: `fs-caret-in 0.3s ${i * 0.05}s var(--ease-out) both` }}>[{part[0]}]</span>
                  ))}
                </p>
                <p className="why">{COPY.m6.rewriteNote}</p>
              </div>
            )}
          </div>

          <aside className="fs-rack">
            <p className="fs-panel-label" style={{ color: 'var(--flax)' }}>{COPY.m6.rackLabel}</p>
            <div className="fs-rack-rail">
              {SPECIMEN_CLAIMS.map((c) => (
                <button
                  key={c} type="button" className="fs-racktag"
                  onClick={() => interrogate(c)}
                  data-cursor="hang"
                >
                  {c}
                </button>
              ))}
            </div>
            <p className="fs-criteria">{COPY.m6.criteria}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MODULE 7 — The verdict. Wears on a momentum odometer, price on a pull tag,
// and a beam balance that tips in real time as the evidence lands.
// ---------------------------------------------------------------------------
function verdictFactors(g, fp, circ, brand) {
  const F = COPY.m7.factors;
  const wears = Math.max(1, g.wears);
  const perWearG = (fp.total * 1000) / wears;
  const factors = [];
  const put = (side, label, wt) => factors.push({ side, label, wt });
  if (wears >= BREAKEVEN_WEARS) put('for', F.perWearGood, clamp(1 + (wears - 30) / 120, 1, 2));
  else put('against', F.perWearBad, clamp(1 + (30 - wears) / 18, 1, 2.2));
  if (g.wears > fp.wearsCap) put('against', F.fragile, 1.4);
  else if (fp.wearsCap >= 150) put('for', F.durable, 1);
  if (circ >= 55) put('for', F.loopClosed, 1);
  else put('against', F.loopBroken, 1);
  if (g.replaces) put('for', F.replaces, 1.6); else put('against', F.adds, 1.1);
  if (brand) {
    if (brand.disclosure >= 60) put('for', F.trust, 0.8);
    else if (brand.disclosure < 30) put('against', F.noTrust, 0.8);
  }
  if (fp.water > 4500) put('against', F.water, 0.7);
  if (fp.microMg > 150) put('against', F.microf, 0.7);
  const score = factors.reduce((s, f) => s + (f.side === 'for' ? f.wt : -f.wt), 0);
  const breakevenN = Math.ceil(fp.total / 0.2);
  let v;
  if (!g.replaces && wears < 20) v = COPY.m7.verdicts.skip;
  else if (score >= 1.6) v = COPY.m7.verdicts.wearOut;
  else if (score >= 0.2) v = COPY.m7.verdicts.commit;
  else if (fp.wearsCap >= 120) v = COPY.m7.verdicts.secondhand;
  else v = COPY.m7.verdicts.skip;
  return { factors, score, breakevenN, verdict: v, perWearG };
}

function Odometer({ value, onChange, min = 1, max = 999 }) {
  const H = typeof window !== 'undefined' && window.innerWidth < 640 ? 72 : 84;
  const fly = useRef({ val: value, v: 0, active: false });
  const [, force] = useState(0);
  useEffect(() => { if (!fly.current.active) fly.current.val = value; }, [value]);

  useRaf((dt) => {
    const f = fly.current;
    if (!f.active) return;
    f.val = clamp(f.val + f.v * dt, min, max);
    f.v *= Math.exp(-2.1 * dt);
    if (Math.abs(f.v) < 3) {
      f.active = false;
      f.val = Math.round(f.val);
      onChange(Math.round(f.val));
    } else if (f.val <= min || f.val >= max) {
      f.v = 0; f.active = false; f.val = Math.round(f.val);
      onChange(Math.round(f.val));
    }
    force((n) => n + 1);
  }, fly.current.active);

  const onDown = (e) => {
    const f = fly.current;
    f.active = false; f.v = 0; f.val = value;
    let lastY = e.clientY; let lastT = performance.now(); let vel = 0;
    startDrag(e, {
      move: (ev) => {
        const now = performance.now();
        const dy = ev.clientY - lastY;
        const dtm = Math.max(8, now - lastT);
        vel = lerp(vel, (-dy / dtm) * 1000 * 0.35, 0.5);
        f.val = clamp(f.val - dy * 0.35, min, max);
        lastY = ev.clientY; lastT = now;
        force((n) => n + 1);
      },
      up: () => {
        if (Math.abs(vel) > 12) { f.v = vel; f.active = true; force((n) => n + 1); }
        else { f.val = Math.round(f.val); onChange(Math.round(f.val)); }
      },
    });
  };

  const onKey = (e) => {
    const step = e.key === 'PageUp' ? 10 : e.key === 'PageDown' ? -10
      : e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1
        : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -1
          : e.key === 'Home' ? min - value : e.key === 'End' ? max - value : 0;
    if (step !== 0) { e.preventDefault(); onChange(clamp(value + step, min, max)); }
  };

  const val = fly.current.active || fly.current.v !== 0 ? fly.current.val : (fly.current.val ?? value);
  const units = val % 10;
  const tensRaw = Math.floor(val / 10) % 10;
  const tens = tensRaw + Math.max(0, units - 9);
  const hundreds = Math.floor(val / 100) % 10 + Math.max(0, tens - 9);
  const digits = [hundreds, tens, units];

  return (
    <div
      className="fs-odo" role="spinbutton" tabIndex={0}
      aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}
      aria-label={COPY.m7.wearsLabel}
      onKeyDown={onKey} onPointerDown={onDown} data-cursor="spin"
    >
      {digits.map((d, i) => (
        <div className="fs-odo-col" key={i} aria-hidden="true">
          <div className="strip" style={{ transform: `translateY(${-(d % 10) * H}px)` }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, k) => (
              <span key={k} style={{ height: H }}>{n}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ModuleSeven() {
  const { g, patch, fp, circ, brand, rm, world } = useWorld();
  const zoneRef = useRef(null);
  const cvRef = useRef(null);
  const size = useCanvas(cvRef);
  const onScreen = useOnScreen(zoneRef);
  const [ruling, setRuling] = useState(null);
  const sim = useRef({
    angle: new Spring(0, 46, 8), queue: [], tokens: [], running: false, nextAt: 0,
  }).current;

  const result = useMemo(() => verdictFactors(g, fp, circ, brand), [g, fp, circ, brand]);
  const costPerWear = g.price / Math.max(1, g.wears);

  const weigh = () => {
    setRuling(null);
    sim.tokens = []; sim.queue = [...result.factors]; sim.running = true;
    sim.nextAt = 0; sim.angle.t = 0;
    if (rm) {
      sim.tokens = result.factors.map((f) => ({ ...f, landed: true }));
      sim.queue = []; sim.running = false;
      const sums = panSums();
      sim.angle.snap(clamp((sums.against - sums.for) * 0.12, -0.36, 0.36));
      setRuling(result);
    }
  };

  const panSums = () => {
    const s = { for: 0, against: 0 };
    for (const tk of sim.tokens) if (tk.landed) s[tk.side] += tk.wt;
    return s;
  };

  useRaf((dt, t) => {
    const cv = cvRef.current; if (!cv) return;
    const { w, h, dpr } = size.current; if (!w) return;
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const px = w / 2; const py = h * 0.34;
    const L = Math.min(w * 0.34, 300);
    const hang = h * 0.3;

    // release the next factor onto the scales
    if (sim.running && sim.queue.length && t >= sim.nextAt) {
      const f = sim.queue.shift();
      const side = f.side === 'for' ? -1 : 1;
      sim.tokens.push({
        ...f, sideSign: side, landed: false,
        x: px + side * L, y: -20, vy: 0,
      });
      sim.nextAt = t + 0.5;
    }

    const a = rm ? sim.angle.x : sim.angle.step(dt);
    const exL = { x: px - Math.cos(a) * L, y: py - Math.sin(a) * L };
    const exR = { x: px + Math.cos(a) * L, y: py + Math.sin(a) * L };
    const panY = (ex) => ex.y + hang;

    // physics for falling factor tags
    let allLanded = sim.tokens.length > 0;
    for (const tk of sim.tokens) {
      const ex = tk.sideSign < 0 ? exL : exR;
      const stack = sim.tokens.filter((o) => o.landed && o.sideSign === tk.sideSign).indexOf(tk);
      const restY = panY(ex) - 10 - (stack >= 0 ? stack : sim.tokens.filter((o) => o.landed && o.sideSign === tk.sideSign).length) * 17;
      if (!tk.landed) {
        tk.vy += 900 * dt; tk.y += tk.vy * dt;
        tk.x = ex.x;
        if (tk.y >= restY) {
          tk.y = restY; tk.landed = true;
          sim.angle.v += tk.sideSign * tk.wt * 0.55;
          const sums = panSums();
          sim.angle.t = clamp((sums.against - sums.for) * 0.12, -0.36, 0.36);
        }
        allLanded = false;
      } else {
        tk.x = ex.x; tk.y = restY;
      }
    }
    if (sim.running && sim.queue.length === 0 && allLanded) {
      sim.running = false;
      setTimeout(() => setRuling(result), 420);
    }

    // draw the machine
    const ink = '#26231D';
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 2;
    // column and pivot
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, h * 0.8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px - 46, h * 0.8); ctx.lineTo(px + 46, h * 0.8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 9, py + 14); ctx.lineTo(px + 9, py + 14); ctx.closePath(); ctx.fill();
    // beam
    ctx.lineWidth = 3.4;
    ctx.beginPath(); ctx.moveTo(exL.x, exL.y); ctx.lineTo(exR.x, exR.y); ctx.stroke();
    // strings and pans
    ctx.lineWidth = 1.2;
    for (const ex of [exL, exR]) {
      const pyn = panY(ex);
      ctx.beginPath();
      ctx.moveTo(ex.x, ex.y); ctx.lineTo(ex.x - 34, pyn - 8);
      ctx.moveTo(ex.x, ex.y); ctx.lineTo(ex.x + 34, pyn - 8);
      ctx.stroke();
      ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(ex.x - 44, pyn - 8); ctx.lineTo(ex.x + 44, pyn - 8); ctx.stroke();
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(ex.x, pyn - 2, 44, 0.15, Math.PI - 0.15); ctx.stroke();
    }
    // pan labels
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(38,35,29,0.6)';
    ctx.fillText(COPY.m7.forPan.toUpperCase(), exL.x, panY(exL) + 30);
    ctx.fillText(COPY.m7.againstPan.toUpperCase(), exR.x, panY(exR) + 30);

    // factor tags
    for (const tk of sim.tokens) {
      ctx.font = '10px "JetBrains Mono", monospace';
      const tw = ctx.measureText(tk.label).width + 14;
      ctx.fillStyle = tk.side === 'for' ? '#33487A' : '#A6503F';
      ctx.fillRect(tk.x - tw / 2, tk.y - 13, tw, 15);
      ctx.fillStyle = '#F4EFE2';
      ctx.fillText(tk.label, tk.x, tk.y - 2);
    }
  }, onScreen);

  const alts = useMemo(() => {
    const list = [];
    const type = typeById(g.typeId);
    list.push(COPY.m7.alternatives.secondhand.replace('{type}', type.name.toLowerCase()).replace('{pct}', '75%'));
    if (g.replaces) list.push(COPY.m7.alternatives.repair);
    if (g.dyeId !== 'undyed') {
      const undyedTotal = computeFootprint({ ...g, dyeId: 'undyed' }).total;
      list.push(COPY.m7.alternatives.undyed.replace('{delta}', (fp.total - undyedTotal).toFixed(1)));
    }
    if (!g.replaces) list.push(COPY.m7.alternatives.swap);
    return list;
  }, [g, fp]);

  return (
    <section className="fs-sec" id="m7" aria-labelledby="m7-h">
      <div className="fs-sec-inner">
        <div className="fs-head">
          <p className="fs-idx" data-n={COPY.m7.idx}>{COPY.m7.sub}</p>
          <h2 className="fs-title" id="m7-h">{COPY.m7.title}</h2>
          <p className="fs-lede">{COPY.m7.lede}</p>
        </div>

        <div className="fs-verdict-grid">
          <div>
            <div className="fs-q">
              <p className="fs-panel-label">{COPY.m7.wearsLabel}</p>
              <Odometer value={g.wears} onChange={(v) => patch({ wears: v })} />
              <p className="fs-odo-hint">drag to spin · fling for momentum</p>
              <div className="fs-perwear">
                <div>
                  <b>{costPerWear < 10 ? `$${costPerWear.toFixed(2)}` : fmtMoney(costPerWear)}</b>
                  <span>cost {COPY.m7.perWear}</span>
                </div>
                <div>
                  <b>{fmtInt(result.perWearG)} g</b>
                  <span>CO2e {COPY.m7.perWear}</span>
                </div>
                <div>
                  <b className={g.wears < result.breakevenN ? 'brk' : ''}>{result.breakevenN}</b>
                  <span>{COPY.m7.breakeven}</span>
                </div>
              </div>
              {g.wears >= 500 && <p className="fs-heirloom">{COPY.m7.heirloom}</p>}
            </div>

            <div className="fs-q">
              <p className="fs-panel-label">{COPY.m7.priceLabel}</p>
              <div className="fs-pricetag">
                <div
                  className="tag" role="slider" tabIndex={0}
                  aria-valuemin={5} aria-valuemax={400} aria-valuenow={g.price}
                  aria-label={COPY.m7.priceLabel}
                  data-cursor="pull"
                  onPointerDown={(e) => {
                    const start = g.price; const y0 = e.clientY;
                    startDrag(e, {
                      move: (ev) => patch({ price: clamp(Math.round(start - (ev.clientY - y0) * 0.6), 5, 400) }),
                    });
                  }}
                  onKeyDown={(e) => {
                    const d = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 5
                      : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -5 : 0;
                    if (d) { e.preventDefault(); patch({ price: clamp(g.price + d, 5, 400) }); }
                  }}
                >
                  {fmtMoney(g.price)}
                </div>
                <small>pull the tag up or down</small>
              </div>
            </div>

            <div className="fs-q">
              <p className="fs-panel-label">{COPY.m7.replaceLabel}</p>
              <div className="fs-swap" role="radiogroup" aria-label={COPY.m7.replaceLabel}>
                <button
                  type="button" className="fs-chip" role="radio" aria-checked={g.replaces}
                  onClick={() => patch({ replaces: true })} data-cursor="swap"
                >
                  {COPY.m7.replaceYes}
                </button>
                <button
                  type="button" className="fs-chip" role="radio" aria-checked={!g.replaces}
                  onClick={() => patch({ replaces: false })} data-cursor="swap"
                >
                  {COPY.m7.replaceNo}
                </button>
              </div>
            </div>

            <div className="fs-alts">
              <p className="fs-panel-label">{COPY.m7.alternativesLabel}</p>
              <ul>
                {alts.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
          </div>

          <div className="fs-balance-zone" ref={zoneRef}>
            <Seat id="m7" style={{ position: 'absolute', left: '30%', right: '30%', top: '-4%', height: '30%' }} />
            <canvas ref={cvRef} aria-hidden="true" />
            <button type="button" className="fs-chip fs-weigh" onClick={weigh} data-cursor="weigh">
              {COPY.m7.weighIt}
            </button>
            <div className="fs-ruling" aria-live="assertive">
              {ruling && (
                <>
                  <span className="fs-ruling-label">{ruling.verdict.label}</span>
                  <p className="fs-ruling-line">{ruling.verdict.line.replace('{n}', ruling.breakevenN)}</p>
                  <p className="fs-breakeven">
                    {fmtKg(fp.total)} kg CO2e · {circ}/100 circular · {brand ? `made by ${brand.name}` : 'no maker assigned'} · indicative
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer and shell
// ---------------------------------------------------------------------------
function Footer() {
  return (
    <footer className="fs-footer">
      <div className="fs-footer-inner">
        <p className="fs-note">{COPY.footer.method}</p>
        <div className="fs-footer-row">
          <span>{COPY.footer.ownTest}</span>
          <span>{COPY.footer.made}</span>
          <a href="#top">{COPY.footer.top} ↑</a>
        </div>
      </div>
    </footer>
  );
}

function EasterEgg({ show }) {
  if (!show) return null;
  return (
    <div className="fs-egg" role="status">
      <div className="fs-egg-tag">
        <span className="hdr">LENS 08 · UNLISTED</span>
        <p>{COPY.egg.line}</p>
        <span className="care">{COPY.egg.care}</span>
      </div>
    </div>
  );
}

function Shell() {
  const { rm, world } = useWorld();
  const [active, setActive] = useState(null);
  const [egg, setEgg] = useState(false);
  const eggTimer = useRef(0);

  const triggerEgg = useCallback(() => {
    setEgg(true);
    // send the travelling garment into a pirouette if it is on its thread
    if (!rm) world.impulse = 26;
    window.clearTimeout(eggTimer.current);
    eggTimer.current = window.setTimeout(() => setEgg(false), 7000);
  }, [rm, world]);
  useEffect(() => () => window.clearTimeout(eggTimer.current), []);

  useEffect(() => {
    const secs = Array.from(document.querySelectorAll('[id^="m"]'))
      .filter((el) => /^m[1-7]$/.test(el.id));
    if (!secs.length || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) setActive(en.target.id);
    }, { rootMargin: '-42% 0px -42% 0px' });
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className={rm ? 'fs-rm' : undefined}>
      <a className="skip-link" href="#m1">{COPY.skip}</a>
      <TopBar onSeventh={triggerEgg} />
      <EasterEgg show={egg} />
      <Rail active={active} />
      <Hero />
      <ModuleOne />
      <ModuleTwo />
      <ModuleThree />
      <ModuleFour />
      <ModuleFive />
      <ModuleSix />
      <ModuleSeven />
      <Footer />
      <WorldLayer />
      <CursorLayer />
    </div>
  );
}

export default function FashionApp() {
  return (
    <WorldProvider>
      <Shell />
    </WorldProvider>
  );
}
