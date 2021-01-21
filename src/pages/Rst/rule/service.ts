import { request } from 'umi';
import { RstApi } from '@/apis';
import type { DiningRule } from './data';

export async function list() {
  return request(RstApi.rule);
}

export async function save(data: DiningRule[][]) {
  return request(RstApi.rule, { method: 'POST', data });
}
