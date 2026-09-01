export type MemoryDifficulty = 'easy' | 'medium' | 'hard';

export interface MemoryDifficultyConfig {
  id: MemoryDifficulty;
  label: string;
  pairsCount: number;
  totalCards: number;
  gridColsClass: string;
  stars: number;
  description: string;
}

export const MEMORY_DIFFICULTIES: Record<MemoryDifficulty, MemoryDifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'आसान',
    pairsCount: 4,
    totalCards: 8,
    gridColsClass: 'grid-cols-2 sm:grid-cols-4',
    stars: 1,
    description: '4 जोड़े (8 कार्ड)',
  },
  medium: {
    id: 'medium',
    label: 'मध्यम',
    pairsCount: 6,
    totalCards: 12,
    gridColsClass: 'grid-cols-3 sm:grid-cols-4',
    stars: 2,
    description: '6 जोड़े (12 कार्ड)',
  },
  hard: {
    id: 'hard',
    label: 'कठिन',
    pairsCount: 8,
    totalCards: 16,
    gridColsClass: 'grid-cols-4',
    stars: 3,
    description: '8 जोड़े (16 कार्ड)',
  },
};

export type MemoryCardType = 'word' | 'image';

export interface MemoryCardItem {
  id: string;              // Unique card ID, e.g. 'card_aam_word_1'
  pairId: string;          // Identifier matching pair, e.g. 'pw_aa_aam'
  type: MemoryCardType;    // 'word' or 'image'
  word: string;            // Devanagari word, e.g. 'आम'
  meaning: string;         // English meaning, e.g. 'Mango'
  image?: string;          // SVG illustration path, e.g. '/images/words/pw_aa_aam.svg'
  emoji: string;           // Fallback emoji, e.g. '🥭'
}

export interface MemoryGameState {
  difficulty: MemoryDifficulty;
  cards: MemoryCardItem[];
  flippedCardIds: string[];
  matchedPairIds: string[];
  moves: number;
  score: number;
  isChecking: boolean;
  isGameComplete: boolean;
}
