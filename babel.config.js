/* eslint-disable import/no-commonjs */
// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    [
      'taro',
      {
        framework: 'react',
        'dynamic-import-node': process.env.TARO_ENV === 'h5',
        ts: true,
        useBuiltIns: 'usage',
      },
    ],
  ],
  plugins: [
    ['lodash'],
    [
      'import',
      {
        libraryName: '@antmjs/vantui',
        libraryDirectory: 'es',
        style: (name) => `${name}/style/less`,
      },
      '@antmjs/vantui',
    ],
  ],
}
