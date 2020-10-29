import { request } from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}


export async function outLogin() {
  return request('/api/login/outLogin');
}
