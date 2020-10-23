/*
 * 用户中心 - 显示层对象
 */
export interface UserCenterVO {
  /*
   * 用户名
   */
  username: string;
  /*
   * 头像
   */
  avatar: string;
  /*
   * 描述
   */
  description: string;
  /*
   * 部门名称
   */
  deptName: string;
  /*
   * 所属楼栋列表
   */
  buildings: string;
  /*
   * 用户角色名称列表
   */
  roles: Array<string>;
}

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
