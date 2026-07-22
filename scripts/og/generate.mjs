// Renders every share thumbnail in scripts/og/cards.mjs to public/<out> at
// 1200x630, using headless Chromium driven over the DevTools protocol (so the
// output is exactly 1200x630 with no image-library dependency).
//
//   node scripts/og/generate.mjs            # render all cards
//   node scripts/og/generate.mjs og-grid    # render only matching cards
//   CHROME_BIN=/path/to/chrome node scripts/og/generate.mjs
//
// Fonts are fetched once from Google Fonts (via curl, which honours the proxy)
// and cached, base64-embedded, in scripts/og/fonts.css. Delete that file to
// refresh. Requires network on first run and a Chromium/Chrome binary.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawn } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const OUT_DIR = path.join(ROOT, 'public');
const TMP = path.join(HERE, '.tmp');
const FONTS = path.join(HERE, 'fonts.css');

const filter = process.argv.slice(2);
const wanted = (out) => filter.length === 0 || filter.some((f) => out.includes(f));

// ---- fonts -----------------------------------------------------------------
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36';
function curl(url) {
  return execFileSync('curl', ['-sS', '--max-time', '40', '-A', UA, url], { maxBuffer: 1 << 27 });
}
function ensureFonts() {
  if (fs.existsSync(FONTS)) return fs.readFileSync(FONTS, 'utf8');
  console.log('· fetching fonts (first run)…');
  const css = curl('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600&family=JetBrains+Mono:wght@500&display=block').toString();
  const re = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*{([^}]*)}/g;
  const faces = [];
  let m;
  while ((m = re.exec(css))) {
    if (m[1] !== 'latin') continue;
    const body = m[2];
    const fam = (body.match(/font-family:\s*'([^']+)'/) || [])[1];
    const weight = (body.match(/font-weight:\s*(\d+)/) || [])[1];
    const url = (body.match(/url\((https:[^)]+\.woff2)\)/) || [])[1];
    if (!fam || !url) continue;
    const b64 = Buffer.from(curl(url)).toString('base64');
    faces.push(`@font-face{font-family:'${fam}';font-style:normal;font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2');}`);
  }
  const out = faces.join('\n');
  fs.writeFileSync(FONTS, out);
  return out;
}

// ---- chromium --------------------------------------------------------------
function findChrome() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  try {
    for (const d of fs.readdirSync(pw)) {
      const a = path.join(pw, d, 'chrome-linux', 'chrome');
      if (d.startsWith('chromium-') && fs.existsSync(a)) return a;
      const b = path.join(pw, d, 'chrome-linux', 'headless_shell');
      if (d.startsWith('chromium_headless_shell') && fs.existsSync(b)) return b;
    }
  } catch { /* no pw dir */ }
  for (const c of ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable']) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('No Chromium found. Set CHROME_BIN to a Chrome/Chromium binary.');
}

const getJSON = (port, p) => new Promise((res, rej) => {
  http.get({ host: '127.0.0.1', port, path: p }, (r) => {
    let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(JSON.parse(d)));
  }).on('error', rej);
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Minimal CDP client over the page target's websocket.
function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  const pending = new Map();
  let id = 0;
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  const ready = new Promise((res) => { ws.onopen = () => res(); });
  const send = (method, params = {}) => new Promise((res, rej) => {
    const mid = ++id;
    pending.set(mid, (msg) => (msg.error ? rej(new Error(msg.error.message)) : res(msg.result)));
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  return { ready, send, close: () => ws.close() };
}

// ---- render ----------------------------------------------------------------
async function main() {
  const fontsCss = ensureFonts();
  const { CARDS } = await import(path.join(HERE, 'cards.mjs') + `?t=${fs.statSync(path.join(HERE, 'cards.mjs')).mtimeMs}`);
  const drawJs = fs.readFileSync(path.join(HERE, 'draw.js'), 'utf8');
  const cards = CARDS.filter((c) => wanted(c.out));
  if (!cards.length) { console.log('No cards match', filter.join(' ')); return; }

  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(TMP, { recursive: true });

  const chrome = findChrome();
  const proc = spawn(chrome, [
    '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--force-color-profile=srgb', '--remote-debugging-port=0',
    `--user-data-dir=${path.join(TMP, 'profile')}`, 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  const port = await new Promise((res, rej) => {
    const to = setTimeout(() => rej(new Error('Chromium did not start')), 15000);
    proc.stderr.on('data', (b) => {
      const m = /ws:\/\/127\.0\.0\.1:(\d+)\//.exec(b.toString());
      if (m) { clearTimeout(to); res(Number(m[1])); }
    });
  });

  const targets = await getJSON(port, '/json/list');
  const page = targets.find((t) => t.type === 'page');
  const client = cdp(page.webSocketDebuggerUrl);
  await client.ready;
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1200, height: 630, deviceScaleFactor: 1, mobile: false,
    screenWidth: 1200, screenHeight: 630,
  });

  for (const card of cards) {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
${fontsCss}
*{margin:0;padding:0}html,body{background:#171C13}canvas{display:block}
</style></head><body><canvas id="c" width="1200" height="630"></canvas>
<script>window.CARD=${JSON.stringify(card)};</script>
<script>${drawJs}</script></body></html>`;
    const file = path.join(TMP, card.out.replace(/\.png$/, '.html'));
    fs.writeFileSync(file, html);

    await client.send('Page.navigate', { url: 'file://' + file });
    let done = false;
    for (let i = 0; i < 80 && !done; i++) {
      await sleep(100);
      const r = await client.send('Runtime.evaluate', { expression: 'window.__done===true', returnByValue: true });
      done = r.result && r.result.value === true;
    }
    if (!done) throw new Error(`Timed out rendering ${card.out}`);

    const shot = await client.send('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: true, fromSurface: true,
      clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 },
    });
    const dest = path.join(OUT_DIR, card.out);
    fs.writeFileSync(dest, Buffer.from(shot.data, 'base64'));
    console.log(`✓ ${card.out}`);
  }

  client.close();
  proc.kill();
  fs.rmSync(TMP, { recursive: true, force: true });
}

main().catch((e) => { console.error('✗', e.message); process.exit(1); });
