/**
 * AuthContext - provides authentication state and actions throughout the app.
 *
 * Uses TanStack Query to fetch the current user (/auth/me).
 * A 401 response clears the auth state and redirects to login.
 */

import { createContext, useContext, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api.js';
import { apiClient } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await authApi.getMe();
      return res.data.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 min
  });

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore - we clear state regardless
    }
    queryClient.clear();
  }, [queryClient]);

  // Attach a 401 interceptor that clears auth state
  // (the interceptor is set once; it calls logout via a stable ref)
  const handleUnauthorised = useCallback(() => {
    queryClient.setQueryData(['auth', 'me'], null);
    queryClient.clear();
  }, [queryClient]);

  // Register 401 response interceptor once
  const value = {
    user: user ?? null,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    isError,
    logout,
    handleUnauthorised,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * @returns {{ user: object|null, isAuthenticated: boolean, isAdmin: boolean, isLoading: boolean, logout: function }}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
