import { request } from 'umi';
import { TableListItem, TableListParams } from './data';


export const BASE_URL = '/api/device/tdxFace';

export async function list(params?: TableListParams) {
  return request(BASE_URL, {
    params,
  });
}

export async function remove(params: (string | number)[]) {
  return request(BASE_URL, {
    method: 'DELETE',
    data: params,
  });
}

export async function add(data: TableListItem) {
  return request(BASE_URL, {
    method: 'POST',
    data,
  });
}

export async function update(params: TableListItem) {
  return request(BASE_URL, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function test(id: number | undefined) {
  return request(`${BASE_URL}/${id}/test`);
}

export async function syncPerson(id: number | undefined) {
  return request(`${BASE_URL}/${id}/syncPerson`);
}
