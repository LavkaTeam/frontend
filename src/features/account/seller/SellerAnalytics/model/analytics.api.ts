import { fetchData } from '@/api/fetchData';

import type { DashboardResponseDto } from './analytics.types';

const buildDashboardQuery = (year?: number) => {
  if (!year) return '';

  const queryParams = new URLSearchParams();
  queryParams.set('year', String(year));

  return `?${queryParams.toString()}`;
};

export const getDashboard = (year?: number): Promise<DashboardResponseDto> => {
  return fetchData<DashboardResponseDto>(
    `/analytics/dashboard${buildDashboardQuery(year)}`,
  );
};
