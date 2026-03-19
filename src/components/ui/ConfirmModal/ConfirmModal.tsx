import { Button } from '@/components/ui/Button';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div
            className={`${styles.iconWrapper} ${variant === 'danger' ? styles.danger : styles.warning}`}
          >
            {variant === 'danger' ? (
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M3 6h18'></path>
                <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'></path>
                <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'></path>
              </svg>
            ) : (
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path>
                <line x1='12' y1='9' x2='12' y2='13'></line>
                <line x1='12' y1='17' x2='12.01' y2='17'></line>
              </svg>
            )}
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <Button variant='secondary' onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            style={{
              backgroundColor: variant === 'danger' ? '#dc2626' : undefined,
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
