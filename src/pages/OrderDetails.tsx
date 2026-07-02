import { useNavigate, useParams } from 'react-router-dom';
import BuyerOrder from '@/components/Account/Tabs/Buyer/BuyerOrders/BuyerOrder/BuyerOrder';

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  if (!orderId) {
    return null;
  }

  return (
    <main className='container'>
      <BuyerOrder orderId={orderId} onBack={() => navigate('/account')} />
    </main>
  );
};

export default OrderDetails;
