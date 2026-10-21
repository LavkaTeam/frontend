import { useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {
  AccountUnavailable,
  EmailVerificationRequired,
  InvalidResetLink,
  PasswordResetEmailSent,
  RegistrationResult,
  VerifyEmailStatus,
} from '@/components/Form';
import { AccessDenied } from '@/components/AccessDenied/AccessDenied';
import { SellerVerificationNotice } from '@/features/account/seller/shared/SellerVerificationNotice/SellerVerificationNotice';
import { SellerAnalyticsSkeleton } from '@/features/account/seller/SellerAnalytics/components';
import { SellerFinancesSkeleton } from '@/features/account/seller/SellerFinances/components/SellerFinancesSkeleton';
import { SellerProductsPageSkeleton } from '@/features/account/seller/SellerProducts/skeleton';
import { useToast } from '@/hooks/useToast';
import type { ApiErrorCode } from '@/types/apiError';

import {
  CompanyVerificationModal,
  type CompanyVerificationState,
} from '@/components/Checkout/CompanyVerificationModal/CompanyVerificationModal';

import ForgotPassword from './ForgotPassword';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';

import styles from './DevAuthPreview.module.css';

// Dev-only catalogue of every auth screen (route /dev/auth). Form screens are
// the real pages with the API call replaced by a simulated backend response,
// so all error handling below runs exactly as in production.

// Same shapes the API client throws (see shared/api/client.ts).
const apiError = (status: number, code: ApiErrorCode, error: string) => ({
  status,
  code,
  error,
});
const validationError = (fields: Record<string, string>) => ({
  status: 400,
  ...fields,
});
const networkError = () => new TypeError('Failed to fetch');

interface Scenario {
  id: string;
  label: string;
  // Resolves with the response body or rejects with the error.
  respond: () => unknown;
  isError?: boolean;
}

const fail = (label: string, id: string, error: () => unknown): Scenario => ({
  id,
  label,
  respond: () => {
    throw error();
  },
  isError: true,
});

const LOGIN_SCENARIOS: Scenario[] = [
  fail('401 Wrong email or password', 'invalid-credentials', () =>
    apiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.'),
  ),
  fail('403 Email not verified: new link sent', 'not-verified-sent', () =>
    apiError(
      403,
      'EMAIL_NOT_VERIFIED',
      'Your email is not verified. A new verification link has been sent to your email.',
    ),
  ),
  fail('403 Email not verified: link sent recently', 'not-verified-recent', () =>
    apiError(
      403,
      'EMAIL_NOT_VERIFIED',
      'Your email is not verified. Please check your inbox for the verification link.',
    ),
  ),
  fail('403 Email not verified: email failed', 'not-verified-failed', () =>
    apiError(
      403,
      'EMAIL_NOT_VERIFIED',
      "Your email is not verified, and we couldn't send a new verification link right now. Please try again in a few minutes.",
    ),
  ),
  fail('429 Too many attempts (account locked)', 'rate-limited', () => ({
    ...apiError(
      429,
      'TOO_MANY_REQUESTS',
      'Too many attempts. Please try again in 15 minutes.',
    ),
    details: { retryAfterSeconds: 900 },
  })),
  fail('401 Account blocked', 'account-disabled', () =>
    apiError(401, 'ACCOUNT_DISABLED', 'This account has been blocked or deleted.'),
  ),
  fail('400 Field validation', 'validation', () =>
    validationError({ email: 'Please enter a valid email address' }),
  ),
  fail('500 Server error', 'server-error', () =>
    apiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred'),
  ),
  fail('Network error', 'network', networkError),
];

const REGISTER_SCENARIOS: Scenario[] = [
  {
    id: 'email-sent',
    label: '200 Email sent',
    respond: () => ({ message: 'Registered', emailSent: true }),
  },
  {
    id: 'email-not-sent',
    label: '200 Email not sent',
    respond: () => ({
      message:
        "Your account has been created, but we couldn't send the verification email right now. Please log in later to receive a new verification link.",
      emailSent: false,
    }),
  },
  fail('409 Email already exists', 'email-exists', () =>
    apiError(409, 'EMAIL_ALREADY_EXISTS', 'An account with this email already exists.'),
  ),
  fail('400 Field validation', 'validation', () =>
    validationError({
      firstName: 'First name must be 2-50 characters long',
      phoneNumber:
        'Please enter the phone number in international format, e.g. +380931234567',
    }),
  ),
  fail('500 Server error', 'server-error', () =>
    apiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred'),
  ),
  fail('Network error', 'network', networkError),
];

const FORGOT_SCENARIOS: Scenario[] = [
  {
    id: 'sent',
    label: '200 Link sent',
    respond: () => ({ message: 'ok' }),
  },
  fail('503 Email delivery failed', 'delivery-failed', () =>
    apiError(
      503,
      'EMAIL_DELIVERY_FAILED',
      "We couldn't send the email right now. Please try again in a few minutes.",
    ),
  ),
  fail('400 Field validation', 'validation', () =>
    validationError({ email: 'Please enter a valid email address' }),
  ),
  fail('Network error', 'network', networkError),
];

const RESET_SCENARIOS: Scenario[] = [
  {
    id: 'success',
    label: '200 Password updated (opens /login)',
    respond: () => ({ message: 'ok' }),
  },
  fail('400 Link expired or used', 'invalid-token', () =>
    apiError(400, 'BAD_REQUEST', 'Invalid password reset token'),
  ),
  fail('400 Password policy', 'validation', () =>
    validationError({
      newPassword:
        'Password must be at least 8 characters long and contain at least one capital letter and one number',
    }),
  ),
  fail('Network error', 'network', networkError),
];

interface PreviewScreen {
  id: string;
  group: string;
  label: string;
  realPath?: string;
  scenarios?: Scenario[];
  render: (request: <T>() => Promise<T>) => ReactNode;
}

const DEMO_EMAIL = 'olivia@untitledui.com';

const SELLER_SECTIONS = [
  {
    id: 'products',
    label: 'Products',
    sectionName: 'your products',
    Skeleton: SellerProductsPageSkeleton,
  },
  {
    id: 'finances',
    label: 'Finances',
    sectionName: 'balances, payouts and transaction history',
    Skeleton: SellerFinancesSkeleton,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    sectionName: 'analytics',
    Skeleton: SellerAnalyticsSkeleton,
  },
];
const noop = () => undefined;

const SCREENS: PreviewScreen[] = [
  {
    id: 'login',
    group: 'Forms',
    label: 'Log in',
    realPath: '/login',
    scenarios: LOGIN_SCENARIOS,
    render: (request) => <Login request={request} />,
  },
  {
    id: 'register',
    group: 'Forms',
    label: 'Sign up',
    realPath: '/register',
    scenarios: REGISTER_SCENARIOS,
    render: (request) => <Register request={request} />,
  },
  {
    id: 'forgot',
    group: 'Forms',
    label: 'Forgot password',
    realPath: '/forgot-password',
    scenarios: FORGOT_SCENARIOS,
    render: (request) => <ForgotPassword request={request} />,
  },
  {
    id: 'reset',
    group: 'Forms',
    label: 'Set new password',
    realPath: '/reset-password?token=preview',
    scenarios: RESET_SCENARIOS,
    render: (request) => <ResetPassword request={request} token='preview' />,
  },
  {
    id: 'register-sent',
    group: 'Email',
    label: 'Sign up: check email',
    render: () => <RegistrationResult email={DEMO_EMAIL} emailSent message='' />,
  },
  {
    id: 'register-not-sent',
    group: 'Email',
    label: 'Sign up: email not sent',
    render: () => (
      <RegistrationResult
        email={DEMO_EMAIL}
        emailSent={false}
        message="Your account has been created, but we couldn't send the verification email right now. Please log in later to receive a new verification link."
      />
    ),
  },
  {
    id: 'login-not-verified',
    group: 'Email',
    label: 'Log in: verify your email',
    render: () => (
      <EmailVerificationRequired
        email={DEMO_EMAIL}
        message='Your email is not verified. A new verification link has been sent to your email.'
        resendSecondsLeft={42}
        isResending={false}
        onResend={noop}
        onBack={noop}
      />
    ),
  },
  {
    id: 'forgot-sent',
    group: 'Email',
    label: 'Reset link sent',
    render: () => <PasswordResetEmailSent email={DEMO_EMAIL} />,
  },
  {
    id: 'verify-loading',
    group: 'Email verification',
    label: 'Verifying',
    render: () => <VerifyEmailStatus state='loading' />,
  },
  {
    id: 'verify-success',
    group: 'Email verification',
    label: 'Verified',
    render: () => <VerifyEmailStatus state='success' />,
  },
  {
    id: 'verify-error',
    group: 'Email verification',
    label: 'Link expired or used',
    render: () => (
      <VerifyEmailStatus
        state='error'
        errorMessage='Invalid or already used verification link'
      />
    ),
  },
  {
    id: 'verify-missing',
    group: 'Email verification',
    label: 'Link without token',
    realPath: '/verify-email',
    render: () => <VerifyEmailStatus state='missingToken' />,
  },
  {
    id: 'reset-expired',
    group: 'Password reset',
    label: 'Link expired',
    render: () => <InvalidResetLink message='Invalid password reset token' />,
  },
  {
    id: 'reset-invalid',
    group: 'Password reset',
    label: 'Link without token',
    realPath: '/reset-password',
    render: () => <InvalidResetLink />,
  },
  {
    id: 'account-disabled',
    group: 'Access',
    label: 'Account blocked',
    render: () => (
      <AccountUnavailable
        message='This account has been blocked or deleted.'
        onBack={noop}
      />
    ),
  },
  {
    id: 'access-denied',
    group: 'Access',
    label: 'Access denied',
    render: () => <AccessDenied />,
  },
  ...(
    [
      [
        'not-verified',
        'Not verified',
        {
          status: 'NOT_VERIFIED',
          missingFields: ['iban', 'bic', 'legalZipCode', 'liquorLicenseDocumentUrl'],
        },
      ],
      ['rejected', 'Rejected', { status: 'REJECTED', missingFields: [] }],
      ['pending', 'Under review', { status: 'PENDING' }],
    ] as Array<[string, string, CompanyVerificationState]>
  ).map(([id, label, state]) => ({
    id: `checkout-${id}`,
    group: 'Checkout: company not verified',
    label,
    render: () => <CompanyVerificationModal state={state} onClose={noop} />,
  })),
  ...(['PENDING', 'REJECTED', 'NOT_VERIFIED'] as const).flatMap((status) =>
      SELLER_SECTIONS.map(({ id, label, sectionName, Skeleton }) => ({
        id: `seller-${id}-${status.toLowerCase()}`,
        group: `Seller verification: ${status.toLowerCase().replace('_', ' ')}`,
        label,
        render: () => (
          <div className={styles.accountArea}>
            <SellerVerificationNotice sectionName={sectionName} status={status}>
              <Skeleton />
            </SellerVerificationNotice>
          </div>
        ),
      })),
  ),
];

const DevAuthPreview = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSlow, setIsSlow] = useState(false);
  const { showToast } = useToast();

  const activeScreen =
    SCREENS.find((screen) => screen.id === searchParams.get('screen')) ||
    SCREENS[0];
  const scenarios = activeScreen.scenarios || [];
  const activeScenario =
    scenarios.find((scenario) => scenario.id === searchParams.get('scenario')) ||
    scenarios[0];
  const groups = [...new Set(SCREENS.map((screen) => screen.group))];

  const request = async <T,>() => {
    if (isSlow) {
      await new Promise((resolve) => window.setTimeout(resolve, 2000));
    }

    return activeScenario.respond() as T;
  };

  const selectScreen = (id: string) => {
    setSearchParams({ screen: id }, { replace: true });
  };

  const selectScenario = (id: string) => {
    setSearchParams({ screen: activeScreen.id, scenario: id }, { replace: true });
  };

  return (
    <div className='container'>
      <div className={styles.page}>
        <header className={styles.toolbar}>
          <div className={styles.heading}>
            <span className={styles.badge}>Dev only</span>
            <h1 className={styles.title}>Auth screens preview</h1>
          </div>

          <div className={styles.controls}>
            <label className={styles.control}>
              <span>Simulated backend response</span>
              <select
                className={styles.select}
                value={activeScenario?.id || ''}
                disabled={!activeScenario}
                onChange={(event) => selectScenario(event.target.value)}
              >
                {!activeScenario && <option value=''>Static screen</option>}
                {scenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.checkbox}>
              <input
                type='checkbox'
                checked={isSlow}
                onChange={(event) => setIsSlow(event.target.checked)}
              />
              Slow network (2s)
            </label>

            <button
              type='button'
              className={styles.ghostButton}
              onClick={() =>
                showToast('Your session has expired. Please log in again.', 'error')
              }
            >
              Session expired toast
            </button>
          </div>
        </header>

        <nav className={styles.nav} aria-label='Auth screens'>
          {groups.map((group) => (
            <div key={group} className={styles.group}>
              <span className={styles.groupTitle}>{group}</span>
              <div className={styles.pills}>
                {SCREENS.filter((screen) => screen.group === group).map(
                  (screen) => (
                    <button
                      key={screen.id}
                      type='button'
                      className={`${styles.pill} ${
                        screen.id === activeScreen.id ? styles.pillActive : ''
                      }`}
                      aria-pressed={screen.id === activeScreen.id}
                      onClick={() => selectScreen(screen.id)}
                    >
                      {screen.label}
                    </button>
                  ),
                )}
              </div>
            </div>
          ))}
        </nav>

        <div className={styles.meta}>
          <span>
            {activeScreen.group} / <strong>{activeScreen.label}</strong>
            {activeScenario && (
              <>
                {' '}
                — submit to get <strong>{activeScenario.label}</strong>
              </>
            )}
          </span>
          {activeScreen.realPath && (
            <Link className={styles.realLink} to={activeScreen.realPath}>
              Open the real page →
            </Link>
          )}
        </div>

        {/* key resets the page state when the screen or response changes */}
        <div
          key={`${activeScreen.id}-${activeScenario?.id}-${isSlow}`}
          className={styles.stage}
        >
          {activeScreen.render(request)}
        </div>
      </div>
    </div>
  );
};

export default DevAuthPreview;
