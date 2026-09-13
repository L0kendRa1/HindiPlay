/**
 * Authentication Context for HindiPlay.
 *
 * Provides global auth state (user, isAuthenticated, isLoading)
 * and methods (login, register, logout) to all components.
 *
 * Guest-first design:
 * - If no token exists, isLoading resolves to false immediately.
 * - If token exists, validates via GET /auth/me on mount.
 * - If backend is unreachable, silently clears stale token — no crash.
 * - Activities continue working without login.
 */

import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../types/api';
import { setToken, clearToken, hasToken } from '../services/authStorage';
import * as authService from '../services/authService';

// ============================================================
// Context Type
// ============================================================

export interface AuthContextType {
  /** The currently authenticated user, or null for guests */
  user: User | null;
  /** Whether a user is authenticated */
  isAuthenticated: boolean;
  /** Whether initial token validation is in progress */
  isLoading: boolean;
  /** Login with email and password. Throws on failure. */
  login: (email: string, password: string) => Promise<void>;
  /** Register a new account. Throws on failure. */
  register: (name: string, email: string, password: string) => Promise<void>;
  /** Logout and clear auth state. */
  logout: () => Promise<void>;
}

// Default context value (guest state)
const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

// ============================================================
// Provider
// ============================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = user !== null;

  // ----------------------------------------------------------
  // Startup: Validate existing token
  // ----------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function validateToken() {
      // No token stored — immediately resolve as guest
      if (!hasToken()) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (!cancelled) {
          setUser(response.user);
        }
      } catch {
        // Token invalid or backend offline — clear stale token silently
        clearToken();
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    validateToken();

    return () => {
      cancelled = true;
    };
  }, []);

  // ----------------------------------------------------------
  // Login
  // ----------------------------------------------------------
  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setToken(response.token);
    setUser(response.user);
  }, []);

  // ----------------------------------------------------------
  // Register
  // ----------------------------------------------------------
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await authService.register(name, email, password);
      setToken(response.token);
      setUser(response.user);
    },
    []
  );

  // ----------------------------------------------------------
  // Logout
  // ----------------------------------------------------------
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Backend may be offline — clear locally regardless
    }
    clearToken();
    setUser(null);
  }, []);

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
