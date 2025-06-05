import styles from './Star.module.css';

const FilledStar = () => {
  return (
    <div className={styles.star}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='13'
        height='13'
        viewBox='0 0 13 13'
        fill='none'
      >
        <path
          d='M6.84065 0.567322L8.2069 5.03755L12.8805 5.11954L9.05129 7.8003L10.4175 12.2705L6.68469 9.4571L2.85544 12.1379L4.37766 7.71831L0.644802 4.90488L5.31844 4.98687L6.84065 0.567322Z'
          fill='#C8721B'
        />
      </svg>
    </div>
  );
};

export { FilledStar };
