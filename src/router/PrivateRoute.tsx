import { Navigate } from 'react-router-dom';
import { Loader } from '@/components/ui/Loader';
import { useUser } from '@/hooks/useUser';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};