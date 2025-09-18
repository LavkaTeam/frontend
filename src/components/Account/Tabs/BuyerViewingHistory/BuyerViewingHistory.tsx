import { CardSection } from '@/components/CardSection/CardSection';
import { CardProduct } from '@/components/CardProduct/CardProduct';
import { productData } from '@/data/productData';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';

import styles from './BuyerViewingHistory.module.css';

const BuyerViewingHistory = () => {
  return (
    <div className={styles.buyerViewingHistory}>
      <CardSection
        title='Viewing History'
        cards={productData}
        CardComponent={CardProduct}
        noPaddings={true}
      />
      <div
        className={styles.clearHistory}
        onClick={() => {
          // логіка очищення історії переглядів
        }}
      >
        <span className={styles.clearHistoryText}>Clear history</span>
        <TrashIcon />
      </div>
    </div>
  );
};

export default BuyerViewingHistory;
