type CheckoutIconProps = {
  className?: string;
};

const CourierDeliveryIcon = ({ className }: CheckoutIconProps) => (
  <svg viewBox='0 0 24 24' className={className} aria-hidden='true'>
    <path
      d='M4.25 8.5c0-.69.56-1.25 1.25-1.25h7.75c.69 0 1.25.56 1.25 1.25v6.25H4.25z'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinejoin='round'
    />
    <path
      d='M14.5 10.25h2.75c.47 0 .9.26 1.12.67l1.38 2.58v1.25c0 .69-.56 1.25-1.25 1.25H14.5z'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinejoin='round'
    />
    <path
      d='M4.25 14.75v.5c0 .69.56 1.25 1.25 1.25H6.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M17.25 10.25v3h2.15'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <circle
      cx='8'
      cy='16.5'
      r='1.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
    />
    <circle
      cx='17'
      cy='16.5'
      r='1.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
    />
  </svg>
);

export { CourierDeliveryIcon };
