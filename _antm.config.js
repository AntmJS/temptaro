module.exports = {
  // 使用这个前要把.husky/pre-commit文件内 npx antm-warning webhooks 注释去掉
  warning: {
    monitorFiles: [
      './package.json',
      './vscode/**',
      './config/**',
      './bable.config.js',
      './eslint.config.js',
      './lint-staged.config.js',
      './stylelint.config.js',
      './tsconig.json',
    ],
    webhooks: {
      // url: 'https://oapi.dingtalk.com/robot/send?access_token=xxx',
      url: '',
    },
  },
}
