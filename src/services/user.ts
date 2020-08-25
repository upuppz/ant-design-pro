import { request } from 'umi';
import DEFAULT_AVATAR from '@/assets/default_avatar.png';
import { UpmsApi } from '@/apis';

/* export async function query() {
  return request<API.CurrentUser[]>('/api/users');
} */

export async function queryCurrent() {
  const res = await request<API.Ret<API.CurrentUser>>(UpmsApi.current);
  if (res.data && !res.data?.avatar) {
    res.data.avatar = DEFAULT_AVATAR;
  }
  return res.data;
}

/* export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
} */
