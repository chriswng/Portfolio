// ============================================================================
// ClothField — the hero's signature surface. A real Verlet cloth, simulated
// on the CPU and drawn on the GPU (ogl). Grab it and it stretches; let go and
// it recovers. At rest it is a quiet woven calico drape (the page's texture);
// under strain the threads thin and lighten and indigo dye bleeds along the
// pull, so a still frame can never show what the module does. Reduced motion
// gets a settled static drape, not a blank. Touch grabs the same as a mouse.
// ============================================================================
import { Renderer, Program, Mesh, Geometry, Color } from 'ogl';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../utils/media';

const VERT = `#version 300 es
in vec2 position;   // cloth node, in CSS pixels
in vec2 uv;         // 0..1 across the sheet
in float strain;    // local stretch vs rest, roughly -1..2
uniform vec2 uResolution;
out vec2 vUv;
out float vStrain;
void main() {
  vUv = uv;
  vStrain = strain;
  vec2 clip = position / uResolution * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);
}
`;

// Plain-weave shader: two thread sets, over-under by a checker, with an
// anisotropic sheen along whichever thread is on top. Strain thins the
// threads (fibres pull straight) and pools indigo into the gaps.
const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
in float vStrain;
uniform vec3 uGround;
uniform vec3 uThread;
uniform vec3 uBleed;
uniform float uThreads;
uniform float uOpacity;
uniform float uReveal;   // 0 on load -> 1, wipes the weave in
out vec4 fragColor;

float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

