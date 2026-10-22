import type { AdminUserDetails } from '@/types/admin';

// Why approving / rejecting is not possible, per the backend rules
// (8-admin.md, section 4). null when the action is allowed.
export const getDecisionBlockers = (
  user: Pick<
    AdminUserDetails,
    'banned' | 'verificationStatus' | 'profileComplete'
  >,
) => {
  if (user.banned) {
    const reason = 'Restore the account before deciding on its verification.';
    return { approve: reason, reject: reason };
  }

  if (user.verificationStatus === 'NOT_VERIFIED') {
    const reason = 'The company has not submitted its profile for review yet.';
    return { approve: reason, reject: reason };
  }

  return {
    approve:
      user.verificationStatus === 'VERIFIED'
        ? 'The company is already verified.'
        : !user.profileComplete
          ? 'The profile is incomplete, so it cannot be verified.'
          : null,
    reject:
      user.verificationStatus === 'REJECTED'
        ? 'The company is already rejected.'
        : null,
  };
};
