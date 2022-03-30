/* md5: b61b8d8382d7063b619091c34c96c784 */
/* Rap仓库ModuleId: 504719 */
/* rule设置参考：https://github.com/nuysoft/Mock/wiki/Syntax-Specification */
import { IResponse } from '../constants'

/**
 * 获取腾讯云临时key
 * @url /box/demo/1.0/cosKey
 * @method GET
 * @rapUrl http://rap2.taobao.org/repository/editor?id=299812&mod=504719&itf=2228962
 */
export type getCosKey = {
  request: Record<string, any>
  response: IResponse<{
    /**
     * id
     * @value  'dsafasdfasd'
     **/
    tmpSecretId: string
    /**
     * key
     * @value  'adfadfasdfasf'
     **/
    tmpSecretKey: string
    /**
     * token
     * @value  'asdfasdf'
     **/
    sessionToken: string
    /**
     * 开始时间
     * @value  1580000000
     **/
    startTime: number
    /**
     * 过期时间
     * @value  1580000000
     **/
    expiredTime: number
  }>
}
