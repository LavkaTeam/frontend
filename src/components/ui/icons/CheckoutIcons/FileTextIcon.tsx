type CheckoutIconProps = {
  className?: string;
};

const FileTextIcon = ({ className }: CheckoutIconProps) => (
  <svg viewBox='0 0 24 24' className={className} aria-hidden='true'>
    <path
      d='M7 3.75h7l4 4V20.25H7z'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinejoin='round'
    />
    <path
      d='M14 3.75v4h4'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinejoin='round'
    />
    <path
      d='M9.5 11.25h5M9.5 14.75h5M9.5 18.25h3'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinecap='round'
    />
  </svg>
);

export { FileTextIcon };
