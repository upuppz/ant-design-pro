import { request } from 'umi';
import { LoginLog, UserCenterVO } from '@/pages/Account/Center/data';

export async function getUserInfo() {
  return request<API.Ret<UserCenterVO>>('/upms/user/info');
}


export async function listLoginLog(params: { current: number }) {
  // @ts-ignore
  return request<LoginLog>('/upms/loginLog', { params, skipUnpack: true });
}
