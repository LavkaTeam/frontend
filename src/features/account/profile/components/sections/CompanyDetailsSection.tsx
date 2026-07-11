import { InputField } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { UploadFileIcon } from '@/components/ui/icons/UploadFileIcon';

import { COMPANY_FIELD_CONFIGS } from '../../config/profileForm.constants';
import type {
  LicenseStatusMeta,
  ProfileFormData,
  ProfileFormErrors,
} from '../../types/profileForm.types';
import styles from './ProfileFormSections.module.css';

interface CompanyDetailsSectionProps {
  formData: ProfileFormData;
  formErrors: ProfileFormErrors;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFieldBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  licenseInputRef: React.RefObject<HTMLInputElement | null>;
  licenseFileName: string | null;
  licenseStatus: LicenseStatusMeta;
  pendingLicenseFile: File | null;
  isViewingLicense: boolean;
  onLicenseUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onViewLicense: () => void;
}

const getLicenseStatusClassName = (tone: LicenseStatusMeta['tone']) => {
  switch (tone) {
    case 'verified':
      return styles.licenseStatusVerified;
    case 'pending':
      return styles.licenseStatusPending;
    case 'rejected':
      return styles.licenseStatusRejected;
    default:
      return '';
  }
};

const CompanyDetailsSection = ({
  formData,
  formErrors,
  onFieldChange,
  onFieldBlur,
  licenseInputRef,
  licenseFileName,
  licenseStatus,
  pendingLicenseFile,
  isViewingLicense,
  onLicenseUpload,
  onViewLicense,
}: CompanyDetailsSectionProps) => {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Company Details</h3>

      <div className={styles.grid}>
        {COMPANY_FIELD_CONFIGS.slice(0, 8).map((field) => (
          <InputField
            key={field.id}
            id={field.id}
            label={field.label}
            value={formData[field.id]}
            onChange={onFieldChange}
            onBlur={onFieldBlur}
            error={formErrors[field.id]}
            placeholder={field.placeholder}
          />
        ))}

        <div className={styles.fullWidth}>
          <div id='liquorLicenseDocumentUrl' className={styles.licenseCard}>
            <div className={styles.licenseCardHeader}>
              <div>
                <p className={styles.licenseLabel}>Liquor license</p>
                <p className={styles.licenseValue}>
                  {formData.liquorLicenseNumber || 'No license number yet'}
                </p>
              </div>
            </div>

            <div className={styles.licenseFileRow}>
              <div className={styles.licenseFileMeta}>
                <div className={styles.licenseFileTitleRow}>
                  <p className={styles.licenseFileName}>
                    {licenseFileName || 'No file uploaded'}
                  </p>

                  {formData.liquorLicenseDocumentUrl && !pendingLicenseFile ? (
                    <Button
                      type='button'
                      className={`${styles.textAction} ${styles.viewAction}`}
                      onClick={onViewLicense}
                      isLoading={isViewingLicense}
                    >
                      View
                    </Button>
                  ) : null}
                </div>

                <p
                  className={`${styles.licenseFileStatus} ${getLicenseStatusClassName(licenseStatus.tone)}`}
                >
                  {licenseStatus.label}
                </p>
              </div>

              <div className={styles.licenseActions}>
                <input
                  ref={licenseInputRef}
                  type='file'
                  style={{ display: 'none' }}
                  accept='.pdf,.jpg,.jpeg,.png'
                  onChange={onLicenseUpload}
                />
                <button
                  type='button'
                  className={styles.textAction}
                  onClick={() => licenseInputRef.current?.click()}
                >
                  <span>{licenseFileName ? 'Replace' : 'Upload file'}</span>
                  <UploadFileIcon />
                </button>
              </div>
            </div>

            <p
              className={`${styles.helperError} ${formErrors.liquorLicenseDocumentUrl ? styles.helperErrorVisible : ''}`}
            >
              {formErrors.liquorLicenseDocumentUrl || ' '}
            </p>
          </div>
        </div>

        {COMPANY_FIELD_CONFIGS.slice(8).map((field) => (
          <InputField
            key={field.id}
            id={field.id}
            label={field.label}
            value={formData[field.id]}
            onChange={onFieldChange}
            onBlur={onFieldBlur}
            error={formErrors[field.id]}
            placeholder={field.placeholder}
          />
        ))}
      </div>
    </section>
  );
};

export { CompanyDetailsSection };
