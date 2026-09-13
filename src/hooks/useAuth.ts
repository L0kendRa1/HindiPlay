/**
 * Convenience hook for accessing AuthContext.
 *
 * Usage:
 *   const { user, isAuthenticated, login, logout } = useAuth();
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../context/AuthContext';

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
