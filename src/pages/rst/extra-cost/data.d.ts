export interface TableListItem {
  id?: number;
  name: string;
  fee: number;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface TableListParams {
  [key: string]: any;

  pageSize?: number;
  current?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
