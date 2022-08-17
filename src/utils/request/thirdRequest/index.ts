import type { IHref } from '../constants'
import Taro from '@tarojs/taro'

export default function thirdRequest<
  T extends Omit<Taro.request.Option, 'success' | 'fail'>,
>(option: {
  [K in keyof T]: K extends 'url' ? IHref<T[K]> : T[K]
}) {
  return new Promise((resolve: (res: CreateFetchResponse<any>) => void) => {
    Taro.request({
      ...option,
    })
      .then((res) => {
        if (res.statusCode === 200) {
          resolve({
            header: res.header,
            code: '200',
            data: res.data || res,
          })
        } else {
          resolve({
            header: res.header,
            code: (res.statusCode || 599).toString(),
            data: res.data || res,
            message: '请求错误',
          })
        }
      })
      .catch((error) => {
        resolve({
          code: '499',
          data: error,
          message: '网络不稳定，请重试',
        })
      })
  })
}
