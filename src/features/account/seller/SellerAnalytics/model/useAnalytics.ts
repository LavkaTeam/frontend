import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getDashboard } from './analytics.api';
import { retryOnServerError } from '@/utils/error';

const ANALYTICS_STALE_TIME = 30_000;

export const analyticsQueryKeys = {
  dashboard: (year?: number) => ['analytics', 'dashboard', year ?? 'current'] as const,
};

export const useDashboard = (year?: number) => {
  return useQuery({
    queryKey: analyticsQueryKeys.dashboard(year),
    queryFn: () => getDashboard(year),
    retry: retryOnServerError,
    staleTime: ANALYTICS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};
