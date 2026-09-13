/**
 * Centralized environment configuration for the HindiPlay frontend.
 *
 * Reads VITE_API_BASE_URL from Vite environment variables.
 * Falls back to http://localhost:5000/api when not set.
 */

// Safe cast: tsconfig does not include vite/client types,
// so import.meta.env would cause TS2339 without this cast.
const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;

/**
 * Base URL for all backend API requests.
 * Includes the /api prefix — service endpoints should use relative paths
 * like `/auth/register`, NOT `/api/auth/register`.
 */
export const API_BASE_URL: string = env.VITE_API_BASE_URL || 'http://localhost:5000/api';
