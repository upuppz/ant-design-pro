import { UploadFile } from 'antd/es/upload/interface';

export interface TableListItem {
  userId: number;
  username: string;
  nickname: string;
  password?: string;
  enabled: boolean;
  icNum?: string;
  idNum?: string;
  lastLoginTime?: Date;
  updatedAt?: Date;
  mobile?: string;
  sex: number;
  userType: string;
  description?: string;
  faces?: Array<UploadFile>;
}

export interface TableListParams {
  nickname?: string;
  username?: string;
  mobile?: string;
  idNum?: string;
  sex?: number;
  enabled?: number;
  // ---------------
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
