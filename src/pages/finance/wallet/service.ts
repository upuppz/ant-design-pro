import request from 'umi-request';
import { UpmsApi } from '@/apis';
import { TableListParams } from './data';

export async function dtoPage(params?: TableListParams) {
  return request(UpmsApi.wallet, {
    params,
  });
}

export async function topUp(params: { targetId: number; fee: number }) {
  return request.post(`${UpmsApi.wallet}/topUp`, {
    data: params,
  });
}

export async function like(text: string) {
  return request(`${UpmsApi.wallet}/like`, {
    params: { text },
  });
}

export async function manual(data: any) {
  return request.post(`${UpmsApi.wallet}/deduction/manual`, {
    data,
  });
}
