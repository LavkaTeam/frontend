import { ErrorIcon } from '@/components/ui/icons/ErrorIcon';
import { VerifiedStatusIcon } from '@/components/ui/icons/CheckoutIcons';

import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.iconWrap}>
        {type === 'success' ? (
          <VerifiedStatusIcon className={styles.statusIcon} />
        ) : (
          <ErrorIcon />
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.title}>
          {type === 'success' ? 'Done' : 'Attention'}
        </span>
        <span className={styles.message}>{message}</span>
      </div>
      <button type='button' onClick={onClose} className={styles.closeButton}>
        <span aria-hidden='true'>&times;</span>
      </button>
    </div>
  );
};

export { Toast };
