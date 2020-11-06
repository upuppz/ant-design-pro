import { request } from 'umi';

// ------ DEPT -----
export async function listDeptTree() {
  return request('/api/upms/dept');
}

// ------ BUILDING -----
export async function listBuildingTree() {
  return request('/api/upms/building');
}
