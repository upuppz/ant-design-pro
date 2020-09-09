export interface TableListItem {
  id: number;
  walletId: number;
  targetType: number;
  fee: number;
  balance: number;
  refundId: number;
  remark: string;
  extraCost: string;
  deptName: string;
  username: string;
  nickname: string;
  sex: string;
  mobile: string;
  icNum: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TableListParams {
  [key: string]: any;

  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
