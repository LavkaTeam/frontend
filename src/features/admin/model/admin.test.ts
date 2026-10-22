import { describe, expect, it } from 'vitest';

import { toQueryString } from '@/api/admin';

import { formatIban, formatMissingField } from './adminDisplay';
import { getAdminActionError } from './useAdminFeedback';
import { getDecisionBlockers } from './verificationDecision';

describe('toQueryString', () => {
  it('skips empty filters and keeps zero and false', () => {
    expect(
      toQueryString({
        status: 'PENDING',
        q: '',
        role: undefined,
        page: 0,
        banned: false,
      }),
    ).toBe('?status=PENDING&page=0&banned=false');
    expect(toQueryString({ q: undefined })).toBe('');
  });

  it('encodes search text', () => {
    expect(toQueryString({ q: 'Craft & Style' })).toBe('?q=Craft+%26+Style');
  });
});

describe('getDecisionBlockers', () => {
  const user = {
    banned: false,
    verificationStatus: 'PENDING' as const,
    profileComplete: true,
  };

  it('allows both decisions for a complete pending profile', () => {
    expect(getDecisionBlockers(user)).toEqual({ approve: null, reject: null });
  });

  it('blocks approving an incomplete profile but allows rejecting it', () => {
    const blockers = getDecisionBlockers({ ...user, profileComplete: false });
    expect(blockers.approve).toMatch(/incomplete/);
    expect(blockers.reject).toBeNull();
  });

  it('allows revoking a verified company and approving a rejected one', () => {
    expect(
      getDecisionBlockers({ ...user, verificationStatus: 'VERIFIED' }),
    ).toEqual({ approve: expect.any(String), reject: null });
    expect(
      getDecisionBlockers({ ...user, verificationStatus: 'REJECTED' }),
    ).toEqual({ approve: null, reject: expect.any(String) });
  });

  it('blocks both for a profile not submitted yet or a banned account', () => {
    const notSubmitted = getDecisionBlockers({
      ...user,
      verificationStatus: 'NOT_VERIFIED',
    });
    expect(notSubmitted.approve).toMatch(/not submitted/);
    expect(notSubmitted.reject).toBe(notSubmitted.approve);

    const banned = getDecisionBlockers({ ...user, banned: true });
    expect(banned.approve).toMatch(/Restore/);
    expect(banned.reject).toBe(banned.approve);
  });
});

describe('admin display', () => {
  it('maps backend field names to profile labels', () => {
    expect(formatMissingField('iban')).toBe('IBAN');
    expect(formatMissingField('legalAddress.zipCode')).toBe(
      'Legal address zip code',
    );
  });

  it('groups an IBAN by four characters', () => {
    expect(formatIban('UA213223130000026007233566001')).toBe(
      'UA21 3223 1300 0002 6007 2335 6600 1',
    );
    expect(formatIban(undefined)).toBe('—');
  });
});

describe('getAdminActionError', () => {
  it('lists the missing fields of PROFILE_INCOMPLETE', () => {
    expect(
      getAdminActionError({
        status: 409,
        code: 'PROFILE_INCOMPLETE',
        error: 'The profile is incomplete.',
        details: { missingFields: ['iban', 'legalAddress.city'] },
      }),
    ).toBe('The profile is incomplete. Missing: IBAN, Legal address city.');
  });

  it('shows the backend text of a conflict', () => {
    expect(
      getAdminActionError({
        status: 409,
        code: 'CONFLICT',
        error: 'The payout request has already been processed.',
      }),
    ).toBe('The payout request has already been processed.');
  });
});
