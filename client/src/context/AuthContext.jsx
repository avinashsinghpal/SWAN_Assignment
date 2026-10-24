/**
 * AuthContext - provides authentication state and actions throughout the app.
 *
 * Uses TanStack Query to fetch the current user (/auth/me).
 * A 401 response clears the auth state and redirects to login.
 */

import { createContext, useContext, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const isExplicitlyLoggedOut =
    typeof window !== 'undefined' && sessionStorage.getItem('swan:logged_out') === '1';

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
    enabled: !isExplicitlyLoggedOut,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 min
  });

  const logout = useCallback(async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('swan:logged_out', '1');
    }
    try {
      await authApi.logout();
    } catch {
      // Ignore - we clear state regardless
    }
    await queryClient.cancelQueries({ queryKey: ['auth', 'me'] });
    queryClient.setQueryData(['auth', 'me'], null);
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== 'auth',
    });
  }, [queryClient]);

  const handleUnauthorized = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('swan:logged_out', '1');
    }
    queryClient.cancelQueries({ queryKey: ['auth', 'me'] });
    queryClient.setQueryData(['auth', 'me'], null);
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== 'auth',
    });
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.href = `/login?expired=1&from=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    }
  }, [queryClient]);

  useEffect(() => {
    window.addEventListener('swan:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('swan:unauthorized', handleUnauthorized);
  }, [handleUnauthorized]);

  const value = {
    user: user ?? null,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    isError,
    logout,
    handleUnauthorized,
    handleUnauthorised: handleUnauthorized,
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
