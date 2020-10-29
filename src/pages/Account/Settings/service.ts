import { request } from 'umi';

export const ChangeAvatarApi = '/upms/user/avatar';

export async function updatePersonal(params: any) {
  return request('/upms/user/personal', {
    method: 'PUT',
    data: params,
  });
}

