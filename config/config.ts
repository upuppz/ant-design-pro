// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: '数字园区管理系统',
    locale: false,
    ...defaultSettings,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/welcome',
      name: '首页',
      icon: 'BankOutlined',
      component: './Welcome',
    },
    {
      name: 'Account',
      icon: 'user',
      path: '/account',
      hideInMenu: true,
      routes: [
        {
          name: '个人中心',
          icon: 'smile',
          path: '/account/center',
          component: './Account/Center',
        },
        {
          name: '个人设置',
          icon: 'smile',
          path: '/account/settings',
          component: './Account/Settings',
        },
      ],
    },
    {
      name: '财务管理',
      icon: 'table',
      path: '/Finance',
      routes: [
        {
          path: '/Finance/Expenses',
          name: '消费记录',
          component: './Finance/Expenses',
        },
        {
          path: '/Finance/Recharge',
          name: '充值记录',
          component: './Finance/Recharge',
        },
      ],
    },
    // {
    //   path: '/admin',
    //   name: 'admin',
    //   icon: 'crown',
    //   access: 'canAdmin',
    //   component: './Admin',
    //   routes: [
    //     {
    //       path: '/admin/sub-page',
    //       name: 'sub-page',
    //       icon: 'smile',
    //       component: './Welcome',
    //     },
    //   ],
    // },
    {
      path: '/',
      redirect: '/welcome',
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  define: {
    UAA: {
      clientId: 'witpark-personal',
      uri: 'http://account.anzepal.com',
      callback: 'http://witpark.anzepal.com',
      scope: 'personal',
    },
  },
});
