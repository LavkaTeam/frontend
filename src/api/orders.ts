import { fetchData } from './fetchData';
import { downloadApiFile } from '@/shared/api/client';
import type {
  GenerateDocumentRequestDto,
  OrderDocumentDto,
  OrderRequestDto,
  OrderResponseDto,
  OrdersSummaryPageDto,
  UpdateOrderStatusRequestDto,
} from '@/types/order';

const buildOrdersQuery = (
  page = 0,
  size = 10,
  statuses: OrderResponseDto['orderStatus'][] = [],
) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  if (statuses.length > 0) {
    params.set('statuses', statuses.join(','));
  }

  return params.toString();
};

const downloadOrdersFile = async (
  endpoint: string,
  fallbackFileName: string,
  statuses: OrderResponseDto['orderStatus'][] = [],
) => {
  const query = statuses.length
    ? `?${new URLSearchParams({ statuses: statuses.join(',') }).toString()}`
    : '';

  return downloadApiFile(`${endpoint}${query}`, fallbackFileName);
};

export const createOrder = (
  data: OrderRequestDto,
): Promise<OrderResponseDto[]> => {
  return fetchData<OrderResponseDto[]>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getMyOrders = (
  page = 0,
  size = 10,
  statuses: OrderResponseDto['orderStatus'][] = [],
): Promise<OrdersSummaryPageDto> => {
  return fetchData<OrdersSummaryPageDto>(
    `/orders/me?${buildOrdersQuery(page, size, statuses)}`,
  );
};

export const getSellerOrders = (
  page = 0,
  size = 10,
  statuses: OrderResponseDto['orderStatus'][] = [],
): Promise<OrdersSummaryPageDto> => {
  return fetchData<OrdersSummaryPageDto>(
    `/orders/seller?${buildOrdersQuery(page, size, statuses)}`,
  );
};

export const getOrderDetails = (orderId: string): Promise<OrderResponseDto> => {
  return fetchData<OrderResponseDto>(`/orders/${orderId}`);
};

export const getOrderDocuments = (
  orderId: string,
): Promise<OrderDocumentDto[]> => {
  return fetchData<OrderDocumentDto[]>(`/orders/${orderId}/documents`);
};

export const generateOrderDocument = (
  orderId: string,
  data: GenerateDocumentRequestDto,
): Promise<OrderDocumentDto> => {
  return fetchData<OrderDocumentDto>(`/orders/${orderId}/documents/generate`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateOrderStatus = (
  orderId: string,
  data: UpdateOrderStatusRequestDto,
): Promise<OrderResponseDto> => {
  return fetchData<OrderResponseDto>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const downloadOrderDocument = async (
  orderId: string,
  documentId: string,
  fallbackFileName = 'document.pdf',
) => {
  return downloadApiFile(
    `/orders/${orderId}/documents/${documentId}/download`,
    fallbackFileName,
  );
};

export const downloadMyOrdersReport = (
  statuses: OrderResponseDto['orderStatus'][] = [],
) => downloadOrdersFile('/orders/me/export', 'buyer-orders-report.xlsx', statuses);

export const downloadSellerOrdersReport = (
  statuses: OrderResponseDto['orderStatus'][] = [],
) =>
  downloadOrdersFile(
    '/orders/seller/export',
    'seller-orders-report.xlsx',
    statuses,
  );
