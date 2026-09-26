// Subtle, non-intrusive UI audio synthesizer (No mechanical clatter)
export class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;
  private volume: number = 0.35;
  private soundProfile: 'soft' | 'click' | 'minimal' | 'custom' = 'soft';
  private errorSoundEnabled: boolean = false;
  private completionSoundEnabled: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public configure(config: {
    enabled: boolean;
    volume?: number;
    profile?: 'soft' | 'click' | 'minimal' | 'custom';
    errorSound?: boolean;
    completionSound?: boolean;
  }) {
    this.enabled = config.enabled;
    if (config.volume !== undefined) {
      this.volume = Math.max(0, Math.min(1, config.volume / 100));
    }
    if (config.profile) {
      this.soundProfile = config.profile;
    }
    if (config.errorSound !== undefined) {
      this.errorSoundEnabled = config.errorSound;
    }
    if (config.completionSound !== undefined) {
      this.completionSoundEnabled = config.completionSound;
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public playKeyPress(isSpace?: boolean) {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = isSpace ? 340 : (this.soundProfile === 'click' ? 520 : 420);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(this.volume * 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Audio fallback safe
    }
  }

  public playError() {
    if (!this.enabled || !this.errorSoundEnabled || this.volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(this.volume * 0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  public playCompletion() {
    if (!this.enabled || !this.completionSoundEnabled || this.volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [440, 660, 880].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(this.volume * 0.1, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.15);
      });
    } catch {}
  }

  // Silent stubs for legacy game hooks
  public playAchievement() {}
  public playGameOver() {}
  public playPowerUp() {}
  public playLifeLost() {}
  public playWordDetonate() {}
  public playLevelUp() {}
  public playComboMilestone(_c?: number) {}
  public playCountdown(_go?: boolean) {}
}

export const soundEngine = new SoundEngine();
