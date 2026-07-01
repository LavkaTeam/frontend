import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { SubHeading } from '@/components/ui/SubHeading';
import { VerifiedStatusIcon } from '@/components/ui/icons/CheckoutIcons';
import styles from '@/pages/Checkout.module.css';

type CheckoutCompanyCardProps = {
  companyName?: string;
  companyStatus: {
    label: string;
    toneClassName: string;
    showIcon: boolean;
  };
  legalAddress: string;
  managerName: string;
  managerPhone: string;
  email?: string;
  registrationNumber: string;
  taxId: string;
  iban?: string;
  bankName: string;
  companyRequirements: string[];
};

const CheckoutCompanyCard = forwardRef<HTMLDivElement, CheckoutCompanyCardProps>(
  (
    {
      companyName,
      companyStatus,
      legalAddress,
      managerName,
      managerPhone,
      email,
      registrationNumber,
      taxId,
      iban,
      bankName,
      companyRequirements,
    },
    ref,
  ) => (
    <div ref={ref} className={styles.card}>
      <SubHeading color='secondary'>Company & documents</SubHeading>

      <div className={styles.companyCard}>
        <div className={styles.companyHeader}>
          <div>
            <p className={styles.companyName}>{companyName || 'Company details missing'}</p>
            <span className={`${styles.companyStatus} ${companyStatus.toneClassName}`}>
              {companyStatus.showIcon ? (
                <VerifiedStatusIcon className={styles.companyStatusIcon} />
              ) : null}
              <span>{companyStatus.label}</span>
            </span>
          </div>
          <Link to='/account' className={styles.billingLink}>
            Edit in profile
          </Link>
        </div>

        <div className={styles.companyMeta}>
          <div className={styles.companyMetaRow}>
            <span>Registration number</span>
            <strong>{registrationNumber || 'Not specified'}</strong>
          </div>
          <div className={styles.companyMetaRow}>
            <span>VAT / Tax ID</span>
            <strong>{taxId || 'Not specified'}</strong>
          </div>
          <div className={styles.companyMetaRow}>
            <span>IBAN</span>
            <strong>{iban || 'Not specified'}</strong>
          </div>
          <div className={styles.companyMetaRow}>
            <span>Bank</span>
            <strong>{bankName || 'Not specified'}</strong>
          </div>
          <div className={styles.companyMetaRow}>
            <span>Legal address</span>
            <strong>{legalAddress || 'Not specified'}</strong>
          </div>
          <div className={styles.companyMetaRow}>
            <span>Manager</span>
            <strong>{managerName || 'Not specified'}</strong>
          </div>
          <div className={styles.companyMetaRow}>
            <span>Email</span>
            <strong>{email || 'Not specified'}</strong>
          </div>
          <div className={styles.companyMetaRow}>
            <span>Phone</span>
            <strong>{managerPhone}</strong>
          </div>
        </div>

        {companyRequirements.length > 0 ? (
          <div className={styles.companyWarning}>
            <p className={styles.companyWarningTitle}>Checkout requirements</p>
            {companyRequirements.map((requirement) => (
              <p key={requirement} className={styles.companyWarningText}>
                {requirement}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  ),
);

CheckoutCompanyCard.displayName = 'CheckoutCompanyCard';

export { CheckoutCompanyCard };
