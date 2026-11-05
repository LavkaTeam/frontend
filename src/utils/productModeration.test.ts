import { describe, expect, it } from 'vitest';

import { getModerationNotice } from './productModeration';

describe('getModerationNotice', () => {
  it('has nothing to say about an approved product', () => {
    expect(getModerationNotice({ status: 'ACTIVE' })).toBeNull();
    expect(getModerationNotice({ status: 'HIDDEN' })).toBeNull();
    expect(getModerationNotice(undefined)).toBeNull();
  });

  it('explains a product waiting for review', () => {
    expect(getModerationNotice({ status: 'UNDER_REVIEW' })?.kind).toBe(
      'UNDER_REVIEW',
    );
  });

  it('shows the reason of a rejection', () => {
    const notice = getModerationNotice({
      status: 'HIDDEN',
      moderationStatus: 'REJECTED',
      moderationReason: 'Photos do not match the title.',
    });

    expect(notice?.kind).toBe('REJECTED');
    expect(notice?.reason).toBe('Photos do not match the title.');
  });

  it('a block wins over everything else', () => {
    const notice = getModerationNotice({
      status: 'UNDER_REVIEW',
      adminBlocked: true,
      moderationStatus: 'BLOCKED',
      moderationReason: 'Counterfeit.',
    });

    expect(notice?.kind).toBe('BLOCKED');
  });
});
