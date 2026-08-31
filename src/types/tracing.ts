import { FeedbackType, ActivityStats } from './activity';

export interface Point2D {
  x: number; // Normalized coordinate: 0.0 to 1.0
  y: number; // Normalized coordinate: 0.0 to 1.0
}

export interface StrokeData {
  id: string;
  order: number;            // 1-indexed stroke sequence (1, 2, 3...)
  name: string;             // Human-readable Devanagari stroke name, e.g. "खड़ी रेखा (Vertical)"
  points: Point2D[];        // Normalized points defining the ideal stroke trajectory
  directionHint?: string;   // e.g. "top-to-bottom", "left-to-right", "clockwise"
}

export interface CharacterTracingData {
  id: string;
  character: string;        // e.g. 'क', 'अ', 'आ', 'इ', 'ग', 'म'
  transliteration: string;  // e.g. 'ka', 'a', 'aa', 'i', 'ga', 'ma'
  category: 'vowel' | 'consonant';
  strokes: StrokeData[];    // Explicit ordered strokes
  meaning?: string;         // Example association word, e.g. "क से कमल"
  emoji?: string;           // e.g. "🪷"
}

export interface UserStroke {
  strokeIndex: number;
  points: Point2D[];
  timestamp: number;
}

export interface StrokeEvaluationResult {
  passed: boolean;
  score: number;            // 0.0 to 1.0
  averageDistance: number;  // In normalized units
  coverage: number;         // 0.0 to 1.0
  feedbackMessage?: string;
}

export interface CharacterTracingState {
  currentIndex: number;
  currentCharacter: CharacterTracingData;
  currentStrokeIndex: number; // Active expected stroke (0-indexed)
  userCompletedStrokes: UserStroke[]; // Successfully completed strokes
  activeUserStroke: Point2D[]; // Currently drawing stroke points
  feedback: FeedbackType;
  feedbackMessage: string;
  isStrokeEvaluating: boolean;
  isCharacterComplete: boolean;
  isRoundComplete: boolean;
  stats: ActivityStats;
}
