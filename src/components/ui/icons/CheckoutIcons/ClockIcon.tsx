type CheckoutIconProps = {
  className?: string;
};

const ClockIcon = ({ className }: CheckoutIconProps) => (
  <svg viewBox='0 0 24 24' className={className} aria-hidden='true'>
    <circle
      cx='12'
      cy='12'
      r='8.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
    />
    <path
      d='M12 8.5v4l2.75 1.75'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export { ClockIcon };
