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
  return new Promise((resolve: (res: Normal.IRequestResponse) => void) => {
    Taro.uploadFile({
      ...option,
    })
      .then((res) => {
        resolve({
          status: 200,
          header: res.headersReceived,
          code: '200',
          data: res,
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
