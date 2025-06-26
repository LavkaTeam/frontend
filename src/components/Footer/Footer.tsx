import { Link } from 'react-router-dom';
import { Logo } from '../Logo';

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.wrapper}>
      <div className='container'>
        <div className={styles.container}>
          <div className={styles.topSection}>
            <Logo />
            <ul className={styles.linkBlock}>
              <li>
                <Link to='/' className={styles.link}>
                  About us
                </Link>
              </li>
              <li>
                <Link to='/' className={styles.link}>
                  Careers
                </Link>
              </li>
              <li>
                <Link to='/' className={styles.link}>
                  FAQ
                </Link>
              </li>
            </ul>
            <ul className={styles.linkBlock}>
              <li>
                <Link to='/' className={styles.link}>
                  How to Become a Seller
                </Link>
              </li>
              <li>
                <Link to='/' className={styles.link}>
                  Rules for Sellers
                </Link>
              </li>
            </ul>
            <ul className={styles.linkBlock}>
              <li>
                <Link to='/' className={styles.link}>
                  Discounts and Promotions
                </Link>
              </li>
              <li>
                <Link to='/' className={styles.link}>
                  Support Center
                </Link>
              </li>
            </ul>
            <ul className={styles.linkBlock}>
              <li>
                <a className={styles.link} href='mailto:b2bbar@gmail.com'>
                  Email: b2bbar@gmail.com
                </a>
              </li>
              <li>
                <a className={styles.link} href='tel:+380978664545'>
                  tel:+380978664545
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.bottomSection}>
            <address className={styles.IconsList}>
              <ul className={styles.Icons}>
                <li>
                  <a
                    href='https://facebook.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width="24" height="24">
                      <use href="/icons/socials.svg#icon-facebook" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href='https://x.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width="24" height="24">
                      <use href="/icons/socials.svg#icon-twitter" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href='https://instagram.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width="24" height="24">
                      <use href="/icons/socials.svg#icon-instagram" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href='https://linkedin.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width="24" height="24">
                      <use href="/icons/socials.svg#icon-linkedin" />
                    </svg>
                  </a>
                </li>
              </ul>
              <ul className={styles.Icons}>
                <li>
                  <a
                    href='https://usa.visa.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width="46" height="32">
                      <use href="/icons/socials.svg#icon-visa" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.mastercard.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width="46" height="32">
                      <use href="/icons/socials.svg#icon-mastercard" />
                    </svg>
                  </a>
                </li>
              </ul>
            </address>
            <p className={styles.copyright}>© B2Bar – B2B Marketplace</p>
            <Link to='/' className={styles.privacy}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };