## Taro项目模版

目前支持微信、支付宝、抖音、快手小程序

### 代码规范

* 默认集成了 prettier eslint stylelint 解决编码规范问题
* 默认集成了 commitlint commitizen 解决commit规范问题
* 默认集成了 husky lint-staged 解决了commit之前自动校验代码规范

### 开发效率

* 使用Unite库以空间换时间的方案加快研发速度，同时保证TS类型安全
* action层引入@antmjs/rapper方案确保响应结果保持TS类型安全，同时默认支持mock
* 自动埋点
* 自动收集异常
* 自动处理异常
* 自动处理pullDownloadRefresh
* 快速使用自定义导航
* 快速支持事件抖动

## 使用

1. 将_antm.config.js 改成 antm.config.js，更新一些参数，gitignore去掉anmt.config.js
2. 编辑actions/types目录，更新后执行yarn rapper
3. 需要引入iconfont可以执行 yarn iconfont 会自动生成src/iconfont.less
4. yarn
5. yarn husky install 
6. yarn watch:weapp