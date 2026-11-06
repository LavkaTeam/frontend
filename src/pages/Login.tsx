import { Suspense, lazy } from 'react';

import { isDemoMode } from '@/features/demo/config';
import {
  AccountUnavailable,
  EmailVerificationRequired,
  LoginForm,
} from '@/components/Form';
import type { LoginRequest } from '@/hooks/useAuth';
import { useLoginHandler } from '@/hooks/useLoginHandler';

// The demo has no password form: it offers the two demo roles instead.
const DemoLoginPage = isDemoMode
  ? lazy(() => import('@/features/demo/pages/DemoLoginPage'))
  : null;

interface LoginProps {
  // Replaces the API call; used by the dev preview only.
  request?: LoginRequest;
}

const Login = ({ request }: LoginProps) => {
  if (DemoLoginPage) {
    return (
      <Suspense fallback={null}>
        <DemoLoginPage />
      </Suspense>
    );
  }

  return <PasswordLogin request={request} />;
};

const PasswordLogin = ({ request }: LoginProps) => {
  const {
    handleSubmit,
    isLoading,
    blocker,
    lastEmail,
    resendVerificationEmail,
    resendSecondsLeft,
    backToForm,
    cooldownSeconds,
  } = useLoginHandler({ request });

  if (blocker?.kind === 'emailNotVerified') {
    return (
      <EmailVerificationRequired
        email={blocker.email}
        message={blocker.message}
        resendSecondsLeft={resendSecondsLeft}
        isResending={isLoading}
        onResend={resendVerificationEmail}
        onBack={backToForm}
      />
    );
  }

  if (blocker?.kind === 'accountDisabled') {
    return <AccountUnavailable message={blocker.message} onBack={backToForm} />;
  }

  return (
    <LoginForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      cooldownSeconds={cooldownSeconds}
      defaultEmail={lastEmail}
    />
  );
};

export default Login;
