import { request } from 'umi';
import {TableListParams, TableListItem} from './data';

const BASE_URL = '/api/upms/role';

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

export async function add(params: TableListItem) {
  return request(BASE_URL, {
    method: 'POST',
    data: {
      ...params,
    },
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

export async function simpleList() {
  return request(`${BASE_URL}/list`);
}
