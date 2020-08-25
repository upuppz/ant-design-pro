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
  history: {
    type: 'browser',
  },
  layout: {
    name: '智慧食堂管理系统',
    logo: '/logo.svg',
    locale: true,
    siderWidth: 228,
  },
  /*禁用国际化
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },*/
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      component: './user/layout',
      routes: [
        {
          name: '登陆',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: '注册页',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
      ],
    },
    {
      path: '/',
      redirect: '/welcome',
    },
    {
      path: '/welcome',
      name: '欢迎',
      icon: 'smile',
      component: './Welcome',
      /*access: 'authorityFilter',
    authority: ['ROLE_ADMIN', 'user'],*/
    },
    {
      name: 'account',
      icon: 'user',
      path: '/account',
      hideInMenu: true,
      routes: [
        {
          name: 'center',
          icon: 'smile',
          path: '/account/center',
          component: './account/center',
        },
      ],
    },
    {
      path: '/finance',
      name: '财务管理',
      icon: 'crown',
      routes: [
        {
          path: '/finance/wallet',
          name: '钱包列表',
          icon: 'smile',
          component: './finance/wallet',
        },
        {
          path: '/finance/log',
          name: '资金流水',
          icon: 'smile',
          component: './finance/log',
        },
        {
          path: '/finance/income',
          name: '充值记录',
          icon: 'smile',
          component: './finance/income',
        },
        {
          path: '/finance/expenditure',
          name: '消费记录',
          icon: 'smile',
          component: './finance/expenditure',
        },
      ],
    },
    {
      path: '/rst',
      name: '食堂管理',
      icon: 'crown',
      routes: [
        {
          path: '/rst/rule',
          name: '消费规则',
          icon: 'smile',
          component: './rst/rule',
        },
        {
          name: '人工收费',
          icon: 'smile',
          path: '/rst/manual',
          component: './rst/manual',
        },
      ],
    },
    {
      path: '/device',
      name: '设备管理',
      icon: 'crown',
      routes: [
        {
          path: '/device/face',
          name: '人脸设备',
          icon: 'smile',
          component: './device/face',
        },
      ],
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
});
