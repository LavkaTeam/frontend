import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getAdminUserLicense } from '@/api/admin';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  useAdminBanUser,
  useAdminRestoreUser,
  useAdminUser,
  useAdminVerificationDecision,
} from '@/hooks/useAdmin';
import { useToast } from '@/hooks/useToast';
import { extractErrorMessage, getErrorStatus } from '@/utils/error';

import {
  formatDate,
  formatDateTime,
  formatIban,
  formatMissingField,
  formatPersonName,
  ROLE_LABELS,
  VERIFICATION_STATUS,
} from '../model/adminDisplay';
import {
  getAdminActionError,
  useAdminFeedback,
} from '../model/useAdminFeedback';
import { AdminDialog, ReasonDialog } from '../shared/AdminDialog/AdminDialog';
import { AdminPageHeader } from '../shared/AdminPageHeader/AdminPageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getDecisionBlockers } from '../model/verificationDecision';
import { PayFeesCard } from './PayFeesCard';

import styles from './AdminUserDetails.module.css';

type DialogKind = 'approve' | 'reject' | 'ban' | 'restore' | null;

const DetailItem = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className={styles.detailItem}>
    <dt>{label}</dt>
    <dd>{children || '—'}</dd>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    <dl className={styles.details}>{children}</dl>
  </section>
);

const UserDetailsSkeleton = () => (
  <div className={styles.layout}>
    <Skeleton width='40%' height={38} radius={8} />
    <Skeleton width='100%' height={180} radius={16} />
    <Skeleton width='100%' height={320} radius={16} />
  </div>
);

