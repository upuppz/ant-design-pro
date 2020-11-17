import { request } from 'umi';
import {TableListItem} from './data';

const BASE_URL = '/api/upms/dept';

export async function tree() {
  return request(BASE_URL)
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
