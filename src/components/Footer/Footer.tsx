import { Link } from 'react-router-dom';
import { Logo } from '../Logo';

import styles from './Footer.module.css';

const FOOTER_COLUMNS = [
  [
    { label: 'About us', to: '/about' },
    { label: 'FAQ', to: '/faq' },
  ],
  [
    { label: 'How to Become a Seller', to: '/become-a-seller' },
    { label: 'Rules for Sellers', to: '/seller-rules' },
  ],
  [
    { label: 'Discounts and Promotions', to: '/promotions' },
    { label: 'Support Center', to: '/support' },
  ],
];

const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <footer className={styles.wrapper}>
      <div className='container'>
        <div className={styles.container}>
          <div className={styles.topSection}>
            <Logo />
            <nav className={styles.columns} aria-label='Footer'>
              {FOOTER_COLUMNS.map((column, index) => (
                <ul key={index} className={styles.linkBlock}>
                  {column.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className={styles.link}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
              <ul className={styles.linkBlock}>
                <li>
                  <a className={styles.link} href='mailto:support@b2bar.tech'>
                    support@b2bar.tech
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className={styles.bottomSection}>
            <address className={styles.IconsList}>
              <ul className={styles.Icons}>
                <li>
                  <a
                    href='https://facebook.com/'
                    aria-label='Facebook'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width='24' height='24' aria-hidden='true'>
                      <use href='/icons/socials.svg#icon-facebook' />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href='https://x.com/'
                    aria-label='X'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width='24' height='24' aria-hidden='true'>
                      <use href='/icons/socials.svg#icon-twitter' />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href='https://instagram.com/'
                    aria-label='Instagram'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width='24' height='24' aria-hidden='true'>
                      <use href='/icons/socials.svg#icon-instagram' />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href='https://linkedin.com/'
                    aria-label='LinkedIn'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width='24' height='24' aria-hidden='true'>
                      <use href='/icons/socials.svg#icon-linkedin' />
                    </svg>
                  </a>
                </li>
              </ul>
              <ul className={styles.Icons}>
                <li>
                  <a
                    href='https://usa.visa.com/'
                    aria-label='Visa'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width='46' height='32' aria-hidden='true'>
                      <use href='/icons/socials.svg#icon-visa' />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.mastercard.com/'
                    aria-label='Mastercard'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width='46' height='32' aria-hidden='true'>
                      <use href='/icons/socials.svg#icon-mastercard' />
                    </svg>
                  </a>
                </li>
              </ul>
            </address>
            <p className={styles.copyright}>© {date} B2Bar – B2B Marketplace</p>
            <Link to='/privacy' className={styles.privacy}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
