// Opt-in ambient sound layer for the reveal story. Always off by default;
// nothing is constructed until the visitor presses the sound toggle (which
// also satisfies browser autoplay policy). One soft pad, quiet pentatonic
// ticks for count-ups, a three-note chime for arrivals. No samples, no
// network: everything is synthesised in the Web Audio API.

const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];

class FootprintAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.pad = null;
    this.on = false;
    this.lastTick = 0;
  }

  _ensure() {
    if (this.ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
    return true;
  }

  _startPad() {
    if (this.pad) return;
    const t = this.ctx.currentTime;
    const padGain = this.ctx.createGain();
    padGain.gain.value = 0.05;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.4;
    // Two slightly detuned triangles a fifth apart: a quiet, warm drone.
    const oscs = [110, 110.4, 165].map((f) => {
      const o = this.ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = f;
      o.connect(filter);
      o.start(t);
      return o;
    });
    // A very slow breathing LFO on the pad level.
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.07;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(padGain.gain);
    lfo.start(t);
    filter.connect(padGain);
    padGain.connect(this.master);
    this.pad = { oscs, lfo, padGain, filter };
  }

  enable() {
    if (!this._ensure()) return false;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this._startPad();
    this.on = true;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(0.55, this.ctx.currentTime, 0.6);
    return true;
  }

  disable() {
    if (!this.ctx) { this.on = false; return; }
    this.on = false;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
    // Once the ramp is inaudible, stop the clock entirely; enable() resumes.
    window.setTimeout(() => { if (!this.on && this.ctx) this.ctx.suspend(); }, 900);
  }

  toggle() {
    if (this.on) { this.disable(); return false; }
    return this.enable();
  }

  // Short filtered blip. `step` 0..1 walks up the pentatonic scale, so a
  // count-up literally rises in pitch as the number climbs.
  tick(step = 0) {
    if (!this.on || !this.ctx) return;
    const now = performance.now();
    if (now - this.lastTick < 55) return;
    this.lastTick = now;
    const t = this.ctx.currentTime;
    const idx = Math.min(PENTATONIC.length - 1, Math.max(0, Math.floor(step * PENTATONIC.length)));
    const o = this.ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = PENTATONIC[idx] * 2;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.055, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + 0.13);
  }

  // Three rising notes for a moment landing (reveal, audit built).
  chime() {
    if (!this.on || !this.ctx) return;
    const t = this.ctx.currentTime;
    [0, 2, 4].forEach((deg, i) => {
      const o = this.ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = PENTATONIC[deg] * 2;
      const g = this.ctx.createGain();
      const at = t + i * 0.09;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.07, at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.5);
      o.connect(g);
      g.connect(this.master);
      o.start(at);
      o.stop(at + 0.55);
    });
  }
}

// Singleton: the page has one sound layer shared by story and dashboard.
export const audio = new FootprintAudio();
