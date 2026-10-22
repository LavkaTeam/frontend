import { StatusIcon, type StatusIconVariant } from '@/components/ui/StatusIcon';
import type { VerificationStatus } from '@/types/user';

import { REQUIRED_PROFILE_FIELDS } from '../../config/profileForm.constants';
import type { ProfileFieldKey } from '../../types/profileForm.types';

import styles from './VerificationGuide.module.css';

interface VerificationGuideProps {
  status?: VerificationStatus;
  // What the admin asked to fix; present only while REJECTED.
  rejectionReason?: string;
  missingFields: ProfileFieldKey[];
  onShowMissingFields: () => void;
}

const STEPS = ['Fill in details', 'Save', 'Review'];

const getContent = (
  status: VerificationStatus | undefined,
  missingCount: number,
): {
  variant: StatusIconVariant;
  title: string;
  text: string;
  currentStep: number;
} | null => {
  switch (status) {
    case 'PENDING':
      return {
        variant: 'pending',
        title: 'Your profile is under review',
        text: 'We are checking your company details. Changing them sends the profile for review again.',
        currentStep: 2,
      };
    case 'REJECTED':
      return {
        variant: 'error',
        title: 'Verification rejected',
        text: 'Correct your company details and save to send them for review again.',
        currentStep: missingCount > 0 ? 0 : 1,
      };
    case 'VERIFIED':
      return null;
    default:
      return missingCount > 0
        ? {
            variant: 'warning',
            title: 'Complete your company profile',
            text: 'Fill in the required details and save: our team then verifies your company.',
            currentStep: 0,
          }
        : {
            variant: 'warning',
            title: 'Save to send your profile for review',
            text: 'All required details are filled in. Save changes to finish.',
            currentStep: 1,
          };
  }
};

// Explains the verification status at the top of "My Profile" and what the
// user has to do next.
const VerificationGuide = ({
  status,
  rejectionReason,
  missingFields,
  onShowMissingFields,
}: VerificationGuideProps) => {
  const content = getContent(status, missingFields.length);
  if (!content) return null;

  const total = REQUIRED_PROFILE_FIELDS.length;
  const filled = total - missingFields.length;
  const showProgress = status !== 'PENDING';

  return (
    <section
      className={styles.guide}
      aria-labelledby='verification-guide-title'
      data-tour='verification-guide'
    >
      <div className={styles.header}>
        <StatusIcon variant={content.variant} size='md' />
        <div className={styles.heading}>
          <h3 id='verification-guide-title' className={styles.title}>
            {content.title}
          </h3>
          <p className={styles.text}>{content.text}</p>
        </div>
      </div>

      {status === 'REJECTED' && rejectionReason ? (
        <div className={styles.reason}>
          <span className={styles.reasonTitle}>Message from our team</span>
          <p>{rejectionReason}</p>
        </div>
      ) : null}

      <div className={styles.footer}>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li
              key={step}
              className={`${styles.step} ${
                index < content.currentStep ? styles.stepDone : ''
              } ${index === content.currentStep ? styles.stepCurrent : ''}`}
              aria-current={index === content.currentStep ? 'step' : undefined}
            >
              <span className={styles.stepNumber}>{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>

        {showProgress && (
          <div className={styles.progressBlock}>
            <div
              className={styles.progressTrack}
              role='progressbar'
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={filled}
              aria-label='Required details filled in'
            >
              <div
                className={styles.progressFill}
                style={{ width: `${(filled / total) * 100}%` }}
              />
            </div>
            <span className={styles.progressLabel}>
              {filled}/{total}
            </span>
          </div>
        )}
      </div>

      {showProgress && missingFields.length > 0 && (
        <button
          type='button'
          className={styles.action}
          onClick={onShowMissingFields}
        >
          Fill in {missingFields.length} missing{' '}
          {missingFields.length === 1 ? 'detail' : 'details'}
          <span aria-hidden='true'>→</span>
        </button>
      )}
    </section>
  );
};

export { VerificationGuide };
