/**
 * Audio service for Hindi Interactive Learning
 * Provides SpeechSynthesis with Hindi (hi-IN) voice support
 * and Web Audio API synthesized sound effects for instant, tactile feedback.
 */

class AudioService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private hindiVoice: SpeechSynthesisVoice | null = null;
  private voicesLoaded: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      this.voicesLoaded = true;
      // Prioritize explicit Hindi (hi-IN) voices
      this.hindiVoice =
        voices.find((v) => v.lang === 'hi-IN' || v.lang === 'hi_IN') ||
        voices.find((v) => v.lang.startsWith('hi')) ||
        voices.find((v) => v.name.toLowerCase().includes('hindi')) ||
        null;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Pronounce a Hindi letter or word using SpeechSynthesis.
   */
  public playSpeechText(text: string, onStart?: () => void, onEnd?: () => void, rate: number = 0.82): Promise<void> {
    return new Promise((resolve) => {
      if (this.isMuted) {
        onStart?.();
        setTimeout(() => {
          onEnd?.();
          resolve();
        }, 300);
        return;
      }

      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        this.playTone(440, 0.3);
        onStart?.();
        setTimeout(() => {
          onEnd?.();
          resolve();
        }, 400);
        return;
      }

      // Cancel ongoing utterance
      window.speechSynthesis.cancel();

      // Ensure voice is selected
      if (!this.hindiVoice && !this.voicesLoaded) {
        this.initVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      if (this.hindiVoice) {
        utterance.voice = this.hindiVoice;
      }
      utterance.rate = rate; // Slightly slowed down for clear articulation
      utterance.pitch = 1.05; // Friendly, clear pitch

      let hasEnded = false;
      const cleanup = () => {
        if (!hasEnded) {
          hasEnded = true;
          onEnd?.();
          resolve();
        }
      };

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        cleanup();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis note:', e);
        cleanup();
      };

      // Safety timeout in case onend doesn't trigger on some mobile browsers
      setTimeout(() => {
        cleanup();
      }, 3000);

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Pronounce a Hindi character (e.g. 'आ', 'क', 'म')
   */
  public playLetterAudio(letter: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
    return this.playSpeechText(letter, onStart, onEnd, 0.82);
  }

  /**
   * Pronounce a Hindi word (e.g. 'आम', 'कमल', 'मछली')
   */
  public playWordAudio(word: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
    return this.playSpeechText(word, onStart, onEnd, 0.88);
  }

  /**
   * Pronounce a character-word association (e.g. "आ से आम", "क से कमल")
   */
  public playAssociationAudio(char: string, word: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
    return this.playSpeechText(`${char} से ${word}`, onStart, onEnd, 0.85);
  }

  /**
   * Synthesize cheerful sound effects using Web Audio API
   */
  public playSfx(type: 'correct' | 'wrong' | 'celebrate' | 'click' | 'pop') {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (type) {
      case 'correct': {
        // Cheerful ascending major chime: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.001, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.4);
        });
        break;
      }

      case 'wrong': {
        // Gentle, soft retry boing: 330Hz down to 260Hz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(329.63, now);
        osc.frequency.exponentialRampToValueAtTime(246.94, now + 0.25);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.32);
        break;
      }

      case 'celebrate': {
        // Victory fanfare chords
        const chords = [
          [523.25, 659.25, 783.99], // C Major
          [587.33, 739.99, 880.0],  // D Major
          [659.25, 830.61, 987.77], // E Major
          [783.99, 987.77, 1318.51, 1567.98], // High C Major sparkle
        ];

        chords.forEach((chord, stepIdx) => {
          const stepTime = now + stepIdx * 0.15;
          chord.forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, stepTime);

            gain.gain.setValueAtTime(0.001, stepTime);
            gain.gain.exponentialRampToValueAtTime(0.18, stepTime + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, stepTime + (stepIdx === chords.length - 1 ? 0.8 : 0.25));

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(stepTime);
            osc.stop(stepTime + (stepIdx === chords.length - 1 ? 0.85 : 0.3));
          });
        });
        break;
      }

      case 'click': {
        // Quick subtle pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'pop': {
        // Cheerful toy bubble pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
    }
  }

  private playTone(freq: number, duration: number) {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }
}

export const audioService = new AudioService();
