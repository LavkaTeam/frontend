import { CardBestseller } from '../CardBestseller';

import styles from './CardList.module.css';

const CardList = () => {
  return (
    <div className={styles.cardList}>
      <CardBestseller />
      <CardBestseller />
      <CardBestseller />
      <CardBestseller />
    </div>
  );
};

export { CardList };
