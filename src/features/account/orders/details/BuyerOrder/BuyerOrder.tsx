import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { OrderDocuments } from '@/components/OrderDocuments';
import { useCreateDemoPaymentSession } from '@/hooks/usePayments';
import { useOrderDetails, useOrderDocuments } from '@/hooks/useOrders';
import { useToast } from '@/hooks/useToast';
import type { UserRole } from '@/types/user';
import { savePaymentBatchContext } from '@/utils/checkoutSuccessStorage';
import { extractErrorMessage } from '@/utils/error';

import {
  formatCurrency,
  formatPlatformFeeBaseType,
  getDeliveryAddressLabel,
} from '../../model/orderDisplay';
import { BuyerOrderDeliveryCard } from './components/BuyerOrderDeliveryCard';
import { BuyerOrderHeader } from './components/BuyerOrderHeader';
import { BuyerOrderPaymentCard } from './components/BuyerOrderPaymentCard';
import { BuyerOrderProductsTable } from './components/BuyerOrderProductsTable';
import { BuyerOrderSummaryCard } from './components/BuyerOrderSummaryCard';
import { SellerOrderHeaderActions } from './components/SellerOrderHeaderActions';
import { BuyerOrderSkeleton } from './skeleton';
import styles from './BuyerOrder.module.css';

interface BuyerOrderProps {
  orderId: string;
  onBack: () => void;
  viewerRole?: UserRole;
}

const BuyerOrder = ({
  orderId,
  onBack,
  viewerRole = 'BUYER',
}: BuyerOrderProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const documentsSectionRef = useRef<HTMLElement>(null);
  const createDemoSessionMutation = useCreateDemoPaymentSession();
  const orderQuery = useOrderDetails(orderId);
  const documentsQuery = useOrderDocuments(orderId, {
    initialData: orderQuery.data?.documents,
    enabled: Boolean(orderId),
  });

  const order = orderQuery.data;
  const highlightedSection = searchParams.get('section');

  useEffect(() => {
    if (
      highlightedSection !== 'documents' ||
      !documentsSectionRef.current ||
      !order
    ) {
      return;
    }

    window.requestAnimationFrame(() => {
      documentsSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, [highlightedSection, order]);

  const summaryRows = useMemo(() => {
    if (!order) return [];

    if (viewerRole === 'SELLER' && order.platformFee) {
      const ratePercent = Number.isFinite(order.platformFee.rate)
        ? `${(order.platformFee.rate * 100).toFixed(order.platformFee.rate % 1 === 0 ? 0 : 2)}%`
        : null;
      const feeLabelSuffix = ratePercent
        ? ` (${ratePercent} of ${formatPlatformFeeBaseType(order.platformFee.baseType)})`
        : '';

      return [
        {
          label: 'Items Subtotal',
          value: formatCurrency(order.summary.subtotal),
        },
        {
          label: 'Tax',
          value: formatCurrency(order.summary.totalTax),
        },
        {
          label: 'Shipping',
          value: order.summary.shippingCostDisplay || 'Billed separately',
          emphasis: 'muted' as const,
        },
        {
          label: 'Order Revenue (Grand Total)',
          value: formatCurrency(order.summary.grandTotal),
        },
        {
          label: `Platform Fee${feeLabelSuffix}`,
          value: formatCurrency(order.platformFee.amount),
        },
        {
          label: 'Net Proceeds',
          value: formatCurrency(order.platformFee.netProceeds),
          emphasis: 'total' as const,
        },
      ];
    }

    return [
      {
        label: 'Sub-Total',
        value: formatCurrency(order.summary.subtotal),
      },
      {
        label: 'Total items',
        value: String(order.summary.totalItems),
      },
      {
        label: 'Total weight',
        value: `${(order.summary.totalWeight || 0).toFixed(1)} kg`,
      },
      {
        label: 'Shipping fee',
        value:
          order.summary.shippingCostDisplay ||
          formatCurrency(order.summary.shippingCost || 0),
        emphasis: 'muted' as const,
      },
      {
        label: 'Total tax',
        value: formatCurrency(order.summary.totalTax),
      },
      {
        label: 'Total',
        value: formatCurrency(order.summary.grandTotal),
        emphasis: 'total' as const,
      },
    ];
  }, [order, viewerRole]);

  if (orderQuery.isLoading) {
    return <BuyerOrderSkeleton />;
  }

  if (orderQuery.isError || !order) {
    return <div className={styles.stateMessage}>Order not found.</div>;
  }

  const recipientName =
    `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`.trim();
  const deliveryAddress = getDeliveryAddressLabel(order);
  const totalGoodsLabel = `${order.items.length} ${
    order.items.length === 1 ? 'Good' : 'Goods'
  }`;
  const isSellerViewer = viewerRole === 'SELLER';

  const handleContinuePayment = async () => {
    if (!order.paymentBatchId) return;

    try {
      savePaymentBatchContext({
        batchId: order.paymentBatchId,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        totalAmount: order.summary.grandTotal || 0,
        currency: 'USD',
        orderIds: [order.id],
        orderNumbers: [order.orderNumber],
      });

      const session = await createDemoSessionMutation.mutateAsync(
        order.paymentBatchId,
      );
      window.location.assign(session.checkoutUrl);
    } catch (error) {
      showToast(
        extractErrorMessage(
          error,
          'Unable to start the online payment right now.',
        ),
        'error',
      );
    }
  };

  return (
    <div className={styles.container}>
      <button type='button' onClick={onBack} className={styles.backButton}>
        <svg
          className={styles.backIcon}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <line x1='19' y1='12' x2='5' y2='12'></line>
          <polyline points='12 19 5 12 12 5'></polyline>
        </svg>
        Back to orders
      </button>

      <BuyerOrderHeader
        order={order}
        viewerRole={viewerRole}
        actionSlot={
          isSellerViewer ? <SellerOrderHeaderActions order={order} /> : null
        }
      />

      <div className={styles.topGrid}>
        <BuyerOrderDeliveryCard
          recipientName={recipientName}
          phone={order.shippingDetails.phone}
          city={order.shippingDetails.city}
          deliveryType={order.shippingDetails.deliveryType}
          address={deliveryAddress}
          trackingNumber={order.shippingDetails.trackingNumber}
        />
        <BuyerOrderSummaryCard rows={summaryRows} />
      </div>

      <BuyerOrderPaymentCard
        order={order}
        viewerRole={viewerRole}
        onContinuePayment={handleContinuePayment}
        isPaymentActionPending={createDemoSessionMutation.isPending}
      />

      <section
        ref={documentsSectionRef}
        className={`${styles.sectionCard} ${styles.documentsCard} ${
          highlightedSection === 'documents'
            ? styles.documentsSectionHighlighted
            : ''
        }`}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Documents</h2>
        </div>
        <OrderDocuments
          orderId={order.id}
          documents={documentsQuery.data}
          isLoading={documentsQuery.isLoading}
          canGenerate={isSellerViewer}
          canForceRegenerate={isSellerViewer}
          canGenerateTypes={
            isSellerViewer
              ? [
                  'PROFORMA_INVOICE',
                  'INVOICE',
                  'DELIVERY_NOTE',
                  'SELLER_SETTLEMENT_STATEMENT',
                ]
              : []
          }
          onRefetch={documentsQuery.refetch}
        />
      </section>

      <BuyerOrderProductsTable
        items={order.items}
        totalGoodsLabel={totalGoodsLabel}
        onProductClick={(productId) => navigate(`/product/${productId}`)}
      />
    </div>
  );
};

export default BuyerOrder;
