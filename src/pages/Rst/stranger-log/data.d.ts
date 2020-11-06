export interface TableListItem {
  id: number;
  deviceKey: string;
  time: string;
  type: string;
  path: string;
  imgBase64: string;
  ip: string;
  searchScore: string;
  livenessScore: string;
  temperature: string;
  standard: string;
  temperatureState: string;
  createdAt?: Date;
}

export interface TableListParams {
  [key: string]: any;

  pageSize?: number;
  current?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
