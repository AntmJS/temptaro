## Taro项目模版

目前支持微信、支付宝、抖音、快手、百度小程序；支持H5

### 代码规范

* 默认集成了 prettier eslint stylelint 解决编码规范问题
* 默认集成了 commitlint commitizen 解决commit规范问题
* 默认集成了 husky lint-staged 解决了commit之前自动校验代码规范

### 开发效率

* 使用Unite库以空间换时间的方案加快研发速度，同时保证TS类型安全
* action层使用@antmjs/rapper实现根据TS类型自动生成action逻辑，保证类型安全
* action层也可以使用yarn swagger自动根据服务端的swagger api 自动生成action逻辑，保证类型安全
* 自动埋点
* 自动收集异常
* 自动处理异常
* 自动处理pullDownloadRefresh
* 快速使用自定义导航
* 快速支持事件抖动
* 二次封装了部分频繁使用的组件

## 使用

1. 将_antm.config.js 改成 antm.config.js，更新token参数，gitignore去掉antm.config.js(需要的话)
2. 执行yarn rapper自动生成action层代码(需要的话)
3. 执行yarn swagger自动根据服务端swagger api生成action层代码(需要的话)
4. 需要引入iconfont可以执行 yarn iconfont 会自动生成src/iconfont.less
5. yarn
6. yarn watch:weapp(package.json里面填写对应环境的appId)
