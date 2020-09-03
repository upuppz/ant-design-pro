import { request } from 'umi';
import { RstApi } from '@/apis';

export async function manual(data: any) {
  return request(`${RstApi.toll}/manual`, {
    method: 'POST',
    data,
  });
}
