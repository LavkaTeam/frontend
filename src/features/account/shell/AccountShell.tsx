import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader } from '@/components/ui/Loader';
import { useUser } from '@/hooks/useUser';

import { AccountProfileFormSkeleton } from '../profile';
import {
  ROLE_TABS,
  getAccountTabComponent,
  normalizeAccountTabKey,
} from './model/accountTabs';
import { TabsList } from './ui/tabs/TabsList';
import { NotVerifiedIcon } from '@/components/ui/icons/StatusIcons/NotVerifiedIcon';
import { PendingIcon } from '@/components/ui/icons/StatusIcons/PendingIcon';
import { VerifiedIcon } from '@/components/ui/icons/StatusIcons/VerifiedIcon';

import styles from './AccountShell.module.css';

const profileSkeletonTabs = new Set(['profile']);

const AccountShell = () => {
  const { data: user, error, isLoading } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawRequestedTab = searchParams.get('tab');
  const requestedTab = normalizeAccountTabKey(rawRequestedTab);
  const previousTabRef = useRef<string | null>(null);

  const availableTabs = useMemo(() => {
    if (!user) return [];
    return ROLE_TABS[user.role] || [];
  }, [user]);

  const activeTabKey = requestedTab || availableTabs[0]?.tabKey || '';

  useEffect(() => {
    if (
      previousTabRef.current &&
      previousTabRef.current !== activeTabKey &&
      typeof window !== 'undefined'
    ) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    previousTabRef.current = activeTabKey;
  }, [activeTabKey]);

  useEffect(() => {
    if (availableTabs.length > 0) {
      const isValidTab = availableTabs.some(
        (tab) => tab.tabKey === activeTabKey,
      );

      if (!isValidTab || !searchParams.has('tab') || rawRequestedTab !== activeTabKey) {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('tab', isValidTab ? activeTabKey : availableTabs[0].tabKey);
        setSearchParams(nextParams, { replace: true });
      }
    }
  }, [activeTabKey, availableTabs, rawRequestedTab, searchParams, setSearchParams]);

  if (error) return null;

  if (isLoading || !user) {
    const isSellerProfile = rawRequestedTab === 'sellerProfile';

    if (!requestedTab || profileSkeletonTabs.has(requestedTab)) {
      return (
        <div className={styles.contentArea}>
          <AccountProfileFormSkeleton
            title={
              isSellerProfile
                ? 'Hello, you are in your seller account'
                : 'Hello, you are in your customer account'
            }
            description={
              isSellerProfile
                ? 'Manage your products, orders, and sales details here'
                : 'Here you will find all information about your orders and be able to update your personal details'
            }
          />
        </div>
      );
    }

    return (
      <div className={styles.contentArea}>
        <Loader variant='section' />
      </div>
    );
  }

  const handleTabChange = (tabKey: string) => {
    setSearchParams({ tab: tabKey });
  };

  const ActiveContentComponent = getAccountTabComponent(user.role, activeTabKey);

  const handleStatusClick = () => {
    setSearchParams({ tab: 'profile', validate: '1' });
  };

  const handleLogoClick = () => {
    setSearchParams({ tab: 'profile', openLogo: '1' });
  };

  const userStatus = user.verificationStatus ?? user.status;
  const shouldOpenProfileValidation =
    userStatus === 'NOT_VERIFIED' || userStatus === 'REJECTED';

  const getStatusInfo = (status?: typeof userStatus) => {
    switch (status) {
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
      case 'REJECTED':
        return {
          icon: <NotVerifiedIcon />,
          text: 'Verification rejected. Update the required profile details.',
        };
      case 'NOT_VERIFIED':
        return {
          icon: <NotVerifiedIcon />,
          text: 'Not verified. Please fill in all company details.',
        };
      case undefined:
        return {
          icon: <NotVerifiedIcon />,
          text: 'Verification status unavailable.',
        };
      default:
        return {
          icon: <NotVerifiedIcon />,
          text: 'Verification status unavailable.',
        };
    }
  };

  const statusInfo = getStatusInfo(userStatus);

  return (
    <div className={styles.accountLayout}>
      <div className={styles.sideBar}>
        <div className={styles.userInfoBlock}>
          <div className={styles.userInfo}>
            <div className={styles.userImageWrapper}>
              <div
                className={styles.userImage}
                onClick={handleLogoClick}
                role='button'
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleLogoClick();
                  }
                }}
                aria-label='Open logo upload'
              >
                <img
                  src={user.logoUrl || '/icons/testAvatar.png'}
                  alt='avatar'
                  className={styles.avatarImg}
                />
              </div>
            </div>

            <div className={styles.userText}>
              <p className={styles.userCompany}>
                {user.companyName || user.firstName || 'User'}
              </p>
              <p className={styles.userEmail}>
                {`${user.firstName} ${user.lastName}`}
              </p>
            </div>
          </div>

          <div
            className={styles.statusIconWrapper}
            onClick={
              shouldOpenProfileValidation ? handleStatusClick : undefined
            }
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
        <Suspense
          fallback={
            profileSkeletonTabs.has(activeTabKey) ? (
              <AccountProfileFormSkeleton
                title={
                  user.role === 'SELLER'
                    ? 'Hello, you are in your seller account'
                    : 'Hello, you are in your customer account'
                }
                description={
                  user.role === 'SELLER'
                    ? 'Manage your products, orders, and sales details here'
                    : 'Here you will find all information about your orders and be able to update your personal details'
                }
              />
            ) : (
              <Loader variant='section' />
            )
          }
        >
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

export { AccountShell };
