import { useNavigate, useParams } from 'react-router-dom';

import { BuyerOrder } from '@/features/account/orders';
import { useOrderDetails } from '@/hooks/useOrders';

import { AdminOrderActions } from './AdminOrderActions';

// GET /api/orders/{id} and its documents are open to the admin for any order.
// The shared component shows both parties; the admin can also (re)generate
// every document and cancel the order.
const AdminOrderDetails = () => {
  const { orderId = '' } = useParams();
  const navigate = useNavigate();
  const order = useOrderDetails(orderId).data;

  return (
    <BuyerOrder
      orderId={orderId}
      viewerRole='ADMIN'
      headerActions={order ? <AdminOrderActions order={order} /> : null}
      // Back to the filtered list when opened from it, else to all orders.
      onBack={() =>
        (window.history.state as { idx?: number } | null)?.idx
          ? navigate(-1)
          : navigate('/admin/orders')
      }
    />
  );
};

export default AdminOrderDetails;