const AdminUserDetails = () => {
  const { userId = '' } = useParams();
  const { showToast } = useToast();
  const notify = useAdminFeedback();
  const userQuery = useAdminUser(userId);
  const decision = useAdminVerificationDecision(userId);
  const ban = useAdminBanUser(userId);
  const restore = useAdminRestoreUser(userId);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [actionError, setActionError] = useState('');
  const [isOpeningLicense, setIsOpeningLicense] = useState(false);

  const openDialog = (kind: DialogKind) => {
    setActionError('');
    setDialog(kind);
  };
  const closeDialog = () => setDialog(null);

  const user = userQuery.data;

  if (userQuery.isLoading) return <UserDetailsSkeleton />;

  if (!user) {
    const notFound = getErrorStatus(userQuery.error) === 404;

    return (
      <>
        <AdminPageHeader
          title={notFound ? 'User not found' : 'Could not load the user'}
          description={
            notFound
              ? 'The user may have been removed.'
              : extractErrorMessage(userQuery.error, 'Please try again.')
          }
          backTo={{ to: '/admin/users', label: 'Users' }}
        />
      </>
    );
  }

  const status = VERIFICATION_STATUS[user.verificationStatus];
  const blockers = getDecisionBlockers(user);
  const companyLabel =
    user.companyName || formatPersonName(user.firstName, user.lastName);
  const isSeller = user.role === 'SELLER';

  const handleApprove = () =>
    decision.mutate(
      { verificationStatus: 'VERIFIED' },
      {
        onSuccess: ({ emailSent }) => {
          closeDialog();
          notify(`${companyLabel} is verified.`, emailSent);
        },
        onError: (error) => setActionError(getAdminActionError(error)),
      },
    );

  const handleReject = (reason: string) =>
    decision.mutate(
      { verificationStatus: 'REJECTED', reason },
      {
        onSuccess: ({ emailSent }) => {
          closeDialog();
          notify(
            user.verificationStatus === 'VERIFIED'
              ? `Verification of ${companyLabel} is revoked.`
              : `${companyLabel} is rejected.`,
            emailSent,
          );
        },
        onError: (error) => setActionError(getAdminActionError(error)),
      },
    );

  const handleBan = (reason: string) =>
    ban.mutate(
      { reason: reason || undefined },
      {
        onSuccess: () => {
          closeDialog();
          notify(`${user.email} is banned.`);
        },
        onError: (error) => setActionError(getAdminActionError(error)),
      },
    );

  const handleRestore = () =>
    restore.mutate(undefined, {
      onSuccess: () => {
        closeDialog();
        notify(`${user.email} is restored.`);
      },
      onError: (error) => setActionError(getAdminActionError(error)),
    });

  // The tab opens on the click itself (so it is not treated as a popup) and
  // receives the file once it is downloaded with the auth header.
  const handleViewLicense = async () => {
    const tab = window.open('', '_blank');
    setIsOpeningLicense(true);

    try {
      const blob = await getAdminUserLicense(user.id);
      const url = URL.createObjectURL(blob);

      if (tab) tab.location.href = url;
      else window.open(url, '_blank', 'noopener');

      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      tab?.close();
      showToast(
        getErrorStatus(error) === 404
          ? 'This user has no license document.'
          : extractErrorMessage(error, 'Could not open the license document.'),
        'error',
      );
    } finally {
      setIsOpeningLicense(false);
    }
  };

  return (
    <div className={styles.layout}>
      <AdminPageHeader
        backTo={{ to: '/admin/users', label: 'Users' }}
        title={companyLabel}
        description={
          <span className={styles.subtitle}>
            <span>{user.email}</span>
            <span aria-hidden='true'>·</span>
            <span>{ROLE_LABELS[user.role] || user.role}</span>
            <span aria-hidden='true'>·</span>
            <span>Registered {formatDate(user.registeredAt)}</span>
          </span>
        }
      />

      {/* Verification decision */}
      <section className={`${styles.section} ${styles.decision}`}>
        <div className={styles.decisionHeader}>
          <div className={styles.decisionStatus}>
            <span className={styles.decisionLabel}>Company verification</span>
            <div className={styles.pills}>
              <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              {user.banned ? (
                <StatusBadge tone='burgundy'>Banned</StatusBadge>
              ) : null}
              {!user.emailVerified ? (
                <StatusBadge tone='gray'>Email not confirmed</StatusBadge>
              ) : null}
            </div>
            {user.verificationReviewedAt ? (
              <span className={styles.muted}>
                Last decision {formatDateTime(user.verificationReviewedAt)}
              </span>
            ) : null}
          </div>

          <div className={styles.decisionActions}>
            <Button
              type='button'
              variant='secondary'
              disabled={Boolean(blockers.reject)}
              title={blockers.reject ?? undefined}
              onClick={() => openDialog('reject')}
            >
              {user.verificationStatus === 'VERIFIED'
                ? 'Revoke verification'
                : 'Reject'}
            </Button>
            <Button
              type='button'
              disabled={Boolean(blockers.approve)}
              title={blockers.approve ?? undefined}
              onClick={() => openDialog('approve')}
            >
              Approve
            </Button>
          </div>
        </div>

        {user.verificationStatus === 'REJECTED' &&
        user.verificationRejectionReason ? (
          <div className={styles.callout}>
            <span className={styles.calloutTitle}>
              Rejection reason sent to the user
            </span>
            <p>{user.verificationRejectionReason}</p>
          </div>
        ) : null}

        {!user.profileComplete && user.missingFields.length > 0 ? (
          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <span className={styles.calloutTitle}>
              Missing details ({user.missingFields.length})
            </span>
            <ul className={styles.chips}>
              {user.missingFields.map((field) => (
                <li key={field}>{formatMissingField(field)}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {blockers.approve &&
        blockers.reject &&
        blockers.approve === blockers.reject ? (
          <p className={styles.muted}>{blockers.approve}</p>
        ) : null}
      </section>

      <div className={styles.columns}>
        <Section title='Contact person'>
          <DetailItem label='Name'>
            {formatPersonName(user.firstName, user.lastName)}
          </DetailItem>
          <DetailItem label='Email'>
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </DetailItem>
          <DetailItem label='Phone'>
            {user.phoneNumber ? (
              <a href={`tel:${user.phoneNumber}`}>{user.phoneNumber}</a>
            ) : null}
          </DetailItem>
        </Section>

        <Section title='Company'>
          <DetailItem label='Company name'>{user.companyName}</DetailItem>
          <DetailItem label='Registration number'>
            {user.registrationNumber}
          </DetailItem>
          <DetailItem label='Tax ID'>{user.taxId}</DetailItem>
          <DetailItem label='VAT number'>{user.vatNumber}</DetailItem>
        </Section>

        <Section title='Liquor license'>
          <DetailItem label='License number'>
            {user.liquorLicenseNumber}
          </DetailItem>
          <DetailItem label='Document'>
            {user.hasLicenseDocument ? (
              <button
                type='button'
                className={styles.linkButton}
                onClick={handleViewLicense}
                disabled={isOpeningLicense}
              >
                {isOpeningLicense ? 'Opening…' : 'View document'}
              </button>
            ) : (
              'Not uploaded'
            )}
          </DetailItem>
        </Section>

        <Section title='Bank details'>
          <DetailItem label='Bank'>{user.bankName}</DetailItem>
          <DetailItem label='IBAN'>
            {user.iban ? (
              <span className={styles.mono}>{formatIban(user.iban)}</span>
            ) : null}
          </DetailItem>
          <DetailItem label='BIC'>
            {user.bic ? <span className={styles.mono}>{user.bic}</span> : null}
          </DetailItem>
        </Section>

        <Section title='Legal address'>
          <DetailItem label='Country'>{user.legalAddress?.country}</DetailItem>
          <DetailItem label='City'>{user.legalAddress?.city}</DetailItem>
          <DetailItem label='Street'>{user.legalAddress?.street}</DetailItem>
          <DetailItem label='ZIP code'>{user.legalAddress?.zipCode}</DetailItem>
        </Section>

        <Section title='Activity'>
          {isSeller ? (
            <>
              <DetailItem label='Products'>
                <Link to={`/admin/products?sellerId=${user.id}`}>
                  {user.productsCount}
                </Link>
              </DetailItem>
              <DetailItem label='Orders as seller'>
                <Link to={`/admin/orders?sellerId=${user.id}`}>
                  {user.ordersAsSeller}
                </Link>
              </DetailItem>
              <DetailItem label='Payouts'>
                <Link to={`/admin/payouts?sellerId=${user.id}`}>
                  View payouts
                </Link>
              </DetailItem>
            </>
          ) : null}
          <DetailItem label='Orders as buyer'>
            <Link to={`/admin/orders?buyerId=${user.id}`}>
              {user.ordersAsBuyer}
            </Link>
          </DetailItem>
          <DetailItem label='Admin actions'>
            <Link to={`/admin/audit?targetId=${user.id}`}>View history</Link>
          </DetailItem>
        </Section>
      </div>

      {isSeller ? (
        <PayFeesCard sellerId={user.id} companyLabel={companyLabel} />
      ) : null}

      <section className={`${styles.section} ${styles.dangerZone}`}>
        <div>
          <h2 className={styles.sectionTitle}>
            {user.banned ? 'Account is banned' : 'Ban account'}
          </h2>
          <p className={styles.muted}>
            {user.banned
              ? 'The user cannot log in. Restoring gives the access back.'
              : 'The user is logged out everywhere and cannot log in until the account is restored.'}
          </p>
        </div>
        {user.banned ? (
          <Button
            type='button'
            variant='secondary'
            onClick={() => openDialog('restore')}
          >
            Restore account
          </Button>
        ) : (
          <Button
            type='button'
            variant='secondary'
            className={styles.dangerOutline}
            onClick={() => openDialog('ban')}
          >
            Ban account
          </Button>
        )}
      </section>

      <AdminDialog
        isOpen={dialog === 'approve'}
        icon='success'
        title={`Verify ${companyLabel}?`}
        description='The company gets access to trading on the platform and receives a confirmation email.'
        confirmLabel='Approve'
        isBusy={decision.isPending}
        error={actionError}
        onConfirm={handleApprove}
        onClose={closeDialog}
      />

      <ReasonDialog
        isOpen={dialog === 'reject'}
        icon='error'
        tone='danger'
        title={
          user.verificationStatus === 'VERIFIED'
            ? `Revoke verification of ${companyLabel}?`
            : `Reject ${companyLabel}?`
        }
        description='Explain what the company has to fix. It can update the profile and send it for review again.'
        label='Reason'
        placeholder='e.g. The license document is expired. Please upload a valid one.'
        minLength={10}
        maxLength={500}
        confirmLabel={
          user.verificationStatus === 'VERIFIED' ? 'Revoke' : 'Reject'
        }
        isBusy={decision.isPending}
        error={actionError}
        onConfirm={handleReject}
        onClose={closeDialog}
      />

      <ReasonDialog
        isOpen={dialog === 'ban'}
        icon='error'
        tone='danger'
        title={`Ban ${user.email}?`}
        description='The user is signed out on every device and cannot log in.'
        label='Reason'
        hint='Kept in the audit log.'
        optional
        minLength={0}
        maxLength={500}
        confirmLabel='Ban account'
        isBusy={ban.isPending}
        error={actionError}
        onConfirm={handleBan}
        onClose={closeDialog}
      />

      <AdminDialog
        isOpen={dialog === 'restore'}
        icon='success'
        title={`Restore ${user.email}?`}
        description='The user can log in again.'
        confirmLabel='Restore'
        isBusy={restore.isPending}
        error={actionError}
        onConfirm={handleRestore}
        onClose={closeDialog}
      />
    </div>
  );
};

export default AdminUserDetails;
