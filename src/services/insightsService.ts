import { api } from './api';
import { LearningInsightsResponse } from '../types/insights';

/**
 * Fetch comprehensive learning insights dashboard data for the authenticated user.
 */
export async function getLearningInsights(): Promise<LearningInsightsResponse> {
  return api.get<LearningInsightsResponse>('/progress/insights');
}
