export interface TableListItem {
  id?: number;
  buildingName?: string;
  parentId: number;
  level: number;
  orderNum: number;
  createdAt: Date;
}
