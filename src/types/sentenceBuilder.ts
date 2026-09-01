import { FeedbackType, ActivityStats } from './activity';

export type SentenceDifficulty = 'easy' | 'medium' | 'hard';

export interface SentenceDifficultyConfig {
  id: SentenceDifficulty;
  label: string;
  wordCountLabel: string;
  stars: number;
  description: string;
}

export const SENTENCE_DIFFICULTIES: Record<SentenceDifficulty, SentenceDifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'आसान',
    wordCountLabel: '3–4 शब्द',
    stars: 1,
    description: 'सरल वाक्य (3–4 शब्द)',
  },
  medium: {
    id: 'medium',
    label: 'मध्यम',
    wordCountLabel: '4–5 शब्द',
    stars: 2,
    description: 'मध्यम वाक्य (4–5 शब्द)',
  },
  hard: {
    id: 'hard',
    label: 'कठिन',
    wordCountLabel: '5–7 शब्द',
    stars: 3,
    description: 'विस्तृत वाक्य (5–7 शब्द)',
  },
};

export interface SentenceWordItem {
  id: string;             // Unique identifier for card instance, e.g. 'word_ram_0'
  text: string;           // Hindi word string, e.g. 'राम'
  originalIndex: number;  // Correct index in original sentence (0, 1, 2, ...)
}

export interface SentenceData {
  id: string;
  words: string[];        // Array of atomic words in correct sequence, e.g. ['राम', 'स्कूल', 'जाता', 'है']
  fullSentence: string;   // Full Hindi sentence with punctuation, e.g. 'राम स्कूल जाता है।'
  difficulty: SentenceDifficulty;
  meaning?: string;       // English meaning, e.g. 'Ram goes to school.'
  emoji?: string;         // Descriptive emoji, e.g. '🏫'
  hint?: string;          // Optional hint, e.g. "पहला शब्द 'राम' है।"
}

export interface SentenceQuestion {
  id: string;
  sentence: SentenceData;
  shuffledWords: SentenceWordItem[];
}

export interface SentenceBuilderState {
  difficulty: SentenceDifficulty;
  questions: SentenceQuestion[];
  currentIndex: number;
  currentQuestion: SentenceQuestion | null;
  availableWords: SentenceWordItem[];
  placedWords: SentenceWordItem[];
  isChecked: boolean;
  isCorrect: boolean;
  feedback: FeedbackType;
  attempts: number;
  hintUsed: boolean;
  isRoundComplete: boolean;
  stats: ActivityStats;
}
