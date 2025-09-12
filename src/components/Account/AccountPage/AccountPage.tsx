import { useUser } from '@/hooks/useUser';
import styles from './AccountPage.module.css';
import { TabsList } from '../Tabs/TabsList/TabsList';
import { Suspense, useState } from 'react';
import { Loader } from '@/components/ui/Loader';

const AccountPage = () => {
  const { data: user, error } = useUser();
  const [activeTab, setActiveTab] = useState<string>('');

  if (error || !user) return null;

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  return (
    <div className={styles.accountLayout}>
      <div className={styles.sideBar}>
        <div className={styles.userInfo}>
          <div className={styles.userImage}>
            {user.image || <img src='/icons/testAvatar.png' />}
            {/* Тестовий аватар */}
          </div>
          <div className={styles.userText}>
            <p className={styles.userName}>
              {user.name} {user.lastName}
            </p>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>
        <TabsList role={user.role} onTabChange={handleTabChange} />
      </div>
      <Suspense fallback={<Loader />}>
        <TabsList.Content activeTab={activeTab} />
      </Suspense>
    </div>
  );
};

export { AccountPage };
