/**
 * Audio service for Hindi Interactive Learning
 * Provides SpeechSynthesis with Hindi (hi-IN) Indian voice prioritization
 * and Web Audio API synthesized sound effects for instant, tactile feedback.
 *
 * Features:
 * - Chromium/WebKit GC protection (retains active utterance references to prevent mid-speech cutoffs)
 * - Chromium 15-second speech bug workaround (pause/resume keepalive)
 * - Safe speech queue & rapid-click debounce
 * - Priority-based Indian Hindi voice selection (hi-IN, Google हिन्दी, Microsoft Hemant/Kalpana, etc.)
 * - Asynchronous voiceschanged listener with Promise-based resolution
 * - Natural calibrated rates for Devanagari learning and story reading
 * - Zero Unicode splitting: preserves complete words, sentences, and matra units
 * - Development diagnostics via getVoiceDiagnostics()
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

  /** Promise that resolves once voices are available (or immediately if already loaded) */
  private voicesReadyPromise: Promise<void>;
  private voicesReadyResolve: (() => void) | null = null;

  /** Chromium long-speech keepalive timer handle */
  private keepAliveInterval: ReturnType<typeof setInterval> | null = null;

  /** Default speech rate for Hindi pronunciation */
  private defaultRate: number = 0.88;

  /** Default pitch for Hindi pronunciation */
  private defaultPitch: number = 1.0;

  constructor() {
    // Create a deferred promise for voice readiness
    this.voicesReadyPromise = new Promise<void>((resolve) => {
      this.voicesReadyResolve = resolve;
    });

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Try immediate load (works on Firefox and some others)
      this.initVoices();

      // Handle asynchronous voice loading (Chromium/WebKit pattern)
      if (!this.voiceChangeHandlerAttached) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
        this.voiceChangeHandlerAttached = true;
      }
    } else {
      // No speech synthesis available — resolve immediately so callers don't hang
      this.voicesReadyResolve?.();
      this.voicesReadyResolve = null;
    }
  }

  /**
   * Capability-based Indian Hindi voice selection prioritizing 'hi-IN' native voices.
   *
   * Priority cascade:
   *   1. hi-IN voice with known Indian Hindi voice name (Google हिन्दी, Microsoft Hemant, etc.)
   *   2. Any voice with lang exactly 'hi-IN' or 'hi_IN'
   *   3. Any voice whose lang starts with 'hi'
   *   4. Any voice whose name contains 'hindi' or 'हिन्दी'
   *   5. Marathi voice as closest Devanagari sister language
   *   6. Browser default (null — SpeechSynthesis uses its own default)
   */
  public initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      this.voicesLoaded = true;

      let selected: SpeechSynthesisVoice | undefined;

      // 1. First priority: Exact match for hi-IN or hi_IN with native Indian voice naming
      selected = voices.find((v) => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        const isHiIn = lang === 'hi-in' || lang === 'hi_in';
        const isIndianHindiName =
          name.includes('hindi') ||
          name.includes('हिन्दी') ||
          name.includes('hemant') ||
          name.includes('kalpana') ||
          name.includes('swara') ||
          name.includes('madhur') ||
          name.includes('lekha') ||
          name.includes('neerja');
        return isHiIn && isIndianHindiName;
      });

      // 2. Second priority: Any voice with lang 'hi-IN' or 'hi_IN'
      if (!selected) {
        selected = voices.find(
          (v) => (v.lang || '').toLowerCase() === 'hi-in' || (v.lang || '').toLowerCase() === 'hi_in'
        );
      }

      // 3. Third priority: Any voice starting with 'hi'
      if (!selected) {
        selected = voices.find((v) => (v.lang || '').toLowerCase().startsWith('hi'));
      }

      // 4. Fourth priority: Any voice whose name contains 'hindi' or 'हिन्दी'
      if (!selected) {
        selected = voices.find(
          (v) =>
            (v.name || '').toLowerCase().includes('hindi') ||
            (v.name || '').toLowerCase().includes('हिन्दी') ||
            ((v.name || '').toLowerCase().includes('india') && (v.lang || '').toLowerCase().includes('hi'))
        );
      }

      // 5. Fifth priority: Marathi / Devanagari phonetics as closest sister language
      if (!selected) {
        selected = voices.find((v) => (v.lang || '').toLowerCase().startsWith('mr'));
      }

      const previousVoiceName = this.hindiVoice?.name;
      this.hindiVoice = selected ?? null;

      // Log voice selection in development only (safe check for Vite/non-Vite environments)
      const isDev = typeof (import.meta as { env?: { DEV?: boolean } }).env?.DEV !== 'undefined'
        ? (import.meta as { env?: { DEV?: boolean } }).env!.DEV
        : false;
      if (isDev && this.hindiVoice && this.hindiVoice.name !== previousVoiceName) {
        console.info(
          `[AudioService] Hindi voice selected: "${this.hindiVoice.name}" (lang: ${this.hindiVoice.lang}, localService: ${this.hindiVoice.localService})`
        );
      } else if (isDev && !this.hindiVoice && previousVoiceName !== undefined) {
        console.warn(
          `[AudioService] No Hindi voice available. Using browser default. ${voices.length} voices found.`
        );
      }

      // Resolve the voicesReady promise so any waiting callers proceed
      if (this.voicesReadyResolve) {
        this.voicesReadyResolve();
        this.voicesReadyResolve = null;
      }
    }
  }

  /**
   * Returns a Promise that resolves once voices have been loaded.
   * Safe to call multiple times — returns the same shared promise.
   */
  public waitForVoices(): Promise<void> {
    return this.voicesReadyPromise;
  }

  public getHindiVoice(): SpeechSynthesisVoice | null {
    if (!this.hindiVoice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
    }
    return this.hindiVoice;
  }

  /**
   * Development diagnostics: returns detailed info about current voice selection.
   * Call `audioService.getVoiceDiagnostics()` in browser console during dev.
   */
  public getVoiceDiagnostics(): {
    selectedVoice: { name: string; lang: string; localService: boolean } | null;
    voicesLoaded: boolean;
    totalVoicesAvailable: number;
    allHindiVoices: Array<{ name: string; lang: string; localService: boolean }>;
    isSpeaking: boolean;
    isMuted: boolean;
    defaultRate: number;
  } {
    const allVoices =
      typeof window !== 'undefined' && 'speechSynthesis' in window
        ? window.speechSynthesis.getVoices()
        : [];

    const hindiVoices = allVoices.filter(
      (v) =>
        (v.lang || '').toLowerCase().startsWith('hi') ||
        (v.name || '').toLowerCase().includes('hindi') ||
        (v.name || '').toLowerCase().includes('हिन्दी')
    );

    return {
      selectedVoice: this.hindiVoice
        ? {
            name: this.hindiVoice.name,
            lang: this.hindiVoice.lang,
            localService: this.hindiVoice.localService,
          }
        : null,
      voicesLoaded: this.voicesLoaded,
      totalVoicesAvailable: allVoices.length,
      allHindiVoices: hindiVoices.map((v) => ({
        name: v.name,
        lang: v.lang,
        localService: v.localService,
      })),
      isSpeaking: this.isSpeakingText,
      isMuted: this.isMuted,
      defaultRate: this.defaultRate,
    };
  }

  public isSpeaking(): boolean {
    return this.isSpeakingText;
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

  /** Configure default speech rate (0.1 – 2.0). Default: 0.90 */
  public setDefaultRate(rate: number) {
    this.defaultRate = Math.max(0.1, Math.min(2.0, rate));
  }

  public getDefaultRate(): number {
    return this.defaultRate;
  }

  /**
   * Start the Chromium long-speech keepalive.
   * Chromium pauses SpeechSynthesis after ~15 seconds. This periodically
   * pause/resumes to keep the speech alive without audible interruption.
   */
  private startKeepAlive() {
    this.stopKeepAlive();
    this.keepAliveInterval = setInterval(() => {
      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        window.speechSynthesis.speaking &&
        !window.speechSynthesis.paused
      ) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000); // Every 10 seconds, well before the ~15s Chromium cutoff
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval !== null) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  /**
   * Explicitly stop any active SpeechSynthesis audio.
   */
  public stopSpeech() {
    this.stopKeepAlive();
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
   * Pronounce a complete Hindi text using SpeechSynthesis.
   * - Entire text is passed intact as ONE natural utterance.
   * - Garbage collection protection ensures words/sentences are not cut off mid-speech.
   * - Rapid-click debounce prevents overlapping or broken audio streams.
   * - Chromium keepalive prevents 15-second timeout on long texts.
   */
  public playSpeechText(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    rate?: number
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

      // Debounce: If the exact same text is already speaking, let it finish
      if (this.isSpeakingText && this.currentSpeakingText === cleanText) {
        resolve();
        return;
      }

      // If a different text was speaking, cleanly cancel it first
      if (this.isSpeakingText && this.currentSpeakingText !== cleanText) {
        this.stopSpeech();
        // Small delay after cancel to let the browser's speech engine reset.
        // Without this, some browsers (especially Chromium) may silently drop
        // the next utterance that is queued immediately after cancel().
        setTimeout(() => {
          this.speakUtterance(cleanText, onStart, onEnd, rate, resolve);
        }, 50);
        return;
      }

      this.speakUtterance(cleanText, onStart, onEnd, rate, resolve);
    });
  }

  /**
   * Internal: creates and speaks a SpeechSynthesisUtterance.
   * Separated from playSpeechText to allow delayed invocation after cancel().
   */
  private speakUtterance(
    cleanText: string,
    onStart: (() => void) | undefined,
    onEnd: (() => void) | undefined,
    rate: number | undefined,
    resolve: () => void
  ) {
    // Ensure voices are initialized
    if (!this.hindiVoice && !this.voicesLoaded) {
      this.initVoices();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'hi-IN';
    if (this.hindiVoice) {
      utterance.voice = this.hindiVoice;
    }
    utterance.rate = rate ?? this.defaultRate;
    utterance.pitch = this.defaultPitch;
    utterance.volume = 1.0;

    // Retain strong reference to prevent Chromium garbage collection from cutting audio
    this.activeUtterances.add(utterance);
    this.isSpeakingText = true;
    this.currentSpeakingText = cleanText;

    let hasCleanedUp = false;
    const cleanup = () => {
      if (!hasCleanedUp) {
        hasCleanedUp = true;
        this.stopKeepAlive();
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
      // Start the Chromium keepalive for longer texts
      if (cleanText.length > 30) {
        this.startKeepAlive();
      }
      onStart?.();
    };

    utterance.onend = () => {
      cleanup();
    };

    utterance.onerror = (e) => {
      // 'canceled' and 'interrupted' errors are normal when intentionally interrupted
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn(`Speech synthesis notice (${cleanText.substring(0, 30)}...):`, e.error);
      }
      cleanup();
    };

    // Dynamic safety timer scaled to text length
    // Minimum 5s for short words, ~200ms per character for long story text
    // This is a backstop only — normal cleanup happens via onend/onerror
    const maxDuration = Math.max(5000, cleanText.length * 200);
    setTimeout(() => {
      cleanup();
    }, maxDuration);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis speak error:', err);
      cleanup();
    }
  }

  /**
   * Pronounce a Hindi character (e.g. 'अ', 'आ', 'क', 'म')
   */
  public playLetterAudio(letter: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
    return this.playSpeechText(letter, onStart, onEnd, 0.85);
  }

  /**
   * Pronounce a complete Hindi word (e.g. 'आम', 'कमल', 'माला', 'सेब')
   */
  public playWordAudio(word: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
    return this.playSpeechText(word, onStart, onEnd, 0.88);
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
    return this.playSpeechText(`${char} से ${word}`, onStart, onEnd, 0.85);
  }

  /**
   * Read a complete Hindi story naturally in Indian Hindi (hi-IN).
   * Uses Chromium keepalive for long paragraphs.
   */
  public playStoryAudio(
    storyTextOrParagraphs: string | string[],
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    const fullText = Array.isArray(storyTextOrParagraphs)
      ? storyTextOrParagraphs.join(' ')
      : storyTextOrParagraphs;
    return this.playSpeechText(fullText, onStart, onEnd, 0.85);
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
