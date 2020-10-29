/*
 * 个人端首页分析数据 - 展示对象
 */
export interface AnalysisPersonalVO{
  /*
   * 帐户余额
   */
  amount: number;
  /*
   * 近12个月消费趋势
   */
  consumptionTrend:Array<API.BizChartsViewableDTO>;
}


// =============

export interface TagType {
  key: string;
  label: string;
}

export interface Member {
  avatar: string;
  name: string;
  id: string;
}

