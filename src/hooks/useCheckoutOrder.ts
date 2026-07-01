import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '@/api/orders';
import type { OrderRequestDto } from '@/types/order';

export const useCheckoutOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrderRequestDto) => createOrder(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['cart'] }),
        queryClient.invalidateQueries({ queryKey: ['orders', 'me'] }),
      ]);
    },
  });
};
