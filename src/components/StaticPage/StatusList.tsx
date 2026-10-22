import styles from './StaticPage.module.css';

export interface StatusListItem {
  name: string;
  // Backend value, shown as a small code, e.g. PENDING.
  code?: string;
  text: string;
}

// Statuses with their meaning, in a two-column grid.
const StatusList = ({ items }: { items: StatusListItem[] }) => (
  <dl className={styles.statusList}>
    {items.map((item) => (
      <div key={item.name} className={styles.status}>
        <dt className={styles.statusName}>
          {item.name}
          {item.code ? <code className={styles.code}>{item.code}</code> : null}
        </dt>
        <dd className={styles.statusText}>{item.text}</dd>
      </div>
    ))}
  </dl>
);

export { StatusList };
