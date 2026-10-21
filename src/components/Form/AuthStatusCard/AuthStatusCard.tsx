import type { ComponentProps, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthRedirect } from '../AuthRedirect/AuthRedirect';
import { FormContainer } from '../FormContainer/FormContainer';
import { Button } from '@ui/Button';
import { FormHeader } from '@ui/FormHeader';
import { StatusIcon, type StatusIconVariant } from '@ui/StatusIcon';

import styles from './AuthStatusCard.module.css';

interface AuthStatusAction {
  label: string;
  // Either a route to open or a handler to run.
  to?: string;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

interface AuthStatusCardProps {
  variant: StatusIconVariant;
  title: string;
  subtitle: ReactNode;
  hint?: ReactNode;
  action?: AuthStatusAction;
  // Rendered as a text link under the main button.
  secondaryAction?: Pick<AuthStatusAction, 'label' | 'onClick'>;
  redirect?: ComponentProps<typeof AuthRedirect>['type'];
}

// Result screens of the auth flow (email sent, link verified, link expired).
// Shares FormContainer, FormHeader and spacing with the auth forms.
const AuthStatusCard = ({
  variant,
  title,
  subtitle,
  hint,
  action,
  secondaryAction,
  redirect,
}: AuthStatusCardProps) => {
  const navigate = useNavigate();
  const hasBody = Boolean(hint || action || secondaryAction || redirect);

  const handleAction = () => {
    if (action?.onClick) action.onClick();
    else if (action?.to) navigate(action.to);
  };

  return (
    <FormContainer>
      <div className={styles.card} aria-live='polite'>
        <StatusIcon variant={variant} />
        <FormHeader title={title} subtitle={subtitle} />

        {hasBody && (
          <div className={styles.body}>
            {hint && <p className={styles.hint}>{hint}</p>}

            {action && (
              <Button
                type='button'
                onClick={handleAction}
                isLoading={action.isLoading}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            )}

            {secondaryAction && (
              <button
                type='button'
                className={styles.textButton}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </button>
            )}

            {redirect && <AuthRedirect type={redirect} />}
          </div>
        )}
      </div>
    </FormContainer>
  );
};

export { AuthStatusCard };
