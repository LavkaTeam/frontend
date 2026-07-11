import {
  AccountProfileForm,
  AccountProfileFormSkeleton,
} from '@/features/account/profile';
import { useUser } from '@/hooks/useUser';

const SellerProfile = () => {
  const { data: user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <AccountProfileFormSkeleton
        title='Hello, you are in your seller account'
        description='Manage your products, orders, and sales details here'
      />
    );
  }

  if (error || !user) return null;

  return (
    <AccountProfileForm
      user={user}
      title='Hello, you are in your seller account'
      description='Manage your products, orders, and sales details here'
    />
  );
};

export default SellerProfile;
