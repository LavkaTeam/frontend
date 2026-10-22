import style from './TabsList.module.css';

export interface TabItem {
  tabKey: string;
  displayName: string;
  // Number of items waiting in the tab, e.g. pending reviews.
  badge?: number;
}

interface TabsListProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
}

export const TabsList = ({ tabs, activeTab, onTabChange }: TabsListProps) => {
  if (!tabs?.length) return null;

  return (
    <div className={style.TabsList}>
      {tabs.map((tab) => (
        <div
          key={tab.tabKey}
          data-tour={`tab-${tab.tabKey}`}
          onClick={() => onTabChange(tab.tabKey)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onTabChange(tab.tabKey);
            }
          }}
          role='button'
          tabIndex={0}
          aria-current={activeTab === tab.tabKey ? 'page' : undefined}
          className={`${style.TabItem} ${
            activeTab === tab.tabKey ? style.TabItemActive : ''
          }`}
        >
          <span>{tab.displayName}</span>
          {tab.badge ? (
            <span className={style.TabBadge} aria-label={`${tab.badge} waiting`}>
              {tab.badge}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
};
