import styles from './ArrowButton.module.css';

interface ArrowButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

const ArrowButton = ({ direction, onClick }: ArrowButtonProps) => {
  return (
    <button className={`${styles.arrowButton} ${styles[direction]}`} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="28"
        viewBox="0 0 16 28"
        fill="none"
        className={styles.arrowIcon}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.636166 12.4447L12.9277 0L16 3.11062L5.24466 14L16 24.8894L12.9277 28L0.636166 15.5553C0.228829 15.1428 0 14.5833 0 14C0 13.4167 0.228829 12.8572 0.636166 12.4447Z"
          fill="#AF261F"
        />
      </svg>
    </button>
  );
};

export { ArrowButton };