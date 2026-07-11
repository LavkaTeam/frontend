import { fetchData } from '@/api/fetchData';
import { downloadApiFile } from '@/shared/api/client';
import type {
  FinanceTransactionsPageDto,
  FinanceSummaryDto,
  FinanceTransactionsParams,
  PayoutRequestDto,
  TransactionDetailsDto,
  TransactionResponseDto,
} from './finance.types';

const buildTransactionsQuery = (params: FinanceTransactionsParams) => {
  const queryParams = new URLSearchParams();

  if (params.type) {
    queryParams.set('type', params.type);
  }

  if (params.status) {
    queryParams.set('status', params.status);
  }

  if (params.startDate) {
    queryParams.set('startDate', params.startDate);
  }

  if (params.endDate) {
    queryParams.set('endDate', params.endDate);
  }

  queryParams.set('page', String(params.page ?? 0));
  queryParams.set('size', String(params.size ?? 10));

  return queryParams.toString();
};

export const getFinanceSummary = (): Promise<FinanceSummaryDto> => {
  return fetchData<FinanceSummaryDto>('/finances/summary');
};

export const getFinanceTransactions = (
  params: FinanceTransactionsParams = {},
): Promise<FinanceTransactionsPageDto> => {
  const query = buildTransactionsQuery(params);

  return fetchData<FinanceTransactionsPageDto>(
    `/finances/transactions${query ? `?${query}` : ''}`,
  );
};

export const requestFinancePayout = (
  data: PayoutRequestDto,
): Promise<TransactionResponseDto> => {
  return fetchData<TransactionResponseDto>('/finances/payouts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getFinanceTransactionDetails = (
  transactionId: string,
): Promise<TransactionDetailsDto> => {
  return fetchData<TransactionDetailsDto>(`/finances/transactions/${transactionId}`);
};

export const downloadFinanceReport = async (params: {
  startDate?: string;
  endDate?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (params.startDate) {
    queryParams.set('startDate', params.startDate);
  }

  if (params.endDate) {
    queryParams.set('endDate', params.endDate);
  }

  const query = queryParams.toString();

  return downloadApiFile(
    `/finances/report/download${query ? `?${query}` : ''}`,
    'financial-report.pdf',
  );
};
