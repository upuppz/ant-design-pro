export interface TableListItem {
  pId?: number;
  parentId?: number;
  title: string;
  deptName?: string;
  value: number;
  deptId?: number;
  orderNum: boolean;
  buildings: number[];
  children?: TableListItem[];
}
