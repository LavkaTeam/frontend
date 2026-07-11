import styles from '../BuyerOrder.module.css';

type SummaryRow = {
  label: string;
  value: string;
  emphasis?: 'normal' | 'muted' | 'total';
};

type BuyerOrderSummaryCardProps = {
  rows: SummaryRow[];
};

const getValueClassName = (emphasis?: SummaryRow['emphasis']) => {
  switch (emphasis) {
    case 'muted':
      return styles.mutedValue;
    case 'total':
      return styles.greenPrice;
    default:
      return styles.price;
  }
};

const getLabelClassName = (emphasis?: SummaryRow['emphasis']) =>
  emphasis === 'total' ? styles.totalLabel : undefined;

const BuyerOrderSummaryCard = ({ rows }: BuyerOrderSummaryCardProps) => (
  <aside className={styles.orderSummaryCard}>
    <div className={styles.summaryHeading}>
      <h2 className={styles.sectionTitle}>Order Summary</h2>
    </div>

    <div className={styles.totalPrice}>
      {rows.map((row, index) => (
        <div
          key={`${row.label}-${index}`}
          className={`${styles.summaryBlock} ${
            index === rows.length - 1 ? styles.totalBlock : ''
          }`}
        >
          <div className={styles.totalInfo}>
            <span className={getLabelClassName(row.emphasis)}>{row.label}:</span>
            <span className={getValueClassName(row.emphasis)}>{row.value}</span>
          </div>
        </div>
      ))}
    </div>
  </aside>
);

export { BuyerOrderSummaryCard };
