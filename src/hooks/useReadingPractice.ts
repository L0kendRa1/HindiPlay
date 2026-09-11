import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReadingPracticeItem,
  ReadingPracticeDifficulty,
  getReadingPracticeItems,
} from '../data/readingPractice';
import { audioService } from '../services/audioService';
import {
  compareHindiReading,
  HindiReadingComparison,
  ReadingError,
} from '../utils/hindiTextUtils';

/**
 * Minimal SpeechRecognition type declarations for browser Web Speech API.
 * Avoids importing large type packages while staying type-safe.
 */
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  onaudiostart: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export type RecognitionState = 'idle' | 'listening' | 'processing' | 'result' | 'error';

export interface ReadingPracticeHook {
  // Content
  currentItem: ReadingPracticeItem | null;
  currentIndex: number;
  totalItems: number;
  difficulty: ReadingPracticeDifficulty;

  // Recognition & Comparison
  recognitionState: RecognitionState;
  interimText: string;
  finalText: string;
  comparisonResult: HindiReadingComparison | null;
  errorMessage: string;
  isSupported: boolean;

  // Scoring & Flow
  score: number;
  attempts: number;
  isRoundComplete: boolean;

  // Actions
  startRecognition: () => void;
  stopRecognition: () => void;
  retryRecognition: () => void;
  nextItem: () => void;
  previousItem: () => void;
  restartRound: () => void;
  setDifficulty: (diff: ReadingPracticeDifficulty) => void;
  listenToExpectedText: () => void;
  pronounceWord: (word: string) => void;
}

