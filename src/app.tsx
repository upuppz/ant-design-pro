import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { Modal, notification, Row } from 'antd';
import { RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { ResponseError } from 'umi-request';
import { getValidAccessToken, setAccessToken, gotoUaa, gotoLocal } from '@/utils/auth';
import qs from 'qs';
import { CloseCircleOutlined } from '@ant-design/icons';
import DEFAULT_AVATAR from '@/assets/default_avatar.png';
import { getCurrent } from './services/user';
import defaultSettings from '../config/defaultSettings';

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  fetchUserInfo: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const res = await getCurrent();
      if (res && !res?.avatar) {
        res.avatar = DEFAULT_AVATAR;
      }
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(' ========== fetchUserInfo ========== ');
      // eslint-disable-next-line no-console
      console.error(error);
    }
    return undefined;
  };

  // 授权回调
  if (window.location.pathname === '/' && window.location.hash) {
    const hashAccessToken = qs.parse(window.location.hash.substring(1));
    setAccessToken((hashAccessToken as unknown) as AUTH.OAuth2AccessToken);
    gotoLocal();
    const currentUser = await fetchUserInfo();
    return { currentUser, fetchUserInfo, settings: defaultSettings };
  }

  // 如果已经授权
  const accessToken = getValidAccessToken();
  if (accessToken.valid) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }



  gotoUaa();
  return { fetchUserInfo };
}

export const layout = ({
                         initialState,
                       }: {
  initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    // onPageChange: () => {
    //   const { currentUser } = initialState;
    //   // 如果没有登录，重定向到 login
    //   if (!currentUser) {
    //     gotoUaa();
    //   }
    // },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

let loginModel: any;

export const request: RequestConfig = {
  // prefix: 'http://localhost:10000',
  errorConfig: {
    adaptor: (resData) => {
      const success = resData.code ? resData.code === '00000' : true;
      return success
        ? { success }
        : { errorMessage: resData.msg, errorCode: resData.code, success };
    },
    errorPage: '/exception',
  },
  parseResponse: true,
  /**
   * 异常处理程序
   */
  errorHandler: (error: ResponseError) => {
    const { response } = error;
    if (error.name === 'BizError') {
      const { code, data, msg } = error.data;
      if (code !== '00000') {
        // 全局通用错误处理
        switch (code) {
          // 统一参数校验未通过错误提示
          case 'A0100':
            if (Array.isArray(data)) {
              notification.error({
                message: msg,
                description: [data.map((value) => <Row>{value.message}</Row>)],
              });
            }
            break;
          default:
        }
        // TODO 2020/10/16:showType处理
      }
      throw error;
    } else if (response && response.status) {
      const errorText = codeMessage[response.status] || response.statusText;
      const { status, url } = response;
      if (status === 401) {
        if (loginModel == null) {
          loginModel = Modal.confirm({
            type: 'error',
            icon: React.createElement(CloseCircleOutlined, { twoToneColor: 'red' }),
            title: '认证信息已失效!',
            content: '您可以继续留在当前页面或重新登陆',
            okText: '重新登陆',
            cancelText: '留在当前',
            onOk() {
              gotoUaa();
            },
            onCancel() {
              loginModel.destroy();
              loginModel = null;
            },
          });
        }
      } else {
        notification.error({
          message: `请求错误 ${status}: ${url}`,
          description: errorText,
        });
      }
    } else if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
    return response;
  },
  // 中间件统一提示处理
  middlewares: [
    async (ctx, next) => {
      await next();
      // console.log("middlewares=========")
      // console.log(ctx)
      // console.log(ctx.req)
      // console.log(ctx.res)
      // @ts-ignore
      if (ctx?.req?.options?.skipUnpack) {
        return;
      }
      ctx.res = ctx.res.data;
    },
  ],
  requestInterceptors: [
    (url, _options) => {
      const options = _options || {};
      const token = getValidAccessToken();
      if (token.valid) {
        // @ts-ignore
        options.headers.Authorization = `${token.tokenType} ${token.accessToken}`;
      } else {
        // 凭证已过期，去认证中心获取授权信息
        gotoUaa();
      }
      return { url, options };
    },
  ],
};
