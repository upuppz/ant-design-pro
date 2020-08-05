export interface TableListItem {
  id: number;
  type: number;
  temperature: string;
  interviewedUnitId: number;
  interviewedUnit: string;
  interviewee: string;
  visitingUnit: string;
  visitor: string;
  visitorId: number;
  visitorPhone: string;
  buildingId: number;
  buildingName: string;
  createdAt: Date;
  remark: string;
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
