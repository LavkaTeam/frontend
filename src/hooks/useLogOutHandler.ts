import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/store/cartSlice';
import { clearFavorites } from '@/store/favoritesSlice';

export const useLogOutHandler = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    localStorage.clear();
    dispatch(clearCart());
    dispatch(clearFavorites());
    queryClient.clear();
    navigate('/');
  };

  return { handleSubmit };
};
