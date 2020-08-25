import request from 'umi-request';
import { RstApi } from '@/apis';

export async function manual(data: any) {
  return request.post(`${RstApi.toll}/manual`, {
    data,
  });
}
