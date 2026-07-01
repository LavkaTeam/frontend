type CheckoutIconProps = {
  className?: string;
};

const CreditCardIcon = ({ className }: CheckoutIconProps) => (
  <svg viewBox='0 0 24 24' className={className} aria-hidden='true'>
    <rect
      x='3.5'
      y='6'
      width='17'
      height='12'
      rx='2'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
    />
    <path
      d='M3.5 10h17'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinecap='round'
    />
    <path
      d='M6.5 14.75h3'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinecap='round'
    />
  </svg>
);

export { CreditCardIcon };
