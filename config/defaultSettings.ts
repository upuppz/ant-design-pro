import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default {
  siderWidth: 228,
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fixed',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: false,
  },
  title: 'Ant Design Pro',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
} as LayoutSettings & {
  pwa: boolean;
};
