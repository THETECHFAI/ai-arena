// AI Arena — Sound FX (Web Audio API, no external files)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('arena-sound-muted') === 'true';
  }

  getCtx() {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    } catch (e) {
      return null;
    }
  }

  // Short subtle click/pop — card selection
  pop() {
    if (this.muted) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.06);

    filter.type = 'highpass';
    filter.frequency.value = 300;

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  // Dramatic rising whoosh — battle start
  whoosh() {
    if (this.muted) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Rising sweep oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(2500, t + 0.5);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(150, t);
    filter.frequency.exponentialRampToValueAtTime(4000, t + 0.5);
    filter.Q.value = 1.5;

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.08);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.65);

    // Noise layer for texture
    const bufSize = Math.floor(ctx.sampleRate * 0.6);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const nFilter = ctx.createBiquadFilter();
    nFilter.type = 'bandpass';
    nFilter.frequency.setValueAtTime(400, t);
    nFilter.frequency.exponentialRampToValueAtTime(5000, t + 0.5);
    nFilter.Q.value = 0.7;
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0, t);
    nGain.gain.linearRampToValueAtTime(0.04, t + 0.1);
    nGain.gain.linearRampToValueAtTime(0.08, t + 0.35);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.6);
  }

  // Deep bass impact/boom — VS reveal
  impact() {
    if (this.muted) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Bass hit
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(80, t);
    bass.frequency.exponentialRampToValueAtTime(25, t + 0.35);
    bassGain.gain.setValueAtTime(0.35, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    bass.connect(bassGain);
    bassGain.connect(ctx.destination);
    bass.start(t);
    bass.stop(t + 0.55);

    // Transient click
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = 'square';
    click.frequency.setValueAtTime(160, t);
    click.frequency.exponentialRampToValueAtTime(35, t + 0.04);
    clickGain.gain.setValueAtTime(0.18, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    click.connect(clickGain);
    clickGain.connect(ctx.destination);
    click.start(t);
    click.stop(t + 0.08);

    // Noise burst
    const bufSize = Math.floor(ctx.sampleRate * 0.12);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const nFilter = ctx.createBiquadFilter();
    nFilter.type = 'lowpass';
    nFilter.frequency.value = 250;
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.12, t);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.12);
  }

  // Quick tick/ping — category bar reveal
  tick() {
    if (this.muted) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, t);
    osc.frequency.exponentialRampToValueAtTime(1600, t + 0.04);
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Triumphant chord/fanfare — winner
  victory() {
    if (this.muted) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Major chord arpeggio: C4-E4-G4-C5
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.06);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.07, t + i * 0.06 + 0.04);
      gain.gain.setValueAtTime(0.07, t + 0.9);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + i * 0.06);
      osc.stop(t + 1.7);
    });

    // High shimmer
    const shimmer = ctx.createOscillator();
    const sGain = ctx.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(1046.50, t + 0.25);
    shimmer.frequency.exponentialRampToValueAtTime(523.25, t + 1.5);
    sGain.gain.setValueAtTime(0, t);
    sGain.gain.linearRampToValueAtTime(0.025, t + 0.35);
    sGain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    shimmer.connect(sGain);
    sGain.connect(ctx.destination);
    shimmer.start(t + 0.25);
    shimmer.stop(t + 1.6);
  }

  // Neutral tension chord — draw
  draw() {
    if (this.muted) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Suspended chord: C4-F4-G4 (sus4 — unresolved tension)
    const notes = [261.63, 349.23, 392.00];
    notes.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.055, t + 0.1);
      gain.gain.setValueAtTime(0.055, t + 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.4);
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('arena-sound-muted', this.muted);
    return this.muted;
  }
}

let sfx;
