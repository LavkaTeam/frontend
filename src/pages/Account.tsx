import { Loader } from '@/components/ui/Loader';
import { useUser } from '@/hooks/useUser';

const Account = () => {
  const { data: user, error, isLoading } = useUser();

  if (isLoading) return <Loader />;
  if (error) return <div>Сталася помилка: {error?.message}</div>;

  return <div>{user?.name || 'Користувача не знайдено'}</div>;
};

export default Account;
