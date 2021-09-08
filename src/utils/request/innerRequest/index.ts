import Taro from '@tarojs/taro'
import type { IPrefix } from '@/constants/domain'

// 基于和服务端的约定，这个方法主要是用来处理返回类型是json的请求，非json类型的自己单独封装
// 格式如下 { statusCode: number, data: { success: boolean, data: any, code: string, message: string } }
export default function innerRequest<
  T extends Omit<Taro.request.Option, 'success' | 'fail'>,
>(
  option: {
    [K in keyof T]: K extends 'url' ? Normal.IPathName<T[K], IPrefix> : T[K]
  },
) {
  option.timeout = option.timeout || 30000
  option.dataType = 'json'
  option.responseType = 'text'
  return new Promise((resolve: (res: Normal.IRequestResponse) => void) => {
    Taro.request({
      ...option,
    })
      .then((res) => {
        // 符合返回的规范才认定为成功
        if (
          res.data &&
          res.data.code &&
          typeof res.data.success === 'boolean'
        ) {
          if (res.data.success) {
            resolve({
              status: 200,
              header: res.header,
              code: res.data.code.toString(),
              data: res.data.data,
            })
          } else {
            resolve({
              status: 200,
              header: res.header,
              code: res.data.code.toString(),
              data: res.data.message,
              message: res.data.message,
            })
          }
        } else {
          if (res.statusCode === 200) res.statusCode = 602
          resolve({
            status: res.statusCode || 601,
            header: res.header,
            code: (res.statusCode || 601).toString(),
            data: res,
            message: '请求错误',
          })
        }
      })
      .catch((error) => {
        resolve({
          status: 601,
          code: '601',
          data: error,
          message: '网络不稳定，请重试',
        })
      })
  })
}
