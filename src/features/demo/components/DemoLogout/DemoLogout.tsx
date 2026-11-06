import { HeaderIcon } from '@/components/HeaderIcon';
import { LogoutIcon } from '@/components/ui/icons/LogoutIcon';

import { useDemoSession } from '../../hooks/useDemoSession';

interface DemoLogoutProps {
  // The header's own class, so the button looks the same as in production.
  className?: string;
}

// Header logout in the demo: leaving ends the sandbox.
const DemoLogout = ({ className }: DemoLogoutProps) => {
  const session = useDemoSession();

  return (
    <div
      className={className}
      role='button'
      tabIndex={0}
      aria-label='Exit demo'
      aria-busy={session.isExiting}
      onClick={session.exit}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          session.exit();
        }
      }}
    >
      <HeaderIcon icon={<LogoutIcon />} iconText='Exit' />
    </div>
  );
};

export default DemoLogout;
