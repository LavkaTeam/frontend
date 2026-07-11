import { describe, expect, it } from 'vitest';

import {
  getRevenueByCategory,
  getRevenueDelta,
  getResolvedRevenueTotal,
} from './analytics.utils';

describe('analytics mappers', () => {
  it('orders popular categories and derives a percentage when the API omits one', () => {
    const categories = getRevenueByCategory([
      { category: 'BARWARE_ACCESSORIES', revenue: 25 },
      { category: 'WINE', revenue: 75 },
    ]);

    expect(categories).toMatchObject([
      { label: 'Wine', percentage: 75 },
      { label: 'Barware Accessories', percentage: 25 },
    ]);
  });

  it('uses the explicit total revenue when it is available', () => {
    expect(
      getResolvedRevenueTotal(
        { totalRevenue: 420 },
        { jan: 100, feb: 100 },
      ),
    ).toBe(420);
  });

  it('handles a new month without dividing by zero', () => {
    expect(getRevenueDelta(25, 0)).toEqual({ difference: 25, percentage: undefined });
  });
});
