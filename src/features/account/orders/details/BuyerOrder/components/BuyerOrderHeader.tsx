import type { ReactNode } from 'react';

import {
  formatOrderDateTime,
  formatOrderStatus,
  formatPaymentMethod,
  formatPaymentStatus,
} from '../../../model/orderDisplay';
import type { OrderResponseDto } from '@/types/order';
import type { UserRole } from '@/types/user';

import styles from '../BuyerOrder.module.css';

type BuyerOrderHeaderProps = {
  order: OrderResponseDto;
  viewerRole?: UserRole;
  actionSlot?: ReactNode;
};

const BuyerOrderHeader = ({
  order,
  viewerRole = 'BUYER',
  actionSlot,
}: BuyerOrderHeaderProps) => (
  <section className={styles.headerCard}>
    <div className={styles.headerTopRow}>
      <div className={styles.headerMain}>
        <h1 className={styles.title}>Order #{order.orderNumber}</h1>
        <div className={styles.badgesRow}>
          <span
            className={`${styles.statusBadge} ${
              styles[`payment${order.paymentStatus}`]
            }`}
          >
            {formatPaymentStatus(order.paymentStatus)}
          </span>
          <span
            className={`${styles.statusBadge} ${
              styles[`status${order.orderStatus}`]
            }`}
          >
            {formatOrderStatus(order.orderStatus)}
          </span>
        </div>
      </div>
      {actionSlot ? <div className={styles.headerActions}>{actionSlot}</div> : null}
    </div>

    <div className={styles.headerMetaRow}>
      <span>Created {formatOrderDateTime(order.createdAt)}</span>
    </div>

    <div className={styles.headerInfoGrid}>
      <div className={styles.headerInfoItem}>
        <span className={styles.inlineLabel}>
          {viewerRole === 'SELLER' ? 'Buyer' : 'Supplier'}
        </span>
        <strong>
          {viewerRole === 'SELLER'
            ? order.buyerCompany || order.buyerName || 'Buyer'
            : order.sellerCompany || order.sellerName || 'Supplier'}
        </strong>
      </div>
      <div className={styles.headerInfoItem}>
        <span className={styles.inlineLabel}>Payment</span>
        <strong>{formatPaymentMethod(order.paymentMethod)}</strong>
      </div>
    </div>

    {order.orderComment ? (
      <div className={styles.orderNote}>
        <span className={styles.inlineLabel}>Order note</span>
        <p>{order.orderComment}</p>
      </div>
    ) : null}
  </section>
);

export { BuyerOrderHeader };