void main() {
  float s = clamp(vStrain, -0.6, 1.2);

  // --- fine linen grain: two low-contrast thread sets plus slub, so it reads
  // as woven fabric up close but never as a hard digital grid ---
  vec2 tt = vUv * uThreads;
  float warp = smoothstep(0.5, 0.12, abs(fract(tt.x) - 0.5));
  float weft = smoothstep(0.5, 0.12, abs(fract(tt.y) - 0.5));
  float slub = hash(floor(tt)) * 0.35;              // irregular thickening
  float grain = clamp((warp + weft) * 0.5 * (0.7 + slub), 0.0, 1.0);

  // --- soft fold shading from the physics strain. This is the visible cloth:
  // where the sheet is pulled taut it lightens, where it bunches it shadows,
  // and the light travels as you drag. A still frame can't show it. ---
  float fold = clamp(s, -0.6, 0.6);

  // gentle static folds, so even at rest (and under reduced motion) the sheet
  // reads as hanging cloth and never as flat white
  float drape = sin(vUv.x * 12.566 + 0.6) * 0.03 + sin(vUv.x * 23.3) * 0.014;

  vec3 col = uGround;
  col = mix(col, uThread, grain * 0.34);            // the weave itself
  col *= 1.0 + drape + fold * 0.5;                  // drape + fold light/shadow
  // indigo gathers where the cloth bunches (compression) and streaks the pull
  float bleed = clamp(max(-s, 0.0) * 0.7 + max(s, 0.0) * grain * 0.3, 0.0, 0.7);
  col = mix(col, uBleed, bleed);

  float alpha = uOpacity * (0.55 + grain * 0.25 + abs(fold) * 0.45);
  // calm the surface behind the headline at the fold, keep it alive up top
  alpha *= mix(1.0, 0.32, smoothstep(0.42, 1.0, vUv.y));
  // wipe in on load, top-to-bottom: a row shows once uReveal passes its height
  alpha *= smoothstep(vUv.y - 0.2, vUv.y + 0.02, uReveal);

  fragColor = vec4(clamp(col, 0.0, 1.0), clamp(alpha, 0.0, 1.0));
}
`;

const COLS = 34;
const ROWS = 24;

export default function ClothField() {
  const ctnRef = useRef(null);

  useEffect(() => {
    const ctn = ctnRef.current;
    if (!ctn) return undefined;
    const reduce = prefersReducedMotion();

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 1.75) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';
    ctn.appendChild(gl.canvas);

    // --- cloth state, in CSS pixels ---
    let W = ctn.offsetWidth || 1;
    let H = ctn.offsetHeight || 1;
    const N = COLS * ROWS;
    const px = new Float32Array(N * 2);   // current
    const pv = new Float32Array(N * 2);   // previous (verlet)
    const rest = new Float32Array(N * 2); // pinned/target for the top row
    const pinned = new Uint8Array(N);
    const strain = new Float32Array(N);

    const idx = (c, r) => r * COLS + c;

    // structural + shear constraints with their rest lengths
    const cons = [];
    const addCon = (a, b) => cons.push({ a, b, rest: 0 });
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = idx(c, r);
        if (c < COLS - 1) addCon(i, idx(c + 1, r));
        if (r < ROWS - 1) addCon(i, idx(c, r + 1));
        if (c < COLS - 1 && r < ROWS - 1) { addCon(i, idx(c + 1, r + 1)); addCon(idx(c + 1, r), idx(c, r + 1)); }
      }
    }

    const layout = () => {
      W = ctn.offsetWidth || 1;
      H = ctn.offsetHeight || 1;
      // the sheet hangs from a line slightly above the top and drapes past the
      // fold of the hero, wider than the viewport so the edges never show.
      const padX = W * 0.06;
      const spanX = W - padX * 2;
      const topY = -H * 0.04;
      const spanY = H * 1.02;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = idx(c, r);
          const x = padX + (c / (COLS - 1)) * spanX;
          const y = topY + (r / (ROWS - 1)) * spanY;
          px[i * 2] = x; px[i * 2 + 1] = y;
          pv[i * 2] = x; pv[i * 2 + 1] = y;
          rest[i * 2] = x; rest[i * 2 + 1] = y;
          pinned[i] = r === 0 ? 1 : 0;   // top edge hangs from the rail
        }
      }
      for (const k of cons) {
        const ax = px[k.a * 2], ay = px[k.a * 2 + 1];
        const bx = px[k.b * 2], by = px[k.b * 2 + 1];
        k.rest = Math.hypot(ax - bx, ay - by);
      }
      renderer.setSize(W, H);
      program.uniforms.uResolution.value = [W, H];
    };

    // --- geometry: dynamic position + strain, static uv + index ---
    const uv = new Float32Array(N * 2);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const i = idx(c, r); uv[i * 2] = c / (COLS - 1); uv[i * 2 + 1] = r / (ROWS - 1);
    }
    const tris = [];
    for (let r = 0; r < ROWS - 1; r++) for (let c = 0; c < COLS - 1; c++) {
      const a = idx(c, r), b = idx(c + 1, r), d = idx(c, r + 1), e = idx(c + 1, r + 1);
      tris.push(a, d, b, b, d, e);
    }
    const index = new Uint16Array(tris);

    const geometry = new Geometry(gl, {
      position: { size: 2, data: px, usage: gl.DYNAMIC_DRAW },
      uv: { size: 2, data: uv },
      strain: { size: 1, data: strain, usage: gl.DYNAMIC_DRAW },
      index: { data: index },
    });

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      transparent: true,
      cullFace: false,
      uniforms: {
        uResolution: { value: [W, H] },
        uGround: { value: new Color('#E4DCC6') },   // calico ground
        uThread: { value: new Color('#9A8E6B') },   // flax thread, muted taupe
        uBleed: { value: new Color('#33487A') },    // vat indigo, under strain
        uThreads: { value: 96 },
        uOpacity: { value: 0.72 },
        uReveal: { value: reduce ? 1.4 : 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    layout();

    // --- pointer: grab nearest node, drag, release to recover ---
    let held = -1;
    let hx = 0, hy = 0;         // where the held node is dragged to
    let mx = -1e3, my = -1e3;   // cursor for the ambient breeze
    const nearest = (x, y) => {
      let best = -1, bd = Infinity;
      for (let i = 0; i < N; i++) {
        if (pinned[i]) continue;
        const dx = px[i * 2] - x, dy = px[i * 2 + 1] - y;
        const d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = i; }
      }
      // only grab if the cloth is genuinely under the cursor
      return bd < (Math.max(W, H) * 0.14) ** 2 ? best : -1;
    };
    const rel = (e) => {
      const r = gl.canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const onDown = (e) => {
      const [x, y] = rel(e);
      const i = nearest(x, y);
      if (i < 0) return;
      held = i; hx = x; hy = y;
      try { ctn.setPointerCapture(e.pointerId); } catch { /* fine */ }
      ctn.dataset.grab = '1';
    };
    const onMove = (e) => {
      const [x, y] = rel(e); mx = x; my = y;
      if (held >= 0) { hx = x; hy = y; }
    };
    const onUp = () => { held = -1; ctn.dataset.grab = '0'; };
    if (!reduce) {
      ctn.addEventListener('pointerdown', onDown);
      ctn.addEventListener('pointermove', onMove, { passive: true });
      ctn.addEventListener('pointerup', onUp);
      ctn.addEventListener('pointercancel', onUp);
      ctn.addEventListener('pointerleave', () => { mx = -1e3; my = -1e3; });
    }

    // --- integrate ---
    // The hero cloth is a taut sheet, not a curtain: only the top edge is
    // pinned, gravity is a gentle belly, and a strong pull back toward rest
    // keeps it filling the hero and springing back the instant you let go.
    const GRAV = 34;       // px/s^2, just enough to sag
    const DAMP = 0.9;
    const RECOVER = 0.055; // spring back toward the rest weave
    const ITER = 3;
    let seedT = 0;

    const step = (dt) => {
      const g = GRAV * dt * dt;
      seedT += dt;
      for (let i = 0; i < N; i++) {
        if (pinned[i]) continue;
        const xi = i * 2, yi = i * 2 + 1;
        let x = px[xi], y = px[yi];
        const ox = pv[xi], oy = pv[yi];
        // ambient breeze so the sheet is never dead still
        const bx = Math.sin(seedT * 0.8 + y * 0.012) * 10 * dt;
        const by = Math.cos(seedT * 0.6 + x * 0.010) * 7 * dt;
        // cursor breeze: a soft push away from the pointer when not held, so a
        // moving mouse ripples the weave without grabbing it
        let px2 = 0, py2 = 0;
        if (held < 0 && mx > -1e3) {
          const dx = x - mx, dy = y - my; const d2 = dx * dx + dy * dy;
          const R = W * 0.16;
          if (d2 < R * R) { const f = (1 - Math.sqrt(d2) / R) * 42 * dt; const d = Math.sqrt(d2) || 1; px2 = dx / d * f; py2 = dy / d * f; }
        }
        let nx = x + (x - ox) * DAMP + bx + px2;
        let ny = y + (y - oy) * DAMP + g + by + py2;
        // spring back to the rest weave (this is what keeps it taut)
        nx += (rest[xi] - x) * RECOVER;
        ny += (rest[yi] - y) * RECOVER;
        pv[xi] = x; pv[yi] = y;
        px[xi] = nx; px[yi] = ny;
      }
      // held node follows the cursor exactly
      if (held >= 0) { px[held * 2] = hx; px[held * 2 + 1] = hy; pv[held * 2] = hx; pv[held * 2 + 1] = hy; }
      // satisfy constraints
      for (let k = 0; k < ITER; k++) {
        for (let ci = 0; ci < cons.length; ci++) {
          const co = cons[ci];
          const a = co.a * 2, b = co.b * 2;
          let dx = px[b] - px[a], dy = px[b + 1] - px[a + 1];
          const d = Math.hypot(dx, dy) || 1e-4;
          const diff = ((d - co.rest) / d) * 0.5;
          const ox = dx * diff, oy = dy * diff;
          if (!pinned[co.a]) { px[a] += ox; px[a + 1] += oy; }
          if (!pinned[co.b]) { px[b] -= ox; px[b + 1] -= oy; }
        }
        if (held >= 0) { px[held * 2] = hx; px[held * 2 + 1] = hy; }
      }
    };

    // per-node strain = mean over-length of its links, for the shader.
    // Buffers are hoisted so the hot loop allocates nothing per frame.
    const acc = new Float32Array(N);
    const cnt = new Float32Array(N);
    const computeStrain = () => {
      acc.fill(0); cnt.fill(0);
      for (let ci = 0; ci < cons.length; ci++) {
        const co = cons[ci];
        const a = co.a * 2, b = co.b * 2;
        const d = Math.hypot(px[b] - px[a], px[b + 1] - px[a + 1]);
        const e = (d - co.rest) / co.rest;
        acc[co.a] += e; cnt[co.a]++; acc[co.b] += e; cnt[co.b]++;
      }
      for (let i = 0; i < N; i++) strain[i] = cnt[i] ? acc[i] / cnt[i] * 5.0 : 0;
    };

    let raf = 0, inView = true, last = performance.now();
    const render = (now) => {
      raf = inView ? requestAnimationFrame(render) : 0;
      let dt = (now - last) / 1000; last = now;
      dt = Math.min(dt, 1 / 30);
      if (program.uniforms.uReveal.value < 1.3) program.uniforms.uReveal.value += dt * 0.8;
      // a couple of substeps keep the cloth stable at low frame rates
      step(dt * 0.6); step(dt * 0.6);
      computeStrain();
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.strain.needsUpdate = true;
      renderer.render({ scene: mesh });
    };

    if (reduce) {
      // settle to a static drape, then draw one frame
      for (let i = 0; i < 220; i++) step(1 / 60);
      computeStrain();
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.strain.needsUpdate = true;
      renderer.render({ scene: mesh });
    } else {
      raf = requestAnimationFrame(render);
    }

    const io = new IntersectionObserver((es) => {
      es.forEach((en) => {
        inView = en.isIntersecting;
        if (inView && !raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(render); }
      });
    });
    io.observe(ctn);

    const onResize = () => { layout(); if (reduce) { for (let i = 0; i < 60; i++) step(1 / 60); computeStrain(); geometry.attributes.position.needsUpdate = true; geometry.attributes.strain.needsUpdate = true; renderer.render({ scene: mesh }); } };
    window.addEventListener('resize', onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      ctn.removeEventListener('pointerdown', onDown);
      ctn.removeEventListener('pointermove', onMove);
      ctn.removeEventListener('pointerup', onUp);
      ctn.removeEventListener('pointercancel', onUp);
      if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <div className="fs-cloth" ref={ctnRef} data-cursor="grab" aria-hidden="true" />;
}
