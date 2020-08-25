import request from 'umi-request';
import { UpmsApi } from '@/apis';

// ------ DEPT -----
export async function listDeptTree() {
  return request(UpmsApi.dept);
}

// ------ BUILDING -----
export async function listBuildingTree() {
  return request(UpmsApi.building);
}
