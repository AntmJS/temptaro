import COS from 'cos-wx-sdk-v5'
import { getCosKeyDemo } from '@/actions/simple/demo'
import { randomNum } from '@/utils'

export default function (filePath: any, filename: string, index?: number) {
  return new Promise(
    (resolve: (res: CreateFetchResponse<any> & { index?: number }) => void) => {
      const cos = new COS({
        // ForcePathStyle: true, // 如果使用了很多存储桶，可以通过打开后缀式，减少配置白名单域名数量，请求时会用地域域名
        getAuthorization: async function (
          _options: any,
          callback: (...prams: any) => void,
        ) {
          // 异步获取临时密钥
          const {
            tmpSecretId,
            tmpSecretKey,
            sessionToken,
            startTime,
            expiredTime,
          } = await getCosKeyDemo({})
          callback({
            TmpSecretId: tmpSecretId,
            TmpSecretKey: tmpSecretKey,
            XCosSecurityToken: sessionToken,
            // 建议返回服务器时间作为签名的开始时间，避免客户浏览器本地时间偏差过大导致签名错误
            StartTime: startTime, // 时间戳，单位秒，如：1580000000
            ExpiredTime: expiredTime, // 时间戳，单位秒，如：1580000900
          })
        },
      })
      const date = new Date()
      const folder = `${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${randomNum(
        10000,
        100000,
      )}`
      cos.postObject(
        {
          Bucket: '',
          Region: '',
          Key: (`img/${process.env.API_ENV}/${folder}/` + filename).replace(
            /[\u4E00-\u9FFF\u0020]/g,
            '',
          ),
          FilePath: filePath,
        },
        function (error: any, data: any) {
          if (data)
            resolve({
              code: '200',
              data: data,
              message: '',
              index,
            })
          if (error)
            resolve({
              code: '599',
              data: error,
              message: '请求异常',
              index,
            })
        },
      )
    },
  )
}
