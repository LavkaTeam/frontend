import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/store/cartSlice';
import { clearFavorites } from '@/store/favoritesSlice';
import { AUTH_LOGOUT_EVENT } from '@/shared/api/client';
import { useToast } from './useToast';

// Resets client state when the API client fails to refresh the session.
const useAuthSessionWatcher = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch(clearCart());
      dispatch(clearFavorites());
      queryClient.clear();

      if (window.location.pathname === '/login') return;

      showToast('Your session has expired. Please log in again.', 'error');
      navigate('/login', {
        replace: true,
        state: {
          from: `${window.location.pathname}${window.location.search}`,
        },
      });
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleSessionExpired);
    };
    // showToast is recreated on every render but only touches module state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, queryClient]);
};

export { useAuthSessionWatcher };
