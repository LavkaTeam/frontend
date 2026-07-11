import { InputField } from '@/components/Form';
import { EditPasswordIcon } from '@/components/ui/icons/EditPasswordIcon';

import { PERSONAL_FIELD_CONFIGS } from '../../config/profileForm.constants';
import type {
  ProfileFormData,
  ProfileFormErrors,
} from '../../types/profileForm.types';
import styles from './ProfileFormSections.module.css';

interface PersonalDetailsSectionProps {
  formData: ProfileFormData;
  formErrors: ProfileFormErrors;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFieldBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onOpenPasswordModal: () => void;
}

const PersonalDetailsSection = ({
  formData,
  formErrors,
  onFieldChange,
  onFieldBlur,
  onOpenPasswordModal,
}: PersonalDetailsSectionProps) => {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Personal Details</h3>

      <div className={styles.grid}>
        {PERSONAL_FIELD_CONFIGS.map((field) => (
          <InputField
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            value={formData[field.id]}
            onChange={onFieldChange}
            onBlur={field.readOnly ? undefined : onFieldBlur}
            error={field.readOnly ? undefined : formErrors[field.id]}
            placeholder={field.placeholder}
            readOnly={field.readOnly}
          />
        ))}

        <div className={styles.fullWidth}>
          <div className={styles.actionRow}>
            <div className={styles.flexGrowField}>
              <InputField
                id='password'
                label='Password'
                type='text'
                value='••••••••'
                readOnly
                tabIndex={-1}
                onMouseDown={(event) => event.preventDefault()}
                placeholder='Password'
              />
            </div>

            <div className={styles.fileActions}>
              <button
                type='button'
                className={styles.textAction}
                onClick={onOpenPasswordModal}
              >
                <span>Edit password</span>
                <EditPasswordIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PersonalDetailsSection };
