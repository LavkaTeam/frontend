import styles from './Price.module.css';

interface PriceProps {
  price: number;
}

const Price = ({ price }: PriceProps) => {
  return <span className={styles.price}>${price.toFixed(2)}</span>;
};

export { Price };
