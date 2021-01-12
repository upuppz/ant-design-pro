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
    name: '数字园区管理系统',
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
      component: './Welcome',
      access: 'authorityFilter',
      authority: ['ROLE_SUPER', 'ROLE_RSTADMIN'],
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
      path: '/upms',
      name: '用户管理',
      icon: 'crown',
      routes: [
        {
          path: '/upms/user',
          name: '用户列表',
          icon: 'smile',
          component: './Upms/User',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER', 'ROLE_RSTADMIN'],
        },
        {
          path: '/upms/building',
          name: '楼栋列表',
          icon: 'smile',
          component: './Upms/Building',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER']
        },
        {
          path: '/upms/dept',
          name: '组织列表',
          icon: 'smile',
          component: './Upms/Dept',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER']
        },
        {
          path: '/upms/role',
          name: '角色列表',
          icon: 'smile',
          component: './Upms/Role',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER']
        },
        {
          path: '/upms/permission',
          name: '权限列表',
          icon: 'smile',
          component: './Upms/Permission',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER']
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
          component: './Finance/Wallet',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER', 'ROLE_RSTADMIN'],
        },
        {
          path: '/finance/log',
          name: '资金流水',
          icon: 'smile',
          component: './Finance/Log',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER', 'ROLE_RSTADMIN'],
        },
        {
          path: '/finance/income',
          name: '入账记录',
          icon: 'smile',
          component: './Finance/Income',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER', 'ROLE_RSTADMIN'],
        },
        {
          path: '/finance/expenditure',
          name: '消费记录',
          icon: 'smile',
          component: './Finance/Expenditure',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER', 'ROLE_RSTADMIN'],
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
          access: 'authorityFilter',
          authority: ['ROLE_SUPER', 'ROLE_RSTADMIN'],
        },
        {
          name: '人工收费',
          icon: 'smile',
          path: '/rst/manual',
          component: './Rst/manual',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER', 'ROLE_RSTADMIN'],
        },
        {
          name: '额外收费项',
          icon: 'smile',
          path: '/rst/extraCost',
          component: './Rst/ExtraCost',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER', 'ROLE_RSTADMIN'],
        },
        {
          name: '陌生人记录',
          icon: 'smile',
          path: '/rst/stranger-Log',
          component: './Rst/stranger-Log',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER', 'ROLE_RSTADMIN'],
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
          component: './Device/Face',
          access: 'authorityFilter',
          authority: ['ROLE_SUPER', 'ROLE_RSTADMIN'],
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
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  define: {
    UAA: {
      clientId: 'witpark-manage',
      uri: 'http://sso.dsp.thspsp.com',
      devUri: 'http://127.0.0.1:10002',
      callback: 'http://dmp.dsp.thspsp.com',
      devCallback: 'http://localhost:8000',
      scope: 'manage',
    },
  },
});
