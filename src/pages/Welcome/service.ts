import { request } from 'umi';

export async function queryAnalysis() {
  return request('/upms/wallet/analysis');
}
