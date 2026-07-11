import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDashboard } from './model/useAnalytics';
import { extractErrorMessage } from '@/utils/error';

import {
  AnalyticsHighlightCard,
  AnalyticsMetricCard,
  AnalyticsRevenueChart,
  AnalyticsStatCard,
  PopularCategoriesChart,
  SellerAnalyticsSkeleton,
} from './components';
import {
  getAvailableYearOptions,
  getHighlightCards,
  getMetricCards,
  getRevenueByCategory,
  getResolvedRevenueTotal,
  getRevenueBars,
  getStatCards,
} from './model/analytics.utils';
import styles from './SellerAnalytics.module.css';

const getSelectedYear = (rawYear: string | null) => {
  const parsedYear = Number(rawYear);
  const currentYear = new Date().getFullYear();

  if (!Number.isInteger(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
    return currentYear;
  }

  return parsedYear;
};

const SellerAnalytics = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedYear = getSelectedYear(searchParams.get('year'));
  const dashboardQuery = useDashboard(selectedYear);

  const yearOptions = useMemo(
    () => getAvailableYearOptions(selectedYear),
    [selectedYear],
  );
  const revenueBars = useMemo(
    () =>
      getRevenueBars(
        dashboardQuery.data?.revenueChart?.currentYear,
        dashboardQuery.data?.revenueChart?.previousYear,
      ),
    [
      dashboardQuery.data?.revenueChart?.currentYear,
      dashboardQuery.data?.revenueChart?.previousYear,
    ],
  );
  const metricCards = useMemo(
    () =>
      getMetricCards(
        dashboardQuery.data?.mainMetrics,
        dashboardQuery.data?.revenueChart?.currentYear,
        dashboardQuery.data?.revenueChart?.previousYear,
      ),
    [
      dashboardQuery.data?.mainMetrics,
      dashboardQuery.data?.revenueChart?.currentYear,
      dashboardQuery.data?.revenueChart?.previousYear,
    ],
  );
  const statCards = useMemo(
    () =>
      getStatCards(
        dashboardQuery.data?.orderStats,
        dashboardQuery.data?.productStats,
      ),
    [dashboardQuery.data?.orderStats, dashboardQuery.data?.productStats],
  );
  const highlightCards = useMemo(
    () =>
      getHighlightCards({
        averageOrderValue: dashboardQuery.data?.averageOrderValue,
      }),
    [dashboardQuery.data?.averageOrderValue],
  );
  const revenueByCategory = useMemo(
    () => getRevenueByCategory(dashboardQuery.data?.revenueByCategory),
    [dashboardQuery.data?.revenueByCategory],
  );
  const primaryStatCards = statCards.slice(0, 6);
  const secondaryStatCards = statCards.slice(6);
  const totalRevenue = getResolvedRevenueTotal(
    dashboardQuery.data?.mainMetrics,
    dashboardQuery.data?.revenueChart?.currentYear,
  );

  const handleYearChange = (year: number) => {
    setSearchParams((previous) => {
      const nextParams = new URLSearchParams(previous);
      nextParams.set('year', String(year));
      return nextParams;
    });
  };

  if (dashboardQuery.isLoading && !dashboardQuery.data) {
    return <SellerAnalyticsSkeleton />;
  }

  if (dashboardQuery.isError) {
    return (
      <div className={styles.feedbackState}>
        <h3>Failed to load analytics</h3>
        <p>
          {extractErrorMessage(
            dashboardQuery.error,
            'Please refresh the page and try again.',
          )}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page} aria-busy={dashboardQuery.isFetching}>
      <header className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.subtitle}>
          Manage your products, orders, and sales details here.
        </p>
      </header>

      <section className={styles.metricsGrid}>
        {metricCards.map((metric) => (
          <AnalyticsMetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className={styles.statsGrid}>
        {primaryStatCards.map((stat) => (
          <AnalyticsStatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <section className={styles.overviewGrid}>
        <PopularCategoriesChart items={revenueByCategory} />

        <div className={styles.overviewSidebar}>
          <section className={styles.highlightsGrid}>
            {highlightCards.map((item) => (
              <AnalyticsHighlightCard key={item.id} item={item} />
            ))}
          </section>

          <section className={styles.statsOverflowGrid}>
            {secondaryStatCards.map((stat) => (
              <AnalyticsStatCard key={stat.id} stat={stat} />
            ))}
          </section>
        </div>
      </section>

      <AnalyticsRevenueChart
        bars={revenueBars}
        year={selectedYear}
        options={yearOptions}
        totalRevenue={totalRevenue}
        onYearChange={handleYearChange}
      />
    </div>
  );
};

export default SellerAnalytics;
