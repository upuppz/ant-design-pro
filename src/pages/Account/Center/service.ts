import { request } from 'umi';
import { UploadFile } from 'antd/lib/upload/interface';
import { LoginLog } from './data';

export const SaveFaceApi = '/api/upms/face';

export async function listLoginLog(params: { current: number }) {
  return request<LoginLog>('/api/upms/loginLog', { params });
}

export async function listFace() {
  return request<API.Ret<UploadFile[]>>('/api/upms/face');
}

export async function removeFace(id: string) {
  return request<API.Ret<boolean>>(`/api/upms/face/${id}`, {
    method: 'DELETE',
  });
}
