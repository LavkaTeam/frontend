import { AccountShell } from '@/features/account';
import { Loader } from '@/components/ui/Loader';
import { useUser } from '@/hooks/useUser';
import { extractErrorMessage } from '@/utils/error';

const Account = () => {
  const { error, isLoading } = useUser();

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <div className='container'>
        <p>{extractErrorMessage(error, 'Failed to load your account.')}</p>
      </div>
    );
  }

  return (
    <div className='container'>
      <AccountShell />
    </div>
  );
};

export default Account;
