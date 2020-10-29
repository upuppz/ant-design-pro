import { request } from 'umi';
import { RequestData } from '@ant-design/pro-table/lib/useFetchData';
import { ItemType, QueryParams } from './data';

export async function query(params: QueryParams):Promise<RequestData<ItemType>> {
  return request('/upms/walletIncome/my', {
    params,
    // @ts-ignore
    skipUnpack: true
  });
}
