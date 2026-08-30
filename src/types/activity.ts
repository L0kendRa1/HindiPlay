export type CharacterCategory = 'vowel' | 'consonant' | 'matra' | 'conjunct';

export type CategoryFilter = 'all' | CharacterCategory;

export interface HindiCharacter {
  id: string;
  char: string;                 // Devanagari character (e.g. 'अ', 'क', 'आ', 'म')
  name: string;                 // Romanized name (e.g. 'a', 'ka', 'aa', 'ma')
  category: CharacterCategory;  // 'vowel' | 'consonant' | 'matra' | 'conjunct'
  subCategory?: string;         // e.g. 'sparsh', 'antahstha', 'ushma', 'hrasva', 'deergha'
  pronunciationHint?: string;   // Phonetic hint in Hindi (e.g. 'क से कमल', 'छोटा अ')
  exampleWord?: {
    word: string;               // e.g. 'कमल'
    meaning: string;            // e.g. 'Lotus'
    emoji: string;              // e.g. '🪷'
  };
  audioFile?: string;           // Future slot for prerecorded audio file path
}

export interface Question {
  id: string;
  targetCharacter: HindiCharacter;
  options: HindiCharacter[];    // Typically 3 choices
  correctAnswerId: string;
}

export type FeedbackType = 'idle' | 'correct' | 'incorrect';

export interface ActivityStats {
  totalQuestions: number;
  currentQuestionIndex: number;
  score: number;
  firstAttemptSuccessCount: number;
  streak: number;
  bestStreak: number;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  currentQuestion: Question | null;
  selectedOptionId: string | null;
  feedback: FeedbackType;
  attemptsForCurrentQuestion: number;
  isAudioPlaying: boolean;
  isRoundComplete: boolean;
  categoryFilter: CategoryFilter;
  stats: ActivityStats;
}
