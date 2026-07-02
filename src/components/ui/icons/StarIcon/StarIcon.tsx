import React from 'react';

type StarIconProps = React.SVGProps<SVGSVGElement>;

export const StarIcon: React.FC<StarIconProps> = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.00004 1.33331L10.06 5.50665L14.6667 6.18001L11.3334 9.42668L12.12 14.0133L8.00004 11.8466L3.88004 14.0133L4.66671 9.42668L1.33337 6.18001L5.94004 5.50665L8.00004 1.33331Z"
      fill="#FABB05"
    />
  </svg>
);
