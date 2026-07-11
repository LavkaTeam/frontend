import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  useDownloadFinanceReport,
  useFinanceTransactionDetails,
  useFinanceSummary,
  useFinanceTransactions,
  useRequestFinancePayout,
} from './useFinances';
import { useToast } from '@/hooks/useToast';
import { useUser } from '@/hooks/useUser';
import { extractErrorMessage } from '@/utils/error';

import {
  isTransactionStatus,
  TRANSACTION_TYPE_FILTER_OPTIONS,
} from '../config/financeDisplay';
import {
  getFinanceSummaryValue,
  toApiDayEnd,
  toApiDayStart,
} from '../utils/financeFormatters';

const PAGE_SIZE = 10;

const hasForbiddenStatus = (error: unknown) => {
  if (!error || typeof error !== 'object') return false;

  const errorRecord = error as Record<string, unknown>;

  return errorRecord.status === 403 || errorRecord.statusCode === 403;
};

export const useSellerFinancesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const { showToast } = useToast();
  const { data: user } = useUser();

  const typeParam = searchParams.get('type');
  const type = TRANSACTION_TYPE_FILTER_OPTIONS.some(
    (option) => option.value === typeParam,
  )
    ? (typeParam as (typeof TRANSACTION_TYPE_FILTER_OPTIONS)[number]['value'])
    : 'ALL';
  const statusParam = searchParams.get('status');
  const status = isTransactionStatus(statusParam) ? statusParam : undefined;
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const currentPage = Math.max(Number(searchParams.get('page') || '1') || 1, 1);
  const transactionFilters = useMemo(
    () => ({
      type: type === 'ALL' ? undefined : type,
      status,
      startDate: toApiDayStart(startDate),
      endDate: toApiDayEnd(endDate),
      page: currentPage - 1,
      size: PAGE_SIZE,
    }),
    [currentPage, endDate, startDate, status, type],
  );
  const hasInvalidDateRange =
    Boolean(startDate) &&
    Boolean(endDate) &&
    Boolean(toApiDayStart(startDate)) &&
    Boolean(toApiDayEnd(endDate)) &&
    new Date(startDate).getTime() > new Date(endDate).getTime();

  const summaryQuery = useFinanceSummary();
  const transactionsQuery = useFinanceTransactions(transactionFilters, {
    enabled: !hasInvalidDateRange,
  });
  const transactionDetailsQuery = useFinanceTransactionDetails(
    selectedTransactionId,
  );
  const payoutMutation = useRequestFinancePayout();
  const downloadFinanceReportMutation = useDownloadFinanceReport();

  const isForbidden =
    hasForbiddenStatus(summaryQuery.error) ||
    hasForbiddenStatus(transactionsQuery.error);
  const hasBlockingError =
    !isForbidden &&
    (summaryQuery.isError ||
      (transactionsQuery.isError && !hasInvalidDateRange));
  const availableBalance = getFinanceSummaryValue(
    summaryQuery.data?.availableForPayout,
    summaryQuery.data?.availableBalance,
  );
  const visibleTransactions = hasInvalidDateRange
    ? []
    : transactionsQuery.data?.content || [];
  const totalPages = transactionsQuery.data?.totalPages || 0;
  const totalItems = transactionsQuery.data?.totalElements || 0;
  const bankName = user?.bankName || user?.bank_Name || '';
  const iban = user?.iban || '';
  const isTransactionsRefreshing =
    transactionsQuery.isFetching && !transactionsQuery.isLoading;

  const updateSearchParams = (
    updater: (params: URLSearchParams) => URLSearchParams,
  ) => {
    setSearchParams((previous) => updater(new URLSearchParams(previous)));
  };

  const handleTypeChange = (nextType: typeof type) => {
    updateSearchParams((nextParams) => {
      nextParams.set('page', '1');

      if (nextType === 'ALL') {
        nextParams.delete('type');
      } else {
        nextParams.set('type', nextType);
      }

      return nextParams;
    });
  };

  const handleStatusChange = (nextStatus?: typeof status) => {
    updateSearchParams((nextParams) => {
      nextParams.set('page', '1');

      if (nextStatus) {
        nextParams.set('status', nextStatus);
      } else {
        nextParams.delete('status');
      }

      return nextParams;
    });
  };

  const handleDateChange = (key: 'startDate' | 'endDate', value: string) => {
    updateSearchParams((nextParams) => {
      nextParams.set('page', '1');

      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }

      return nextParams;
    });
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    updateSearchParams((nextParams) => {
      nextParams.set('page', String(page));
      return nextParams;
    });
  };

  const handlePayoutSubmit = async (amount: number) => {
    try {
      await payoutMutation.mutateAsync({ amount });
      showToast('Payout request created successfully.', 'success');
      setIsPayoutModalOpen(false);
    } catch (error) {
      showToast(
        extractErrorMessage(error, 'Failed to create payout request.'),
        'error',
      );
    }
  };

  const handleReportDownload = async () => {
    if (downloadFinanceReportMutation.isPending) return;

    try {
      const result = await downloadFinanceReportMutation.mutateAsync({
        startDate: toApiDayStart(startDate),
        endDate: toApiDayEnd(endDate),
      });

      const url = window.URL.createObjectURL(result.blob);
      const link = window.document.createElement('a');

      link.href = url;
      link.download = result.fileName;
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showToast(
        extractErrorMessage(error, 'Failed to download financial report.'),
        'error',
      );
    }
  };

  return {
    type,
    status,
    startDate,
    endDate,
    currentPage,
    hasInvalidDateRange,
    summaryQuery,
    transactionsQuery,
    transactionDetailsQuery,
    payoutMutation,
    downloadFinanceReportMutation,
    isForbidden,
    hasBlockingError,
    availableBalance,
    visibleTransactions,
    totalPages,
    totalItems,
    bankName,
    iban,
    isPayoutModalOpen,
    setIsPayoutModalOpen,
    selectedTransactionId,
    setSelectedTransactionId,
    isTransactionsRefreshing,
    handleTypeChange,
    handleStatusChange,
    handleDateChange,
    handlePageChange,
    handlePayoutSubmit,
    handleReportDownload,
  };
};
