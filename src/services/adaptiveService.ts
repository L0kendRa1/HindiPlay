/**
 * Service to fetch personalized adaptive learning recommendations.
 */

import { api } from './api';
import { PersonalizedRecommendationResponse } from '../types/adaptive';

/**
 * Fetch personalized recommendations (dynamically tailored if authenticated, guest fallback otherwise).
 */
export async function getPersonalizedRecommendations(): Promise<PersonalizedRecommendationResponse> {
  return api.get<PersonalizedRecommendationResponse>('/content/hindi/personalized');
}

/**
 * Fetch explicit guest starter recommendations.
 */
export async function getGuestRecommendations(): Promise<PersonalizedRecommendationResponse> {
  return api.get<PersonalizedRecommendationResponse>('/content/hindi/personalized/guest');
}
