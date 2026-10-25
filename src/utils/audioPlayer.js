// Romantic Wedding Synthesizer & Audio Engine using Web Audio API
// Generates warm, ethereal acoustic piano & harp chord progression (Canon in D / Wedding Chords)
// Completely self-contained, requires no external MP3 dependencies, guaranteed to work anywhere!

class WeddingAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.currentStep = 0;
    this.volume = 0.35;
    this.gainNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Romantic chord progression notes (D major, A/C#, Bm, F#m, G, D, G, A)
  getChords() {
    return [
      { root: 293.66, notes: [293.66, 369.99, 440.00, 587.33] }, // D
      { root: 220.00, notes: [277.18, 329.63, 440.00, 554.37] }, // A
      { root: 246.94, notes: [246.94, 293.66, 369.99, 493.88] }, // Bm
      { root: 185.00, notes: [277.18, 369.99, 440.00, 554.37] }, // F#m
      { root: 196.00, notes: [196.00, 246.94, 293.66, 392.00] }, // G
      { root: 293.66, notes: [220.00, 293.66, 369.99, 440.00] }, // D
      { root: 196.00, notes: [196.00, 246.94, 293.66, 392.00] }, // G
      { root: 220.00, notes: [220.00, 277.18, 329.63, 440.00] }, // A
    ];
  }

  playPluck(freq, delay = 0, duration = 3.5) {
    if (!this.ctx || !this.gainNode) return;
    const now = this.ctx.currentTime + delay;

    // Dual oscillator for rich warm acoustic bell/harp timbre
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.002, now); // subtle natural chorus

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration);

    // Warm envelope
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.22, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  playStep() {
    const chords = this.getChords();
    const chord = chords[this.currentStep % chords.length];

    // Arpeggiate chord notes smoothly like a wedding harp
    chord.notes.forEach((freq, idx) => {
      this.playPluck(freq, idx * 0.42, 4.0);
    });

    // Deep gentle bass note
    this.playPluck(chord.root / 2, 0, 5.0);

    this.currentStep = (this.currentStep + 1) % chords.length;
  }

  playChime() {
    this.init();
    if (!this.ctx) return;
    // Special magical chime when wax seal is cracked
    const chimeFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    chimeFreqs.forEach((freq, i) => {
      this.playPluck(freq, i * 0.09, 3.0);
    });
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.playStep();
    this.timerId = setInterval(() => {
      if (this.isPlaying) {
        this.playStep();
      }
    }, 2400);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const weddingAudio = new WeddingAudioEngine();