export function useReadingPractice(): ReadingPracticeHook {
  const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
  const isSupported = SpeechRecognitionCtor !== null;

  const [difficulty, setDifficultyState] = useState<ReadingPracticeDifficulty>('easy');
  const [items, setItems] = useState<ReadingPracticeItem[]>(() => getReadingPracticeItems('easy'));
  const [currentIndex, setCurrentIndex] = useState(0);

  const [recognitionState, setRecognitionState] = useState<RecognitionState>('idle');
  const [interimText, setInterimText] = useState('');
  const [finalText, setFinalText] = useState('');
  const [comparisonResult, setComparisonResult] = useState<HindiReadingComparison | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Scoring & Attempts
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hasScoredCurrentItem, setHasScoredCurrentItem] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isActiveRef = useRef(false);

  const currentItem = items[currentIndex] ?? null;
  const totalItems = items.length;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_e) {
          // Ignore
        }
        recognitionRef.current = null;
      }
      isActiveRef.current = false;
      audioService.stopSpeech();
    };
  }, []);

  const pronounceWord = useCallback((word: string) => {
    if (!word) return;
    audioService.playWordAudio(word);
  }, []);

  const handleSpeechResult = useCallback(
    (spokenText: string) => {
      const cleanSpoken = spokenText.trim();
      setFinalText(cleanSpoken);
      setInterimText('');
      setRecognitionState('result');

      if (!currentItem) return;

      const comparison = compareHindiReading(currentItem.text, cleanSpoken);
      setComparisonResult(comparison);

      setAttempts((prev) => {
        const nextAttempts = prev + 1;

        if (comparison.isCorrect) {
          audioService.playSfx('correct');
          // Award point only on first attempt
          if (!hasScoredCurrentItem && prev === 0) {
            setScore((s) => s + 1);
            setHasScoredCurrentItem(true);
          }
        } else {
          audioService.playSfx('wrong');

          // Stage B requirement: automatically pronounce the first problematic expected word
          const firstErrorWord = comparison.errors.find(
            (e: ReadingError) => e.expectedWord
          )?.expectedWord;

          if (firstErrorWord) {
            setTimeout(() => {
              audioService.playWordAudio(firstErrorWord);
            }, 350);
          }
        }

        return nextAttempts;
      });
    },
    [currentItem, hasScoredCurrentItem]
  );

  const startRecognition = useCallback(() => {
    if (!SpeechRecognitionCtor) {
      setRecognitionState('error');
      setErrorMessage('इस ब्राउज़र में आवाज़ पहचानने की सुविधा उपलब्ध नहीं है।');
      return;
    }

    // Prevent multiple simultaneous instances
    if (isActiveRef.current && recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_e) {
        // Ignore
      }
    }

    // Stop any playing audio
    audioService.stopSpeech();

    // Reset current attempt recognition state
    setInterimText('');
    setFinalText('');
    setComparisonResult(null);
    setErrorMessage('');
    setRecognitionState('listening');

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isActiveRef.current = true;
      setRecognitionState('listening');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? '';
        if (result.isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (interim) {
        setInterimText(interim);
      }

      if (final) {
        handleSpeechResult(final);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn('[ReadingPractice] SpeechRecognition error:', event.error, event.message);

      // Don't update state for abort errors during intentional stops
      if (event.error === 'aborted') return;

      let msg = 'कुछ समझ में नहीं आया। कृपया फिर से बोलें।';

      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          msg = 'माइक की अनुमति नहीं मिली। कृपया ब्राउज़र में माइक्रोफ़ोन की अनुमति दें।';
          break;
        case 'no-speech':
          msg = 'कुछ सुनाई नहीं दिया। कृपया फिर से बोलें।';
          break;
        case 'network':
          msg = 'नेटवर्क में समस्या है। कृपया इंटरनेट कनेक्शन जाँचें।';
          break;
        case 'audio-capture':
          msg = 'माइक्रोफ़ोन नहीं मिला। कृपया माइक जोड़ें और फिर से कोशिश करें।';
          break;
        case 'language-not-supported':
          msg = 'हिन्दी भाषा पहचान इस ब्राउज़र में उपलब्ध नहीं है।';
          break;
      }

      setErrorMessage(msg);
      setRecognitionState('error');
      isActiveRef.current = false;
    };

    recognition.onend = () => {
      isActiveRef.current = false;
      setRecognitionState((prev) => {
        if (prev === 'listening') {
          if (!finalText) {
            setErrorMessage('कुछ सुनाई नहीं दिया। कृपया फिर से बोलें।');
            return 'error';
          }
          return 'result';
        }
        return prev;
      });
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.warn('[ReadingPractice] Failed to start recognition:', err);
      setErrorMessage('आवाज़ पहचान शुरू नहीं हो सकी। कृपया फिर से कोशिश करें।');
      setRecognitionState('error');
      isActiveRef.current = false;
    }
  }, [SpeechRecognitionCtor, finalText, handleSpeechResult]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current && isActiveRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_e) {
        // Ignore
      }
      isActiveRef.current = false;
      setRecognitionState((prev) => (prev === 'listening' ? 'processing' : prev));
    }
  }, []);

  const retryRecognition = useCallback(() => {
    if (recognitionRef.current && isActiveRef.current) {
      try { recognitionRef.current.abort(); } catch (_e) { /* */ }
    }
    audioService.stopSpeech();
    setFinalText('');
    setInterimText('');
    setComparisonResult(null);
    setErrorMessage('');
    setRecognitionState('idle');
  }, []);

  const nextItem = useCallback(() => {
    if (recognitionRef.current && isActiveRef.current) {
      try { recognitionRef.current.abort(); } catch (_e) { /* */ }
    }
    audioService.stopSpeech();
    audioService.playSfx('pop');

    if (currentIndex + 1 >= items.length) {
      setIsRoundComplete(true);
      audioService.playSfx('celebrate');
      return;
    }

    setFinalText('');
    setInterimText('');
    setComparisonResult(null);
    setErrorMessage('');
    setRecognitionState('idle');
    setAttempts(0);
    setHasScoredCurrentItem(false);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, items.length]);

  const previousItem = useCallback(() => {
    if (recognitionRef.current && isActiveRef.current) {
      try { recognitionRef.current.abort(); } catch (_e) { /* */ }
    }
    audioService.stopSpeech();
    audioService.playSfx('pop');

    setFinalText('');
    setInterimText('');
    setComparisonResult(null);
    setErrorMessage('');
    setRecognitionState('idle');
    setAttempts(0);
    setHasScoredCurrentItem(false);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : items.length - 1));
  }, [items.length]);

  const restartRound = useCallback(() => {
    if (recognitionRef.current && isActiveRef.current) {
      try { recognitionRef.current.abort(); } catch (_e) { /* */ }
    }
    audioService.stopSpeech();
    audioService.playSfx('click');

    const newItems = getReadingPracticeItems(difficulty);
    setItems(newItems);
    setCurrentIndex(0);
    setScore(0);
    setAttempts(0);
    setHasScoredCurrentItem(false);
    setIsRoundComplete(false);
    setFinalText('');
    setInterimText('');
    setComparisonResult(null);
    setErrorMessage('');
    setRecognitionState('idle');
  }, [difficulty]);

  const setDifficulty = useCallback((diff: ReadingPracticeDifficulty) => {
    if (recognitionRef.current && isActiveRef.current) {
      try { recognitionRef.current.abort(); } catch (_e) { /* */ }
    }
    audioService.stopSpeech();
    audioService.playSfx('click');

    setDifficultyState(diff);
    const newItems = getReadingPracticeItems(diff);
    setItems(newItems);
    setCurrentIndex(0);
    setScore(0);
    setAttempts(0);
    setHasScoredCurrentItem(false);
    setIsRoundComplete(false);
    setFinalText('');
    setInterimText('');
    setComparisonResult(null);
    setErrorMessage('');
    setRecognitionState('idle');
  }, []);

  const listenToExpectedText = useCallback(() => {
    if (!currentItem) return;
    audioService.playSpeechText(currentItem.text);
  }, [currentItem]);

  return {
    currentItem,
    currentIndex,
    totalItems,
    difficulty,
    recognitionState,
    interimText,
    finalText,
    comparisonResult,
    errorMessage,
    isSupported,
    score,
    attempts,
    isRoundComplete,
    startRecognition,
    stopRecognition,
    retryRecognition,
    nextItem,
    previousItem,
    restartRound,
    setDifficulty,
    listenToExpectedText,
    pronounceWord,
  };
}
