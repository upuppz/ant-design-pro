export interface TableListItem {
  roleId: number;
  roleName: string;
  roleKey: string;
  description?: string;
  enabled: string;
  createdAt: Date;
}

export interface TableListParams {
  [key: string]: any;

  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
