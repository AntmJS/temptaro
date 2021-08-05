// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="node_modules/@tarojs/plugin-platform-weapp/types/shims-weapp.d.ts" />

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development'
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'tt' | 'qq'
    API_ENV: 'stable' | 'real' | 'pre' | 'dev'
    WATCHING: 'true' | 'false'
    DEPLOY_VERSION: string
  }
}

declare namespace Normal {
  type Record<K extends keyof any, T> = {
    [P in K]: T
  }
  type IAnyObject = Record<string, any>
  type INoneEmptyArray<T> = [T, ...T[]]
}
