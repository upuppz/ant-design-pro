import { request } from 'umi';
import { RequestData } from '@ant-design/pro-table/lib/useFetchData';
import { ItemType, QueryParams } from './data';

export async function query(params: QueryParams):Promise<RequestData<ItemType>> {
  return request(`/upms/walletIncome/${params.uid}`, {
    params,
    // @ts-ignore
    skipUnpack: true
  });
}
