/* eslint-disable @typescript-eslint/ban-ts-comment */
export default defineAppConfig({
  pages: ['pages/index/index', 'pages/second/index'],
  window: {
    // @ts-ignore
    titleBarColor: '#ededed',
    backgroundColor: '#ededed',
    backgroundColorTop: '#ededed',
    backgroundColorBottom: '#ededed',
    // 微信全局设置自定义导航栏
    navigationStyle: 'custom',
    // 支付宝全局设置自定义导航栏
    transparentTitle: 'always',
    titlePenetrate: 'YES',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
  },
})
