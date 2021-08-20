import Taro from '@tarojs/taro'

// 解决H5路由返回的path和小程序不一致的问题
const userRouterBak = Taro.useRouter
Taro.useRouter = function useRouter<
  TParams extends Partial<Record<string, string>> = Partial<
    Record<string, string>
  >,
>(dynamic?: boolean): Taro.RouterInfo<TParams> {
  const route: Taro.RouterInfo<TParams> = userRouterBak(dynamic)
  if (process.env.TARO_ENV === 'h5') {
    route.path = route.path.slice(1).split('?')[0]!
  }
  return route
}

const canIUseBak = Taro.canIUse
Taro.canIUse = function canIUse(schema: string): boolean {
  if (process.env.TARO_ENV !== 'h5') {
    return canIUseBak(schema)
  }
  return false
}
