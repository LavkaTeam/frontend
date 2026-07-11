import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  downloadFinanceReport,
  getFinanceTransactionDetails,
  getFinanceSummary,
  getFinanceTransactions,
  requestFinancePayout,
} from './finance.api';
import type {
  FinanceTransactionsParams,
  PayoutRequestDto,
  TransactionDetailsDto,
} from './finance.types';

const FINANCE_STALE_TIME = 30_000;

export const financeQueryKeys = {
  summary: ['finances', 'summary'] as const,
  transactions: (params: FinanceTransactionsParams) =>
    ['finances', 'transactions', params] as const,
  transactionDetails: (transactionId: string) =>
    ['finances', 'transaction', transactionId] as const,
};

export const useFinanceSummary = () => {
  return useQuery({
    queryKey: financeQueryKeys.summary,
    queryFn: getFinanceSummary,
    staleTime: FINANCE_STALE_TIME,
  });
};

export const useFinanceTransactions = (
  params: FinanceTransactionsParams,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: financeQueryKeys.transactions(params),
    queryFn: () => getFinanceTransactions(params),
    staleTime: FINANCE_STALE_TIME,
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });
};

export const useRequestFinancePayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PayoutRequestDto) => requestFinancePayout(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: financeQueryKeys.summary }),
        queryClient.invalidateQueries({
          queryKey: ['finances', 'transactions'],
        }),
      ]);
    },
  });
};

export const useFinanceTransactionDetails = (
  transactionId: string | null,
) => {
  return useQuery<TransactionDetailsDto>({
    queryKey: financeQueryKeys.transactionDetails(transactionId || ''),
    queryFn: () => getFinanceTransactionDetails(transactionId || ''),
    enabled: Boolean(transactionId),
    staleTime: FINANCE_STALE_TIME,
  });
};

export const useDownloadFinanceReport = () => {
  return useMutation({
    mutationFn: (params: { startDate?: string; endDate?: string }) =>
      downloadFinanceReport(params),
  });
};
