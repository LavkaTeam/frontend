import { AccountShell } from '@/features/account';
import { Loader } from '@/components/ui/Loader';
import { useUser } from '@/hooks/useUser';

const Account = () => {
  const { error, isLoading } = useUser();

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error?.message}</div>;

  return (
    <div className='container'>
      <AccountShell />
    </div>
  );
};

export default Account;
