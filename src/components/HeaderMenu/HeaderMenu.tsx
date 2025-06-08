import { getUserName } from '@data/userNameData.tsx';
import styles from './HeaderMenu.module.css';
import { AllCategoriesDropdown } from '../AllCategoriesDropdown';

const HeaderMenu = () => {
  return (
    <section className={styles.HeaderMenu}>
      <div className='container'>
        <div className={styles.HeaderMenuContainer}>
          <AllCategoriesDropdown />
          <ul className={styles.brandList}>
            <li className={styles.brandLogo}>
              <img src='/icons/bacardiLogo.svg' alt='Bacardi Logo' />
            </li>
            <li className={styles.brandLogo}>
              <img src='/icons/bigwinesLogo.svg' alt='Big Wines Logo' />
            </li>
            <li className={styles.brandLogo}>
              <img src='/icons/patronLogo.svg' alt='Patron Logo' />
            </li>
            <li className={styles.brandLogo}>
              <img src='/icons/absolutLogo.svg' alt='Absolut Logo' />
            </li>
            <li className={styles.brandLogo}>
              <img src='/icons/remymartinLogo.svg' alt='Remy Martin Logo' />
            </li>
            <li className={styles.brandLogo}>
              <img src='/icons/campariLogo.svg' alt='Campari Logo' />
            </li>
          </ul>
          <div className={styles.userinfo}>
            <img src='/icons/bellIcon.svg' alt='Bell icon' />
            <p className={styles.userMessage}>Welcome {getUserName()}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HeaderMenu };
