// Error codes returned by the backend as {"error": "...", "code": "<CODE>"}.
// See LAVKA_BACKEND/backend/docs/2-auth-and-registration.md.
export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_DISABLED'
  | 'INVALID_TOKEN'
  | 'EMAIL_NOT_VERIFIED'
  | 'SELLER_NOT_VERIFIED'
  | 'COMPANY_NOT_VERIFIED'
  | 'COMPANY_VERIFICATION_PENDING'
  | 'TOO_MANY_REQUESTS'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'EMAIL_ALREADY_EXISTS'
  | 'CONFLICT'
  | 'PAYLOAD_TOO_LARGE'
  | 'EMAIL_DELIVERY_FAILED'
  | 'INTERNAL_ERROR';
