import { request } from 'umi';
import { TableListItem } from './data';

const BASE_URL = '/api/upms/building';

export async function tree() {
  return request(BASE_URL);
}

export async function get(id: string | undefined) {
  return request(`${BASE_URL}/${id}`);
}

export async function remove(id: string | number) {
  return request(`${BASE_URL}/${id}`,{
    method: 'DELETE',
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
