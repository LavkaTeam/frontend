import {
  AccountUnavailable,
  EmailVerificationRequired,
  LoginForm,
} from '@/components/Form';
import type { LoginRequest } from '@/hooks/useAuth';
import { useLoginHandler } from '@/hooks/useLoginHandler';

interface LoginProps {
  // Replaces the API call; used by the dev preview only.
  request?: LoginRequest;
}

const Login = ({ request }: LoginProps) => {
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
