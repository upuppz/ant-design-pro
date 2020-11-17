export interface TableListItem {
  parentId?: number;
  title: string;
  permissionName?: string;
  value: number;
  permissionId?: number;
  permission?: string;
  orderNum: boolean;
  children?: TableListItem[];
}
