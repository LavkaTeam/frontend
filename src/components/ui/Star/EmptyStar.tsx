import styles from './Star.module.css';

const EmptyStar = () => {
  return (
    <div className={styles.star}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='14'
        height='13'
        viewBox='0 0 14 13'
        fill='none'
      >
        <path
          d='M7.9107 5.18322L8.01693 5.53084L11.5164 5.59223L8.94635 7.39117L8.64872 7.59888L8.75494 7.9465L9.67122 10.9455L7.16782 9.0575L6.87766 8.83949L6.58002 9.04719L4.01098 10.8452L5.03286 7.8812L5.15121 7.53752L4.86104 7.3195L2.35569 5.43152L5.85515 5.49291L5.9735 5.14923L6.99442 2.18426L7.9107 5.18322Z'
          stroke='#C8721B'
        />
      </svg>
    </div>
  );
};

export { EmptyStar };
