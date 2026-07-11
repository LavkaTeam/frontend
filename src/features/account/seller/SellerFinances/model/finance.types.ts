import type { PaginatedResponse } from '@/types/api';
import type { Address } from '@/types/user';

export type TransactionType =
  | 'ORDER_REVENUE'
  | 'PAYOUT'
  | 'PLATFORM_FEE'
  | 'FEE_PAYMENT';

export type TransactionStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface FinanceSummaryDto {
  availableForPayout?: number;
  pendingPayments?: number;
  platformFeesDue?: number;

  // Legacy fields kept temporarily for compatibility with older responses.
  availableBalance?: number;
  expectedPayments?: number;
}

export interface PayoutRequestDto {
  amount: number;
}

export interface TransactionResponseDto {
  id: string;
  orderId?: string | null;
  orderNumber?: string | null;
  type: TransactionType;
  amount: number;
  feeRate?: number | null;
  feeBase?: number | null;
  feeBaseType?: string | null;
  status: TransactionStatus;
  createdAt: string;
}

export interface TransactionDetailsDto extends TransactionResponseDto {
  bankName?: string | null;
  iban?: string | null;
  bic?: string | null;
  adminComment?: string | null;
  processedAt?: string | null;
  buyerName?: string | null;
  buyerCompany?: string | null;
  buyerEmail?: string | null;
  buyerPhone?: string | null;
  buyerLegalAddress?: Address | null;
}

export interface FinanceTransactionsParams {
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export type FinanceTransactionsPageDto = PaginatedResponse<TransactionResponseDto>;
