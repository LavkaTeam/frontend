import { Link } from 'react-router-dom';

import { HeaderIcon } from '@/components/HeaderIcon';

// Header entry for visitors without a sandbox ("Try demo" instead of login).
const DemoTryButton = () => (
  <Link to='/demo'>
    <HeaderIcon
      icon={
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <polygon points='6 4 20 12 6 20 6 4' />
        </svg>
      }
      iconText='Try demo'
    />
  </Link>
);

export default DemoTryButton;
