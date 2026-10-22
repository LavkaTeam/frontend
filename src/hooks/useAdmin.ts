import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  approveAdminPayout,
  banAdminUser,
  blockAdminProduct,
  decideAdminVerification,
  getAdminAudit,
  getAdminOrders,
  getAdminPayouts,
  getAdminProducts,
  getAdminStats,
  getAdminUser,
  getAdminUsers,
  payAdminSellerFees,
  rejectAdminPayout,
  restoreAdminUser,
  refundAdminOrder,
  unblockAdminProduct,
} from '@/api/admin';
import type {
  AdminAuditListParams,
  AdminBanRequest,
  AdminOrderListParams,
  AdminPayoutListParams,
  AdminProductListParams,
  AdminUserListParams,
  AdminVerificationRequest,
} from '@/types/admin';
import { retryOnServerError } from '@/utils/error';

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  users: (params?: AdminUserListParams) =>
    [...adminKeys.all, 'users', params ?? {}] as const,
  user: (id: string) => [...adminKeys.all, 'user', id] as const,
  payouts: (params?: AdminPayoutListParams) =>
    [...adminKeys.all, 'payouts', params ?? {}] as const,
  orders: (params?: AdminOrderListParams) =>
    [...adminKeys.all, 'orders', params ?? {}] as const,
  products: (params?: AdminProductListParams) =>
    [...adminKeys.all, 'products', params ?? {}] as const,
  audit: (params?: AdminAuditListParams) =>
    [...adminKeys.all, 'audit', params ?? {}] as const,
};

const listOptions = {
  placeholderData: keepPreviousData,
  retry: retryOnServerError,
  staleTime: 15_000,
};

/* ---------- Queries ---------- */

export const useAdminStats = () =>
  useQuery({
    queryKey: adminKeys.stats(),
    queryFn: getAdminStats,
    retry: retryOnServerError,
    staleTime: 30_000,
  });

export const useAdminUsers = (params: AdminUserListParams) =>
  useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => getAdminUsers(params),
    ...listOptions,
  });

export const useAdminUser = (id: string) =>
  useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => getAdminUser(id),
    enabled: Boolean(id),
    retry: retryOnServerError,
  });

export const useAdminPayouts = (params: AdminPayoutListParams) =>
  useQuery({
    queryKey: adminKeys.payouts(params),
    queryFn: () => getAdminPayouts(params),
    ...listOptions,
  });

export const useAdminOrders = (params: AdminOrderListParams) =>
  useQuery({
    queryKey: adminKeys.orders(params),
    queryFn: () => getAdminOrders(params),
    ...listOptions,
  });

export const useAdminProducts = (params: AdminProductListParams) =>
  useQuery({
    queryKey: adminKeys.products(params),
    queryFn: () => getAdminProducts(params),
    ...listOptions,
  });

export const useAdminAudit = (params: AdminAuditListParams) =>
  useQuery({
    queryKey: adminKeys.audit(params),
    queryFn: () => getAdminAudit(params),
    ...listOptions,
  });

/* ---------- Mutations ---------- */

// Every admin action changes lists, queue counters and the audit log, so the
// whole admin cache is refreshed after it. Lists are cheap and paginated.
const useInvalidateAdmin = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: adminKeys.all });
};

export const useAdminVerificationDecision = (userId: string) => {
  const invalidate = useInvalidateAdmin();

  return useMutation({
    mutationFn: (data: AdminVerificationRequest) =>
      decideAdminVerification(userId, data),
    onSuccess: invalidate,
  });
};

export const useAdminBanUser = (userId: string) => {
  const invalidate = useInvalidateAdmin();

  return useMutation({
    mutationFn: (data: AdminBanRequest) => banAdminUser(userId, data),
    onSuccess: invalidate,
  });
};

export const useAdminRestoreUser = (userId: string) => {
  const invalidate = useInvalidateAdmin();

  return useMutation({
    mutationFn: () => restoreAdminUser(userId),
    onSuccess: invalidate,
  });
};

export const useAdminApprovePayout = () => {
  const invalidate = useInvalidateAdmin();

  return useMutation({
    mutationFn: (payoutId: string) => approveAdminPayout(payoutId),
    onSuccess: invalidate,
  });
};

export const useAdminRejectPayout = () => {
  const invalidate = useInvalidateAdmin();

  return useMutation({
    mutationFn: ({
      payoutId,
      comment,
    }: {
      payoutId: string;
      comment: string;
    }) => rejectAdminPayout(payoutId, { comment }),
    onSuccess: invalidate,
  });
};

export const useAdminPayFees = (sellerId: string) => {
  const invalidate = useInvalidateAdmin();

  return useMutation({
    mutationFn: (amount: number) => payAdminSellerFees(sellerId, { amount }),
    onSuccess: invalidate,
  });
};

export const useAdminRefundOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason: string) => refundAdminOrder(orderId, { reason }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminKeys.all }),
        // The shared order page reads the order through the common endpoint.
        queryClient.invalidateQueries({
          queryKey: ['orders', 'details', orderId],
        }),
      ]);
    },
  });
};

export const useAdminBlockProduct = () => {
  const invalidate = useInvalidateAdmin();

  return useMutation({
    mutationFn: ({
      productId,
      reason,
    }: {
      productId: string;
      reason: string;
    }) => blockAdminProduct(productId, { reason }),
    onSuccess: invalidate,
  });
};

export const useAdminUnblockProduct = () => {
  const invalidate = useInvalidateAdmin();

  return useMutation({
    mutationFn: (productId: string) => unblockAdminProduct(productId),
    onSuccess: invalidate,
  });
};
