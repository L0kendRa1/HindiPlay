/**
 * Centralized fetch-based HTTP client for all HindiPlay API requests.
 *
 * - Auto-attaches JWT from authStorage as Authorization: Bearer header
 * - Auto-clears stale tokens on 401 responses
 * - Wraps all errors in ApiRequestError for consistent handling
 * - Debug logging only in development
 */

import { API_BASE_URL } from '../config/env';
import { getToken, clearToken } from './authStorage';

// Safe DEV check — tsconfig lacks vite/client types
const IS_DEV = (import.meta as unknown as { env: Record<string, string | undefined> }).env.DEV === 'true'
  || (import.meta as unknown as { env: Record<string, string | undefined> }).env.MODE === 'development';

/**
 * Custom error class for API request failures.
 * Provides structured access to HTTP status and backend error message.
 */
export class ApiRequestError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

/**
 * Build request headers with optional JWT authentication.
 */
function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Process a fetch Response into typed JSON or throw ApiRequestError.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // On 401, auto-clear stale token (silent, no redirect)
  if (response.status === 401) {
    clearToken();
  }

  let body: T & { success?: boolean; message?: string };

  try {
    body = await response.json() as T & { success?: boolean; message?: string };
  } catch {
    throw new ApiRequestError(
      response.status,
      `Server returned ${response.status} with non-JSON response`
    );
  }

  if (!response.ok) {
    const errorMessage = body?.message || `Request failed with status ${response.status}`;
    throw new ApiRequestError(response.status, errorMessage);
  }

  return body as T;
}

/**
 * Centralized API client.
 *
 * Paths are relative to the API base URL.
 * Example: api.get('/auth/me') → GET http://localhost:5000/api/auth/me
 */
export const api = {
  /**
   * Send a GET request.
   * @param path - Relative path (e.g. '/auth/me')
   */
  async get<T>(path: string): Promise<T> {
    const url = `${API_BASE_URL}${path}`;

    if (IS_DEV) {
      console.log(`[API] GET ${url}`);
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(),
      });

      return await handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw error;
      }
      // Network error (backend offline, CORS, etc.)
      throw new ApiRequestError(0, 'Network error: Unable to reach the server');
    }
  },

  /**
   * Send a POST request with a JSON body.
   * @param path - Relative path (e.g. '/auth/login')
   * @param body - Request payload (will be JSON.stringified)
   */
  async post<T>(path: string, body?: unknown): Promise<T> {
    const url = `${API_BASE_URL}${path}`;

    if (IS_DEV) {
      console.log(`[API] POST ${url}`);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: buildHeaders(),
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      return await handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw error;
      }
      // Network error (backend offline, CORS, etc.)
      throw new ApiRequestError(0, 'Network error: Unable to reach the server');
    }
  },
};
