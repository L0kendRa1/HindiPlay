import { FeedbackType, ActivityStats } from './activity';

export type UnitType = 'base' | 'vowel-unit' | 'consonant-matra' | 'conjunct';

export interface HindiUnit {
  id: string;
  base: string;           // Base character (e.g. 'म', 'क', 'आ')
  matra?: string;         // Vowel sign (e.g. 'ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ')
  display: string;        // Rendered visible unit (e.g. 'मा', 'कि', 'आ', 'म')
  type: UnitType;
  hint?: string;          // Pedagogical decomposition (e.g. 'म + ा')
}

export interface WordBuilderWord {
  id: string;
  word: string;           // e.g. 'माला', 'आम', 'कमल', 'तरबूज'
  units: HindiUnit[];     // Explicit pedagogical sequence of units
  unitCount: number;      // Explicit pedagogical count of learning units (NOT JavaScript string length)
  meaning: string;        // e.g. 'गले में पहनने वाली वस्तु'
  emoji: string;          // e.g. '📿', '🥭', '🪷'
  image?: string;         // Optional image URL
  category: 'simple' | 'matra'; // Pedagogical categorization
  hint?: string;
}

export interface WordLengthOption {
  unitCount: number;      // e.g. 2, 3, 4
  label: string;          // e.g. '2 अक्षर'
  stars: number;          // e.g. 1, 2, 3
  examples: string[];     // e.g. ['आम', 'माला', 'कार']
  wordCount: number;
}

export type WordBuilderMode = 'guided' | 'discovery';

export interface WordBuilderQuestion {
  id: string;
  targetWord: WordBuilderWord;
  availableUnits: HindiUnit[]; // Shuffled units
}

export interface WordBuilderState {
  mode: WordBuilderMode;
  selectedUnitCount: number | null; // null = selector screen
  questions: WordBuilderQuestion[];
  currentIndex: number;
  currentQuestion: WordBuilderQuestion | null;
  selectedUnits: HindiUnit[];
  availableUnits: HindiUnit[];
  feedback: FeedbackType;
  attempts: number;
  isSolved: boolean;
  isRoundComplete: boolean;
  stats: ActivityStats;
  discoveredWord: WordBuilderWord | null;
  discoveredWordsHistory: WordBuilderWord[];
}
