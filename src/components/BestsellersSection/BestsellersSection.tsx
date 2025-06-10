import { CardList } from '../CardList/CardList';
import { ArrowButton } from '../ArrowButton/ArrowButton';
import { Heading } from '../Heading/Heading';
import styles from './BestsellersSection.module.css';

const BestsellersSection = () => {
  return (
<section className={styles.bestsellersSection}>
  <div className={styles.wrapper}>
    <Heading>Bestsellers</Heading>
    <div className={styles.bestsellersContainer}>
      <div className={`${styles.Button} ${styles.leftButton}`}>
        <ArrowButton direction="left" onClick={() => {}} />
      </div>
      <CardList />
      <div className={`${styles.Button} ${styles.rightButton}`}>
        <ArrowButton direction="right" onClick={() => {}} />
      </div>
    </div>
  </div>
</section>
  );
};

export { BestsellersSection };