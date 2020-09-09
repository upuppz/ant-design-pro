import { request } from 'umi';
import { UpmsApi } from '@/apis';
import { TableListParams } from './data';

export async function dtoPage(params?: TableListParams) {
  return request(UpmsApi.wallet, {
    params,
  });
}

export async function topUp(params: { targetId: number; fee: number; remark: string }) {
  return request(`${UpmsApi.wallet}/topUp`, {
    method: 'POST',
    data: params,
  });
}

export async function like(text: string) {
  return request(`${UpmsApi.wallet}/like`, {
    params: { text },
  });
}

export async function manual(data: any) {
  return request(`${UpmsApi.wallet}/deduction/manual`, {
    method: 'POST',
    data,
  });
}
