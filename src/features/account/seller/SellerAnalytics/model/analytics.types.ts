export interface DashboardMainMetricsDto {
  salesAmountUnits?: number | null;
  totalRevenue?: number | null;
  netProfit?: number | null;
  revenueTrendPercentage?: number | null;
}

export interface DashboardOrderStatsDto {
  totalOrders?: number | null;
  newB2bClients?: number | null;
  inProgressOrders?: number | null;
  completedOrders?: number | null;
  totalB2bClients?: number | null;
}

export interface DashboardProductStatsDto {
  totalProducts?: number | null;
  activeProducts?: number | null;
  inStockProducts?: number | null;
  lowStockProducts?: number | null;
  outOfStockProducts?: number | null;
}

export type DashboardRevenueChartYearDto = Record<
  string,
  number | null | undefined
>;

export interface DashboardRevenueSubcategoryDto {
  subcategory?: string | null;
  revenue?: number | null;
  percentage?: number | null;
}

export interface DashboardRevenueByCategoryDto {
  category?: string | null;
  revenue?: number | null;
  percentage?: number | null;
  subcategories?: DashboardRevenueSubcategoryDto[] | null;
}

export interface DashboardRevenueChartDto {
  currentYear?: DashboardRevenueChartYearDto | null;
  previousYear?: DashboardRevenueChartYearDto | null;
}

export interface DashboardResponseDto {
  mainMetrics?: DashboardMainMetricsDto | null;
  orderStats?: DashboardOrderStatsDto | null;
  productStats?: DashboardProductStatsDto | null;
  revenueChart?: DashboardRevenueChartDto | null;
  revenueByCategory?: DashboardRevenueByCategoryDto[] | null;
  averageOrderValue?: number | null;
}
