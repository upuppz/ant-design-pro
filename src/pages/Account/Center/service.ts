import { request } from 'umi';
import { LoginLog } from './data';

export async function listLoginLog(params: { current: number }) {
  // @ts-ignore
  return request<LoginLog>('/api/upms/loginLog', { params, skipUnpack: true });
}
