import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  downloadMyOrdersReport,
  downloadOrderDocument,
  downloadSellerOrdersReport,
  generateOrderDocument,
  getMyOrders,
  getOrderDetails,
  getOrderDocuments,
  getSellerOrders,
  updateOrderStatus,
} from '@/api/orders';
import { completeSellerOrder } from '@/api/payments';
import type {
  GenerateDocumentRequestDto,
  OrderDocumentDto,
  OrderResponseDto,
  UpdateOrderStatusRequestDto,
} from '@/types/order';

const hasPendingDocuments = (documents: OrderDocumentDto[]) =>
  documents.some((document) => document.status === 'PENDING');

export const useMyOrders = (
  page = 0,
  size = 10,
  statuses: OrderResponseDto['orderStatus'][] = [],
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['orders', 'me', page, size, statuses],
    queryFn: () => getMyOrders(page, size, statuses),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: options?.enabled ?? true,
  });
};

export const useSellerOrders = (
  page = 0,
  size = 10,
  statuses: OrderResponseDto['orderStatus'][] = [],
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['orders', 'seller', page, size, statuses],
    queryFn: () => getSellerOrders(page, size, statuses),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: options?.enabled ?? true,
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
        queryClient.invalidateQueries({
          queryKey: ['orders', 'seller'],
        }),
      ]);
    },
  });
};

export const useCompleteSellerOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => completeSellerOrder(orderId),
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
        queryClient.invalidateQueries({
          queryKey: ['orders', 'seller'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['finances'],
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
      fallbackFileName,
    }: {
      orderId: string;
      documentId: string;
      fallbackFileName?: string;
    }) => downloadOrderDocument(orderId, documentId, fallbackFileName),
  });
};

export const useDownloadMyOrdersReport = () => {
  return useMutation({
    mutationFn: (statuses: OrderResponseDto['orderStatus'][] = []) =>
      downloadMyOrdersReport(statuses),
  });
};

export const useDownloadSellerOrdersReport = () => {
  return useMutation({
    mutationFn: (statuses: OrderResponseDto['orderStatus'][] = []) =>
      downloadSellerOrdersReport(statuses),
  });
};
