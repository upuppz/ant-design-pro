import { request } from 'umi';

export const ChangeAvatarApi = '/upms/user/avatar';

export async function updatePersonal(params: API.CurrentUserVO) {
  return request<API.Ret<boolean>>('/upms/user/personal', {
    method: 'PUT',
    data: params,
  });
}

export async function restPassword(params: RestPasswordVO) {
  return request<API.Ret<boolean>>('/upms/user/restPassword', {
    method: 'PUT',
    data: params,
  });
}

export async function getSecurity() {
  return request<API.Ret<PersonalSecurityInfo>>('/upms/user/security');
}

