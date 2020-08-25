export interface TableListItem {
  walletId: number;
  walletIncome: number;
  walletOutcome: number;
  balanceFee: number;
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

export interface LikeItem {
  userId: number;
  nickname: string;
  mobile: string;
  deptName: string;
}
