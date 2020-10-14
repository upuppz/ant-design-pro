/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/fake_chart_data': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/api/auth/': {
      target: 'http://localhost:10001',
      changeOrigin: true,
      pathRewrite: { '^/api/auth': '' },
    },
    '/api/upms/': {
      target: 'http://localhost:10002',
      changeOrigin: true,
      pathRewrite: { '^/api/upms': '' },
    },
    '/api/guest/': {
      target: 'http://localhost:10003',
      changeOrigin: true,
      pathRewrite: { '^/api/guest': '' },
    },
    '/api/device/': {
      target: 'http://localhost:10004',
      changeOrigin: true,
      pathRewrite: { '^/api/device': '' },
    },
    '/api/rst/': {
      target: 'http://localhost:10005',
      changeOrigin: true,
      pathRewrite: { '^/api/rst': '' },
    },
  },
  test: {
    '/api/': {
      target: 'http://localhost:10000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
