import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession, logout as authLogout } from '../lib/auth-client';

/**
 * Query key factory for authentication-related queries
 */
export const authQueryKeys = {
  all: ['auth'] as const,
  session: () => [...authQueryKeys.all, 'session'] as const,
};

/**
 * Hook to get the current authentication session.
 * 
 * Uses TanStack Query to cache the session state. The server is the source of truth.
 * 
 * @returns Object containing user data, authentication status, and query helpers
 */
export function useSession() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: authQueryKeys.session(),
    queryFn: getSession,
    staleTime: Infinity, // Session state doesn't become stale
    retry: false, // Don't retry failed auth checks
  });

  return {
    user: data?.user ?? null,
    isAuthenticated: data?.isAuthenticated ?? false,
    isLoading,
    error,
    /**
     * Invalidate the session cache to force a refetch
     */
    refetch: () => queryClient.invalidateQueries({ queryKey: authQueryKeys.session() }),
  };
}

/**
 * Hook to perform logout.
 * 
 * Returns a mutation that logs out the user and invalidates the session cache.
 * 
 * @returns Object with logout function and mutation state
 */
export function useLogout() {
  const queryClient = useQueryClient();

  const logout = async () => {
    await authLogout();
    // Invalidate session cache to trigger refetch showing logged-out state
    await queryClient.invalidateQueries({ queryKey: authQueryKeys.session() });
  };

  return {
    logout,
  };
}