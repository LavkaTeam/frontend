import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  useCompleteSellerOrder,
  useUpdateOrderStatus,
} from '@/hooks/useOrders';
import { useToast } from '@/hooks/useToast';
import type { OrderResponseDto } from '@/types/order';
import { extractErrorMessage } from '@/utils/error';

import { formatOrderStatus } from '../../../model/orderDisplay';
import styles from '../BuyerOrder.module.css';

type SellerOrderHeaderActionsProps = {
  order: OrderResponseDto;
};

type UpdatableOrderStatus = OrderResponseDto['orderStatus'];

type StatusTransitionConfig = {
  nextStatus: UpdatableOrderStatus;
  title: string;
  description: string;
  actionLabel: string;
  requiresTrackingNumber?: boolean;
  confirmLabel?: string;
  requiresOfflineCompletion?: boolean;
  secondaryAction?: {
    status: UpdatableOrderStatus;
    label: string;
  };
};

const STATUS_TRANSITIONS: Partial<
  Record<OrderResponseDto['orderStatus'], StatusTransitionConfig>
> = {
  NEW: {
    nextStatus: 'PROCESSING',
    title: 'Accept order into processing',
    description:
      'Confirm stock availability and move the order to preparation.',
    actionLabel: 'Accept',
    secondaryAction: {
      status: 'CANCELLED',
      label: 'Reject',
    },
  },
  PROCESSING: {
    nextStatus: 'SHIPPED',
    title: 'Mark order as shipped',
    description:
      'Add tracking information before handing over the shipment to logistics.',
    actionLabel: 'Ship order',
    requiresTrackingNumber: true,
    confirmLabel: 'Confirm shipment',
  },
  SHIPPED: {
    nextStatus: 'DELIVERED',
    title: 'Confirm delivery',
    description: 'Complete the order after the buyer receives the shipment.',
    actionLabel: 'Mark as delivered',
    confirmLabel: 'Confirm delivery',
  },
  DELIVERED: {
    nextStatus: 'COMPLETED',
    title: 'Complete order?',
    description:
      'By completing this order, you confirm that the order has been fulfilled and payment has been received directly from the buyer.',
    actionLabel: 'Complete order',
    confirmLabel: 'Confirm & complete',
    requiresOfflineCompletion: true,
  },
};

