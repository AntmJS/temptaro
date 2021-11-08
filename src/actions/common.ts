import request from '@/utils/request'

export function getConfig() {
  // url的前缀会和constants/domain里面的环境下面的key做ts校验
  // proxy.error: 交给页面自己处理，会抛给error
  // proxy.warning: 直接内部帮你做了toast
  // proxy.info：直接把整个数据返回给请求的await结果
  return request({ url: '/api/xxx', method: 'GET' }, { proxy: 'error' })
}
