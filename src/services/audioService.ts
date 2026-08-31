/**
 * Audio service for Hindi Interactive Learning
 * Provides SpeechSynthesis with Hindi (hi-IN) voice support
 * and Web Audio API synthesized sound effects for instant, tactile feedback.
 * 
 * Features:
 * - Chromium/WebKit GC protection (retains active utterance references to prevent mid-speech cutoffs)
 * - Safe speech queue & rapid-click debounce
 * - Capability-based voice selection (hi-IN priority with graceful fallbacks)
 * - Natural calibrated rates for Devanagari learning (0.9 rate, 1.0 pitch)
 * - Zero Unicode splitting: preserves complete words and matra units
 */

class AudioService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private hindiVoice: SpeechSynthesisVoice | null = null;
  private voicesLoaded: boolean = false;
  private activeUtterances: Set<SpeechSynthesisUtterance> = new Set();
  private isSpeakingText: boolean = false;
  private currentSpeakingText: string | null = null;
  private voiceChangeHandlerAttached: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (!this.voiceChangeHandlerAttached) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
        this.voiceChangeHandlerAttached = true;
      }
    }
  }

  /**
   * Capability-based voice selection for Hindi (hi-IN)
   */
  public initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      this.voicesLoaded = true;

      let selected: SpeechSynthesisVoice | undefined;

      // 1. First priority: Exact match for hi-IN / hi_IN
      selected = voices.find(
        (v) => v.lang === 'hi-IN' || v.lang === 'hi_IN' || v.lang.toLowerCase() === 'hi-in'
      );

      // 2. Second priority: Any voice starting with 'hi'
      if (!selected) {
        selected = voices.find((v) => v.lang.toLowerCase().startsWith('hi'));
      }

      // 3. Third priority: Any voice with 'hindi' or 'india' in name
      if (!selected) {
        selected = voices.find(
          (v) =>
            v.name.toLowerCase().includes('hindi') ||
            (v.name.toLowerCase().includes('india') && v.lang.toLowerCase().includes('hi'))
        );
      }

      // 4. Fourth priority: Marathi / Devanagari phonetics or default
      if (!selected) {
        selected = voices.find((v) => v.lang.toLowerCase().startsWith('mr'));
      }

      this.hindiVoice = selected ?? null;
    }
  }

  public getHindiVoice(): SpeechSynthesisVoice | null {
    if (!this.hindiVoice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
    }
    return this.hindiVoice;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
    if (muted) {
      this.stopSpeech();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Explicitly stop any active SpeechSynthesis audio.
   */
  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn('Speech cancellation note:', err);
      }
    }
    this.activeUtterances.clear();
    this.isSpeakingText = false;
    this.currentSpeakingText = null;
  }

  /**
   * Pronounce a complete Hindi word or character using SpeechSynthesis.
   * - Entire text is passed intact as ONE utterance.
   * - Garbage collection protection ensures words are not cut off mid-speech.
   * - Rapid-click debounce prevents overlapping or broken audio streams.
   */
  public playSpeechText(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    rate: number = 0.90
  ): Promise<void> {
    return new Promise((resolve) => {
      const cleanText = text ? text.trim() : '';
      if (!cleanText) {
        onEnd?.();
        resolve();
        return;
      }

      if (this.isMuted) {
        onStart?.();
        setTimeout(() => {
          onEnd?.();
          resolve();
        }, 200);
        return;
      }

      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        this.playTone(440, 0.25);
        onStart?.();
        setTimeout(() => {
          onEnd?.();
          resolve();
        }, 300);
        return;
      }

      // Debounce: If the exact same word is already speaking, allow it to finish smoothly
      if (this.isSpeakingText && this.currentSpeakingText === cleanText) {
        return;
      }

      // If a different word was speaking, cleanly cancel it first
      if (this.isSpeakingText && this.currentSpeakingText !== cleanText) {
        this.stopSpeech();
      }

      // Ensure voices are initialized
      if (!this.hindiVoice && !this.voicesLoaded) {
        this.initVoices();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'hi-IN';
      if (this.hindiVoice) {
        utterance.voice = this.hindiVoice;
      }
      utterance.rate = rate; // Calibrated 0.90 for clear, natural Hindi articulation
      utterance.pitch = 1.0; // Natural pitch
      utterance.volume = 1.0;

      // Retain strong reference to prevent Chromium garbage collection from cutting audio
      this.activeUtterances.add(utterance);
      this.isSpeakingText = true;
      this.currentSpeakingText = cleanText;

      let hasCleanedUp = false;
      const cleanup = () => {
        if (!hasCleanedUp) {
          hasCleanedUp = true;
          this.activeUtterances.delete(utterance);
          if (this.currentSpeakingText === cleanText) {
            this.isSpeakingText = false;
            this.currentSpeakingText = null;
          }
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
        // 'canceled' errors are normal when intentionally interrupted
        if (e.error !== 'canceled') {
          console.warn(`Speech synthesis notice (${cleanText}):`, e.error);
        }
        cleanup();
      };

      // Safety timer (4.5s) to guarantee resolution if mobile browsers drop onend
      setTimeout(() => {
        cleanup();
      }, 4500);

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis speak error:', err);
        cleanup();
      }
    });
  }

  /**
   * Pronounce a Hindi character (e.g. 'अ', 'आ', 'क', 'म')
   */
  public playLetterAudio(letter: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
    return this.playSpeechText(letter, onStart, onEnd, 0.88);
  }

  /**
   * Pronounce a complete Hindi word (e.g. 'आम', 'कमल', 'मटर', 'माला', 'सेब')
   */
  public playWordAudio(word: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
    return this.playSpeechText(word, onStart, onEnd, 0.90);
  }

  /**
   * Pronounce a character-word association (e.g. "आ से आम", "क से कमल")
   */
  public playAssociationAudio(
    char: string,
    word: string,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    return this.playSpeechText(`${char} से ${word}`, onStart, onEnd, 0.88);
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
          gain.gain.exponentialRampToValueAtTime(0.22, now + idx * 0.08 + 0.02);
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
        gain.gain.linearRampToValueAtTime(0.16, now + 0.04);
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
            gain.gain.exponentialRampToValueAtTime(0.16, stepTime + 0.03);
            gain.gain.exponentialRampToValueAtTime(
              0.001,
              stepTime + (stepIdx === chords.length - 1 ? 0.8 : 0.25)
            );

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

        gain.gain.setValueAtTime(0.12, now);
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

        gain.gain.setValueAtTime(0.10, now);
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

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }
}

export const audioService = new AudioService();
