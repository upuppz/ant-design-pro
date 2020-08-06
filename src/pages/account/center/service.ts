import request from 'umi-request';

export async function listLoginLog(params: { current: number }) {
  return request('/upms/loginLog', {
    params,
  });
}
