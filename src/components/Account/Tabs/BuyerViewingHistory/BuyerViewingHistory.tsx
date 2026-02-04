import { useMemo } from 'react';
import { CardSection } from '@/components/CardSection/CardSection';
import { CardProduct } from '@/components/CardProduct/CardProduct';
import { productData } from '@/data/productData';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Space } from '@/components/ui/Space';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearHistory } from '@/store/viewingHistorySlice';

import styles from './BuyerViewingHistory.module.css';
import { EmptyViewingHistory } from '@/components/ui/icons/EmptyViewingHistory';

const BuyerViewingHistory = () => {
  const dispatch = useAppDispatch();
  // Отримуємо список ID з Redux
  const historyIds = useAppSelector((state: any) => state.viewingHistory);

  // Перетворюємо ID на реальні об'єкти товарів
  const historyProducts = useMemo(() => {
    // map збереже порядок сортування (від найновішого до найстарішого)
    return historyIds
      .map((id: string) => productData.find((p) => p.id === id))
      .filter((item: any) => item !== undefined);
  }, [historyIds]);

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  return (
    <div className={styles.buyerViewingHistory}>
      <div>
        <HeadingH3>Viewing history</HeadingH3>
        <Space height='32px' />
      </div>

      {historyProducts.length > 0 ? (
        <>
          <div className={styles.clearHistory} onClick={handleClearHistory}>
            <span className={styles.clearHistoryText}>Clear history</span>
            <TrashIcon />
          </div>
          <CardSection
            cards={historyProducts}
            CardComponent={CardProduct}
            noPaddings={true}
          />
        </>
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
