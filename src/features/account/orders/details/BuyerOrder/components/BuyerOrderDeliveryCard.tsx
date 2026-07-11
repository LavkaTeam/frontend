import type { DeliveryType } from '@/types/order';
import { formatDeliveryType } from '../../../model/orderDisplay';

import styles from '../BuyerOrder.module.css';

type BuyerOrderDeliveryCardProps = {
  recipientName: string;
  phone: string;
  city: string;
  deliveryType: DeliveryType;
  address: string;
  trackingNumber?: string;
};

const BuyerOrderDeliveryCard = ({
  recipientName,
  phone,
  city,
  deliveryType,
  address,
  trackingNumber,
}: BuyerOrderDeliveryCardProps) => (
  <section className={`${styles.sectionCard} ${styles.detailsCard}`}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>Delivery Details</h2>
    </div>

    <div className={styles.detailRows}>
      <div className={styles.detailRow}>
        <span>Recipient</span>
        <strong>{recipientName || 'Not specified'}</strong>
      </div>
      <div className={styles.detailRow}>
        <span>Phone</span>
        <strong>{phone}</strong>
      </div>
      <div className={styles.detailRow}>
        <span>City</span>
        <strong>{city}</strong>
      </div>
      <div className={styles.detailRow}>
        <span>Delivery type</span>
        <strong>{formatDeliveryType(deliveryType)}</strong>
      </div>
      <div className={styles.detailRow}>
        <span>Address</span>
        <strong>{address || 'No address provided'}</strong>
      </div>
      <div className={styles.detailRow}>
        <span>Tracking number</span>
        <strong>{trackingNumber || 'Not assigned yet'}</strong>
      </div>
    </div>
  </section>
);

export { BuyerOrderDeliveryCard };
