declare namespace API {
  export interface CurrentUser {
    userId: string,
    userType: number,
    avatar?: string,
    nickname: string,
    description: string,
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
