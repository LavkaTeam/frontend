import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { mockOrders } from '@/data/ordersData';
import { productData } from '@/data/productData';
import type { Order } from '@/types/order';
import { addItem, updateItemQuantity } from '@/store/cartSlice';
import styles from './BuyerOrder.module.css';

interface BuyerOrderProps {
  orderId: string;
  onBack: () => void;
}

const BuyerOrder: React.FC<BuyerOrderProps> = ({ orderId, onBack }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const foundOrder = mockOrders.find((o) => o.orderId === orderId);
    setOrder(foundOrder || null);
  }, [orderId]);

  if (!order) {
    return <div>Order not found</div>;
  }

  // (Дата створення + 7 днів)
  const calculateDeliveryDate = (dateString: string) => {
    const createdDate = new Date(dateString);
    const deliveryDate = new Date(createdDate);
    deliveryDate.setDate(createdDate.getDate() + 7);

    // Форматуємо дату (May 18, 2025)
    return deliveryDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const deliveryDateString = calculateDeliveryDate(order.orderCreatedAt);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Логіка Reorder (Додавання в кошик)
  const handleReorder = () => {
    order.orderItems.forEach((item) => {
      const productCard = productData.find((p) => p.id === item.productId);

      if (productCard) {
        dispatch(addItem(productCard));

        if (item.productQuantity > 1) {
          dispatch(
            updateItemQuantity({
              id: item.productId,
              quantity: item.productQuantity,
            }),
          );
        }
      }
    });

    // Після додавання переходимо в кошик
    navigate('/cart');
  };

  return (
    <div className={styles.container}>
      <button onClick={onBack} className={styles.backButton}>
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

      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Order Details</h1>
          <p className={styles.subTitle}>
            Expected Delivery – {deliveryDateString}
          </p>
        </div>
        <button className={styles.reorderButton} onClick={handleReorder}>
          Reorder
        </button>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoBox}>
          <div className={styles.infoGroup}>
            <span className={styles.labelDark}>Delivery:</span>
            <span className={styles.valueGray}>
              {order.deliveryType || 'Courier delivery'}
            </span>
          </div>

          <div className={styles.infoGroup}>
            <span className={styles.labelDark}>Payment method:</span>
            <span className={styles.valueGray}>
              {order.paymentMethod || 'Online'}
            </span>
          </div>
        </div>

        <div className={styles.infoBox}>
          <span className={styles.labelGray}>Delivery address:</span>
          <span className={styles.valueDark}>
            {order.deliveryAddress || 'No address provided'}
          </span>
        </div>
      </div>

      <div className={styles.goodsSection}>
        <div className={styles.goodsHeader}>
          <span className={styles.goodsCount}>
            {order.orderItems.length} Goods
          </span>
          <div className={styles.goodsHeaderRight}>
            <span className={styles.headerAmount}>Amount</span>
            <span className={styles.headerPrice}>Price</span>
          </div>
        </div>

        <div className={styles.goodsList}>
          {order.orderItems.map((item, index) => (
            <div
              key={index}
              className={styles.itemRow}
              onClick={() => handleProductClick(item.productId)}
            >
              <div className={styles.itemLeft}>
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className={styles.itemImage}
                  />
                ) : (
                  <div className={styles.placeholderImg} />
                )}

                <div className={styles.itemText}>
                  <span>
                    {item.productName.split(',')[0]}, {item.productVolume},
                  </span>
                  <span style={{ color: '#252b37' }}>
                    {item.productProducer}
                  </span>
                </div>
              </div>

              <div className={styles.itemRight}>
                <span className={styles.itemAmount}>
                  {item.productQuantity}
                </span>
                <span className={styles.itemPrice}>
                  ${item.productPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerOrder;
