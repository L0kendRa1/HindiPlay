/**
 * Gamification API service.
 *
 * All paths are relative to API_BASE_URL.
 */

import { api } from './api';
import type { GamificationResponse, BadgesResponse } from '../types/api';

/**
 * Get the gamification profile for the current user.
 * Returns XP, stars, streak, and earned badges.
 * For new users without activity, returns zero-state values.
 */
export async function getGamification(): Promise<GamificationResponse> {
  return api.get<GamificationResponse>('/gamification');
}

/**
 * Get the full badge catalog with the user's earned status.
 * Returns all available badges with isEarned flag and earnedAt date.
 */
export async function getBadges(): Promise<BadgesResponse> {
  return api.get<BadgesResponse>('/gamification/badges');
}
