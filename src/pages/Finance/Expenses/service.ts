import { request } from 'umi';
import { RequestData } from '@ant-design/pro-table/lib/useFetchData';
import { ItemType, QueryParams } from './data';

export async function query(params: QueryParams):Promise<RequestData<ItemType>> {
  return request('/api/upms/walletExpenditure/my', {
    params,
    // @ts-ignore
    skipUnpack: true
  });
}

// 所有额外收费项
export async function extraCost() {
  return request(`/api/rst/extraCost/all`);
}

