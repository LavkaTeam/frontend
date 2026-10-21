import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { StatusIcon, type StatusIconVariant } from '@/components/ui/StatusIcon';
import { PROFILE_FIELD_LABELS } from '@/features/account/profile';
import type { ProfileFieldKey } from '@/features/account/profile/types/profileForm.types';

import styles from './CompanyVerificationModal.module.css';

export type CompanyVerificationState =
  | { status: 'NOT_VERIFIED'; missingFields: ProfileFieldKey[] }
  | { status: 'REJECTED'; missingFields: ProfileFieldKey[] }
  | { status: 'PENDING' };

interface CompanyVerificationModalProps {
  state: CompanyVerificationState | null;
  onClose: () => void;
}

const CONTENT: Record<
  CompanyVerificationState['status'],
  { variant: StatusIconVariant; title: string; text: string }
> = {
  NOT_VERIFIED: {
    variant: 'warning',
    title: 'Complete your company profile',
    text: 'B2bar accepts orders only from verified companies. Fill in the missing details and save your profile: it then goes to our team for review.',
  },
  REJECTED: {
    variant: 'error',
    title: 'Verification rejected',
    text: 'We could not verify your company details. Update them in your profile and save to send them for review again.',
  },
  PENDING: {
    variant: 'pending',
    title: 'Your company is being reviewed',
    text: 'Our team is checking your company details. You can place orders once your company is verified. Your cart will be kept.',
  },
};

// Shown when checkout is blocked by the company verification status, either
// by the frontend pre-check or by 403 COMPANY_NOT_VERIFIED /
// COMPANY_VERIFICATION_PENDING from the backend.
const CompanyVerificationModal = ({
  state,
  onClose,
}: CompanyVerificationModalProps) => {
  const navigate = useNavigate();
  const isOpen = Boolean(state);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!state) return null;

  const { variant, title, text } = CONTENT[state.status];
  const missingFields = state.status === 'PENDING' ? [] : state.missingFields;

  const openProfile = () => {
    // validate=1 highlights every missing field in the profile form.
    navigate('/account?tab=profile&validate=1');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role='dialog'
        aria-modal='true'
        aria-labelledby='company-verification-title'
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type='button'
          className={styles.closeButton}
          onClick={onClose}
          aria-label='Close'
        >
          ✕
        </button>

        <StatusIcon variant={variant} />

        <div className={styles.content}>
          <h3 id='company-verification-title' className={styles.title}>
            {title}
          </h3>
          <p className={styles.text}>{text}</p>
        </div>

        {missingFields.length > 0 && (
          <div className={styles.missing}>
            <span className={styles.missingLabel}>
              Missing details ({missingFields.length})
            </span>
            <ul className={styles.chips}>
              {missingFields.map((field) => (
                <li key={field} className={styles.chip}>
                  {PROFILE_FIELD_LABELS[field] || field}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.actions}>
          {state.status === 'PENDING' ? (
            <Button type='button' onClick={onClose}>
              Got it
            </Button>
          ) : (
            <>
              <Button type='button' variant='secondary' onClick={onClose}>
                Not now
              </Button>
              <Button type='button' onClick={openProfile}>
                Go to profile
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export { CompanyVerificationModal };
