import { request } from 'umi';
import { AuthApi } from '@/apis';
import { ACCESS_TOKEN } from '@/configs';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  /* return request<API.LoginStateType>('/api/login/account', {
    method: 'POST',
    data: params,
  }); */
  return request(AuthApi.login, {
    method: 'POST',
    data: { ...params, grant_type: 'password', scope: 'all' },
    requestType: 'form',
    headers: {
      Authorization: 'Basic d2l0cGFyay1jbG91ZDoxMjM0NTY=',
    },
    skipErrorHandler: true,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request(`${AuthApi.logout}?access_token=${localStorage.getItem(ACCESS_TOKEN)}`);
}
