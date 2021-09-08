import Taro from '@tarojs/taro'

export default function thirdRequest<
  T extends Omit<Taro.request.Option, 'success' | 'fail'>,
>(
  option: {
    [K in keyof T]: K extends 'url' ? Normal.IHref<T[K]> : T[K]
  },
) {
  return new Promise((resolve: (res: Normal.IRequestResponse) => void) => {
    Taro.request({
      ...option,
    })
      .then((res) => {
        resolve({
          status: res.statusCode || 601,
          header: res.header,
          code: (res.statusCode || 601).toString(),
          data: res.data || res,
          message: '请求错误',
        })
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
