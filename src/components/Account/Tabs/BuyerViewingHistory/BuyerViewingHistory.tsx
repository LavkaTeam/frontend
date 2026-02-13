import { CardSection } from '@/components/CardSection/CardSection';
import { CardProduct } from '@/components/CardProduct/CardProduct/CardProduct';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Space } from '@/components/ui/Space';
import { useAppDispatch } from '@/store/hooks';
import { clearHistory } from '@/store/viewingHistorySlice';
import { useViewingHistoryProducts } from '@/hooks/useViewingHistoryProducts';
import { EmptyViewingHistory } from '@/components/ui/icons/EmptyViewingHistory';
import { Loader } from '@/components/ui/Loader';
import styles from './BuyerViewingHistory.module.css';
const BuyerViewingHistory = () => {
  const dispatch = useAppDispatch();

  const { products: historyProducts, isLoading } = useViewingHistoryProducts();

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  return (
    <div className={styles.buyerViewingHistory}>
      <div>
        <HeadingH3>Viewing history</HeadingH3>
        <Space height='32px' />
      </div>
      <div className={styles.clearHistory} onClick={handleClearHistory}>
        <span className={styles.clearHistoryText}>Clear history</span>
        <TrashIcon />
      </div>

      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader variant='section' />
        </div>
      ) : historyProducts.length > 0 ? (
        <CardSection
          cards={historyProducts}
          CardComponent={CardProduct}
          noPaddings={true}
        />
      ) : (
        <>
          <Space height='32px' />
          <div className={styles.EmptyViewingHistory}>
            <EmptyViewingHistory />
            <Space height='16px' />
            <p>There’s nothing in your viewing history yet.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default BuyerViewingHistory;
