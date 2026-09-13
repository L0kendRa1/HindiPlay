/**
 * JWT token storage using localStorage.
 *
 * Simple wrapper around localStorage with a consistent key.
 * Used by the HTTP client (api.ts) and AuthContext.
 */

const TOKEN_KEY = 'hindiplay_token';

/** Retrieve the stored JWT token, or null if not present. */
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    // localStorage may be unavailable (SSR, private browsing, etc.)
    return null;
  }
}

/** Store a JWT token in localStorage. */
export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Silently fail — guest mode will still work
  }
}

/** Remove the stored JWT token from localStorage. */
export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Silently fail
  }
}

/** Check whether a JWT token is currently stored. */
export function hasToken(): boolean {
  return getToken() !== null;
}
