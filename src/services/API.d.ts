declare namespace API {

  export interface Ret<T = any> {
    code: string;
    msg?: string;
    showType?: number;
    data?: T;
  }

  export interface CurrentUser {
    userId: number,
    userType: number,
    nickname: string,
    description: string,
    avatar?: string,
    ext: {
      key: string;
      label: string;
    },
    authorities: Array<string>
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
