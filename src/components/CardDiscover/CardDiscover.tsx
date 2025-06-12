import { Link } from 'react-router-dom';
import type { DiscoverCard } from '@/types/discoverCard';

import styles from './CardDiscover.module.css';

interface CardDiscoverProps {
  card: DiscoverCard;
}

const CardDiscover = ({ card }: CardDiscoverProps) => {
  return (
    <div className={styles.cardLinkWrapper}>
      <div className={styles.card}>
        <div className={styles.cardImageWrapper}>
          <img src={card.image} alt={card.title} className={styles.cardImage} />
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{card.title}</h3>
          <p className={styles.cardDescription}>{card.description}</p>
          <Link to={card.link} className={styles.cardLink}>
            Read more...
          </Link>
        </div>
      </div>
    </div>
  );
};

export { CardDiscover };
