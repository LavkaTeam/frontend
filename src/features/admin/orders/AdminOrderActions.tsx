import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { adminKeys, useAdminRefundOrder } from '@/hooks/useAdmin';
import { useUpdateOrderStatus } from '@/hooks/useOrders';
import type { OrderResponseDto } from '@/types/order';

import {
  getAdminActionError,
  useAdminFeedback,
} from '../model/useAdminFeedback';
import { AdminDialog, ReasonDialog } from '../shared/AdminDialog/AdminDialog';

interface AdminOrderActionsProps {
  order: OrderResponseDto;
}

// Cancelled and completed orders are final.
const CANCELLABLE: OrderResponseDto['orderStatus'][] = [
  'NEW',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
];

// The admin may change the status of any order (PATCH /orders/{id}/status),
// but only the closing actions are offered here: moving an order forward is
// the seller's job. A paid order is refunded first; the backend refuses to
// cancel it (ORDER_PAID_USE_REFUND) so that no money is left hanging.
const AdminOrderActions = ({ order }: AdminOrderActionsProps) => {
  const queryClient = useQueryClient();
  const updateStatus = useUpdateOrderStatus(order.id);
  const refund = useAdminRefundOrder(order.id);
  const notify = useAdminFeedback();
  const [dialog, setDialog] = useState<'cancel' | 'refund' | null>(null);
  const [error, setError] = useState('');

  const canRefund = order.paymentStatus === 'PAID';
  const canCancel =
    CANCELLABLE.includes(order.orderStatus) && order.paymentStatus !== 'PAID';

  if (!canRefund && !canCancel) return null;

  const open = (next: 'cancel' | 'refund') => {
    setError('');
    setDialog(next);
  };

  const handleCancel = () =>
    updateStatus.mutate(
      { orderStatus: 'CANCELLED' },
      {
        onSuccess: () => {
          setDialog(null);
          void queryClient.invalidateQueries({ queryKey: adminKeys.all });
          notify(`Order ${order.orderNumber} is cancelled.`);
        },
        onError: (mutationError) =>
          setError(getAdminActionError(mutationError)),
      },
    );

  const handleRefund = (reason: string) =>
    refund.mutate(reason, {
      onSuccess: ({ emailSent }) => {
        setDialog(null);
        notify(`Order ${order.orderNumber} is refunded.`, emailSent);
      },
      onError: (mutationError) => setError(getAdminActionError(mutationError)),
    });

  return (
    <>
      {canRefund ? (
        <Button
          type='button'
          variant='secondary'
          onClick={() => open('refund')}
        >
          Refund order
        </Button>
      ) : null}
      {canCancel ? (
        <Button
          type='button'
          variant='secondary'
          onClick={() => open('cancel')}
        >
          Cancel order
        </Button>
      ) : null}

      <AdminDialog
        isOpen={dialog === 'cancel'}
        icon='warning'
        title={`Cancel order ${order.orderNumber}?`}
        description='The reserved stock goes back to the seller and the order is closed for both parties. This cannot be undone.'
        confirmLabel='Cancel order'
        cancelLabel='Keep order'
        tone='danger'
        isBusy={updateStatus.isPending}
        error={error}
        onConfirm={handleCancel}
        onClose={() => setDialog(null)}
      />

      <ReasonDialog
        isOpen={dialog === 'refund'}
        icon='warning'
        title={`Refund order ${order.orderNumber}?`}
        description='The order is marked as refunded and the seller’s earnings for it are reversed. The order stays open and the stock is not returned: cancel the order afterwards if needed.'
        label='Reason'
        placeholder='For example: goods were damaged in transit'
        hint='The buyer and the seller receive this text by email.'
        minLength={10}
        maxLength={500}
        confirmLabel='Refund order'
        tone='danger'
        isBusy={refund.isPending}
        error={error}
        onConfirm={handleRefund}
        onClose={() => setDialog(null)}
      />
    </>
  );
};

export { AdminOrderActions };
