export interface TableListItem {
  userId?: number;
  deptId: number;
  username: string;
  userType: string;
  nickname: string;
  sex: string;
  password?: string;
  idNum?: string;
  mobile?: string;
  description?: string;
  enabled?: boolean;
  createdAt: Date;
  roles: Array<number>;
  ext: string;
}

export interface TableListParams {
  [key: string]: any;

  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
