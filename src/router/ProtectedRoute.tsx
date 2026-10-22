import { Navigate, useLocation } from 'react-router-dom';
import { Loader } from '@/components/ui/Loader';
import { AccessDenied } from '@/components/AccessDenied/AccessDenied';
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
  const location = useLocation();

  if (isLoading) return <Loader />;
  if (!user) {
    return (
      <Navigate
        to='/login'
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // The admin has no buyer/seller cabinet; send them to their own.
    if (user.role === 'ADMIN') return <Navigate to='/admin' replace />;

    return <AccessDenied />;
  }

  return <>{children}</>;
};
