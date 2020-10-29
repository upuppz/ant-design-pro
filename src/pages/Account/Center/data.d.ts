
/*
 * 登录日志实体类
 */
export interface LoginLog {
  /*
   * id
   */
  id: number;
  /*
   * 用户ID
   */
  userId: number;
  /*
   * 登录地点
   */
  location: string;
  /*
   * IP地址
   */
  ip: string;
  /*
   * 操作系统
   */
  system: string;
  /*
   * 浏览器
   */
  browser: string;
  /*
   * 登陆状态(0=成功,1=用户名或密码错误,9=其它错误)
   */
  status: number;
  /*
   * 登录时间
   */
  createdAt: Date;
}


export interface ListItemDataType {
  id: string;
  owner: string;
  title: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success';
  percent: number;
  logo: string;
  href: string;
  body?: any;
  updatedAt: string;
  createdAt: string;
  subDescription: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: any[];
}
