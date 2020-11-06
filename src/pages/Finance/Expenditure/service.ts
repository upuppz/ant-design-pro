import { request } from 'umi';
import { UpmsApi } from '@/apis';
import { TableListParams } from './data';

export async function dtoPage(params?: TableListParams) {
  return request(UpmsApi.walletExpenditure, {
    params,
  });
}

export async function refund(data: { id: number; reason?: string }) {
  return request(`${UpmsApi.walletExpenditure}/${data.id}/refund`, {
    method: 'POST',
    requestType: 'form',
    data,
  });
}
