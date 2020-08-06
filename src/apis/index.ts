/**
 * 验证功能相关
 */
export const AuthApi = {
  /**
   * 登录API
   */
  login: '/auth/oauth/token',

  /**
   * 登出API
   */
  logout: '/auth/logout',
};

/**
 * 用户权限管理相关
 */
export const UpmsApi = {
  /**
   * 管理端用户API
   */
  enterprise: '/upms/enterprise',

  /**
   * 企业员工API
   */
  employees: '/upms/enterprise/employees',
  /**
   * 企业员工API
   */
  uploadAvatar: '/upms/enterprise/upload',
};

/**
 * 用户权限管理相关
 */
export const GuestsApi = {
  /**
   * 企业API
   */
  employees: '/guests/enterprise',

  /**
   * 企业API
   */
  guests: '/guests/enterprise/guests',
};
