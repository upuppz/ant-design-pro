import { request } from 'umi';
import { TableListParams } from './data';

const BASE_URL = '/api/upms/wallet';

export async function dtoPage(params?: TableListParams) {
  return request(BASE_URL, {
    params,
  });
}

export async function topUp(params: { targetId: number; fee: number }) {
  return request(`${BASE_URL}/topUp`, {
    method: "POST",
    data: params,
  });
}

export async function like(text: string) {
  return request(`${BASE_URL}/like`, {
    params: { text },
  });
}

export async function manual(data: any) {
  return request(`${BASE_URL}/deduction/manual`, {
    method: "POST",
    data,
  });
}
