import { request } from 'umi';
import { RstApi } from '@/apis';
import { TableListParams } from './data.d';

export async function page(params?: TableListParams) {
  return request(RstApi.strangerLog, {
    params,
  });
}
