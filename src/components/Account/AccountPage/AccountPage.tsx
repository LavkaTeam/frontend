import { Suspense, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { Loader } from '@/components/ui/Loader';
import { TabsList } from '../Tabs/TabsList/TabsList';
import { ROLE_TABS, tabComponents } from '@/config/accountTabs';
import { NotVerifiedIcon } from '@/components/ui/icons/StatusIcons/NotVerifiedIcon';
import { PendingIcon } from '@/components/ui/icons/StatusIcons/PendingIcon';
import { VerifiedIcon } from '@/components/ui/icons/StatusIcons/VerifiedIcon';

import styles from './AccountPage.module.css';

const AccountPage = () => {
  const { data: user, error } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const availableTabs = useMemo(() => {
    if (!user) return [];
    return ROLE_TABS[user.role.toUpperCase()] || [];
  }, [user]);

  const activeTabKey =
    searchParams.get('tab') || availableTabs[0]?.tabKey || '';

  useEffect(() => {
    if (availableTabs.length > 0) {
      const isValidTab = availableTabs.some(
        (tab) => tab.tabKey === activeTabKey,
      );

      if (!isValidTab || !searchParams.has('tab')) {
        setSearchParams({ tab: availableTabs[0].tabKey }, { replace: true });
      }
    }
  }, [activeTabKey, availableTabs, searchParams, setSearchParams]);

  if (error || !user) return null;

  const handleTabChange = (tabKey: string) => {
    setSearchParams({ tab: tabKey });
  };

  const ActiveContentComponent = tabComponents[activeTabKey];

  const handleStatusClick = () => {
    setSearchParams({ tab: 'SellerProfile' });
  };

  const userStatus = user.status || 'NOT_VERIFIED'; // fallback

  const getStatusInfo = () => {
    switch (userStatus) {
      case 'VERIFIED':
        return {
          icon: <VerifiedIcon />,
          text: 'Account Verified',
        };
      case 'PENDING':
        return {
          icon: <PendingIcon />,
          text: 'Verification Pending. We are reviewing your details.',
        };
      case 'NOT_VERIFIED':
      default:
        return {
          icon: <NotVerifiedIcon />,
          text: 'Not Verified. Please fill in all company details.',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={styles.accountLayout}>
      <div className={styles.sideBar}>
        <div className={styles.userInfoBlock}>
          <div className={styles.userInfo}>
            <div className={styles.userImageWrapper}>
              <div className={styles.userImage}>
                <img
                  src={user.logoUrl || '/icons/testAvatar.png'}
                  alt='avatar'
                  className={styles.avatarImg}
                />
              </div>
            </div>

            <div className={styles.userText}>
              <p className={styles.userCompany}>
                {user.companyName || `${user.name} ${user.lastName}`}
              </p>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>

          <div
            className={styles.statusIconWrapper}
            onClick={userStatus !== 'VERIFIED' ? handleStatusClick : undefined}
          >
            {statusInfo.icon}

            <div className={styles.statusTooltip}>
              {statusInfo.text}
              <div className={styles.tooltipArrow}></div>
            </div>
          </div>
        </div>

        <TabsList
          tabs={availableTabs}
          activeTab={activeTabKey}
          onTabChange={handleTabChange}
        />
      </div>

      <div className={styles.contentArea}>
        <Suspense fallback={<Loader variant='section' />}>
          {ActiveContentComponent ? (
            <ActiveContentComponent />
          ) : (
            <div>Tab not found</div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export { AccountPage };
