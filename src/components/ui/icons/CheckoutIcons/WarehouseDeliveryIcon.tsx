type CheckoutIconProps = {
  className?: string;
};

const WarehouseDeliveryIcon = ({ className }: CheckoutIconProps) => (
  <svg viewBox='0 0 24 24' className={className} aria-hidden='true'>
    <path
      d='M4.5 10.25 12 5l7.5 5.25'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M6.25 10.5h11.5v8.25H6.25z'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinejoin='round'
    />
    <path
      d='M10 18.75v-4.5c0-.41.34-.75.75-.75h2.5c.41 0 .75.34.75.75v4.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinejoin='round'
    />
  </svg>
);

export { WarehouseDeliveryIcon };
