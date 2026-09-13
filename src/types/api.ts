/**
 * TypeScript interfaces for all HindiPlay backend API responses.
 *
 * Derived from exact backend controller response shapes.
 * Every field name and nesting level matches the actual JSON payloads.
 */

// ============================================================
// Generic
// ============================================================

/** Standard error response from the backend */
export interface ApiError {
  success: false;
  message: string;
}

// ============================================================
// Auth Types
// ============================================================

/** User object returned by backend (password and __v stripped) */
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string; // Present in GET /me, omitted in register/login
}

/** Response from POST /auth/register and POST /auth/login */
export interface AuthResponse {
  success: true;
  message: string;
  token: string;
  user: User;
}

/** Response from GET /auth/me */
export interface MeResponse {
  success: true;
  user: User;
}

// ============================================================
// Progress Types
// ============================================================

/** A single progress record from the database */
export interface ProgressRecord {
  _id: string;
  user: string;
  subject: string;
  activityId: string;
  score: number;
  total: number;
  accuracy: number;
  attempts: number;
  completed: boolean;
  timeSpentSeconds: number;
  metadata: Record<string, unknown>;
  gamificationProcessed: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload sent to POST /progress.
 * Do NOT include accuracy — backend calculates it.
 */
export interface ProgressPayload {
  activityId: string;
  score: number;
  total: number;
  attempts?: number;
  completed?: boolean;
  timeSpentSeconds?: number;
  subject?: string;
  metadata?: Record<string, unknown>;
}

/** Badge info returned when a new badge is earned during progress save */
export interface EarnedBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

/** Gamification rewards returned alongside progress save */
export interface RewardSummary {
  xpEarned: number;
  starsEarned: number;
  currentStreak: number;
  longestStreak: number;
  newBadges: EarnedBadge[];
}

/** Response from POST /progress */
export interface CreateProgressResponse {
  success: true;
  message: string;
  data: ProgressRecord & {
    progress: ProgressRecord;
    rewards: RewardSummary;
  };
}

/** Pagination metadata included in list responses */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/** Response from GET /progress and GET /progress/:activityId */
export interface ProgressListResponse {
  success: true;
  data: ProgressRecord[];
  pagination: PaginationMeta;
}

/** Per-activity stats breakdown in the stats response */
export interface ActivityBreakdown {
  activityId: string;
  attempts: number;
  bestScore: number;
  averageAccuracy: number;
  lastAttemptAt: string;
}

/** Aggregated stats data */
export interface ProgressStats {
  totalActivitiesCompleted: number;
  totalAttempts: number;
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
  totalTimeSpentSeconds: number;
  averageScore: number;
  bestScore: number;
  activityCount: number;
  activityBreakdown: ActivityBreakdown[];
}

/** Response from GET /progress/stats */
export interface ProgressStatsResponse {
  success: true;
  data: ProgressStats;
}

// ============================================================
// Gamification Types
// ============================================================

/** Badge subdocument stored in user's gamification profile */
export interface UserBadge {
  id: string;
  name: string;
  earnedAt: string;
  metadata?: {
    description?: string;
    icon?: string;
  };
}

/** Gamification profile data */
export interface GamificationProfile {
  _id?: string;
  user?: string;
  totalXp: number;
  totalStars: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  badges: UserBadge[];
  createdAt?: string;
  updatedAt?: string;
}

/** Response from GET /gamification */
export interface GamificationResponse {
  success: true;
  data: GamificationProfile;
}

/** A badge from the catalog with earned status */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  isEarned: boolean;
  earnedAt: string | null;
}

/** Response from GET /gamification/badges */
export interface BadgesResponse {
  success: true;
  data: {
    earnedCount: number;
    totalBadges: number;
    badges: Badge[];
  };
}
