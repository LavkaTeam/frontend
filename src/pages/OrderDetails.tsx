import { Navigate, useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { orderId } = useParams();

  if (!orderId) {
    return null;
  }

  return <Navigate to={`/account?tab=orders&orderId=${orderId}`} replace />;
};

export default OrderDetails;
