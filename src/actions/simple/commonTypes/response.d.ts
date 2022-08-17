export type IResponseData<T> = {
  /**
   * @rule 15-25
   */
  data: T

  /**
   * 业务状态
   * @value true
   **/
  success: boolean

  /**
   * 错误消息
   * @value '请求成功'
   **/
  message?: string

  /**
   * 状态码
   * @value '200'
   **/
  code: string
}
