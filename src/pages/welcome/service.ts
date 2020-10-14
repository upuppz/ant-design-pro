import { request } from 'umi';
import { RstApi } from '@/apis';

export async function analysis() {
  return request(RstApi.ANALYSIS);
}

export async function trendData(params: {
  tableKey: string;
  dataLevel: string;
  dateStrings: [string, string];
}) {
  return request(RstApi.ANALYSIS_TREND, { params });
}
