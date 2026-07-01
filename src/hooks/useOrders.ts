import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  downloadOrderDocument,
  generateOrderDocument,
  getMyOrders,
  getOrderDetails,
  getOrderDocuments,
  updateOrderStatus,
} from '@/api/orders';
import type {
  GenerateDocumentRequestDto,
  OrderDocumentDto,
  UpdateOrderStatusRequestDto,
} from '@/types/order';

const hasPendingDocuments = (documents: OrderDocumentDto[]) =>
  documents.some((document) => document.status === 'PENDING');

export const useMyOrders = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['orders', 'me', page, size],
    queryFn: () => getMyOrders(page, size),
    staleTime: 30_000,
  });
};

export const useOrderDetails = (orderId?: string) => {
  return useQuery({
    queryKey: ['orders', 'details', orderId],
    queryFn: () => getOrderDetails(orderId as string),
    enabled: Boolean(orderId),
  });
};

export const useOrderDocuments = (
  orderId?: string,
  options?: { enabled?: boolean; initialData?: OrderDocumentDto[] },
) => {
  return useQuery({
    queryKey: ['orders', 'documents', orderId],
    queryFn: () => getOrderDocuments(orderId as string),
    enabled: Boolean(orderId) && (options?.enabled ?? true),
    initialData: options?.initialData,
    refetchInterval: (query) => {
      const documents = query.state.data;
      return documents && hasPendingDocuments(documents) ? 4000 : false;
    },
  });
};

export const useGenerateOrderDocument = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateDocumentRequestDto) =>
      generateOrderDocument(orderId, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['orders', 'documents', orderId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['orders', 'details', orderId],
        }),
      ]);
    },
  });
};

export const useUpdateOrderStatus = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrderStatusRequestDto) =>
      updateOrderStatus(orderId, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['orders', 'documents', orderId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['orders', 'details', orderId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['orders', 'me'],
        }),
      ]);
    },
  });
};

export const saveDocumentBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const useDownloadOrderDocument = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      documentId,
    }: {
      orderId: string;
      documentId: string;
    }) => downloadOrderDocument(orderId, documentId),
  });
};
