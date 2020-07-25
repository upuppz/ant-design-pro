export interface EnterpriseInfo {
  deptId: number;
  deptName: string;
  buildingId: number;
  buildingName: string;
  nickname: string;
  avatar: string;
  mobile: string;
  description: string;
  lastLoginTime: string;
}

export interface ListItemDataType {
  id: number;
  userId: number;
  location: string;
  ip: string;
  system: string;
  browser: string;
  status: number;
  createdAt: string;
}
