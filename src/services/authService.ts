/**
 * Authentication API service.
 *
 * All paths are relative to API_BASE_URL (which already includes /api).
 * Example: '/auth/register' → http://localhost:5000/api/auth/register
 */

import { api } from './api';
import type { AuthResponse, MeResponse } from '../types/api';

/**
 * Register a new user account.
 * @returns AuthResponse with token and user on success
 */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/register', { name, email, password });
}

/**
 * Login with email and password.
 * @returns AuthResponse with token and user on success
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login', { email, password });
}

/**
 * Get the currently authenticated user's profile.
 * Requires a valid JWT token in storage.
 * @returns MeResponse with user profile
 */
export async function getMe(): Promise<MeResponse> {
  return api.get<MeResponse>('/auth/me');
}

/**
 * Logout the current user.
 * In stateless JWT auth, the server simply acknowledges;
 * token removal is handled by the caller (AuthContext).
 */
export async function logout(): Promise<void> {
  await api.post<{ success: boolean; message: string }>('/auth/logout');
}
