/*
 * 重置用户密码视图
 */
interface RestPasswordVO{
  /*
   * 旧密码
   */
  oldPassword:string;
  /*
   * 新密码
   */
  newPassword:string;
  /*
   * 确认密码
   */
  confirmPassword:string;
}

/*
 * 个人用户安全信息
 */
interface PersonalSecurityInfo{
  /*
   * 密码强度
   */
  passwordStrength:string;
  /*
   * 密保手机
   * 没绑定为空
   */
  mobile:string;
}
