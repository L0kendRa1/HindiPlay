import { FeedbackType, ActivityStats } from './activity';

export type StoryDifficulty = 'easy' | 'medium' | 'hard';

export interface StoryDifficultyConfig {
  id: StoryDifficulty;
  label: string;
  sentenceCountLabel: string;
  questionsPerStory: number;
  stars: number;
  description: string;
}

export const STORY_DIFFICULTIES: Record<StoryDifficulty, StoryDifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'आसान',
    sentenceCountLabel: '3–4 वाक्य',
    questionsPerStory: 2,
    stars: 1,
    description: 'छोटी कहानी (3–4 वाक्य, 2 सवाल)',
  },
  medium: {
    id: 'medium',
    label: 'मध्यम',
    sentenceCountLabel: '5–6 वाक्य',
    questionsPerStory: 3,
    stars: 2,
    description: 'मध्यम कहानी (5–6 वाक्य, 3 सवाल)',
  },
  hard: {
    id: 'hard',
    label: 'कठिन',
    sentenceCountLabel: '7–10 वाक्य',
    questionsPerStory: 4,
    stars: 3,
    description: 'विस्तृत कहानी (7–10 वाक्य, 4 सवाल)',
  },
};

export interface StoryQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface StoryData {
  id: string;
  title: string;
  emoji: string;
  difficulty: StoryDifficulty;
  paragraphs: string[];
  fullStoryText: string;
  questions: StoryQuestion[];
}

export interface ReadingComprehensionState {
  difficulty: StoryDifficulty;
  stories: StoryData[];
  currentStoryIndex: number;
  currentQuestionIndex: number;
  selectedOption: string | null;
  isChecked: boolean;
  isCorrect: boolean;
  feedback: FeedbackType;
  attempts: number;
  isPlayingAudio: boolean;
  isStoryComplete: boolean;
  isRoundComplete: boolean;
  stats: ActivityStats;
}
