import { request } from 'umi';
import { LoginLog } from '@/pages/Account/Center/data';

export async function listLoginLog(params: { current: number }) {
  // @ts-ignore
  return request<LoginLog>('/upms/loginLog', { params, skipUnpack: true });
}
