import { AuthStatusCard } from '../AuthStatusCard/AuthStatusCard';

// Result screens of the auth flow. Pages decide which one to show; the dev
// preview (/dev/auth) renders them through the same pages.

const SUPPORT_EMAIL = 'support@b2bar.tech';

const NEW_VERIFICATION_LINK_HINT =
  'Log in with your email and password, and we will send you a new verification link.';

type VerifyEmailState = 'missingToken' | 'loading' | 'success' | 'error';

interface VerifyEmailStatusProps {
  state: VerifyEmailState;
  errorMessage?: string;
}

const VerifyEmailStatus = ({ state, errorMessage }: VerifyEmailStatusProps) => {
  switch (state) {
    case 'missingToken':
      return (
        <AuthStatusCard
          variant='error'
          title='Invalid link'
          subtitle='This verification link is incomplete.'
          hint={NEW_VERIFICATION_LINK_HINT}
          action={{ label: 'Go to log in', to: '/login' }}
        />
      );
    case 'success':
      return (
        <AuthStatusCard
          variant='success'
          title='Email verified'
          subtitle='Your email has been confirmed. You can now log in to your account.'
          action={{ label: 'Log in', to: '/login' }}
        />
      );
    case 'error':
      return (
        <AuthStatusCard
          variant='error'
          title='Verification failed'
          subtitle={
            errorMessage || 'This link has expired or has already been used.'
          }
          hint={NEW_VERIFICATION_LINK_HINT}
          action={{ label: 'Go to log in', to: '/login' }}
        />
      );
    case 'loading':
      return (
        <AuthStatusCard
          variant='loading'
          title='Verifying your email'
          subtitle='This will only take a moment.'
        />
      );
  }
};

interface RegistrationResultProps {
  email: string;
  emailSent: boolean;
  message: string;
}

const RegistrationResult = ({
  email,
  emailSent,
  message,
}: RegistrationResultProps) => {
  if (!emailSent) {
    return (
      <AuthStatusCard
        variant='warning'
        title='Account created'
        subtitle={message}
        action={{ label: 'Go to log in', to: '/login' }}
      />
    );
  }

  return (
    <AuthStatusCard
      variant='email'
      title='Check your email'
      subtitle={
        <>
          We sent a verification link to <strong>{email}</strong>.
        </>
      }
      hint='The link is valid for 30 minutes. Did not get the email? Check your spam folder or log in to receive a new link.'
      action={{ label: 'Go to log in', to: '/login' }}
    />
  );
};

interface EmailVerificationRequiredProps {
  email: string;
  // Backend text: says whether a new link was sent, was sent recently, or
  // could not be sent.
  message: string;
  resendSecondsLeft: number;
  isResending: boolean;
  onResend: () => void;
  onBack: () => void;
}

// Shown instead of the login form when the backend answers
// 403 EMAIL_NOT_VERIFIED.
const EmailVerificationRequired = ({
  email,
  message,
  resendSecondsLeft,
  isResending,
  onResend,
  onBack,
}: EmailVerificationRequiredProps) => (
  <AuthStatusCard
    variant='email'
    title='Verify your email'
    subtitle={
      <>
        To log in, confirm <strong>{email}</strong> using the link we sent to
        your inbox.
      </>
    }
    hint={message}
    action={{
      label:
        resendSecondsLeft > 0
          ? `Resend email in ${resendSecondsLeft}s`
          : 'Resend email',
      onClick: onResend,
      isLoading: isResending,
      disabled: resendSecondsLeft > 0,
    }}
    secondaryAction={{ label: 'Back to log in', onClick: onBack }}
  />
);

interface AccountUnavailableProps {
  message: string;
  onBack: () => void;
}

// Shown instead of the login form for 401 ACCOUNT_DISABLED.
const AccountUnavailable = ({ message, onBack }: AccountUnavailableProps) => (
  <AuthStatusCard
    variant='error'
    title='Account unavailable'
    subtitle={message}
    hint={
      <>
        If you think this is a mistake, contact us at{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>
          <strong>{SUPPORT_EMAIL}</strong>
        </a>
        .
      </>
    }
    action={{ label: 'Back to log in', onClick: onBack }}
  />
);

const PasswordResetEmailSent = ({ email }: { email: string }) => (
  <AuthStatusCard
    variant='email'
    title='Check your email'
    subtitle={
      <>
        If an account exists for <strong>{email}</strong>, we have sent a
        password reset link to it.
      </>
    }
    hint='The link is valid for 1 hour. Did not get the email? Check your spam folder or try again in a few minutes.'
    action={{ label: 'Back to log in', to: '/login' }}
  />
);

interface InvalidResetLinkProps {
  // Backend reason when it rejected the token; empty for a link without one.
  message?: string;
}

const InvalidResetLink = ({ message }: InvalidResetLinkProps) => (
  <AuthStatusCard
    variant='error'
    title={message ? 'Link expired' : 'Invalid link'}
    subtitle={message || 'This password reset link is incomplete or broken.'}
    hint={
      message
        ? 'Reset links are valid for 1 hour and work only once. Request a new one to set your password.'
        : undefined
    }
    action={{ label: 'Request a new link', to: '/forgot-password' }}
    redirect='rememberPassword'
  />
);

export {
  VerifyEmailStatus,
  RegistrationResult,
  EmailVerificationRequired,
  AccountUnavailable,
  PasswordResetEmailSent,
  InvalidResetLink,
};
export type { VerifyEmailState };
