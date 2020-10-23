import { request } from 'umi';

// export async function query() {
//   return request<API.CurrentUser[]>('/api/users');
// }

export async function getCurrent() {
  return request<API.CurrentUser>('/upms/current');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
