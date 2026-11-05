import { describe, expect, it } from 'vitest';

import type { UserResponse } from '@/types/user';

import { getCheckoutBlock } from './checkoutBlock';

const company = {
  companyName: 'Elite Import',
  registrationNumber: 'REG-12345',
  taxId: 'TAX-9988',
  iban: 'UA213223130000026007233566001',
  bankName: 'PrivatBank',
  legalAddress: {
    country: 'Ukraine',
    city: 'Kyiv',
    street: 'Main 1',
    zipCode: '01001',
  },
} as Partial<UserResponse>;

const user = (overrides: Partial<UserResponse>) =>
  ({ ...company, ...overrides }) as UserResponse;

describe('getCheckoutBlock', () => {
  it('lets a verified company with billing details check out', () => {
    expect(
      getCheckoutBlock(user({ verificationStatus: 'VERIFIED' })),
    ).toBeNull();
  });

  it('waits for the profile before deciding', () => {
    expect(getCheckoutBlock(undefined)).toBeNull();
  });

  it('asks a company under review to wait', () => {
    const block = getCheckoutBlock(user({ verificationStatus: 'PENDING' }));
    expect(block?.title).toMatch(/being reviewed/);
    expect(block?.primary).toBe(false);
  });

  it('sends a not verified or rejected company to the profile', () => {
    for (const verificationStatus of ['NOT_VERIFIED', 'REJECTED'] as const) {
      const block = getCheckoutBlock(user({ verificationStatus }));
      expect(block?.to).toBe('/account?tab=profile&validate=1');
    }
  });

  it('blocks a verified company that lost its billing details', () => {
    const block = getCheckoutBlock(
      user({ verificationStatus: 'VERIFIED', iban: '' }),
    );
    expect(block).not.toBeNull();
  });
});
