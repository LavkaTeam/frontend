import style from './TabsList.module.css';

interface TabItem {
  tabKey: string;
  displayName: string;
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
          onClick={() => onTabChange(tab.tabKey)}
          className={`${style.TabItem} ${
            activeTab === tab.tabKey ? style.TabItemActive : ''
          }`}
        >
          {tab.displayName}
        </div>
      ))}
    </div>
  );
};
