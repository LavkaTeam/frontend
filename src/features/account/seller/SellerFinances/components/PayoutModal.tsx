import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';

import { formatFinanceAmount } from '../utils/financeFormatters';
import styles from './PayoutModal.module.css';

interface PayoutModalProps {
  isOpen: boolean;
  availableBalance: number;
  bankName?: string;
  iban?: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

const PayoutModal = ({
  isOpen,
  availableBalance,
  bankName,
  iban,
  isSubmitting,
  onClose,
  onSubmit,
}: PayoutModalProps) => {
  const [amount, setAmount] = useState('');
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const numericAmount = Number(amount);
  const isAmountEmpty = amount.trim() === '';

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsVisible(false);

      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = window.requestAnimationFrame(() => {
          setIsVisible(true);
          animationFrameRef.current = null;
        });
      });
    } else {
      setIsVisible(false);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isSubmitting, onClose]);

  const validationMessage = useMemo(() => {
    if (isAmountEmpty) return '';
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return 'Amount must be greater than 0.';
    }
    if (numericAmount > availableBalance) {
      return 'Amount cannot exceed available balance.';
    }

    return '';
  }, [availableBalance, isAmountEmpty, numericAmount]);
  const isInvalid = isAmountEmpty || Boolean(validationMessage);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`${styles.modalOverlay} ${
        isVisible ? styles.modalOverlayVisible : styles.modalOverlayHidden
      }`}
      role='presentation'
      onClick={isSubmitting ? undefined : onClose}
      onTransitionEnd={(event) => {
        if (
          !isVisible &&
          event.target === event.currentTarget &&
          event.propertyName === 'opacity'
        ) {
          setShouldRender(false);
        }
      }}
    >
      <div
        className={`${styles.modal} ${
          isVisible ? styles.modalVisible : styles.modalHidden
        }`}
        role='dialog'
        aria-modal='true'
        aria-labelledby='payout-title'
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 id='payout-title'>Payment request</h3>
          <button
            type='button'
            className={styles.closeButton}
            onClick={onClose}
            aria-label='Close payout modal'
          >
            ×
          </button>
        </div>

        <p className={styles.modalText}>
          Available for payout:{' '}
          <span className={styles.modalAmount}>
            {formatFinanceAmount(availableBalance)}
          </span>
        </p>

        <div className={styles.bankDetails}>
          <span>Bank account</span>
          <strong>{(iban || 'Not specified').toUpperCase()}</strong>
          <small>{bankName || 'Add bank details in your profile'}</small>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!isInvalid) {
              onSubmit(numericAmount);
            }
          }}
        >
          <label className={styles.amountField}>
            <span>Amount</span>
            <input
              type='number'
              min='0.01'
              max={availableBalance}
              step='0.01'
              inputMode='decimal'
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder='0.00'
            />
          </label>

          <p className={styles.validationText}>
            {validationMessage || '\u00A0'}
          </p>

          <div className={styles.modalActions}>
            <Button
              type='button'
              variant='secondary'
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isInvalid} isLoading={isSubmitting}>
              Submit request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { PayoutModal };
