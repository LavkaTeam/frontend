import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.header_logo}>Logo</div>
        <div className={styles.header_actions}>actions</div>
      </div>
    </header>
  );
};
export { Header };
