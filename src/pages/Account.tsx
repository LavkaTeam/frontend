import { HeaderMenu } from '@/components/HeaderMenu';
import { AccountPage } from '@/components/Account/AccountPage';
import { Loader } from '@/components/ui/Loader';
import { useUser } from '@/hooks/useUser';

const Account = () => {
  const { data: user, error, isLoading } = useUser();

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error?.message}</div>;

  return (
    <div className='container'>
      <HeaderMenu />
      <AccountPage />
    </div>
  );
};

export default Account;
