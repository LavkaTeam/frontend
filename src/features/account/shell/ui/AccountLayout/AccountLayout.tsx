import type { ReactNode } from 'react';

import { TabsList, type TabItem } from '../tabs/TabsList';

import styles from './AccountLayout.module.css';

interface AccountLayoutProps {
  // Who the cabinet belongs to: avatar, main line and second line.
  avatarSrc: string;
  title: string;
  subtitle: string;
  // Makes the avatar a button (e.g. to upload a logo).
  onAvatarClick?: () => void;
  avatarLabel?: string;
  // Icons next to the identity (verification status, tour button, ...).
  actions?: ReactNode;
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  children: ReactNode;
}

/**
 * Frame of every cabinet: identity and tabs in the sticky sidebar, the active
 * section on the right. Shared by the buyer/seller account and the admin
 * panel, so they look and behave the same.
 */
const AccountLayout = ({
  avatarSrc,
  title,
  subtitle,
  onAvatarClick,
  avatarLabel = 'Open avatar',
  actions,
  tabs,
  activeTab,
  onTabChange,
  children,
}: AccountLayoutProps) => (
  <div className={styles.accountLayout}>
    <div className={styles.sideBar}>
      <div className={styles.userInfoBlock}>
        <div className={styles.userInfo} data-tour='account-identity'>
          <div className={styles.userImageWrapper}>
            {onAvatarClick ? (
              <div
                className={`${styles.userImage} ${styles.userImageInteractive}`}
                onClick={onAvatarClick}
                role='button'
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onAvatarClick();
                  }
                }}
                aria-label={avatarLabel}
              >
                <img src={avatarSrc} alt='avatar' className={styles.avatarImg} />
              </div>
            ) : (
              <div className={styles.userImage}>
                <img src={avatarSrc} alt='avatar' className={styles.avatarImg} />
              </div>
            )}
          </div>

          <div className={styles.userText}>
            <p className={styles.userCompany}>{title}</p>
            <p className={styles.userEmail}>{subtitle}</p>
          </div>
        </div>

        {actions ? <div className={styles.userActions}>{actions}</div> : null}
      </div>

      <TabsList tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
    </div>

    <div className={styles.contentArea}>{children}</div>
  </div>
);

export { AccountLayout };
