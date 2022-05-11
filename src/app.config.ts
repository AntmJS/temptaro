/* eslint-disable @typescript-eslint/ban-ts-comment */
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/pagination/index',
    'pages/tabAndSearchPagination/index',
  ],
  window: {
    // @ts-ignore
    titleBarColor: '#ededed',
    backgroundColor: '#ededed',
    backgroundColorTop: '#ededed',
    backgroundColorBottom: '#ededed',
    backgroundImageColor: '#ededed',
    // 微信全局设置自定义导航栏
    navigationStyle: 'custom',
    // 支付宝全局设置自定义导航栏
    transparentTitle: 'always',
    titlePenetrate: 'YES',
  },
})
