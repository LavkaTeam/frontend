import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { StatusIcon, type StatusIconVariant } from '@/components/ui/StatusIcon';
import { useUser } from '@/hooks/useUser';
import type { VerificationStatus } from '@/types/user';

import styles from './SellerVerificationNotice.module.css';

interface SellerVerificationNoticeProps {
  // What the seller is missing, e.g. "your products" or "analytics".
  sectionName: string;
  // Layout of the locked section shown blurred behind the dialog. The
  // backend answers 403 SELLER_NOT_VERIFIED, so there is no real data:
  // pass the section skeleton.
  children: ReactNode;
  // Overrides the status from /user/me (used by the dev preview).
  status?: VerificationStatus;
}

const getNoticeContent = (
  status: VerificationStatus | undefined,
  sectionName: string,
): {
  variant: StatusIconVariant;
  title: string;
  text: string;
  canCompleteVerification: boolean;
} => {
  switch (status) {
    case 'PENDING':
      return {
        variant: 'pending',
        title: 'Account under review',
        text: `We are reviewing your company details. You will get access to ${sectionName} once your account is verified.`,
        canCompleteVerification: false,
      };
    case 'REJECTED':
      return {
        variant: 'error',
        title: 'Verification rejected',
        text: `Update the required company details in your profile to get access to ${sectionName}.`,
        canCompleteVerification: true,
      };
    default:
      return {
        variant: 'warning',
        title: 'Account not verified',
        text: `Complete your company details in your profile to get access to ${sectionName}.`,
        canCompleteVerification: true,
      };
  }
};

// Locks a seller section until the account is verified: the section layout
// stays visible, blurred and dimmed, with the explanation on top.
const SellerVerificationNotice = ({
  sectionName,
  children,
  status,
}: SellerVerificationNoticeProps) => {
  const [, setSearchParams] = useSearchParams();
  const { data: user } = useUser();
  const { variant, title, text, canCompleteVerification } = getNoticeContent(
    status ?? user?.verificationStatus ?? user?.status,
    sectionName,
  );

  return (
    <div className={styles.gate}>
      <div className={styles.backdrop} aria-hidden='true' inert>
        {children}
      </div>

      <div className={styles.overlay}>
        <div
          className={styles.dialog}
          role='dialog'
          aria-labelledby='seller-verification-title'
          aria-describedby='seller-verification-text'
        >
          <StatusIcon variant={variant} />
          <div className={styles.content}>
            <h3 id='seller-verification-title' className={styles.title}>
              {title}
            </h3>
            <p id='seller-verification-text' className={styles.text}>
              {text}
            </p>
          </div>
          {canCompleteVerification && (
            <Button
              type='button'
              onClick={() => setSearchParams({ tab: 'profile', validate: '1' })}
            >
              Complete verification
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export { SellerVerificationNotice };
