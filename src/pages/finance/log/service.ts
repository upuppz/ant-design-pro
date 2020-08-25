import request from 'umi-request';
import { UpmsApi } from '@/apis';
import { TableListParams } from './data';

export async function dtoPage(params?: TableListParams) {
  return request(UpmsApi.walletLog, {
    params,
  });
}
