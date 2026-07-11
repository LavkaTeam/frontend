import { useEffect, useState } from 'react';

import { InputField } from '@/components/Form';
import { Button } from '@/components/ui/Button';

import { ADDRESS_FIELD_CONFIGS } from '../../config/profileForm.constants';
import type { AddressDraft } from '../../types/profileForm.types';
import sectionStyles from '../sections/ProfileFormSections.module.css';
import styles from './AddressModal.module.css';

interface AddressModalProps {
  draft: AddressDraft | null;
  isOpen: boolean;
  isSaving: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onRequestClose: () => void;
  onExited: () => void;
}

const AddressModal = ({
  draft,
  isOpen,
  isSaving,
  onChange,
  onSave,
  onRequestClose,
  onExited,
}: AddressModalProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return;
    }

    if (shouldRender) {
      setIsVisible(false);
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!shouldRender || !isOpen) return;

    const openTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 16);

    return () => window.clearTimeout(openTimer);
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onRequestClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onRequestClose, shouldRender]);

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (
      event.target === event.currentTarget &&
      event.propertyName === 'opacity' &&
      !isVisible
    ) {
      setShouldRender(false);
      onExited();
    }
  };

  if (!shouldRender || !draft) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isVisible ? styles.modalOverlayOpen : ''}`}
      onClick={onRequestClose}
      onTransitionEnd={handleTransitionEnd}
      role='dialog'
      aria-modal='true'
      aria-labelledby='address-modal-title'
    >
      <div
        className={`${styles.modalCard} ${isVisible ? styles.modalCardOpen : ''}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h3 id='address-modal-title' className={styles.modalTitle}>
              {draft.id ? 'Edit address' : 'Add address'}
            </h3>
            <p className={styles.modalDescription}>
              Fill in delivery details for this saved address.
            </p>
          </div>
          <button
            type='button'
            className={styles.modalCloseButton}
            onClick={onRequestClose}
            aria-label='Close address modal'
          >
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={sectionStyles.grid}>
            {ADDRESS_FIELD_CONFIGS.map((field) => {
              const fieldContent = (
                <InputField
                  id={field.id}
                  label={field.label}
                  value={draft[field.id] || ''}
                  onChange={onChange}
                  placeholder={field.placeholder}
                />
              );

              if (field.fullWidth) {
                return (
                  <div key={field.id} className={sectionStyles.fullWidth}>
                    {fieldContent}
                  </div>
                );
              }

              return <div key={field.id}>{fieldContent}</div>;
            })}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Button variant='secondary' onClick={onRequestClose}>
            Cancel
          </Button>
          <Button onClick={onSave} isLoading={isSaving}>
            {draft.id ? 'Update address' : 'Save address'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { AddressModal };
