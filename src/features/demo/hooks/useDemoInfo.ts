import { useQuery } from '@tanstack/react-query';

import { getDemoInfo } from '../api';

// Settings change rarely, so one request per page load is enough. Texts fall
// back to these values while it loads or if it fails.
export const DEFAULT_TTL_HOURS = 24;

export const useDemoInfo = () =>
  useQuery({
    queryKey: ['demo', 'info'],
    queryFn: getDemoInfo,
    staleTime: Infinity,
    retry: false,
  });

export const useDemoTtlHours = () =>
  useDemoInfo().data?.tenantTtlHours ?? DEFAULT_TTL_HOURS;
