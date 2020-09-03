import { request } from 'umi';
import { UpmsApi } from '@/apis';
import { TableListParams } from './data';

export async function dtoPage(params?: TableListParams) {
  return request(UpmsApi.walletExpenditure, {
    params,
  });
}
