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
    buildingName?: string;
    deptName?: string;
  }

  export interface OAuth {
    expiresIn: string | null;
    accessToken: string;
    tokenType: string | null;
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
