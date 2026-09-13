/**
 * Learning progress API service.
 *
 * All paths are relative to API_BASE_URL.
 * Accuracy is calculated on the backend — never sent from frontend.
 */

import { api } from './api';
import type {
  ProgressPayload,
  CreateProgressResponse,
  ProgressListResponse,
  ProgressStatsResponse,
} from '../types/api';

/** Optional query parameters for progress list endpoints */
interface ProgressListParams {
  page?: number;
  limit?: number;
  activityId?: string;
  subject?: string;
}

/**
 * Build a query string from optional parameters.
 * Filters out undefined values.
 */
function buildQuery(params?: ProgressListParams): string {
  if (!params) return '';

  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);

  return entries.length > 0 ? `?${entries.join('&')}` : '';
}

/**
 * Save a new activity progress/attempt result.
 * Backend calculates accuracy from score/total.
 * Also triggers gamification rewards (XP, stars, streak, badges).
 */
export async function saveProgress(
  payload: ProgressPayload
): Promise<CreateProgressResponse> {
  return api.post<CreateProgressResponse>('/progress', payload);
}

/**
 * Get paginated progress history for the current user.
 * Supports optional filters: activityId, subject, page, limit.
 */
export async function getProgress(
  params?: ProgressListParams
): Promise<ProgressListResponse> {
  return api.get<ProgressListResponse>(`/progress${buildQuery(params)}`);
}

/**
 * Get overall learning progress statistics for the current user.
 * Includes aggregate metrics and per-activity breakdown.
 */
export async function getProgressStats(): Promise<ProgressStatsResponse> {
  return api.get<ProgressStatsResponse>('/progress/stats');
}

/**
 * Get progress records for a specific activity.
 * @param activityId - The activity code (e.g. 'letter-quiz')
 * @param params - Optional pagination: page, limit
 */
export async function getActivityProgress(
  activityId: string,
  params?: Pick<ProgressListParams, 'page' | 'limit'>
): Promise<ProgressListResponse> {
  return api.get<ProgressListResponse>(
    `/progress/${encodeURIComponent(activityId)}${buildQuery(params)}`
  );
}
