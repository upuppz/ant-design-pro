import { request } from 'umi';

export async function queryAnalysis() {
  return request('/api/upms/wallet/analysis');
}
