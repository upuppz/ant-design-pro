declare namespace API {

  /**
   * REST API 返回结果
   */
   interface Ret<T = any> {
    code: string;
    msg?: string;
    showType?: number;
    data?: T;
  }

  /*
 * 当前登陆用户信息视图
 */
   interface CurrentUserVO {
    /*
     * 用户ID
     */
    readonly userId: string;
    /*
     * 用户类型
     */
    readonly userType: number;
    /*
     * 头像
     */
    avatar: string;
    /*
     * 用户姓名
     */
    readonly nickname: string;
    /*
     * 描述
     */
    readonly description: string;
    /*
     * 部门名称
     */
    readonly deptName: string;
    /*
     * 扩展信息
     */
    readonly ext: {
      [key]: string;
      [value]: any;
    };
    /*
     * 所属楼栋列表
     */
    readonly buildingNames: Array<string>;
    /*
     * 用户角色名称列表
     */
    readonly roleNames: Array<string>;
    /*
     * 用户权限列表
     * 角色与权限
     */
    readonly authorities: Array<string>;
  }

  /*
 * bizcharts前端图表控件可视化格式
 */
  interface BizChartsViewableDTO{
    x:string;
    y:any;
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


