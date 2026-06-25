import { Link } from 'react-router-dom';
import styles from './CardRelatedLead.module.css';

const CardRelatedLead = () => {
  return (
    <Link to="/accessories" className={styles.leadCard}>
      <div className={styles.imageWrapper}>
        <img
          src="/images/AccessoriesCard.jpg"
          alt="Alcohol Accessories"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          Style in the Details: Alcohol Accessories That Set the Mood
        </h3>
        <p className={styles.description}>
          In the world of aesthetics, it's not just the taste of the drink that
          matters — it's also how it's served. Bar accessories are more than
          just tools; they are the elements that turn an ordinary evening into a
          stylish ritual...
        </p>
        <div className={styles.readMoreBlock}>
          <button className={styles.readMoreBtn} tabIndex={-1}>
            Read more...
          </button>
        </div>
      </div>
    </Link>
  );
};

export { CardRelatedLead };
