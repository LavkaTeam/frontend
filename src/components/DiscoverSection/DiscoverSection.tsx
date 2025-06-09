import { Heading } from '../Heading/Heading';
import { CardDiscover } from '../CardDiscover/CardDiscover';
import { discoverCards } from '@/data/discoverData';

import styles from './DiscoverSection.module.css';

const DiscoverSection = () => {
  return (
    <section className={styles.discoverSection}>
      <div className='container'>
        <Heading>Discover</Heading>
        <div className={styles.cardContainer}>
          {discoverCards.map((card) => (
            <CardDiscover key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export { DiscoverSection };
