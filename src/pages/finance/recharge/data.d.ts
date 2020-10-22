export interface QueryParams {
  uid: number,
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  current?: number;
  // filter?: { [key: string]: any[] };
  // sorter?: { [key: string]: any };
}


export interface ItemType {
  /**
   * 流水号
   */
  id: string;
  /**
   * 业务类型
   */
  targetType: number;

  /**
   * 变动的金额，正负数
   */
  fee: number;
  /**
   *  附加费用项
   */
  extraCost: string;
  /**
   * 订单创建时间
   */
  createdAt: Date;
  /**
   * 备注信息
   */
  remark:string;
}
