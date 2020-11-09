import { history } from 'umi';

// ======== OAuth2 localStorage name ============
/**
 * 令牌
 */
export const ACCESS_TOKEN: string = 'access_token';
/**
 * 令牌类型
 */
const TOKEN_TYPE: string = 'token_type';
/**
 * 刷新令牌
 */
// const REFRESH_TOKEN: string = 'refresh_token';
/**
 * 过期时间戳
 */
const EXPIRE_TIME: string = 'expires_time';
/**
 * 过期秒数
 */
const EXPIRE_IN: string = 'expires_in';
/**
 * 令牌权限范围
 */
// const SCOPE: string = 'scope';

// ======= OAuth2 additionalInformation localStorage name ==========
/**
 * 权限
 */
// const AUTHORITIES: string = 'authorities';

// ====== local localStorage name ===========
/**
 * 登陆成功后的目地路径
 */
const GOTO: string = 'goto';

export function getValidAccessToken(): AUTH.OAuth2AccessToken {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  // const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  const tokenType = localStorage.getItem(TOKEN_TYPE);
  const expiresTimeStr = localStorage.getItem(EXPIRE_TIME);
  const time = typeof expiresTimeStr === 'string' ? parseInt(expiresTimeStr, 10) : 0;
  const expiresTime = new Date(time);
  // const scope = localStorage.getItem(SCOPE);
  const valid = accessToken != null && time >= new Date().getTime();
  return {
    accessToken,
    // refreshToken,
    tokenType,
    expiresTime,
    // scope,
    valid,
  };
}

export function setAccessToken(model: AUTH.OAuth2AccessToken): void {
  if (model[ACCESS_TOKEN]) localStorage.setItem(ACCESS_TOKEN, model[ACCESS_TOKEN]);
  // if (model[REFRESH_TOKEN]) localStorage.setItem(REFRESH_TOKEN, model[REFRESH_TOKEN]);
  if (model[TOKEN_TYPE]) localStorage.setItem(TOKEN_TYPE, model[TOKEN_TYPE]);
  const expireIn = model[EXPIRE_IN];
  if (expireIn) {
    localStorage.setItem(EXPIRE_TIME, ((1000 * expireIn) + new Date().getTime()).toString());
    localStorage.setItem(EXPIRE_IN, expireIn);
  }
  // if (model[SCOPE]) localStorage.setItem(SCOPE, model[SCOPE]);
}

export function gotoUaa(): void {
  // localStorage.clear();
  localStorage.setItem(
    GOTO,
    window.location.pathname + window.location.search + window.location.hash,
  );
  // @ts-ignore
  window.location.href = `${UAA.uri}/oauth/authorize?client_id=${UAA.clientId}&redirect_uri=${UAA.callback}&response_type=token&scope=${UAA.scope}`;
}

/**
 * 退出登录，并且将当前的 url 保存
 */
export function loginOut(): void {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  // @ts-ignore
  window.location.href = `${UAA.uri}logout?${ACCESS_TOKEN}=${accessToken}`;
  localStorage.clear();
};

export function gotoLocal(): void {
  const goto = localStorage.getItem(GOTO);
  if (goto && history.location.pathname !== goto) {
    history.push(goto);
  }
}
