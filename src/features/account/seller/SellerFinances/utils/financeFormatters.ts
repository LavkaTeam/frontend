import type { TransactionResponseDto } from '../model/finance.types';

import {
  getFinanceTransactionStatusMeta,
  NEGATIVE_TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
} from '../config/financeDisplay';

const financeCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatFinanceAmount = (
  amount: number,
  options: { withSign?: boolean; type?: TransactionResponseDto['type'] } = {},
) => {
  const isNegative =
    options.type !== undefined && NEGATIVE_TRANSACTION_TYPES.has(options.type);
  const sign = options.withSign ? (isNegative ? '-' : '+') : '';

  return `${sign}${financeCurrencyFormatter.format(Math.abs(amount))}`;
};

export const formatFinanceDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const toApiDayStart = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;

  return new Date(`${value}T00:00:00.000Z`).toISOString();
};

export const toApiDayEnd = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;

  return new Date(`${value}T23:59:59.999Z`).toISOString();
};

export const getTransactionDetails = (
  transaction: TransactionResponseDto,
) => {
  if (transaction.type === 'PLATFORM_FEE' && transaction.feeRate !== null) {
    const rate = Number(transaction.feeRate ?? 0) * 100;

    return `Platform fee (${rate.toFixed(0)}%)`;
  }

  if (transaction.type === 'FEE_PAYMENT') {
    return 'Manual fee settlement';
  }

  return TRANSACTION_TYPE_LABELS[transaction.type];
};

export const getTransactionTitle = (transaction: TransactionResponseDto) => {
  if (transaction.type === 'PLATFORM_FEE' && transaction.status === 'PROCESSING') {
    return 'Platform fee due';
  }

  if (transaction.type === 'PAYOUT') {
    return 'Payout';
  }

  return TRANSACTION_TYPE_LABELS[transaction.type];
};

export const getTransactionSubtitle = (
  transaction: TransactionResponseDto,
) => {
  if (transaction.orderNumber) {
    return transaction.orderNumber;
  }

  if (transaction.type === 'PAYOUT') {
    return `Reference ${transaction.id.slice(0, 8).toUpperCase()}`;
  }

  return getTransactionDetails(transaction);
};

export const getFinanceSummaryValue = (
  value: number | undefined,
  legacyValue: number | undefined,
) => value ?? legacyValue ?? 0;

export const exportTransactionsReport = (
  transactions: TransactionResponseDto[],
) => {
  const rows = [
    ['Date', 'Type', 'Order', 'Amount', 'Status'],
    ...transactions.map((transaction) => [
      formatFinanceDate(transaction.createdAt),
      getTransactionDetails(transaction),
      transaction.orderNumber || '',
      formatFinanceAmount(transaction.amount, { type: transaction.type }),
      getFinanceTransactionStatusMeta(transaction).label,
    ]),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join('\t'),
    )
    .join('\n');
  const blob = new Blob([csv], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement('a');

  link.href = url;
  link.download = 'finance-transactions-report.xls';
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
