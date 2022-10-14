## 注意事项

* h5环境使用useRouter取到的params需要自行decode，其他环境及this.location内部已decode过了，或者使用hooks.ts内的useRouter
* 如果自己在函数式组件内调用useDidShow，需要在方法内包裹一层nextTick方法，否则Taro的生命周期里面会先执行useDidShow，再执行useEffect(() => {//后执行}, [])，或者使用hooks.ts内的useDidShow

## Taro项目模版

目前支持微信、支付宝、抖音、快手、百度小程序；支持H5

### 代码规范

* 默认集成了 prettier eslint stylelint 解决编码规范问题
* 默认集成了 commitlint commitizen 解决commit规范问题
* 默认集成了 husky lint-staged 解决了commit之前自动校验代码规范

### 开发效率

* 使用Unite库以空间换时间的方案加快研发速度，同时保证TS类型安全
* action层使用@antmjs/api实现根据TS类型自动生成action逻辑，保证类型安全
* action层也可以使用yarn swagger自动根据服务端的swagger api 自动生成action逻辑，保证类型安全
* 自动埋点
* 自动收集异常
* 自动处理异常
* 自动处理pullDownloadRefresh
* 快速使用自定义导航
* 快速支持事件抖动
* 二次封装了部分频繁使用的组件

## 使用

1. 执行yarn rapper自动生成action层代码(需要的话)
2. 执行yarn swagger自动根据服务端swagger api生成action层代码(需要的话)
3. 需要引入iconfont可以执行 yarn iconfont 会自动生成src/iconfont.less
4. yarn
5. yarn watch:weapp(package.json里面填写对应环境的appId)

## 如果需要添加告警机制

1. 将_antm.config.js 改成 antm.config.js
2. 更新antm.config.js里面的webhooks.url的access_token
3. 将.husky/pre-commit里面的npx antm-warning webhooks 注释取消

### 执行顺序 useDidShow 优先于useEffect执行

- app show
- app launch

- index com show
- index page show
- index com load
- index page load

- index com hide
- index page hide

- second com show
- second page show
- second com load
- second page load

- index com show
- index pageshow

- second page unload
- second com unload
