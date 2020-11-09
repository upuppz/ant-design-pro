import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default {
  siderWidth: 228,
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: false,
  },
  title: '数字园区管理系统',
  pwa: true,
  logo: '/logo.svg',
  iconfontUrl: '',
  "splitMenus": false
} as LayoutSettings & {
  pwa: boolean;
};
