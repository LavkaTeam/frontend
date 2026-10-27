import { Link } from 'react-router-dom';

import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Skeleton } from '@/components/ui/Skeleton';
import type { BadgeTone } from '@/components/ui/StatusBadge';
import {
  MetricCard,
  MetricCardSkeleton,
  StatCard,
  StatCardSkeleton,
  type CardAccent,
} from '@/components/ui/StatCards';
import { useAdminStats } from '@/hooks/useAdmin';
import { extractErrorMessage } from '@/utils/error';

import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PRODUCT_STATUS,
  VERIFICATION_STATUS,
} from '../model/adminDisplay';
import { AdminPageHeader } from '../shared/AdminPageHeader/AdminPageHeader';

import styles from './AdminDashboard.module.css';

const Count = ({ value }: { value: number }) => (
  <AnimatedNumber value={value} formatter={String} precision='integer' />
);

interface QueueCardProps {
  label: string;
  count: number;
  accent: CardAccent;
  to: string;
  actionLabel: string;
}

// A queue of things waiting for the admin; the whole card is a link to it.
const QueueCard = ({
  label,
  count,
  accent,
  to,
  actionLabel,
}: QueueCardProps) => (
  <Link to={to} className={styles.queueLink}>
    <MetricCard
      label={label}
      accent={accent}
      value={<Count value={count} />}
      footer={
        <span className={styles.queueAction}>
          {count ? actionLabel : 'Nothing waiting'}
          {count ? <span aria-hidden='true'> →</span> : null}
        </span>
      }
    />
  </Link>
);

interface BreakdownItem {
  key: string;
  label: string;
  tone: BadgeTone;
  value: number;
  to: string;
}

const BreakdownSkeleton = ({ rows }: { rows: number }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <Skeleton width={160} height={32} radius={8} />
      <Skeleton width={56} height={44} radius={8} />
    </div>
    <div className={styles.breakdown}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className={styles.skeletonRow}>
          <div className={styles.skeletonLabel}>
            <Skeleton
              width={index % 2 === 0 ? 104 : 132}
              height={22}
              radius={6}
            />
            <Skeleton width={28} height={22} radius={6} />
          </div>
          <Skeleton width='100%' height={6} radius={999} />
        </div>
      ))}
    </div>
  </div>
);

// Mirrors the loaded page, as SellerAnalyticsSkeleton does for the seller.
const AdminDashboardSkeleton = () => (
  <>
    <AdminPageHeader
      title='Dashboard'
      description='What needs your attention and how the marketplace is doing.'
    />
    <section className={styles.metricsGrid}>
      {[0, 1, 2].map((index) => (
        <MetricCardSkeleton key={index} />
      ))}
    </section>
    <section className={styles.statsGrid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </section>
    <div className={styles.cards}>
      {[4, 4, 4, 6].map((rows, index) => (
        <BreakdownSkeleton key={index} rows={rows} />
      ))}
    </div>
  </>
);

const BreakdownCard = ({
  title,
  total,
  items,
}: {
  title: string;
  total: number;
  items: BreakdownItem[];
}) => (
  <section className={styles.card}>
    <div className={styles.cardHeader}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <span className={styles.cardTotal}>{total}</span>
    </div>

    <ul className={styles.breakdown}>
      {items.map((item) => (
        <li key={item.key}>
          <Link to={item.to} className={styles.breakdownRow}>
            <span className={styles.breakdownLabel}>
              <span className={`${styles.swatch} ${styles[item.tone]}`} />
              {item.label}
            </span>
            <span className={styles.breakdownValue}>{item.value}</span>
            <span className={styles.bar} aria-hidden='true'>
              {/* Bar length is data-driven. */}
              <span
                className={`${styles.barFill} ${styles[item.tone]}`}
                style={{
                  width: `${total > 0 ? (item.value / total) * 100 : 0}%`,
                }}
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

const toItems = <K extends string>(
  counts: Partial<Record<K, number>>,
  meta: Record<K, { label: string; tone: BadgeTone }>,
  linkFor: (key: K) => string,
): BreakdownItem[] =>
  (Object.keys(meta) as K[]).map((key) => ({
    key,
    label: meta[key].label,
    tone: meta[key].tone,
    value: counts[key] ?? 0,
    to: linkFor(key),
  }));

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) return <AdminDashboardSkeleton />;

  return (
    <>
      <AdminPageHeader
        title='Dashboard'
        description='What needs your attention and how the marketplace is doing.'
      />

      {error || !stats ? (
        <p className={styles.error} role='alert'>
          {extractErrorMessage(error, 'Could not load the statistics.')}
        </p>
      ) : (
        <>
          <section className={styles.metricsGrid}>
            <QueueCard
              label='Company review'
              count={stats.queues.pendingVerifications}
              accent='burgundy'
              to='/admin/users?status=PENDING'
              actionLabel='Review companies'
            />
            <QueueCard
              label='Payout requests'
              count={stats.queues.pendingPayouts}
              accent='orange'
              to='/admin/payouts?status=PENDING'
              actionLabel='Process payouts'
            />
            <QueueCard
              label='Products to review'
              count={stats.queues.productsToReview}
              accent='green'
              to='/admin/products?status=UNDER_REVIEW'
              actionLabel='Review products'
            />
          </section>

          <section className={styles.statsGrid}>
            <StatCard
              label='Total users'
              accent='burgundy'
              value={<Count value={stats.users.total} />}
            />
            <StatCard
              label='Buyers'
              accent='green'
              value={<Count value={stats.users.buyers} />}
            />
            <StatCard
              label='Sellers'
              accent='orange'
              value={<Count value={stats.users.sellers} />}
            />
            <StatCard
              label='Verified Companies'
              accent='green'
              value={
                <Count value={stats.users.byVerificationStatus.VERIFIED ?? 0} />
              }
            />
            <StatCard
              label='Orders'
              accent='green'
              value={<Count value={stats.orders.total} />}
            />
            <StatCard
              label='Products'
              accent='orange'
              value={<Count value={stats.products.total} />}
            />
          </section>

          <div className={styles.cards}>
            <BreakdownCard
              title='Payments'
              total={stats.orders.total}
              items={toItems(
                stats.orders.byPaymentStatus,
                PAYMENT_STATUS,
                (status) => `/admin/orders?paymentStatus=${status}`,
              )}
            />
            <BreakdownCard
              title='Products'
              total={stats.products.total}
              items={toItems(
                stats.products.byStatus,
                PRODUCT_STATUS,
                (status) => `/admin/products?status=${status}`,
              )}
            />
            <BreakdownCard
              title='Companies'
              total={stats.users.total}
              items={toItems(
                stats.users.byVerificationStatus,
                VERIFICATION_STATUS,
                (status) => `/admin/users?status=${status}`,
              )}
            />
            <BreakdownCard
              title='Orders'
              total={stats.orders.total}
              items={toItems(
                stats.orders.byStatus,
                ORDER_STATUS,
                (status) => `/admin/orders?status=${status}`,
              )}
            />
          </div>
        </>
      )}
    </>
  );
};

export default AdminDashboard;
