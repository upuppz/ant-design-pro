import request from 'umi-request';

export async function enterpriseInfo() {
  return request('/upms/enterprise');
}

export async function listLoginLog(params: { current: number }) {
  return request('/upms/loginLog', {
    params,
  });
}
