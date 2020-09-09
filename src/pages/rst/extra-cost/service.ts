import { request } from 'umi';
import { RstApi } from '@/apis';
import { TableListItem, TableListParams } from './data.d';

export async function page(params?: TableListParams) {
  return request(RstApi.extraCost, {
    params,
  });
}

export async function remove(params: (string | number)[]) {
  return request(RstApi.extraCost, {
    method: 'DELETE',
    data: params,
  });
}

export async function add(params: TableListItem) {
  return request(RstApi.extraCost, {
    method: 'POST',
    data: params,
  });
}

export async function update(params: TableListItem) {
  return request(RstApi.extraCost, {
    method: 'PUT',
    data: params,
  });
}

// 所有额外收费项
export async function all() {
  return request(`${RstApi.extraCost}/all`);
}
