type CheckoutIconProps = {
  className?: string;
};

const PackageCheckIcon = ({ className }: CheckoutIconProps) => (
  <svg viewBox='0 0 24 24' className={className} aria-hidden='true'>
    <path
      d='M4 8.5 12 4l8 4.5v9L12 22l-8-4.5z'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinejoin='round'
    />
    <path
      d='M12 12V22M4.75 8.3 12 12l7.25-3.7'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinejoin='round'
    />
    <path
      d='m9.5 14.5 1.75 1.75 3.75-4'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export { PackageCheckIcon };
