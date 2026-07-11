import {
  AccountProfileForm,
  AccountProfileFormSkeleton,
} from '@/features/account/profile';
import { useUser } from '@/hooks/useUser';

const BuyerProfile = () => {
  const { data: user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <AccountProfileFormSkeleton
        title='Hello, you are in your customer account'
        description='Here you will find all information about your orders and be able to update your personal details'
      />
    );
  }

  if (error || !user) return null;

  return (
    <AccountProfileForm
      user={user}
      title='Hello, you are in your customer account'
      description='Here you will find all information about your orders and be able to update your personal details'
    />
  );
};

export default BuyerProfile;
