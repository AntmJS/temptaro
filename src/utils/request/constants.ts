export type TProxy = 'warning' | 'info'
export type IPrefix = keyof typeof domain.real

export type IPathName<
  T extends string,
  K extends string,
> = T extends `/${K}${infer R}` ? `/${K}${R}` : never

export type IHref<T extends string> = T extends `https://${infer R}`
  ? `https://${R}`
  : T extends `http://${infer R}`
  ? `http://${R}`
  : never

/************************************************** */
/** 上半部分类型，下半部分逻辑 */
/************************************************** */

const domain = {
  real: {
    box: 'http://rap2api.taobao.org/app/mock/299812',
  },
  pre: {
    box: 'http://rap2api.taobao.org/app/mock/299812',
  },
  stable: {
    box: 'http://rap2api.taobao.org/app/mock/299812',
  },
  dev: {
    box: 'http://rap2api.taobao.org/app/mock/299812',
    pet: 'http://swagger.io',
  },
}

export default domain
