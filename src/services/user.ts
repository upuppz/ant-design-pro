import { request } from 'umi';

// export async function query() {
//   return request<API.CurrentUser[]>('/api/users');
// }

export async function getCurrent() {
  return request<API.Ret<API.CurrentUserVO>>('/api/upms/my?userType=0');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
