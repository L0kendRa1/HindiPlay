export interface LetterItem {
  id: string;
  char: string;          // Devanagari character (e.g. 'अ', 'आ')
  name: string;          // Romanized name (e.g. 'a', 'aa')
  pronunciationHint: string; // Phonetic hint in Hindi (e.g. 'छोटा अ')
  exampleWord?: {
    word: string;        // e.g. 'अनार'
    meaning: string;     // e.g. 'Pomegranate'
    emoji: string;       // e.g. '🍎'
  };
  audioFile?: string;    // Future slot for prerecorded MP3/WAV
}

export interface Question {
  id: string;
  targetLetter: LetterItem;
  options: LetterItem[]; // Typically 3 choices
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
  stats: ActivityStats;
}
