import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  completeDemoPayment,
  createDemoPaymentSession,
  failDemoPayment,
} from '@/api/payments';

const invalidatePaymentRelatedQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ['orders'],
    }),
    queryClient.invalidateQueries({
      queryKey: ['cart'],
    }),
    queryClient.invalidateQueries({
      queryKey: ['finances'],
    }),
  ]);
};

export const useCreateDemoPaymentSession = () =>
  useMutation({
    mutationFn: (batchId: string) => createDemoPaymentSession(batchId),
  });

export const useCompleteDemoPayment = (batchId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => completeDemoPayment(batchId as string),
    onSuccess: async () => {
      await invalidatePaymentRelatedQueries(queryClient);
    },
  });
};

export const useFailDemoPayment = (batchId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => failDemoPayment(batchId as string),
    onSuccess: async () => {
      await invalidatePaymentRelatedQueries(queryClient);
    },
  });
};
