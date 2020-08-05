import { request } from 'umi';
import { GuestsApi } from '@/apis';
import { TableListParams } from './data';

export async function guests(params?: TableListParams) {
  return request(GuestsApi.guests, {
    params,
  });
}
