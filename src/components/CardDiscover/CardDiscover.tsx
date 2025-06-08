import styles from './CardDiscover.module.css';
import { Link } from 'react-router-dom';
import type { DiscoverCard } from '../../data/discoverData';

interface CardDiscoverProps {
  card: DiscoverCard;
}

const CardDiscover = ({ card }: CardDiscoverProps) => {
  return (
    <Link to={card.link} className={styles.cardLinkWrapper}>
      <div className={styles.card}>
        <img src={card.image} alt={card.title} className={styles.cardImage} />
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{card.title}</h3>
          <p className={styles.cardDescription}>{card.description}</p>
          <Link to={card.link} className={styles.cardLink}>
            Read more...
          </Link>
        </div>
      </div>
    </Link>
  );
};

export { CardDiscover };