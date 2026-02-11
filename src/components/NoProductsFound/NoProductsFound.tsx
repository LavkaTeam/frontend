import styles from './NoProductsFound.module.css';

const NoProductsFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <svg
          width='120'
          height='120'
          viewBox='0 0 80 80'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M56.5 56.5L70 70'
            stroke='#4A2B29'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <circle cx='38' cy='38' r='24' stroke='#4A2B29' strokeWidth='4' />
          <path
            d='M28 28L48 48M48 28L28 48'
            stroke='#C43210'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>

      <h2 className={styles.title}>No products found</h2>

      <p className={styles.description}>
        We couldn’t find what you’re looking for.
      </p>
    </div>
  );
};

export { NoProductsFound };
