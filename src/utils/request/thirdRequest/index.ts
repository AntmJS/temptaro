import Taro from '@tarojs/taro'

export default function thirdRequest<
  T extends Omit<Taro.request.Option, 'success' | 'fail'>,
>(
  option: {
    [K in keyof T]: K extends 'url' ? Normal.IHref<T[K]> : T[K]
  },
) {
  return Taro.request({
    ...option,
  })
    .then((res) => {
      Promise.resolve({
        status: res.statusCode || 601,
        header: res.header,
        code: (res.statusCode || 601).toString(),
        data: res.data || res,
        message:
          res.errMsg ||
          (res.data
            ? res.data.error || res.data.error_msg || res.data
            : '请求失败'),
      })
    })
    .catch((error) => {
      Promise.resolve({
        status: 601,
        code: '601',
        data: error,
        message: error.errMsg || '请求失败',
      })
    })
}
