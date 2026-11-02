import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  // ==========================================
  // 1. SETTINGS STATE (SIGNALS)
  // ==========================================
  public isSfxMuted = signal<boolean>(false);
  public sfxVolume = signal<number>(0.4);

  public isMusicMuted = signal<boolean>(false);
  public musicVolume = signal<number>(0.2);

  public isWindMuted = signal<boolean>(false);
  public windVolume = signal<number>(0.25);

  // ==========================================
  // 2. AUDIO NODES
  // ==========================================
  private isAmbientPlaying = false;
  private ambientMasterGain: GainNode | null = null;
  private windMasterGain: GainNode | null = null;
  private ambientNodes: AudioNode[] = [];
  private forestSoundTimers: ReturnType<typeof setTimeout>[] = [];

  // ==========================================
  // 3. CORE INITIALIZATION
  // ==========================================
  private initContext(): AudioContext | null {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this.ctx && !this.noiseBuffer) {
        this.noiseBuffer = this.createNoiseBuffer(this.ctx, 4);
      }
      if (this.ctx && !this.isAmbientPlaying && (!this.isMusicMuted() || !this.isWindMuted())) {
        this.startAmbient();
      }
      return this.ctx;
    } catch (e) {
      console.warn('Web Audio API error:', e);
      return null;
    }
  }

  private createNoiseBuffer(ctx: AudioContext, durationSeconds: number): AudioBuffer {
    const bufferSize = ctx.sampleRate * durationSeconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  // ==========================================
  // 4. SOUND EFFECTS (SFX)
  // ==========================================

  public playClick(): void {
    if (this.isSfxMuted() || this.sfxVolume() <= 0) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const pitchVariation = 0.97 + Math.random() * 0.06;
      const startFreq = 400 * pitchVariation;
      const endFreq = 700 * pitchVariation;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.06);

      const vol = Math.max(0.001, this.sfxVolume() * 0.3);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  public playTabSwitch(): void {
    if (this.isSfxMuted() || this.sfxVolume() <= 0) return;
    try {
      const ctx = this.initContext();
      if (!ctx || !this.noiseBuffer) return;

      const now = ctx.currentTime;
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1, now);
      filter.frequency.setValueAtTime(1500, now);
      filter.frequency.exponentialRampToValueAtTime(3000, now + 0.08);

      const gain = ctx.createGain();
      const vol = Math.max(0.001, this.sfxVolume() * 0.25);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now, Math.random() * 3, 0.12);
    } catch {}
  }

  public playUnlock(): void {
    if (this.isSfxMuted() || this.sfxVolume() <= 0) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Ascending major arpeggio: C5 E5 G5 C6
      const notes = [523.25, 659.25, 783.99, 1046.5];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        const vol = Math.max(0.001, this.sfxVolume() * 0.15);
        gain.gain.setValueAtTime(0.001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(vol, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.55);
      });
    } catch {}
  }

  // ==========================================
  // 5. AMBIENT FOREST SOUNDSCAPE
  // ==========================================

  public startAmbient(): void {
    try {
      if (!this.ctx || this.isAmbientPlaying) return;

      this.isAmbientPlaying = true;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // --- MASTER GAIN ---
      this.ambientMasterGain = ctx.createGain();
      const targetAmbientGain = this.isMusicMuted()
        ? 0.0001
        : Math.max(0.0001, this.musicVolume() * 0.15);
      this.ambientMasterGain.gain.setValueAtTime(0.0001, now);
      this.ambientMasterGain.gain.linearRampToValueAtTime(targetAmbientGain, now + 2.0);
      this.ambientMasterGain.connect(ctx.destination);

      // --- WIND MASTER GAIN ---
      this.windMasterGain = ctx.createGain();
      const targetWindGain = this.isWindMuted()
        ? 0.0001
        : Math.max(0.0001, this.windVolume() * 0.25);
      this.windMasterGain.gain.setValueAtTime(0.0001, now);
      this.windMasterGain.gain.linearRampToValueAtTime(targetWindGain, now + 2.0);
      this.windMasterGain.connect(ctx.destination);

      // --- LAYER A: SOFT HARMONIC DRONE (consonant fifths) ---
      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(450, now);
      droneFilter.connect(this.ambientMasterGain);

      const droneFreqs = [130.81, 196.0, 261.63]; // C3, G3, C4 - consonant intervals
      droneFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const voiceGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(-5, now); // slight detune for warmth

        voiceGain.gain.setValueAtTime(0.05, now);
        osc.connect(voiceGain);
        voiceGain.connect(droneFilter);

        osc.start(now);
        this.ambientNodes.push(osc, voiceGain);
      });

      // --- LAYER B: WIND THROUGH LEAVES (filtered noise) ---
      if (!this.isWindMuted()) {
        const windSource = ctx.createBufferSource();
        windSource.buffer = this.noiseBuffer;
        windSource.loop = true;

        const windFilter = ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.Q.setValueAtTime(1.5, now);
        windFilter.frequency.setValueAtTime(4000, now);

        const windGain = ctx.createGain();
        windGain.gain.setValueAtTime(0.12, now);

        // Slow amplitude modulation for gustiness
        const windAmpLfo = ctx.createOscillator();
        const windAmpLfoGain = ctx.createGain();
        windAmpLfo.type = 'sine';
        windAmpLfo.frequency.setValueAtTime(0.05, now);
        windAmpLfoGain.gain.setValueAtTime(0.08, now);

        windAmpLfo.connect(windAmpLfoGain);
        windAmpLfoGain.connect(windGain.gain);

        windSource.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(this.windMasterGain);

        windSource.start(now);
        windAmpLfo.start(now);
        this.ambientNodes.push(windSource, windFilter, windGain, windAmpLfo, windAmpLfoGain);
      }

      // --- SCHEDULED FOREST SOUNDS ---
      this.scheduleBirdChirp(ctx, now);
    } catch (e) {
      console.warn('Ambient init failed:', e);
      this.isAmbientPlaying = false;
    }
  }

  private scheduleBirdChirp(ctx: AudioContext, now: number): void {
    if (!this.ctx || this.isMusicMuted()) return;

    const nextChirp = now + 10 + Math.random() * 15; // 10-25 seconds
    const timer = setTimeout(
      () => {
        if (!this.ctx || this.isMusicMuted()) return;
        this.playBirdChirp();
        this.scheduleBirdChirp(this.ctx!, this.ctx.currentTime);
      },
      (nextChirp - now) * 1000,
    );
    this.forestSoundTimers.push(timer);
  }

  private playBirdChirp(): void {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Two-note chirp, slightly randomized
      const baseFreq = 3000 + Math.random() * 1000;
      const secondFreq = baseFreq * (1.3 + Math.random() * 0.3);

      [baseFreq, secondFreq].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + idx * 0.08 + 0.2);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {}
  }

  // ==========================================
  // 6. GAIN UPDATES & CONTROLS
  // ==========================================

  public updateGains(): void {
    try {
      if (!this.ctx) {
        if (!this.isMusicMuted() || !this.isWindMuted()) this.initContext();
        return;
      }
      if (!this.isAmbientPlaying && (!this.isMusicMuted() || !this.isWindMuted())) {
        this.startAmbient();
        return;
      }

      const now = this.ctx.currentTime;

      if (this.ambientMasterGain) {
        const targetMusic = this.isMusicMuted()
          ? 0.0001
          : Math.max(0.0001, this.musicVolume() * 0.15);
        this.ambientMasterGain.gain.setTargetAtTime(targetMusic, now, 0.2);
      }

      if (this.windMasterGain) {
        const targetWind = this.isWindMuted() ? 0.0001 : Math.max(0.0001, this.windVolume() * 0.25);
        this.windMasterGain.gain.setTargetAtTime(targetWind, now, 0.2);
      }
    } catch {}
  }

  public stopAmbient(): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Clear scheduled forest sounds
    this.forestSoundTimers.forEach((timer) => clearTimeout(timer));
    this.forestSoundTimers = [];

    this.ambientNodes.forEach((node) => {
      try {
        if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
          node.stop(now + 0.5);
        }
        if (node instanceof GainNode) {
          node.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        }
      } catch {}
    });
    this.ambientNodes = [];
    this.isAmbientPlaying = false;
    this.ambientMasterGain = null;
    this.windMasterGain = null;
  }

  public toggleSfxMute(): void {
    this.isSfxMuted.set(!this.isSfxMuted());
    if (!this.isSfxMuted()) this.playClick();
  }

  public toggleMusicMute(): void {
    this.isMusicMuted.set(!this.isMusicMuted());
    this.updateGains();
  }

  public toggleWindMute(): void {
    this.isWindMuted.set(!this.isWindMuted());
    this.updateGains();
  }

  public setSfxVolume(val: number): void {
    this.sfxVolume.set(val);
    if (val > 0 && this.isSfxMuted()) this.isSfxMuted.set(false);
  }

  public setMusicVolume(val: number): void {
    this.musicVolume.set(val);
    if (val > 0 && this.isMusicMuted()) this.isMusicMuted.set(false);
    this.updateGains();
  }

  public setWindVolume(val: number): void {
    this.windVolume.set(val);
    if (val > 0 && this.isWindMuted()) this.isWindMuted.set(false);
    this.updateGains();
  }
}
