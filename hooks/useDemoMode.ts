/**
 * useDemoMode Hook
 * 
 * Hook to check if demo mode is enabled from environment variables.
 * Demo mode allows payment simulation without blockchain transactions.
 */

import { useMemo } from 'react';

export function useDemoMode(): boolean {
  const isDemoMode = useMemo(() => {
    return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  }, []);

  return isDemoMode;
}

/**
 * Check if demo mode is enabled (non-hook version for server components)
 */
export function isDemoModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}
