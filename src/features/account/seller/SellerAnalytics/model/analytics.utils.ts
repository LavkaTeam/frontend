import type {
  DashboardMainMetricsDto,
  DashboardOrderStatsDto,
  DashboardProductStatsDto,
  DashboardRevenueByCategoryDto,
  DashboardRevenueChartYearDto,
} from './analytics.types';

const MONTH_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const;

const MONTH_KEY_ALIASES: Record<string, (typeof MONTH_KEYS)[number]> = {
  '1': 'jan',
  '01': 'jan',
  jan: 'jan',
  january: 'jan',
  '2': 'feb',
  '02': 'feb',
  feb: 'feb',
  february: 'feb',
  '3': 'mar',
  '03': 'mar',
  mar: 'mar',
  march: 'mar',
  '4': 'apr',
  '04': 'apr',
  apr: 'apr',
  april: 'apr',
  '5': 'may',
  '05': 'may',
  may: 'may',
  '6': 'jun',
  '06': 'jun',
  jun: 'jun',
  june: 'jun',
  '7': 'jul',
  '07': 'jul',
  jul: 'jul',
  july: 'jul',
  '8': 'aug',
  '08': 'aug',
  aug: 'aug',
  august: 'aug',
  '9': 'sep',
  '09': 'sep',
  sep: 'sep',
  sept: 'sep',
  september: 'sep',
  '10': 'oct',
  oct: 'oct',
  october: 'oct',
  '11': 'nov',
  nov: 'nov',
  november: 'nov',
  '12': 'dec',
  dec: 'dec',
  december: 'dec',
};

const CATEGORY_COLORS = [
  '#C8721B',
  '#AF261F',
  '#5D923C',
  '#87827E',
  '#C49A6C',
  '#8A4B27',
] as const;

export interface RevenueBarDatum {
  key: (typeof MONTH_KEYS)[number];
  label: string;
  fullLabel: string;
  currentValue: number;
  previousValue: number;
}

export interface AnalyticsMetricViewModel {
  id: string;
  label: string;
  numericValue: number;
  formatValue: (value: number) => string;
  accent: 'neutral' | 'green' | 'orange';
  trendValue: string;
  trendDirection: 'up' | 'down' | 'neutral';
  trendLabel: string;
}

export interface AnalyticsStatViewModel {
  id: string;
  label: string;
  numericValue: number;
  formatValue: (value: number) => string;
  accent: 'green' | 'orange' | 'burgundy';
}

export interface AnalyticsHighlightViewModel {
  id: 'averageOrderValue';
  label: string;
  numericValue: number;
  formatValue: (value: number) => string;
  accent: 'green';
  description: string;
}

export interface AnalyticsCategoryRevenueViewModel {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

const normalizeMonthEntries = (source?: DashboardRevenueChartYearDto | null) => {
  const values = new Map<(typeof MONTH_KEYS)[number], number>();

  Object.entries(source || {}).forEach(([rawKey, rawValue]) => {
    const normalizedKey = MONTH_KEY_ALIASES[rawKey.trim().toLowerCase()];

    if (!normalizedKey) return;

    values.set(normalizedKey, Number(rawValue) || 0);
  });

  return values;
};

const getRevenueTotal = (source?: DashboardRevenueChartYearDto | null) => {
  return Array.from(normalizeMonthEntries(source).values()).reduce(
    (sum, value) => sum + value,
    0,
  );
};

export const getRevenueBars = (
  currentYear?: DashboardRevenueChartYearDto | null,
  previousYear?: DashboardRevenueChartYearDto | null,
): RevenueBarDatum[] => {
  const currentMap = normalizeMonthEntries(currentYear);
  const previousMap = normalizeMonthEntries(previousYear);

  return MONTH_KEYS.map((monthKey) => ({
    key: monthKey,
    label: monthKey[0].toUpperCase() + monthKey.slice(1),
    fullLabel: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      new Date(`2026-${String(MONTH_KEYS.indexOf(monthKey) + 1).padStart(2, '0')}-01`),
    ),
    currentValue: currentMap.get(monthKey) || 0,
    previousValue: previousMap.get(monthKey) || 0,
  }));
};

export const getChartPeakValue = (bars: RevenueBarDatum[]) => {
  const peak = bars.reduce(
    (max, item) => Math.max(max, item.currentValue, item.previousValue),
    0,
  );

  return peak > 0 ? peak : 1;
};

export const formatCompactNumber = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0';

  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
};

export const formatInteger = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0';

  return new Intl.NumberFormat('en').format(value);
};

export const formatCurrency = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatTrendValue = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0%';

  return `${Math.abs(value).toFixed(Math.abs(value) >= 10 ? 0 : 1)}%`;
};

export const getTrendDirection = (
  value?: number | null,
): AnalyticsMetricViewModel['trendDirection'] => {
  if (typeof value !== 'number' || Number.isNaN(value) || value === 0) {
    return 'neutral';
  }

  return value > 0 ? 'up' : 'down';
};

export const getRevenueTrend = (
  metrics?: DashboardMainMetricsDto | null,
  currentYear?: DashboardRevenueChartYearDto | null,
  previousYear?: DashboardRevenueChartYearDto | null,
) => {
  if (typeof metrics?.revenueTrendPercentage === 'number') {
    return metrics.revenueTrendPercentage;
  }

  const currentTotal = getRevenueTotal(currentYear);
  const previousTotal = getRevenueTotal(previousYear);

  if (previousTotal <= 0) return currentTotal > 0 ? 100 : 0;

  return ((currentTotal - previousTotal) / previousTotal) * 100;
};

