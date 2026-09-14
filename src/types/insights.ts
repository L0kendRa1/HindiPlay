import { PersonalizedRecommendation } from './adaptive';

export interface ActivityPerformanceItem {
  activityId: string;
  skillName: string;
  domain: string;
  attempts: number;
  completedCount: number;
  bestScore: number;
  mostRecentScore: number;
  mostRecentTotal: number;
  mostRecentAccuracy: number;
  averageAccuracy: number;
  lastAttemptAt: string;
  status: 'strong' | 'needs-practice' | 'in-progress';
}

export interface DomainInsightItem {
  domain: string;
  nameHindi: string;
  accuracy: number;
  attempts: number;
  statusTextHindi: string;
}

export interface RecentProgressPoint {
  sessionIndex: number;
  activityId: string;
  skillName: string;
  score: number;
  total: number;
  accuracy: number;
  completed: boolean;
  timeSpentSeconds: number;
  timestamp: string;
}

export interface LearningOverview {
  totalActivitiesCompleted: number;
  totalAttempts: number;
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
  totalTimeSpentSeconds: number;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  totalStars: number;
  badgesEarnedCount: number;
}

export interface LearningInsightsData {
  hasData: boolean;
  overview: LearningOverview;
  activityPerformance: ActivityPerformanceItem[];
  strengths: DomainInsightItem[];
  weaknesses: DomainInsightItem[];
  needsMoreData: DomainInsightItem[];
  recentProgressTrend: RecentProgressPoint[];
  focusRecommendations: PersonalizedRecommendation;
  emptyStateMessageHindi?: string;
}

export interface LearningInsightsResponse {
  success: boolean;
  data: LearningInsightsData;
}
