import type { OrderDocumentType } from '@/types/order';

export const documentLabels: Record<OrderDocumentType, string> = {
  PURCHASE_ORDER: 'Purchase Order',
  DELIVERY_NOTE: 'Delivery Note',
  PROFORMA_INVOICE: 'Proforma Invoice',
  INVOICE: 'Invoice',
  SELLER_SETTLEMENT_STATEMENT: 'Settlement Statement',
};

export const statusLabels = {
  PENDING: 'Generating',
  GENERATED: 'Ready',
  FAILED: 'Failed',
} as const;

export const GENERATABLE_DOCUMENT_TYPES: OrderDocumentType[] = [
  'PROFORMA_INVOICE',
  'INVOICE',
  'DELIVERY_NOTE',
  'SELLER_SETTLEMENT_STATEMENT',
];
