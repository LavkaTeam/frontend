import { fetchData } from './fetchData';
import type {
  GenerateDocumentRequestDto,
  OrderDocumentDto,
  OrderRequestDto,
  OrderResponseDto,
  OrdersPageDto,
  UpdateOrderStatusRequestDto,
} from '@/types/order';

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
): Promise<OrdersPageDto> => {
  return fetchData<OrdersPageDto>(`/orders/me?page=${page}&size=${size}`);
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
) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || 'https://lavka-api.onrender.com/api'}/orders/${orderId}/documents/${documentId}/download`,
    {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  );

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      throw await response.json();
    }

    throw new Error(await response.text());
  }

  const blob = await response.blob();
  const disposition = response.headers.get('content-disposition');
  const fileNameMatch = disposition?.match(/filename="?([^"]+)"?/i);
  const fileName = fileNameMatch?.[1] || 'document.pdf';

  return { blob, fileName };
};
