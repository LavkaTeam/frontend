import { useEffect, useId, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { StatusIcon, type StatusIconVariant } from '@/components/ui/StatusIcon';

import styles from './AdminDialog.module.css';

interface AdminDialogProps {
  isOpen: boolean;
  title: string;
  description?: ReactNode;
  icon?: StatusIconVariant;
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  // For read-only views: only the close button is shown.
  hideConfirm?: boolean;
  // Buttons between "Cancel" and the confirm button, e.g. "Reject".
  extraActions?: ReactNode;
  // 'danger' for irreversible or user-affecting actions.
  tone?: 'primary' | 'danger';
  isBusy?: boolean;
  confirmDisabled?: boolean;
  // Backend error shown inside the dialog, so it stays in context.
  error?: string;
  onConfirm: () => void;
  onClose: () => void;
}

// Confirmation dialog of admin actions, in the style of the app modals.
const AdminDialog = ({
  isOpen,
  title,
  description,
  icon,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  hideConfirm = false,
  extraActions,
  tone = 'primary',
  isBusy = false,
  confirmDisabled = false,
  error,
  onConfirm,
  onClose,
}: AdminDialogProps) => {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      // A request in flight cannot be cancelled, so the dialog stays.
      if (event.key === 'Escape' && !isBusy) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isBusy, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={() => {
        if (!isBusy) onClose();
      }}
    >
      <div
        className={styles.modal}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          {icon ? <StatusIcon variant={icon} size='md' /> : null}
          <div className={styles.heading}>
            <h3 id={titleId} className={styles.title}>
              {title}
            </h3>
            {description ? (
              <div className={styles.description}>{description}</div>
            ) : null}
          </div>
        </div>

        {children ? <div className={styles.body}>{children}</div> : null}

        {error ? (
          <p className={styles.error} role='alert'>
            {error}
          </p>
        ) : null}

        <div className={styles.actions}>
          <Button
            type='button'
            variant='secondary'
            onClick={onClose}
            disabled={isBusy}
          >
            {cancelLabel}
          </Button>
          {extraActions}
          {hideConfirm ? null : (
            <Button
              type='button'
              className={tone === 'danger' ? styles.dangerButton : undefined}
              onClick={onConfirm}
              isLoading={isBusy}
              disabled={confirmDisabled}
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ReasonDialogProps extends Omit<
  AdminDialogProps,
  'children' | 'onConfirm' | 'confirmDisabled'
> {
  label: string;
  placeholder?: string;
  hint?: string;
  minLength: number;
  maxLength: number;
  // An optional reason may be left empty (e.g. when banning).
  optional?: boolean;
  onConfirm: (reason: string) => void;
}

/**
 * Asks for the reason of a decision. The backend emails the text to the
 * user, so the limits mirror the contract (8-admin.md, section 2).
 */
const ReasonDialog = ({
  label,
  placeholder,
  hint = 'The user receives this text by email.',
  minLength,
  maxLength,
  optional = false,
  onConfirm,
  isOpen,
  ...dialogProps
}: ReasonDialogProps) => {
  const fieldId = useId();
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);

  // Each opening starts with an empty field.
  useEffect(() => {
    if (isOpen) {
      setReason('');
      setTouched(false);
    }
  }, [isOpen]);

  const length = reason.trim().length;
  const tooShort = length < minLength && !(optional && length === 0);
  const tooLong = length > maxLength;
  const invalid = tooShort || tooLong;
  const validationMessage = tooLong
    ? `Use at most ${maxLength} characters.`
    : tooShort
      ? `Write at least ${minLength} characters.`
      : '';

  return (
    <AdminDialog
      {...dialogProps}
      isOpen={isOpen}
      confirmDisabled={invalid}
      onConfirm={() => {
        setTouched(true);
        if (!invalid) onConfirm(reason.trim());
      }}
    >
      <div className={styles.field}>
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {optional ? (
            <span className={styles.optional}> (optional)</span>
          ) : null}
        </label>
        <textarea
          id={fieldId}
          className={`${styles.textarea} ${touched && invalid ? styles.textareaInvalid : ''}`}
          value={reason}
          placeholder={placeholder}
          rows={4}
          maxLength={maxLength + 50}
          onChange={(event) => setReason(event.target.value)}
          onBlur={() => setTouched(true)}
          autoFocus
        />
        <div className={styles.fieldFooter}>
          <span
            className={touched && invalid ? styles.fieldError : styles.hint}
          >
            {touched && invalid ? validationMessage : hint}
          </span>
          <span className={tooLong ? styles.fieldError : styles.counter}>
            {length}/{maxLength}
          </span>
        </div>
      </div>
    </AdminDialog>
  );
};

export { AdminDialog, ReasonDialog };
