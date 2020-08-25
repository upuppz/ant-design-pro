import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox, message } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
import { LoginParamsType, fakeAccountLogin } from '@/services/login';
import {
  ACCESS_TOKEN,
  AUTHORITIES,
  EXPIRE_TIME,
  REFRESH_TOKEN,
  SCOPE,
  TOKEN_TYPE,
} from '@/configs';
import LoginFrom from './components/Login';
import styles from './style.less';

const { Tab, Username, Password, Mobile, Captcha, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#') + 1);
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  window.location.href = urlParams.href.split(urlParams.pathname)[0] + (redirect || '/');
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [submitting, setSubmitting] = useState(false);

  const { refresh } = useModel('@@initialState');
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const ret = await fakeAccountLogin({ ...values, type });
      if (ret.code === '00000') {
        const msg = ret.data;
        message.success('登录成功！');
        localStorage.setItem(ACCESS_TOKEN, msg[ACCESS_TOKEN]);
        localStorage.setItem(REFRESH_TOKEN, msg[REFRESH_TOKEN]);
        localStorage.setItem(SCOPE, msg[SCOPE]);
        localStorage.setItem(TOKEN_TYPE, msg[TOKEN_TYPE]);
        const current = new Date();
        const expireTime = current.setTime(current.getTime() + 1000 * msg[EXPIRE_TIME]);
        localStorage.setItem(EXPIRE_TIME, expireTime.toString());
        localStorage.setItem(AUTHORITIES, JSON.stringify(msg[AUTHORITIES]));
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState({ status: 'error', type });
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };

  const { status, type: loginType } = userLoginState;

  return (
    <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
      <Tab key="account" tab="账户密码登录">
        {status === 'error' && loginType === 'account' && !submitting && (
          <LoginMessage content="账户或密码错误" />
        )}

        <Username
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <Password
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
      </Tab>
      <Tab key="mobile" tab="手机号登录">
        {status === 'error' && loginType === 'mobile' && !submitting && (
          <LoginMessage content="验证码错误" />
        )}
        <Mobile
          name="mobile"
          placeholder="手机号"
          rules={[
            {
              required: true,
              message: '请输入手机号！',
            },
            {
              pattern: /^1\d{10}$/,
              message: '手机号格式错误！',
            },
          ]}
        />
        <Captcha
          name="captcha"
          placeholder="验证码"
          countDown={120}
          getCaptchaButtonText=""
          getCaptchaSecondText="秒"
          rules={[
            {
              required: true,
              message: '请输入验证码！',
            },
          ]}
        />
      </Tab>
      <div>
        <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
          自动登录
        </Checkbox>
        <a
          style={{
            float: 'right',
          }}
        >
          忘记密码
        </a>
      </div>
      <Submit loading={submitting}>登录</Submit>
      <div className={styles.other}>
        其他登录方式
        <AlipayCircleOutlined className={styles.icon} />
        <TaobaoCircleOutlined className={styles.icon} />
        <WeiboCircleOutlined className={styles.icon} />
        {/* <Link className={styles.register} to="/user/register">
          注册账户
        </Link> */}
      </div>
    </LoginFrom>
  );
};

export default Login;
