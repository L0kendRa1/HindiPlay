/**
 * Frontend types for Hindi learning content returned by backend content endpoints.
 */

export interface BackendImage {
  url: string;
  alt: string;
  source?: string;
  license?: string;
}

export interface BackendHindiWord {
  _id: string;
  word: string;
  normalizedWord: string;
  meaning: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  letters: string[];
  learningUnits: string[];
  matras: string[];
  image: BackendImage | null;
  audioText: string;
  tags: string[];
  isActive: boolean;
  subject: string;
}

export interface BackendHindiLetter {
  _id: string;
  character: string;
  name: string;
  type: 'स्वर' | 'व्यंजन' | 'अन्य';
  pronunciationText: string;
  learningUnits: string[];
  exampleWord: string;
  exampleMeaning: string;
  image: BackendImage | null;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BackendHindiMatra {
  _id: string;
  symbol: string;
  name: string;
  sound: string;
  vowelEquivalent: string;
  position: 'right' | 'left' | 'top' | 'bottom';
  examples: Array<{
    baseConsonant: string;
    combinedUnit: string;
    exampleWord: string;
  }>;
  learningUnits: string[];
  audioText: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BackendStoryQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface BackendHindiStory {
  _id: string;
  title: string;
  description: string;
  paragraphs: string[];
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageLevel: string;
  vocabulary: string[];
  questions: BackendStoryQuestion[];
  image: BackendImage | null;
  audioText: string;
  emoji: string;
}

export interface ContentStatsData {
  words: number;
  letters: number;
  matras: number;
  stories: number;
  wordsWithImages: number;
  categoriesCount: number;
  categories: string[];
  wordsByDifficulty?: {
    easy: number;
    medium: number;
    hard: number;
  };
  wordsByCategory?: Record<string, number>;
}

export interface RandomWordsParams {
  count?: number;
  activityId?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  hasImage?: boolean;
  exclude?: string;
}

export interface ContentListResponse<T> {
  success: true;
  count?: number;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ContentItemResponse<T> {
  success: true;
  data: T;
}
