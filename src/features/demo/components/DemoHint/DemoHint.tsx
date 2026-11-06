import styles from './DemoHint.module.css';

interface DemoHintProps {
  children: string;
}

// An inline note for a function the demo turns off.
const DemoHint = ({ children }: DemoHintProps) => (
  <p className={styles.hint} role='note'>
    <span className={styles.icon} aria-hidden='true'>
      i
    </span>
    {children}
  </p>
);

export default DemoHint;
