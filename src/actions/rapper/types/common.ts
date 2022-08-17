import { IResponseData } from '../commonTypes/response.d'

/**
 * 获取角色列表
 * @url /box/common/1.0/role/list
 * @method GET
 */
export type getRoleList = {
  request: Record<string, any>
  response: IResponseData<
    Array<{
      /**
       * 名称
       * @value ['角色AA ', '角色BB']
       * @rule +1
       */
      name: string

      /**
       * 描述角色作用
       * @value 1
       * @rule +1
       */
      id: number

      /**
       * 描述角色作用
       * @value ['描述AA', '描述BB']
       * @rule +1
       */
      desc: string
    }>
  >
}

/**
 * 获取腾讯云临时key
 * @url /box/common/1.0/cosKey
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

/**
 * 登录接口
 * @url /box/common/1.0/login
 * @method POST
 */
export type login = {
  request: {
    /**
     * 编码
     * @value  true
     **/
    jsCode: string
    /**
     * iv
     * @value  true
     **/
    iv: string
    /**
     * EncryptedData
     * @value  true
     **/
    userInfoEncryptedData: string
  }
  response: IResponseData<{
    token: string
  }>
}
