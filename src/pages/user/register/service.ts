import request from 'umi-request';
import { UserRegisterParams } from '@/pages/user/register/index';

export async function fakeRegister(params: UserRegisterParams) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}
