type CheckoutIconProps = {
  className?: string;
};

const VerifiedStatusIcon = ({ className }: CheckoutIconProps) => (
  <svg viewBox='0 0 20 20' className={className} aria-hidden='true'>
    <path
      d='M10 1.66663L12.575 4.27496L16.2083 4.05829L15.9917 7.69163L18.3333 10L15.9917 12.3083L16.2083 15.9416L12.575 15.725L10 18.3333L7.425 15.725L3.79167 15.9416L4.00833 12.3083L1.66667 10L4.00833 7.69163L3.79167 4.05829L7.425 4.27496L10 1.66663Z'
      fill='currentColor'
      fillOpacity='0.14'
    />
    <path
      d='M6.75 10L8.95 12.2L13.25 7.89996'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.9'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M10 1.66663L12.575 4.27496L16.2083 4.05829L15.9917 7.69163L18.3333 10L15.9917 12.3083L16.2083 15.9416L12.575 15.725L10 18.3333L7.425 15.725L3.79167 15.9416L4.00833 12.3083L1.66667 10L4.00833 7.69163L3.79167 4.05829L7.425 4.27496L10 1.66663Z'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinejoin='round'
    />
  </svg>
);

export { VerifiedStatusIcon };
