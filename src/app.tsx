import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { message, Modal, notification, Row } from 'antd';
import { history, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';

import {
  ACCESS_TOKEN,
  AUTHORITIES,
  EXPIRE_TIME,
  REFRESH_TOKEN,
  SCOPE,
  TOKEN_TYPE,
} from '@/configs';
import { CloseCircleOutlined } from '@ant-design/icons';
import { stringify } from 'querystring';
import defaultSettings from '../config/defaultSettings';

export const getInitialState = async (): Promise<{
  currentUser?: API.CurrentUser | undefined;
  settings?: LayoutSettings;
  auth?: API.OAuth;
  hasRoutes?: string[];
}> => {
  // 如果是登录页面，不执行
  // if (history.location.pathname !== '/user/login') {
  if (!history.location.pathname.startsWith('/user')) {
    /* try { */
    // const currentUser = await queryCurrent();
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      const tokenType = localStorage.getItem(TOKEN_TYPE);
      const expiresIn = localStorage.getItem(EXPIRE_TIME);
      const scope = localStorage.getItem(SCOPE);
      const authorities = JSON.parse(localStorage.getItem(AUTHORITIES) as string);
      return {
        // currentUser,
        auth: { accessToken, refreshToken, tokenType, expiresIn, scope },
        hasRoutes: authorities,
        settings: defaultSettings,
      };
    }

    history.push('/user/login');
    /* } catch (error) {
      history.push('/user/login');
    } */
  }
  return {
    settings: defaultSettings,
  };
};

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
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

enum ErrorShowType {
  SILENT = 0,
  SUCCESS_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  INFO_MESSAGE = 3,
  WARN_MESSAGE = 4,
  SUCCESS_NOTIFICATION = 5,
  ERROR_NOTIFICATION = 6,
  INFO_NOTIFICATION = 7,
  WARN_NOTIFICATION = 6,
  REDIRECT = 9,
}

let loginModel: any;

export const request: RequestConfig = {
  errorConfig: {
    adaptor: (resData) => {
      const success = resData?.code ? resData?.code === '00000' : true;
      return { errorMessage: resData?.msg, errorCode: resData?.code, success };
    },
  },
  /**
   * 异常处理程序
   */
  errorHandler: (error: any) => {
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
              localStorage.removeItem(ACCESS_TOKEN);
              localStorage.removeItem(REFRESH_TOKEN);
              localStorage.removeItem(SCOPE);
              localStorage.removeItem(TOKEN_TYPE);
              localStorage.removeItem(EXPIRE_TIME);
              localStorage.removeItem(AUTHORITIES);
              // const redirect = parse(window.location.href.split('?')[1]);
              if (window.location.pathname !== '/user/login') {
                history.replace({
                  pathname: '/user/login',
                  search: stringify({
                    redirect: window.location.href,
                  }),
                });
              }
              loginModel.destroy();
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
      const { res } = ctx;
      // 统一提示处理
      if (res?.showType) {
        const errorMessage = res.msg;
        // const errorCode = res.code;
        const errorData = res.data;
        if (errorData === null || typeof errorData === 'string') {
          switch (res.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.SUCCESS_MESSAGE:
              message.success(errorData || errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorData || errorMessage);
              break;
            case ErrorShowType.INFO_MESSAGE:
              message.info(errorData || errorMessage);
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warn(errorData || errorMessage);
              break;
            case ErrorShowType.SUCCESS_NOTIFICATION:
              notification.success({
                message: errorMessage,
                description: errorData,
              });
              break;
            case ErrorShowType.ERROR_NOTIFICATION:
              notification.error({
                message: errorMessage,
                description: errorData,
              });
              break;
            case ErrorShowType.INFO_NOTIFICATION:
              notification.info({
                message: errorMessage,
                description: errorData,
              });
              break;
            case ErrorShowType.WARN_NOTIFICATION:
              notification.warn({
                message: errorMessage,
                description: errorData,
              });
              break;
            /* case ErrorShowType.REDIRECT:
            // @ts-ignore
            history.push({
              pathname: DEFAULT_ERROR_PAGE,
              query: { errorCode, errorMessage },
            });
            // redirect to error page
            break; */
            default:
              message.error(errorMessage);
              break;
          }
        }
      }
    },
  ],
  requestInterceptors: [
    (url, options) => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      if (accessToken) {
        // eslint-disable-next-line no-param-reassign
        options.headers = { Authorization: `Bearer ${accessToken}` };
      }
      return { url, options };
    },
  ],
};
