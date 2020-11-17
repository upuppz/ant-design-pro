import { request } from 'umi';
import { TableListParams, TableListItem } from './data';

const BASE_URL = '/api/upms/user';

export async function page(params?: TableListParams) {
  return request(BASE_URL, {
    params,
  });
}

export async function removeUser(params: (string | number)[]) {
  return request(BASE_URL, {
    method: 'DELETE',
    data: params,
  });
}

export async function addUser(params: TableListItem) {
  return request(BASE_URL, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateUser(params: TableListItem) {
  return request(BASE_URL, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function faces(uid: number | undefined) {
  return request(`${BASE_URL}/${uid}/faces`);
}
