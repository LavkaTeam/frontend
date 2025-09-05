import styles from './TextGrid.module.css';

interface TextGridProps {
  children: React.ReactNode;
}

const TextGrid = ({ children }: TextGridProps) => {
  return (
    <div className={styles.textGrid}>
      <p>{children}</p>
    </div>
  );
};

export { TextGrid };