export const getMetricCards = (
  metrics?: DashboardMainMetricsDto | null,
  currentYear?: DashboardRevenueChartYearDto | null,
  previousYear?: DashboardRevenueChartYearDto | null,
): AnalyticsMetricViewModel[] => {
  const revenueTrend = getRevenueTrend(metrics, currentYear, previousYear);
  const trendDirection = getTrendDirection(revenueTrend);

  return [
    {
      id: 'salesAmountUnits',
      label: 'Sales amount (units)',
      numericValue: metrics?.salesAmountUnits ?? 0,
      formatValue: formatCompactNumber,
      accent: 'neutral',
      trendValue: formatTrendValue(revenueTrend),
      trendDirection,
      trendLabel: 'vs previous period',
    },
    {
      id: 'totalRevenue',
      label: 'Orders in dollars',
      numericValue: metrics?.totalRevenue ?? 0,
      formatValue: formatCurrency,
      accent: 'green',
      trendValue: formatTrendValue(revenueTrend),
      trendDirection,
      trendLabel: 'vs previous period',
    },
    {
      id: 'netProfit',
      label: 'Net Profit',
      numericValue: metrics?.netProfit ?? 0,
      formatValue: formatCurrency,
      accent: 'orange',
      trendValue: formatTrendValue(revenueTrend),
      trendDirection,
      trendLabel: 'vs previous period',
    },
  ];
};

export const getStatCards = (
  orderStats?: DashboardOrderStatsDto | null,
  productStats?: DashboardProductStatsDto | null,
): AnalyticsStatViewModel[] => {
  return [
    {
      id: 'totalOrders',
      label: 'Total Orders',
      numericValue: orderStats?.totalOrders ?? 0,
      formatValue: formatInteger,
      accent: 'green',
    },
    {
      id: 'newB2bClients',
      label: 'B2B Signups',
      numericValue: orderStats?.newB2bClients ?? 0,
      formatValue: formatInteger,
      accent: 'green',
    },
    {
      id: 'inProgressOrders',
      label: 'In Progress',
      numericValue: orderStats?.inProgressOrders ?? 0,
      formatValue: formatInteger,
      accent: 'orange',
    },
    {
      id: 'completedOrders',
      label: 'Completed',
      numericValue: orderStats?.completedOrders ?? 0,
      formatValue: formatInteger,
      accent: 'green',
    },
    {
      id: 'totalB2bClients',
      label: 'B2B Clients',
      numericValue: orderStats?.totalB2bClients ?? 0,
      formatValue: formatInteger,
      accent: 'orange',
    },
    {
      id: 'totalProducts',
      label: 'Total Products',
      numericValue: productStats?.totalProducts ?? 0,
      formatValue: formatInteger,
      accent: 'green',
    },
    {
      id: 'inStockProducts',
      label: 'In Stock',
      numericValue: productStats?.inStockProducts ?? 0,
      formatValue: formatInteger,
      accent: 'green',
    },
    {
      id: 'lowStockProducts',
      label: 'Low Stock',
      numericValue: productStats?.lowStockProducts ?? 0,
      formatValue: formatInteger,
      accent: 'orange',
    },
    {
      id: 'outOfStockProducts',
      label: 'Out of Stock',
      numericValue: productStats?.outOfStockProducts ?? 0,
      formatValue: formatInteger,
      accent: 'burgundy',
    },
  ];
};

export const getHighlightCards = (
  dashboard?: {
    averageOrderValue?: number | null;
  } | null,
): AnalyticsHighlightViewModel[] => {
  return [
    {
      id: 'averageOrderValue',
      label: 'Average Order Value',
      numericValue: dashboard?.averageOrderValue ?? 0,
      formatValue: formatCurrency,
      accent: 'green',
      description: 'Average revenue per completed order.',
    },
  ];
};

export const getAvailableYearOptions = (selectedYear: number) => {
  const currentYear = new Date().getFullYear();
  const baseYear = Math.max(currentYear, selectedYear);

  return Array.from({ length: 5 }, (_, index) => {
    const year = baseYear - index;

    return {
      value: String(year),
      label: year === currentYear ? 'This year' : String(year),
    };
  });
};

export const getResolvedRevenueTotal = (
  metrics?: DashboardMainMetricsDto | null,
  currentYear?: DashboardRevenueChartYearDto | null,
) => {
  if (typeof metrics?.totalRevenue === 'number') {
    return metrics.totalRevenue;
  }

  return getRevenueTotal(currentYear);
};

const formatCategoryLabel = (value: string) =>
  value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const getRevenueByCategory = (
  revenueByCategory?: DashboardRevenueByCategoryDto[] | null,
): AnalyticsCategoryRevenueViewModel[] => {
  const entries = (revenueByCategory || [])
    .map((entry, index) => ({
      id: entry.category || `category-${index}`,
      label: formatCategoryLabel(entry.category || 'Uncategorized'),
      value: Number(entry.revenue) || 0,
      apiPercentage: Number(entry.percentage),
    }))
    .filter((entry) => entry.value > 0)
    .sort((left, right) => right.value - left.value);

  const total = entries.reduce((sum, entry) => sum + entry.value, 0);

  return entries.map((entry, index) => ({
    id: entry.id,
    label: entry.label,
    value: entry.value,
    percentage: Number.isFinite(entry.apiPercentage)
      ? entry.apiPercentage
      : total > 0
        ? (entry.value / total) * 100
        : 0,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));
};

export const getRevenueDelta = (
  currentValue: number,
  previousValue: number,
) => {
  const difference = currentValue - previousValue;
  const percentage =
    previousValue > 0 ? (difference / previousValue) * 100 : undefined;

  return {
    difference,
    percentage,
  };
};
