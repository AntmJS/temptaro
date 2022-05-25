/* eslint-disable @typescript-eslint/no-var-requires */
const { defineConfig } = require('@antmjs/rapper')

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
  rapper: defineConfig({
    rapper: {
      // 拉取接口地址
      apiUrl: 'http://rap2api.taobao.org',
      rapUrl: 'http://rap2.taobao.org',
      // 生成的文件目录地址
      rapperPath: './src/actions/rapper',
      // rap项目id，自己输入
      repositoryId: 88888,
      // xxx自己登陆 http://rap2api.taobao.org 里面找cookie
      tokenCookie: 'koa.sid=xxx; koa.sid.sig=xxx',
    },
    download: {
      //请求 function 模板
      requestFunc(params) {
        function getFnName(url) {
          const fnName = url.match(/\/([.a-z0-9_-]+)\/([a-z0-9_-]+$)/i)
          if (fnName && fnName.length === 3) {
            if (/^\d+\.\d+$/.test(fnName[1])) {
              return fnName[2]
            }
            return (
              fnName[1] + fnName[2].charAt(0).toUpperCase() + fnName[2].slice(1)
            )
          }
          return null
        }
        const fnName = getFnName(params.requestUrl)
        if (!fnName) {
          throw new TypeError('接口路径不对,请修改合规')
        }
        const camelCaseName = `${fnName.charAt(0).toUpperCase()}${fnName.slice(
          1,
        )}`
        const reqTypeName = `IReq${camelCaseName}`
        const resTypeName = `IRes${camelCaseName}`
        return {
          reqTypeName,
          resTypeName,
          funcMain: `
              /**
               * 接口名：${params.funcDescription}
               * Rap 地址: ${params.rapUrl}?id=${params.repositoryId}&mod=${params.moduleId}&itf=${params.interfaceId}
               */
              export const ${fnName} = createFetch<${reqTypeName}, ${resTypeName}>('${params.requestUrl}', '${params.requestMethod}')
              `,
        }
      },
      //请求 函数共工头（用于引入函数
      requestModule(params) {
        return {
          fileName: params.moduleDescription,
          moduleHeader: `
// @ts-nocheck

import { createFetch } from '@/utils/request'
`,
        }
      },
    },
    upload: {
      mode: 'type',
      // fileRegex 将尝试使用绝对文件路径检测测试文件
      // (/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$
      fileRegex: 'src/actions/rapper/types',

      formatFunc(params) {
        // createFetch<IReqGoodsQbf, IResGoodsQbf>('/c/api/1.0/approve/goods/qbf', 'GET')
        // export const goodsQbf = createFetch<IGoodsQbf['request'], IGoodsQbf['response']>("/c/api/1.0/approve/goods/qbf", "GET");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, reqTypeName, resTypeName, reqUrl, reqMethod] =
          params.body.match(
            /createFetch<([\w\[\]'"]+),\s+([\w\[\]'"]+)>\(['"]([\s\S]+)['"], ['"]([a-zA-Z]+)['"]\)/,
          ) || []
        if (!reqTypeName || !resTypeName) {
          return null
        }
        const matchInterfaceId = params.comment.match(
          /http:\/\/rap2\.tao[\s\S]+&itf=(\d+)/,
        )
        return {
          resTypeName,
          reqTypeName,
          // 如果返回 null '' undefined 0 等 就会被认为是新的接口，会触发上rap操作
          interfaceId: matchInterfaceId ? Number(matchInterfaceId[1]) : null,
          reqUrl: reqUrl,
          reqMethod: reqMethod,
        }
      },
      // webpack 别名 alias 绝对路径
      alias: {
        '@': './src',
      },
    },
    isUpload: true,
  }),
}
