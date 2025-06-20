import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useLogOutHandler = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSubmit = () => {
    localStorage.clear();
    queryClient.clear();
    navigate('/');
  };

  return { handleSubmit };
};
