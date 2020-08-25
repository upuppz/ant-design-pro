import request from 'umi-request';
import { RstApi } from '@/apis';
import { DiningRule } from './data';

export async function list() {
  return request(RstApi.rule);
}

export async function save(data: Array<DiningRule>[]) {
  return request.post(RstApi.rule, { data });
}
