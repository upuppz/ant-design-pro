import { request } from 'umi';

export const ChangeAvatarApi = '/api/upms/user/avatar';

export async function updatePersonal(params: API.CurrentUserVO) {
  return request<API.Ret<boolean>>('/api/upms/user/personal', {
    method: 'PUT',
    data: params,
  });
}

export async function restPassword(params: RestPasswordVO) {
  return request<API.Ret<boolean>>('/api/upms/user/restPassword', {
    method: 'PUT',
    data: params,
  });
}

export async function getSecurity() {
  return request<API.Ret<PersonalSecurityInfo>>('/api/upms/user/security');
}

