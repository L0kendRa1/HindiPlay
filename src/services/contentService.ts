/**
 * Centralized API service for fetching Hindi learning content from the backend.
 * All paths are relative to API_BASE_URL (which includes /api).
 */

import { api } from './api';
import {
  BackendHindiWord,
  BackendHindiLetter,
  BackendHindiMatra,
  BackendHindiStory,
  ContentStatsData,
  RandomWordsParams,
  ContentListResponse,
  ContentItemResponse,
} from '../types/content';

/**
 * Fetch smart-selected random Hindi words.
 */
export async function getRandomWords(
  params: RandomWordsParams = {}
): Promise<ContentListResponse<BackendHindiWord>> {
  const query = new URLSearchParams();

  if (params.count !== undefined) query.set('count', String(params.count));
  if (params.activityId) query.set('activityId', params.activityId);
  if (params.category && params.category !== 'all') query.set('category', params.category);
  if (params.difficulty) query.set('difficulty', params.difficulty);
  if (params.hasImage !== undefined) query.set('hasImage', String(params.hasImage));
  if (params.exclude) query.set('exclude', params.exclude);

  const qs = query.toString();
  const path = qs ? `/content/hindi/words/random?${qs}` : '/content/hindi/words/random';

  return api.get<ContentListResponse<BackendHindiWord>>(path);
}

/**
 * Fetch paginated Hindi words with optional filtering.
 */
export async function getWords(params: {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  search?: string;
  hasImage?: boolean;
} = {}): Promise<ContentListResponse<BackendHindiWord>> {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.set('page', String(params.page));
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.category && params.category !== 'all') query.set('category', params.category);
  if (params.difficulty) query.set('difficulty', params.difficulty);
  if (params.search) query.set('search', params.search);
  if (params.hasImage !== undefined) query.set('hasImage', String(params.hasImage));

  const qs = query.toString();
  const path = qs ? `/content/hindi/words?${qs}` : '/content/hindi/words';

  return api.get<ContentListResponse<BackendHindiWord>>(path);
}

/**
 * Fetch all Hindi letters (Swar, Vyanjan, Sanyukt).
 */
export async function getLetters(): Promise<ContentListResponse<BackendHindiLetter>> {
  return api.get<ContentListResponse<BackendHindiLetter>>('/content/hindi/letters');
}

/**
 * Fetch all Hindi matras with combinations and examples.
 */
export async function getMatras(): Promise<ContentListResponse<BackendHindiMatra>> {
  return api.get<ContentListResponse<BackendHindiMatra>>('/content/hindi/matras');
}

/**
 * Fetch Hindi stories with comprehension questions.
 */
export async function getStories(params: {
  page?: number;
  limit?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
} = {}): Promise<ContentListResponse<BackendHindiStory>> {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.set('page', String(params.page));
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.difficulty) query.set('difficulty', params.difficulty);

  const qs = query.toString();
  const path = qs ? `/content/hindi/stories?${qs}` : '/content/hindi/stories';

  return api.get<ContentListResponse<BackendHindiStory>>(path);
}

/**
 * Fetch single story by ID.
 */
export async function getStoryById(id: string): Promise<ContentItemResponse<BackendHindiStory>> {
  return api.get<ContentItemResponse<BackendHindiStory>>(`/content/hindi/stories/${id}`);
}

/**
 * Fetch overall Hindi content library statistics.
 */
export async function getContentStats(): Promise<ContentItemResponse<ContentStatsData>> {
  return api.get<ContentItemResponse<ContentStatsData>>('/content/hindi/stats');
}
