/**
 * BizCharts 可视化图表项数据
 */
export interface BizChartsViewableDataType {
  x: string;
  y: number;
}

/**
 * 欢迎页第一行：统计数据（用餐人数、销售额、用餐数、充值金额）
 */
export interface AnalysisDataType {
  totalMembership: number;
  todayMembership: number;
  weeklyOnWeekly: number;
  dayOnDay: number;
  totalSales: number;
  todaySales: number;
  salesData: BizChartsViewableDataType[];
  totalMeals: number;
  todayMeals: number;
  mealsData: BizChartsViewableDataType[];
  todayRechargeAmount: number;
  totalRechargeAmount: number;
  rechargeAmountData: BizChartsViewableDataType[];
}

/**
 * 欢迎页第二行：趋势数据()
 */
export interface TrendDataType {
  // 销售趋势数据
  salesData: BizChartsViewableDataType[];
  // 用餐趋势数据
  membershipData: BizChartsViewableDataType[];
}

export interface OfflineDataType {
  name: string;
  cvr: number;
}

export interface OfflineChartData {
  x: any;
  y1: number;
  y2: number;
}

export interface RadarData {
  name: string;
  label: string;
  value: number;
}

export interface AnalysisData extends TrendDataType {
  analysisData: AnalysisDataType;
  // -------------
  // visitData2: VisitDataType[];
  // salesData: VisitDataType[];
  // searchData: SearchDataType[];
  // salesTypeData: TrendDataType[];
  // salesTypeDataOnline: VisitDataType[];
  // salesTypeDataOffline: VisitDataType[];
  // radarData: RadarData[];
}
