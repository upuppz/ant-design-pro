import { request } from 'umi';
import { UpmsApi } from '@/apis';
import { TableListParams, TableListItem } from './data.d';

export async function page(params?: TableListParams) {
  return request(UpmsApi.employees, {
    params,
  });
}

export async function remove(params: (string | number)[]) {
  return request(UpmsApi.employees, {
    method: 'DELETE',
    data: params,
  });
}

export async function create(params: TableListItem) {
  return request(UpmsApi.employees, {
    method: 'POST',
    data: params,
  });
}

export async function update(params: TableListItem) {
  return request(UpmsApi.employees, {
    method: 'PUT',
    data: params,
  });
}

export async function userFaces(uid: number | undefined) {
  return request(`${UpmsApi.employees}/${uid}/faces`);
}
