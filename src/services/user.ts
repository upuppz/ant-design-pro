import { request } from 'umi';

// export async function query() {
//   return request<API.CurrentUser[]>('/api/users');
// }

export async function getCurrent() {
  return request<API.Ret<API.CurrentUserVO>>('/upms/my');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
