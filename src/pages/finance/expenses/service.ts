import { request } from 'umi';
import { ItemType, QueryParams } from './data';
import { RequestData } from '@ant-design/pro-table/lib/useFetchData';

export async function query(params: QueryParams):Promise<RequestData<ItemType>> {
  return request(`/upms/walletExpenditure/${params.uid}`, {
    params,
    // @ts-ignore
    skipUnpack: true
  });
}

// 所有额外收费项
export async function extraCost() {
  return request(`/rst/extraCost/all`);
}

