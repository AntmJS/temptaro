import type { IPrefix, IPathName } from '../constants'
import Taro from '@tarojs/taro'

// 基于和服务端的约定，这个方法主要是用来处理返回类型是json的请求，非json类型的自己单独封装
// 格式如下 { statusCode: number, data: { success: boolean, data: any, code: string, message: string } }
export default function innerRequest<
  T extends Omit<Taro.request.Option, 'success' | 'fail'>,
>(option: {
  [K in keyof T]: K extends 'url' ? IPathName<T[K], IPrefix> : T[K]
}) {
  option.timeout = option.timeout || 30000
  option.dataType = 'json'
  option.responseType = 'text'
  return new Promise((resolve: (res: CreateFetchResponse<any>) => void) => {
    Taro.request({
      ...option,
    })
      .then((res) => {
        // 符合返回的规范才认定为成功
        if (
          (res.data.data || res.data.code) &&
          typeof res.data.success === 'boolean'
        ) {
          if (res.data.success) {
            resolve({
              header: res.header,
              code: '200',
              data: res.data.data,
            })
          } else {
            resolve({
              header: res.header,
              code: (res.data.code || 597).toString(),
              data: res.data.msg || res.data.message,
              message: res.data.msg || res.data.message,
            })
          }
        } else {
          if (res.statusCode === 200) res.statusCode = 598
          resolve({
            header: res.header,
            code: (res.statusCode || 599).toString(),
            data: res,
            message: '请求错误',
          })
        }
      })
      .catch((error) => {
        console.log(error)
        resolve({
          code: '499',
          data: error,
          message: '网络不稳定，请重试',
        })
      })
  })
}
