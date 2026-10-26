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
  public musicVolume = signal<number>(0.25);

  public isWindMuted = signal<boolean>(false);
  public windVolume = signal<number>(0.3);

  // ==========================================
  // 2. AUDIO NODES
  // ==========================================
  private isMusicPlaying = false;
  private musicMasterGain: GainNode | null = null;
  private windMasterGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];

  // ==========================================
  // 3. CORE INITIALIZATION & NOISE GENERATOR
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
        this.noiseBuffer = this.createPinkNoiseBuffer(this.ctx, 5);
      }
      if (this.ctx && !this.isMusicPlaying && (!this.isMusicMuted() || !this.isWindMuted())) {
        this.startAmbientMusic();
      }
      return this.ctx;
    } catch (e) {
      console.warn('Web Audio API error:', e);
      return null;
    }
  }

  private createPinkNoiseBuffer(ctx: AudioContext, durationSeconds: number): AudioBuffer {
    const bufferSize = ctx.sampleRate * durationSeconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.04;
      b6 = white * 0.115926;
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

      const pitchVariation = 0.96 + Math.random() * 0.08;
      const startFreq = 190 * pitchVariation;
      const endFreq = 65 * pitchVariation;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.075);

      const vol = Math.max(0.001, this.sfxVolume() * 0.5);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
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

      const randomOffset = Math.random() * 4.5;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(2.5, now);
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.09);

      const gain = ctx.createGain();
      const vol = Math.max(0.001, this.sfxVolume() * 0.45);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now, randomOffset, 0.12);
    } catch {}
  }

  public playUnlock(): void {
    if (this.isSfxMuted() || this.sfxVolume() <= 0) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const vol = Math.max(0.001, this.sfxVolume() * 0.25);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.95);
      });
    } catch {}
  }

  // ==========================================
  // 5. AMBIENT MUSIC & WIND LAYERS
  // ==========================================

  public startAmbientMusic(): void {
    try {
      if (!this.ctx || this.isMusicPlaying) return;

      this.isMusicPlaying = true;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // --- MASTER GAIN: MUSIC ---
      this.musicMasterGain = ctx.createGain();
      const targetMusicGain = this.isMusicMuted()
        ? 0.0001
        : Math.max(0.0001, this.musicVolume() * 0.18);
      this.musicMasterGain.gain.setValueAtTime(0.0001, now);
      this.musicMasterGain.gain.linearRampToValueAtTime(targetMusicGain, now + 3.0);
      this.musicMasterGain.connect(ctx.destination);

      // --- MASTER GAIN: WIND ---
      this.windMasterGain = ctx.createGain();
      const targetWindGain = this.isWindMuted()
        ? 0.0001
        : Math.max(0.0001, this.windVolume() * 0.35);
      this.windMasterGain.gain.setValueAtTime(0.0001, now);
      this.windMasterGain.gain.linearRampToValueAtTime(targetWindGain, now + 3.0);
      this.windMasterGain.connect(ctx.destination);

      // --- LAYER A: ZEN HARMONIC DRONE ---
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, now);

      const filterLfo = ctx.createOscillator();
      const filterLfoGain = ctx.createGain();
      filterLfo.type = 'sine';
      filterLfo.frequency.setValueAtTime(0.08, now);
      filterLfoGain.gain.setValueAtTime(140, now);
      filterLfo.connect(filterLfoGain);
      filterLfoGain.connect(filter.frequency);
      filterLfo.start(now);

      filter.connect(this.musicMasterGain);

      const padFrequencies = [65.41, 98.0, 164.81, 196.0, 246.94, 293.66];
      this.ambientOscillators = [filterLfo];

      padFrequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const voiceGain = ctx.createGain();

        osc.type = index < 2 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime((index % 2 === 0 ? 1 : -1) * (2 + index * 1.2), now);

        const baseVoiceVol = index < 2 ? 0.22 : 0.1;
        voiceGain.gain.setValueAtTime(baseVoiceVol, now);

        const ampLfo = ctx.createOscillator();
        const ampLfoGain = ctx.createGain();
        ampLfo.type = 'sine';
        ampLfo.frequency.setValueAtTime(0.05 + index * 0.017, now);
        ampLfoGain.gain.setValueAtTime(baseVoiceVol * 0.45, now);

        ampLfo.connect(ampLfoGain);
        ampLfoGain.connect(voiceGain.gain);

        osc.connect(voiceGain);
        voiceGain.connect(filter);

        osc.start(now);
        ampLfo.start(now);

        this.ambientOscillators.push(osc, ampLfo);
      });

      // --- LAYER B: WIND & RUSTLING CANOPY ---
      this.setupWindAndLeavesLayer(ctx, now);
    } catch (e) {
      console.warn('Ambient synth init failed:', e);
      this.isMusicPlaying = false;
    }
  }

  private setupWindAndLeavesLayer(ctx: AudioContext, now: number): void {
    if (!this.noiseBuffer || !this.windMasterGain) return;

    const windSource = ctx.createBufferSource();
    windSource.buffer = this.noiseBuffer;
    windSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.Q.setValueAtTime(1.8, now);
    windFilter.frequency.setValueAtTime(550, now);

    const windPitchLfo = ctx.createOscillator();
    const windPitchLfoGain = ctx.createGain();
    windPitchLfo.type = 'sine';
    windPitchLfo.frequency.setValueAtTime(0.09, now);
    windPitchLfoGain.gain.setValueAtTime(260, now);
    windPitchLfo.connect(windPitchLfoGain);
    windPitchLfoGain.connect(windFilter.frequency);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.28, now);

    const windAmpLfo = ctx.createOscillator();
    const windAmpLfoGain = ctx.createGain();
    windAmpLfo.type = 'sine';
    windAmpLfo.frequency.setValueAtTime(0.065, now);
    windAmpLfoGain.gain.setValueAtTime(0.18, now);
    windAmpLfo.connect(windAmpLfoGain);
    windAmpLfoGain.connect(windGain.gain);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.windMasterGain);

    windSource.start(now);
    windPitchLfo.start(now);
    windAmpLfo.start(now);

    this.ambientOscillators.push(windPitchLfo, windAmpLfo);
  }

  public updateGains(): void {
    try {
      if (!this.ctx) {
        if (!this.isMusicMuted() || !this.isWindMuted()) this.initContext();
        return;
      }
      if (!this.isMusicPlaying && (!this.isMusicMuted() || !this.isWindMuted())) {
        this.startAmbientMusic();
        return;
      }
      const now = this.ctx.currentTime;

      if (this.musicMasterGain) {
        const targetMusic = this.isMusicMuted()
          ? 0.0001
          : Math.max(0.0001, this.musicVolume() * 0.18);
        this.musicMasterGain.gain.setTargetAtTime(targetMusic, now, 0.15);
      }

      if (this.windMasterGain) {
        const targetWind = this.isWindMuted() ? 0.0001 : Math.max(0.0001, this.windVolume() * 0.35);
        this.windMasterGain.gain.setTargetAtTime(targetWind, now, 0.15);
      }
    } catch {}
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
