import { request } from 'umi';
import { LoginLog, UserCenterVO } from '@/pages/account/center/data';

export async function getUserInfo() {
  return request<UserCenterVO>('/upms/user/info');
}


export async function listLoginLog(params: { current: number }) {
  // @ts-ignore
  return request<LoginLog>('/upms/loginLog', { params, skipUnpack: true });
}
