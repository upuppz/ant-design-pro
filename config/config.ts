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
    name: '数据园区管理系统',
    logo: '/logo.svg',
    locale: false,
    siderWidth: 228,
  },
  locale: {
    default: 'zh-CN',
    antd: false,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
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
      path: '/',
      redirect: '/welcome',
    },
    {
      path: '/welcome',
      name: '首页',
      icon: 'smile',
      component: './welcome',
      /*access: 'authorityFilter',
        authority: ['ROLE_ADMIN', 'User'],
        */
    },
    {
      name: 'Account',
      icon: 'user',
      path: '/account',
      hideInMenu: true,
      routes: [
        {
          name: 'center',
          icon: 'smile',
          path: '/account/center',
          component: './Account/Center',
        },
      ],
    },
    {
      path: '/finance',
      name: '财务管理',
      icon: 'crown',
      routes: [
        {
          path: '/finance/Wallet',
          name: '钱包列表',
          icon: 'smile',
          component: './Finance/Wallet',
        },
        {
          path: '/finance/Log',
          name: '资金流水',
          icon: 'smile',
          component: './Finance/Log',
        },
        {
          path: '/finance/Income',
          name: '入账记录',
          icon: 'smile',
          component: './Finance/Income',
        },
        {
          path: '/finance/expenditure',
          name: '消费记录',
          icon: 'smile',
          component: './Finance/Expenditure',
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
          component: './Rst/rule',
        },
        {
          name: '人工收费',
          icon: 'smile',
          path: '/rst/manual',
          component: './Rst/manual',
        },
        {
          name: '额外收费项',
          icon: 'smile',
          path: '/rst/extraCost',
          component: './Rst/ExtraCost',
        },
        {
          name: '陌生人记录',
          icon: 'smile',
          path: '/rst/stranger-Log',
          component: './Rst/stranger-Log',
        },
      ],
    },
    // {
    //   path: '/device',
    //   name: '设备管理',
    //   icon: 'crown',
    //   routes: [
    //     {
    //       path: '/device/face',
    //       name: '人脸设备',
    //       icon: 'smile',
    //       component: './Device/Face',
    //     },
    //   ],
    // },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  define: {
    UAA: {
      clientId: 'witpark-manage',
      uri: 'http://account.test.com/',
      callback: 'http://localhost:8000',
      scope: 'manage',
    },
  },
});
