import type { IPrefix } from '@/constants/domain'
import DOMAIN from '@/constants/domain'
// 注意：下面三个方法的调用不需要处理reject的场景，内部对请求做了封装，统一抛出到resolve内
import _request from './innerRequest'
import _thirdRequest from './thirdRequest'
import _uploadFile from './uploadFile'

function url(option: Taro.request.Option) {
  const prefix = option.url.split('/')[1] as IPrefix
  const domain = DOMAIN[process.env.API_ENV][prefix]
  // 暂时先不支持缓存，优化的时候再处理吧
  option.url =
    domain +
    option.url +
    (option.url.indexOf('?') > -1 ? `&t=${+new Date()}` : `?t=${+new Date()}`)
}

function header(option: Taro.request.Option) {
  const header = {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'X-M-TOKEN': '',
    'X-M-VERSION': process.env.DEPLOY_VERSION,
    'X-M-TYPE': process.env.TARO_ENV,
  }
  option.header = header
}

// 只处理response.data为json的情况,其他返回都属于异常
export default function <
  T extends Omit<Taro.request.Option, 'success' | 'fail' | 'header'>,
>(
  option: {
    [K in keyof T]: K extends 'url' ? Normal.IPathName<T[K], IPrefix> : T[K]
  },
) {
  url(option)
  header(option)
  _request(option)
}

export function thirdRequest<
  T extends Omit<Taro.request.Option, 'success' | 'fail'>,
>(
  option: {
    [K in keyof T]: K extends 'url' ? Normal.IHref<T[K]> : T[K]
  },
) {
  return _thirdRequest(option)
}

export function uploadFile(
  option: Omit<Taro.uploadFile.Option, 'success' | 'fail' | 'url'>,
) {
  const updateOption: Taro.uploadFile.Option = { ...option, url: '' }
  return _uploadFile(updateOption)
}
