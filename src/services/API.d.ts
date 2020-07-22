declare namespace API {
  export interface CurrentUser {
    userId: number;
    deptId: number;
    username: string;
    userType: number;
    nickname?: string;
    sex?: string;
    avatar?: string;
    idNum?: string;
    icNum?: string;
    mobile?: string;
    enabled?: string;
    description?: string;
    lastLoginTime?: string;
    createdAt?: string;
    updatedAt?: string;
    createBy?: string;
    modifyBy?: string;
    roles?: string;
  }

  /* export interface CurrentUser {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  } */

  export interface OAuth {
    expiresIn: string | null;
    scope: string | null;
    accessToken: string;
    tokenType: string | null;
    authorities: string[] | null;
    refreshToken: string | null;
  }

  export interface Ret<T = any> {
    code: string;
    msg?: string;
    showType?: number;
    data?: T;
  }

  export interface LoginStateType {
    status?: 'ok' | 'error';
    type?: string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }
}
