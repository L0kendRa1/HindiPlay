import { CharacterCategory, CategoryFilter, HindiCharacter, FeedbackType, ActivityStats } from './activity';

export interface PictureWordItem {
  id: string;
  character: string;             // e.g. 'आ', 'क', 'म'
  characterId: string;           // Ref to HindiCharacter.id
  word: string;                  // e.g. 'आम', 'कमल', 'मछली'
  meaning: string;               // e.g. 'Mango', 'Lotus', 'Fish'
  emoji: string;                 // e.g. '🥭', '🪷', '🐟'
  image?: string;                // e.g. '/images/aam.png'
  category: CharacterCategory;   // 'vowel' | 'consonant' | 'matra' | 'conjunct'
  hint?: string;                 // e.g. 'आ से आम'
}

export interface PictureMatchQuestion {
  id: string;
  targetCharacter: HindiCharacter;
  targetWord: PictureWordItem;
  options: PictureWordItem[];    // 3 choices (1 correct + 2 distractors)
  correctAnswerId: string;
}

export interface PictureMatchState {
  questions: PictureMatchQuestion[];
  currentIndex: number;
  currentQuestion: PictureMatchQuestion | null;
  selectedOptionId: string | null;
  wrongOptionIds: string[];
  feedback: FeedbackType;
  attempts: number;
  isAudioPlaying: boolean;
  isRoundComplete: boolean;
  categoryFilter: CategoryFilter;
  stats: ActivityStats;
}