const SellerOrderHeaderActions = ({ order }: SellerOrderHeaderActionsProps) => {
  const { showToast } = useToast();
  const updateStatusMutation = useUpdateOrderStatus(order.id);
  const completeOrderMutation = useCompleteSellerOrder(order.id);
  const [activeAction, setActiveAction] = useState<
    UpdatableOrderStatus | 'CANCEL' | 'COMPLETE' | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(
    order.shippingDetails.trackingNumber || '',
  );

  const isOfflinePayment =
    order.paymentMethod !== 'CARD_ONLINE' && order.paymentStatus !== 'PAID';
  const transition =
    order.orderStatus === 'DELIVERED' && !isOfflinePayment
      ? undefined
      : STATUS_TRANSITIONS[order.orderStatus];

  useEffect(() => {
    setTrackingNumber(order.shippingDetails.trackingNumber || '');
  }, [order.id, order.shippingDetails.trackingNumber]);

  useEffect(() => {
    if (isModalOpen) {
      const timer = window.setTimeout(() => {
        setIsModalVisible(true);
      }, 10);

      return () => window.clearTimeout(timer);
    }

    setIsModalVisible(false);
    return undefined;
  }, [isModalOpen]);

  const modalConfig = useMemo(() => {
    if (!transition) return null;
    if (transition.requiresTrackingNumber) return transition;
    if (transition.nextStatus === 'DELIVERED') return transition;
    if (transition.requiresOfflineCompletion) return transition;
    return null;
  }, [transition]);

  const handleStatusUpdate = async (
    nextStatus: UpdatableOrderStatus,
    options?: { trackingNumber?: string },
  ) => {
    try {
      setActiveAction(nextStatus);
      await updateStatusMutation.mutateAsync({
        orderStatus: nextStatus,
        trackingNumber: options?.trackingNumber,
      });

      setIsModalOpen(false);
      showToast(
        nextStatus === 'SHIPPED'
          ? 'Shipment confirmed and tracking number saved.'
          : `Order status updated to ${formatOrderStatus(nextStatus)}.`,
        'success',
      );
    } catch (error) {
      showToast(
        extractErrorMessage(error, 'Failed to update order status.'),
        'error',
      );
    } finally {
      setActiveAction(null);
    }
  };

  const handleOfflineCompletion = async () => {
    try {
      setActiveAction('COMPLETE');
      await completeOrderMutation.mutateAsync();
      setIsModalOpen(false);
      showToast('Order completed and payment marked as paid.', 'success');
    } catch (error) {
      showToast(
        extractErrorMessage(error, 'Failed to complete the order.'),
        'error',
      );
    } finally {
      setActiveAction(null);
    }
  };

  if (!transition) {
    return (
      <div className={styles.headerStatusNote}>
        {order.paymentMethod === 'CARD_ONLINE' &&
        order.paymentStatus === 'AWAITING_PAYMENT'
          ? 'The buyer has not completed the online payment yet.'
          : order.paymentMethod === 'CARD_ONLINE' &&
              order.paymentStatus === 'FAILED'
            ? 'The buyer can retry the online payment.'
            : `Current status: ${formatOrderStatus(order.orderStatus)}`}
      </div>
    );
  }

  const trackingValue = trackingNumber.trim();
  const disableModalConfirm =
    updateStatusMutation.isPending ||
    completeOrderMutation.isPending ||
    (transition.requiresTrackingNumber && trackingValue.length === 0);

  const handlePrimaryAction = () => {
    if (modalConfig) {
      setIsModalOpen(true);
      return;
    }

    void handleStatusUpdate(transition.nextStatus);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    window.setTimeout(() => {
      setIsModalOpen(false);
    }, 280);
  };

  return (
    <>
      <div className={styles.headerActionGroup}>
        {transition.secondaryAction ? (
          <Button
            type='button'
            variant='secondary'
            onClick={() =>
              handleStatusUpdate(transition.secondaryAction!.status)
            }
            disabled={
              updateStatusMutation.isPending || completeOrderMutation.isPending
            }
            isLoading={activeAction === transition.secondaryAction.status}
            className={styles.headerActionButton}
          >
            {transition.secondaryAction.label}
          </Button>
        ) : null}

        <Button
          type='button'
          onClick={handlePrimaryAction}
          isLoading={activeAction === transition.nextStatus && !isModalOpen}
          disabled={
            updateStatusMutation.isPending || completeOrderMutation.isPending
          }
          className={styles.headerActionButton}
        >
          {transition.actionLabel}
        </Button>
      </div>

      {isModalOpen && modalConfig ? (
        <div
          className={`${styles.actionModalOverlay} ${
            isModalVisible ? styles.actionModalOverlayOpen : ''
          }`}
          onClick={handleCloseModal}
        >
          <div
            className={`${styles.actionModal} ${
              isModalVisible ? styles.actionModalOpen : ''
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.actionModalHeader}>
              <div>
                <h3 className={styles.actionModalTitle}>{modalConfig.title}</h3>
                <p className={styles.actionModalDescription}>
                  {modalConfig.description}
                </p>
              </div>
              <button
                type='button'
                className={styles.actionModalClose}
                onClick={handleCloseModal}
                aria-label='Close status modal'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>

            {modalConfig.requiresTrackingNumber ? (
              <div className={styles.actionModalField}>
                <label
                  htmlFor='seller-tracking-number'
                  className={styles.inlineLabel}
                >
                  Tracking Number
                </label>
                <Input
                  id='seller-tracking-number'
                  value={trackingNumber}
                  onChange={(event) => setTrackingNumber(event.target.value)}
                  placeholder='Nova Poshta / Ukrposhta / own courier'
                />
              </div>
            ) : null}

            <div className={styles.actionModalFooter}>
              <Button
                type='button'
                onClick={
                  modalConfig.requiresOfflineCompletion
                    ? handleOfflineCompletion
                    : () =>
                        handleStatusUpdate(modalConfig.nextStatus, {
                          trackingNumber: modalConfig.requiresTrackingNumber
                            ? trackingValue
                            : undefined,
                        })
                }
                isLoading={
                  updateStatusMutation.isPending ||
                  completeOrderMutation.isPending
                }
                disabled={disableModalConfirm}
              >
                {modalConfig.confirmLabel || modalConfig.actionLabel}
              </Button>
              <Button
                type='button'
                variant='secondary'
                onClick={handleCloseModal}
                disabled={
                  updateStatusMutation.isPending ||
                  completeOrderMutation.isPending
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export { SellerOrderHeaderActions };
