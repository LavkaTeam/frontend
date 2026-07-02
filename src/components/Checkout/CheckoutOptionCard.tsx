import type { ComponentType, InputHTMLAttributes } from 'react';
import styles from '@/pages/Checkout.module.css';

type OptionIconProps = {
  className?: string;
};

type CheckoutOptionCardProps = {
  value: string;
  title: string;
  description: string;
  hint?: string;
  icon: ComponentType<OptionIconProps>;
  selected: boolean;
  disabled?: boolean;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  kind: 'delivery' | 'payment';
};

const CheckoutOptionCard = ({
  title,
  description,
  hint,
  value,
  icon: Icon,
  selected,
  disabled,
  inputProps,
  kind,
}: CheckoutOptionCardProps) => {
  const cardClassName = kind === 'payment' ? styles.paymentCard : styles.optionCard;
  const activeClassName =
    kind === 'payment' ? styles.paymentCardActive : styles.optionCardActive;
  const disabledClassName = disabled ? styles.paymentCardDisabled : '';
  const bodyClassName =
    kind === 'payment' ? styles.paymentCardInner : styles.optionContent;

  return (
    <label
      className={`${cardClassName} ${selected ? activeClassName : ''} ${disabledClassName}`.trim()}
    >
      <input
        type='radio'
        value={value}
        className={styles.hiddenInput}
        disabled={disabled}
        {...inputProps}
      />
      <div className={bodyClassName}>
        <div className={styles.optionIcon}>
          <Icon className={styles.optionSvg} />
        </div>
        <div className={styles.paymentText}>
          <p className={styles.optionTitle}>{title}</p>
          <p className={styles.optionDescription}>{description}</p>
          {hint ? <p className={styles.optionHint}>{hint}</p> : null}
        </div>
        <span className={styles.optionIndicator} aria-hidden='true' />
      </div>
    </label>
  );
};

export { CheckoutOptionCard };
