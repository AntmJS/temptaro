/* md5: e69ae573b9cdfe181665a3acbdf112e1 */
/* Rap仓库ModuleId: 503316 */
/* rule设置参考：https://github.com/nuysoft/Mock/wiki/Syntax-Specification */
import { IResponse } from '../constants'

/**
 * 获取角色列表
 * @url /box/common/1.0/role/list
 * @method GET
 * @rapUrl http://rap2.taobao.org/repository/editor?id=299812&mod=503316&itf=2221146
 */
export type getRoleList = {
  request: Record<string, any>
  response: IResponse<
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
 * @rapUrl http://rap2.taobao.org/repository/editor?id=299812&mod=503316&itf=2221147
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

/**
 * 登录接口
 * @url /box/common/1.0/login
 * @method POST
 * @rapUrl http://rap2.taobao.org/repository/editor?id=299812&mod=503316&itf=2221148
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
  response: IResponse<{
    token: string
  }>
}
