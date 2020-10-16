declare namespace AUTH {

  export interface OAuth2AccessToken {
    accessToken: string | null,
    tokenType: string | null,
    // refreshToken: string | null,
    expiresTime: Date | null,
    // scope: string | null,
    /**
     * Token是否有效
     */
    valid: boolean,
  }

  // export interface Ret<T = any> {
  //   code: string;
  //   msg?: string;
  //   showType?: number;
  //   data?: T;
  // }

}
