import { describe, expect, it } from 'vitest';

import {
  formatFinanceAmount,
  getFinanceSummaryValue,
  getTransactionDetails,
} from './financeFormatters';

describe('finance formatters', () => {
  it('formats platform fees as negative amounts', () => {
    expect(formatFinanceAmount(12.5, { withSign: true, type: 'PLATFORM_FEE' })).toBe(
      '-$12.50',
    );
  });

  it('prefers current finance summary fields over legacy values', () => {
    expect(getFinanceSummaryValue(24, 12)).toBe(24);
    expect(getFinanceSummaryValue(undefined, 12)).toBe(12);
  });

  it('renders the API fee rate as a percentage', () => {
    expect(
      getTransactionDetails({
        id: 'fee-1',
        type: 'PLATFORM_FEE',
        amount: 5,
        feeRate: 0.05,
        status: 'COMPLETED',
        createdAt: '2026-01-01T00:00:00.000Z',
      }),
    ).toBe('Platform fee (5%)');
  });
});
