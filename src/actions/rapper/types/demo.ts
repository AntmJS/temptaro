import { IResponseData } from '../commonTypes/response.d'

/**
 * 获取腾讯云临时key
 * @url /box/demo/1.0/cosKey
 * @method GET
 */
export type getCosKey = {
  request: Record<string, any>
  response: IResponseData<{
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
