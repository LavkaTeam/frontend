import { fetchData } from './fetchData';

import type {
  AdminAuditEntry,
  AdminAuditListParams,
  AdminBanRequest,
  AdminBlockProductRequest,
  AdminOrderListItem,
  AdminOrderListParams,
  AdminPage,
  AdminPayFeesRequest,
  AdminPayFeesResponse,
  AdminPayout,
  AdminPayoutDecisionResponse,
  AdminPayoutListParams,
  AdminProductListItem,
  AdminProductListParams,
  AdminProductModerationResponse,
  AdminRefundOrderRequest,
  AdminRefundOrderResponse,
  AdminRejectPayoutRequest,
  AdminStats,
  AdminUserDetails,
  AdminUserListItem,
  AdminUserListParams,
  AdminVerificationRequest,
  AdminVerificationResponse,
} from '@/types/admin';

type QueryValue = string | number | boolean | undefined;

// Skips empty filters, so "All" in a filter means "no parameter".
export const toQueryString = (params: object) => {
  const search = new URLSearchParams();

  Object.entries(params as Record<string, QueryValue>).forEach(
    ([key, value]) => {
      if (value === undefined || value === '') return;
      search.set(key, String(value));
    },
  );

  const query = search.toString();
  return query ? `?${query}` : '';
};

const post = <T>(endpoint: string, body?: object) =>
  fetchData<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });

/* ---------- Dashboard ---------- */

export const getAdminStats = () => fetchData<AdminStats>('/admin/stats');

/* ---------- Users ---------- */

export const getAdminUsers = (params: AdminUserListParams) =>
  fetchData<AdminPage<AdminUserListItem>>(
    `/admin/users${toQueryString(params)}`,
  );

export const getAdminUser = (id: string) =>
  fetchData<AdminUserDetails>(`/admin/users/${id}`);

// Streams the license file; needs the Authorization header, so it is fetched
// as a blob instead of being opened with a plain link.
export const getAdminUserLicense = (id: string) =>
  fetchData<Blob>(`/admin/users/${id}/license`, { responseType: 'blob' });

export const decideAdminVerification = (
  id: string,
  data: AdminVerificationRequest,
) =>
  fetchData<AdminVerificationResponse>(`/admin/users/${id}/verification`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const banAdminUser = (id: string, data: AdminBanRequest) =>
  post<AdminUserDetails>(`/admin/users/${id}/ban`, data);

export const restoreAdminUser = (id: string) =>
  post<AdminUserDetails>(`/admin/users/${id}/restore`);

/* ---------- Payouts ---------- */

export const getAdminPayouts = (params: AdminPayoutListParams) =>
  fetchData<AdminPage<AdminPayout>>(
    `/admin/finances/payouts${toQueryString(params)}`,
  );

export const approveAdminPayout = (id: string) =>
  post<AdminPayoutDecisionResponse>(`/admin/finances/payouts/${id}/approve`);

export const rejectAdminPayout = (id: string, data: AdminRejectPayoutRequest) =>
  post<AdminPayoutDecisionResponse>(
    `/admin/finances/payouts/${id}/reject`,
    data,
  );

export const payAdminSellerFees = (
  sellerId: string,
  data: AdminPayFeesRequest,
) =>
  post<AdminPayFeesResponse>(
    `/admin/finances/sellers/${sellerId}/pay-fees`,
    data,
  );

/* ---------- Orders ---------- */

export const getAdminOrders = (params: AdminOrderListParams) =>
  fetchData<AdminPage<AdminOrderListItem>>(
    `/admin/orders${toQueryString(params)}`,
  );

/* ---------- Products ---------- */

export const getAdminProducts = (params: AdminProductListParams) =>
  fetchData<AdminPage<AdminProductListItem>>(
    `/admin/products${toQueryString(params)}`,
  );

// Refunds a PAID order: sets paymentStatus REFUNDED and reverses the seller's
// finances. It neither cancels the order nor returns stock.
export const refundAdminOrder = (id: string, data: AdminRefundOrderRequest) =>
  post<AdminRefundOrderResponse>(`/admin/orders/${id}/refund`, data);

export const blockAdminProduct = (id: string, data: AdminBlockProductRequest) =>
  post<AdminProductModerationResponse>(`/admin/products/${id}/block`, data);

export const unblockAdminProduct = (id: string) =>
  post<AdminProductModerationResponse>(`/admin/products/${id}/unblock`);

/* ---------- Audit log ---------- */

export const getAdminAudit = (params: AdminAuditListParams) =>
  fetchData<AdminPage<AdminAuditEntry>>(`/admin/audit${toQueryString(params)}`);
