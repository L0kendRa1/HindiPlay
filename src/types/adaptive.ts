import { BackendHindiWord } from './content';

export type LearnerLevel = 'guest' | 'beginner' | 'intermediate' | 'advanced';
export type RecommendedDifficulty = 'easy' | 'medium' | 'hard';
export type RecommendationReason =
  | 'guest-starter-pack'
  | 'new-learner-welcome'
  | 'reinforce-weak-area'
  | 'continue-current-level'
  | 'challenge-learner';

export interface RecommendedActivity {
  activityCode: string;
  title: string;
  domain: string;
  reason: string;
  highlightTextHindi?: string;
}

export interface DomainAreaInfo {
  domain: string;
  nameHindi: string;
  accuracy: number;
  attempts: number;
}

export interface PersonalizedRecommendation {
  learnerLevel: LearnerLevel;
  recommendedDifficulty: RecommendedDifficulty;
  overallAccuracy: number;
  recentAccuracy?: number;
  totalAttempts: number;
  reason: RecommendationReason;
  messageHindi: string;
  messageEnglish: string;
  recommendedActivities: RecommendedActivity[];
  weakAreas: DomainAreaInfo[];
  strongAreas: DomainAreaInfo[];
  recommendedWords: BackendHindiWord[];
}

export interface PersonalizedRecommendationResponse {
  success: boolean;
  data: PersonalizedRecommendation;
}
