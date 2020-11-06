import { request } from 'umi';
import { DeviceApi } from '@/apis';
import { TableListItem, TableListParams } from './data';

export async function list(params?: TableListParams) {
  // eslint-disable-next-line no-return-await
  return await request(DeviceApi.tdxFace, {
    params,
  });
}

export async function remove(params: (string | number)[]) {
  return request(DeviceApi.tdxFace, {
    method: 'DELETE',
    data: params,
  });
}

export async function add(data: TableListItem) {
  return request(DeviceApi.tdxFace, {
    method: 'POST',
    data,
  });
}

export async function update(params: TableListItem) {
  return request(DeviceApi.tdxFace, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function test(id: number | undefined) {
  return request(`${DeviceApi.tdxFace}/${id}/test`);
}

export async function syncPerson(id: number | undefined) {
  return request(`${DeviceApi.tdxFace}/${id}/syncPerson`);
}
