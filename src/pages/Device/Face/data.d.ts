export interface TableListItem {
  id?: number;
  name?: string;
  companyName?: string;
  deviceKey?: string;
  buildingId?: number;
  buildingName?: string;
  secret?: string;
  comModContent?: string;
  comModType: string;
  delayTimeForCloseDoor?: number;
  displayModContent?: string;
  displayModType: string;
  identifyDistance?: string;
  saveIdentifyTime: number;
  identifyScores?: number;
  multiplayerDetection: string;
  recRank: string;
  recStrangerTimesThreshold?: number;
  recStrangerType: string;
  ttsModContent?: string;
  ttsModType: string;
  ttsModStrangerType: string;
  ttsModStrangerContent?: string;
  wg?: string;
  whitelist: string;
  saveIdentifyMode?: number;
  lastHeartBeat?: Date;
  personCount?: number;
  faceCount?: number;
  ip?: string;
  version?: string;
  lastSync?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TableListParams {
  [key: string]: any;

  pageSize?: number;
  current?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
