import Taro from '@tarojs/taro'

export default function uploadFile(
  option: Omit<Taro.uploadFile.Option, 'success' | 'fail'>,
) {
  /** 更新HEADER */
  const header = {
    'Content-Type': 'multipart/form-data',
  }
  option.header = { ...header, ...option.header }
  /** 更新HEADER */
  return Taro.uploadFile({
    ...option,
  })
    .then((res) => {
      Promise.resolve({
        status: res.statusCode || 601,
        code: (res.statusCode || 601).toString(),
        data: res.data || res,
        message: res.errMsg || res.data || '请求失败',
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
