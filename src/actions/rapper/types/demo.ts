/* md5: b984dabef0e59fa90ab6ca805fdbca2c */
/* Rap仓库ModuleId: 512128 */
import { IResponse } from '../commonTypes/response.d'

/**
 * 获取腾讯云临时key
 * @url /box/demo/1.0/cosKey
 * @method GET
 * @rapUrl http://rap2.taobao.org/repository/editor?id=299812&mod=512128&itf=2270115
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
