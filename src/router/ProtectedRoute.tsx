import { Navigate } from 'react-router-dom';
import { Loader } from '@/components/ui/Loader';
import { useUser } from '@/hooks/useUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <Loader />;
  if (!user) return <Navigate to='/login' replace />;

  if (allowedRoles.length > 0) {
    const hasAccess = allowedRoles.includes(user.role);
    if (!hasAccess) return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};
