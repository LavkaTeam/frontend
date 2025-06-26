import { AllCategoriesDropdown } from '../Category/AllCategoriesDropdown';

import styles from './HeaderMenu.module.css';

const HeaderMenu = () => {
  return (
    <section className={styles.HeaderMenu}>
      <div className='container'>
        <div className={styles.HeaderMenuContainer}>
          <AllCategoriesDropdown />
          <ul className={styles.brandList}>
            <li className={styles.brandLogo}>
              <svg height='20' width='88'>
                <use href="/icons/partners.svg#icon-bacardiLogo" />
              </svg>
            </li>
            <li className={styles.brandLogo}>
              <svg height='31' width='78'>
                <use href="/icons/partners.svg#icon-bigwinesLogo" />
              </svg>
            </li>
            <li className={styles.brandLogo}>
              <svg height='45' width='76'>
                <use href="/icons/partners.svg#icon-patronLogo" />
              </svg>
            </li>
            <li className={styles.brandLogo}>
              <svg height='24' width='100'>
                <use href="/icons/partners.svg#icon-jamesonLogo" />
              </svg>
              </li>
            <li className={styles.brandLogo}>
              <svg height='16' width='86'>
                <use href="/icons/partners.svg#icon-absolutLogo" />
              </svg>
            </li>
            <li className={styles.brandLogo}>
              <svg height='21' width='112'>
                <use href="/icons/partners.svg#icon-remymartinLogo" />
              </svg>
            </li>
            <li className={styles.brandLogo}>
              <svg height='45' width='74'>
                <use href="/icons/partners.svg#icon-jackDaniels" />
              </svg>            
            </li>
            <li className={styles.brandLogo}>
              <svg height='19' width='88'>
                <use href="/icons/partners.svg#icon-campariLogo" />
              </svg>                  
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export { HeaderMenu };
