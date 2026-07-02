import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  useDownloadOrderDocument,
  useOrderDocuments,
  saveDocumentBlob,
} from '@/hooks/useOrders';
import type { OrderDocumentDto, OrderResponseDto } from '@/types/order';
import { extractErrorMessage } from '@/utils/error';
import { useToast } from '@/hooks/useToast';

import styles from './CheckoutSuccess.module.css';

const ORDER_STEPS = ['RECEIVED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value || 0);

const formatWeight = (value?: number) =>
  Number.isFinite(value) ? `${(value || 0).toFixed(1)} kg` : '0.0 kg';

const getBuyerLabel = (orders: OrderResponseDto[]) => {
  const primaryOrder = orders[0];

  return (
    primaryOrder?.buyerCompany ||
    primaryOrder?.buyerName ||
    primaryOrder?.sellerCompany ||
    'Customer'
  );
};

const getPurchaseOrderStatus = (document?: OrderDocumentDto) => {
  if (!document) return { label: 'PO generating', tone: styles.badgePending };
  if (document.status === 'GENERATED') {
    return { label: 'PO READY', tone: styles.badgeReady };
  }
  if (document.status === 'FAILED') {
    return { label: 'PO failed', tone: styles.badgeFailed };
  }
  return { label: 'PO generating', tone: styles.badgePending };
};

const getOrderStepState = (status: OrderResponseDto['orderStatus']) => {
  if (status === 'NEW') return { activeStep: 0, isCancelled: false };
  if (status === 'PROCESSING') return { activeStep: 1, isCancelled: false };
  if (status === 'SHIPPED') return { activeStep: 2, isCancelled: false };
  if (status === 'DELIVERED') return { activeStep: 3, isCancelled: false };

  return { activeStep: 0, isCancelled: true };
};

const getSummaryTotals = (orders: OrderResponseDto[]) =>
  orders.reduce(
    (acc, order) => {
      acc.items += order.summary.totalItems || 0;
      acc.weight += order.summary.totalWeight || 0;
      acc.subtotal += order.summary.subtotal || 0;
      acc.tax += order.summary.totalTax || 0;
      acc.total += order.summary.grandTotal || 0;
      return acc;
    },
    { items: 0, weight: 0, subtotal: 0, tax: 0, total: 0 },
  );

const CheckIcon = () => (
  <svg viewBox='0 0 80 80' className={styles.heroIcon} aria-hidden='true'>
    <circle cx='40' cy='40' r='34' fill='currentColor' />
    <path
      d='m25 41 10 10 20-22'
      fill='none'
      stroke='var(--color-primary-white)'
      strokeWidth='6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox='0 0 24 24' aria-hidden='true'>
    <path
      d='M2.75 12s3.25-5.75 9.25-5.75S21.25 12 21.25 12 18 17.75 12 17.75 2.75 12 2.75 12Z'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <circle
      cx='12'
      cy='12'
      r='2.75'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
    />
  </svg>
);

const DocumentIcon = () => (
  <svg viewBox='0 0 24 24' aria-hidden='true'>
    <path
      d='M8 3.75h6l4 4v12.5H8z'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinejoin='round'
    />
    <path
      d='M14 3.75v4h4M12 11.5v5M9.75 14.25 12 16.5l2.25-2.25'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const SupplierOrderProgress = ({
  status,
}: {
  status: OrderResponseDto['orderStatus'];
}) => {
  const { activeStep, isCancelled } = getOrderStepState(status);
  const segments = ORDER_STEPS.length;
  const progressWidth = `${((activeStep + 0.5) / segments) * 100}%`;

  if (isCancelled) {
    return <div className={styles.cancelledState}>Cancelled</div>;
  }

  return (
    <div className={styles.progressBlock}>
      <div className={styles.progressTrack} aria-hidden='true'>
        <div className={styles.progressFill} style={{ width: progressWidth }} />
        <div className={styles.progressThumb} style={{ left: progressWidth }} />
      </div>

      <div className={styles.progressLabels}>
        {ORDER_STEPS.map((step, index) => (
          <span
            key={step}
            className={
              index <= activeStep
                ? styles.progressLabelActive
                : styles.progressLabel
            }
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
};

const SupplierOrderCard = ({ order }: { order: OrderResponseDto }) => {
  const { showToast } = useToast();
  const documentsQuery = useOrderDocuments(order.id, {
    initialData: order.documents,
  });
  const downloadMutation = useDownloadOrderDocument();
  const purchaseOrder =
    documentsQuery.data?.find(
      (document) => document.type === 'PURCHASE_ORDER',
    ) || order.documents.find((document) => document.type === 'PURCHASE_ORDER');
  const documentStatus = getPurchaseOrderStatus(purchaseOrder);
  const isInvoiceReady = purchaseOrder?.status === 'GENERATED';
  const isInvoiceFailed = purchaseOrder?.status === 'FAILED';

  const handleDownload = async () => {
    if (!purchaseOrder || purchaseOrder.status !== 'GENERATED') return;

    try {
      const { blob, fileName } = await downloadMutation.mutateAsync({
        orderId: order.id,
        documentId: purchaseOrder.id,
      });
      saveDocumentBlob(blob, fileName);
    } catch (error) {
      showToast(
        extractErrorMessage(error, 'Failed to download document.'),
        'error',
      );
    }
  };

  return (
    <article className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <div>
          <h3 className={styles.supplierTitle}>
            {order.sellerCompany || order.sellerName || 'Supplier order'}
          </h3>
          <p className={styles.orderNumber}>#{order.orderNumber}</p>
          <p className={styles.supplierMeta}>
            {order.summary.totalItems} items • Total:{' '}
            {formatCurrency(order.summary.grandTotal)}
          </p>
        </div>

        <span className={`${styles.statusBadge} ${documentStatus.tone}`}>
          <span className={styles.badgeDot} />
          {documentStatus.label}
        </span>
      </div>

      <SupplierOrderProgress status={order.orderStatus} />

      <div className={styles.actions}>
        <Link to={`/orders/${order.id}`} className={styles.ghostAction}>
          <EyeIcon />
          View Details
        </Link>
        <Link to={`/orders/${order.id}`} className={styles.ghostAction}>
          <DocumentIcon />
          Documents
        </Link>
        <button
          type='button'
          className={styles.ghostAction}
          onClick={handleDownload}
          disabled={!isInvoiceReady}
        >
          <DocumentIcon />
          {isInvoiceFailed ? 'Invoice Failed' : 'Invoice'}
        </button>
      </div>
    </article>
  );
};

const CheckoutSuccess = ({ orders }: { orders: OrderResponseDto[] }) => {
  const totals = getSummaryTotals(orders);
  const buyerLabel = getBuyerLabel(orders);

  return (
    <section className={styles.success}>
      <header className={styles.hero}>
        <CheckIcon />
        <h1 className={styles.title}>
          <span>Thank you for order,</span>
          <span>{buyerLabel}</span>
        </h1>
        {orders.length > 1 ? (
          <div className={styles.splitBadge}>
            Your checkout was split into {orders.length} supplier orders
          </div>
        ) : null}
      </header>

      <div className={styles.content}>
        <div className={styles.ordersContainer}>
          <section className={styles.ordersSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Supplier Orders</h2>
            </div>

            <div className={styles.sectionContainer}>
              {' '}
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <SupplierOrderCard key={order.id} order={order} />
                ))}
              </div>
              <aside className={styles.sidebar}>
                <section className={styles.summaryCard}>
                  <h2 className={styles.summaryTitle}>
                    Overall checkout Summary
                  </h2>

                  <div className={styles.summaryBlock}>
                    <div className={styles.totalInfo}>
                      <p>Sub-Total:</p>
                      <span className={styles.price}>
                        {formatCurrency(totals.subtotal)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.summaryBlock}>
                    <div className={styles.totalInfo}>
                      <p>Total items:</p>
                      <span className={styles.price}>{totals.items}</span>
                    </div>
                    <div className={styles.totalInfo}>
                      <p>Total weight:</p>
                      <span className={styles.price}>
                        {formatWeight(totals.weight)}
                      </span>
                    </div>
                    <div className={styles.totalInfo}>
                      <p>Shipping fee:</p>
                      <span className={styles.mutedValue}>
                        Billed separately
                      </span>
                    </div>
                  </div>

                  <div
                    className={`${styles.summaryBlock} ${styles.totalBlock}`}
                  >
                    <div className={styles.totalInfo}>
                      <p>Total tax:</p>
                      <span className={styles.price}>
                        {formatCurrency(totals.tax)}
                      </span>
                    </div>
                    <div className={styles.totalInfo}>
                      <p className={styles.totalLabel}>Grand Total</p>
                      <span className={styles.greenPrice}>
                        {formatCurrency(totals.total)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.checkoutButton}>
                    <Link to='/account'>
                      <Button>View Order History</Button>
                    </Link>
                  </div>
                  <Link to='/products'>
                    <Button variant='secondary'>Continue Shopping</Button>
                  </Link>
                </section>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export { CheckoutSuccess };
