interface ShoppingCartProps {
  currentColor?: string;
}

export const ShoppingCart = ({ currentColor = 'white' }: ShoppingCartProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='25'
      height='24'
      viewBox='0 0 25 24'
      fill='none'
    >
      <g clipPath='url(#clip0_1129_11447)'>
        <path
          d='M1.5 1H5.5L8.18 14.39C8.27144 14.8504 8.52191 15.264 8.88755 15.5583C9.25318 15.8526 9.7107 16.009 10.18 16H19.9C20.3693 16.009 20.8268 15.8526 21.1925 15.5583C21.5581 15.264 21.8086 14.8504 21.9 14.39L23.5 6H6.5M10.5 21C10.5 21.5523 10.0523 22 9.5 22C8.94772 22 8.5 21.5523 8.5 21C8.5 20.4477 8.94772 20 9.5 20C10.0523 20 10.5 20.4477 10.5 21ZM21.5 21C21.5 21.5523 21.0523 22 20.5 22C19.9477 22 19.5 21.5523 19.5 21C19.5 20.4477 19.9477 20 20.5 20C21.0523 20 21.5 20.4477 21.5 21Z'
          stroke={currentColor}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_1129_11447'>
          <rect
            width='24'
            height='24'
            fill={currentColor}
            transform='translate(0.5)'
          />
        </clipPath>
      </defs>
    </svg>
  );
};
