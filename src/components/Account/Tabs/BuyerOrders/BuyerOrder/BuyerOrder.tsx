import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@/components/ui/Loader';
import { OrderDocuments } from '@/components/OrderDocuments';
import { useOrderDetails, useOrderDocuments } from '@/hooks/useOrders';
import styles from './BuyerOrder.module.css';

interface BuyerOrderProps {
  orderId: string;
  onBack: () => void;
}

const BuyerOrder: React.FC<BuyerOrderProps> = ({ orderId, onBack }) => {
  const navigate = useNavigate();
  const orderQuery = useOrderDetails(orderId);
  const documentsQuery = useOrderDocuments(orderId, {
    initialData: orderQuery.data?.documents,
    enabled: Boolean(orderId),
  });

  if (orderQuery.isLoading) {
    return <Loader variant='section' />;
  }

  if (orderQuery.isError || !orderQuery.data) {
    return <div>Order not found</div>;
  }

  const order = orderQuery.data;
  const deliveryDateString = new Date(order.createdAt).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  );
  const deliveryAddress =
    order.shippingDetails.deliveryType === 'COURIER'
      ? [order.shippingDetails.city, order.shippingDetails.addressLine]
          .filter(Boolean)
          .join(', ')
      : [order.shippingDetails.city, order.shippingDetails.warehouseNumber]
          .filter(Boolean)
          .join(', ');

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
          <h1 className={styles.title}>Order {order.orderNumber}</h1>
          <p className={styles.subTitle}>
            Created on {deliveryDateString} • {order.sellerCompany || order.sellerName}
          </p>
        </div>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoBox}>
          <div className={styles.infoGroup}>
            <span className={styles.labelDark}>Delivery:</span>
            <span className={styles.valueGray}>{order.shippingDetails.deliveryType}</span>
          </div>

          <div className={styles.infoGroup}>
            <span className={styles.labelDark}>Payment method:</span>
            <span className={styles.valueGray}>{order.paymentMethod}</span>
          </div>
        </div>

        <div className={styles.infoBox}>
          <span className={styles.labelGray}>Delivery address:</span>
          <span className={styles.valueDark}>
            {deliveryAddress || 'No address provided'}
          </span>
        </div>
      </div>

      <section className={styles.documentsSection}>
        <div className={styles.documentsHeader}>
          <h2 className={styles.documentsTitle}>Documents</h2>
          <p className={styles.documentsDescription}>
            Download generated order files and track generation status.
          </p>
        </div>
        <OrderDocuments
          orderId={order.id}
          documents={documentsQuery.data}
          isLoading={documentsQuery.isLoading}
          onRefetch={documentsQuery.refetch}
        />
      </section>

      <div className={styles.goodsSection}>
        <div className={styles.goodsHeader}>
          <span className={styles.goodsCount}>{order.items.length} Goods</span>
          <div className={styles.goodsHeaderRight}>
            <span className={styles.headerAmount}>Amount</span>
            <span className={styles.headerPrice}>Price</span>
          </div>
        </div>

        <div className={styles.goodsList}>
          {order.items.map((item) => (
            <div
              key={item.productId}
              className={styles.itemRow}
              onClick={() => navigate(`/product/${item.productId}`)}
            >
              <div className={styles.itemLeft}>
                {item.mainImage?.url ? (
                  <img
                    src={item.mainImage.url}
                    alt={item.name || 'Product'}
                    className={styles.itemImage}
                  />
                ) : (
                  <div className={styles.placeholderImg} />
                )}

                <div className={styles.itemText}>
                  <span>
                    {item.name || 'Product'}
                    {item.volume ? `, ${item.volume}` : ''}
                  </span>
                  <span style={{ color: '#252b37' }}>
                    {item.producer || 'Unknown producer'}
                  </span>
                </div>
              </div>

              <div className={styles.itemRight}>
                <span className={styles.itemAmount}>{item.quantity}</span>
                <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerOrder;
