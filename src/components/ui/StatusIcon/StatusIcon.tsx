import styles from './StatusIcon.module.css';

export type StatusIconVariant =
  | 'email'
  | 'success'
  | 'warning'
  | 'pending'
  | 'error'
  | 'loading';

const ICON_PATHS: Record<Exclude<StatusIconVariant, 'loading'>, string[]> = {
  email: [
    'M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z',
    'm3 7 9 6 9-6',
  ],
  success: ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4 12 14.01l-3-3'],
  warning: [
    'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z',
    'M12 9v4',
    'M12 17h.01',
  ],
  pending: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 6v6l4 2'],
  error: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'm15 9-6 6', 'm9 9 6 6'],
};

interface StatusIconProps {
  variant: StatusIconVariant;
  // 'lg' for page-level status screens, 'md' for inline cards.
  size?: 'md' | 'lg';
}

const StatusIcon = ({ variant, size = 'lg' }: StatusIconProps) => {
  return (
    <div className={`${styles.icon} ${styles[size]} ${styles[variant]}`} aria-hidden='true'>
      {variant === 'loading' ? (
        <span className={styles.spinner} />
      ) : (
        <svg
          width={size === 'lg' ? 28 : 22}
          height={size === 'lg' ? 28 : 22}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          {ICON_PATHS[variant].map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      )}
    </div>
  );
};

export { StatusIcon };
