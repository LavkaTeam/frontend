import {
  buildProfileFormData,
  getMissingProfileFields,
  toProfileFieldKey,
} from '@/features/account/profile';
import type { UserResponse } from '@/types/user';
import { getErrorCode, getErrorDetails } from '@/utils/error';

import type { CompanyVerificationState } from './CompanyVerificationModal';

// What the frontend pre-check shows before calling the backend.
export const getCompanyVerificationState = (
  user?: UserResponse,
): CompanyVerificationState => {
  const status = user?.verificationStatus ?? user?.status;
  const missingFields = user
    ? getMissingProfileFields(buildProfileFormData(user))
    : [];

  if (status === 'PENDING') return { status: 'PENDING' };
  if (status === 'REJECTED') return { status: 'REJECTED', missingFields };

  return { status: 'NOT_VERIFIED', missingFields };
};

// Reads 403 COMPANY_NOT_VERIFIED / COMPANY_VERIFICATION_PENDING from
// POST /api/orders; null for any other error.
export const getCompanyVerificationStateFromError = (
  error: unknown,
): CompanyVerificationState | null => {
  const code = getErrorCode(error);
  const details = getErrorDetails(error);

  if (code === 'COMPANY_VERIFICATION_PENDING') return { status: 'PENDING' };
  if (code !== 'COMPANY_NOT_VERIFIED') return null;

  const missingFields = Array.isArray(details.missingFields)
    ? details.missingFields
        .filter((field): field is string => typeof field === 'string')
        .map(toProfileFieldKey)
    : [];

  return details.verificationStatus === 'REJECTED'
    ? { status: 'REJECTED', missingFields }
    : { status: 'NOT_VERIFIED', missingFields };
};
