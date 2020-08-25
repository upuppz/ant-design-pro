import request from 'umi-request';
import { UpmsApi } from '@/apis';

export async function listLoginLog(params: { current: number }) {
  return request(UpmsApi.loginLog, {
    params,
  });
}
