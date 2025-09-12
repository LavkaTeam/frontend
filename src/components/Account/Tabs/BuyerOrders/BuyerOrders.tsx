import styles from './BuyerOrders.module.css';

const BuyerOrders = () => {
  return (
    <div className={styles.BuyerOrders}>
      <h3 className={styles.title}>My orders</h3>
      <p className={styles.description}>
        List of your orders since registration
      </p>
    </div>
  );
};

export default BuyerOrders;
