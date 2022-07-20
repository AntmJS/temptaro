import { document } from '@tarojs/runtime'
// import { request as TaroRequest } from '@tarojs/taro'
import Trace, {
  EAppType,
  EAppSubType,
  EGcs /* utf8ToBytes */,
} from '@antmjs/trace'
import { cacheGetSync } from './cache'

const { exposure, log, monitor } = Trace(
  {
    appId: '1',
    appType: process.env.TARO_ENV === 'h5' ? EAppType.browser : EAppType.mini,
    appSubType:
      process.env.TARO_ENV === 'h5'
        ? EAppSubType.browser
        : EAppSubType[process.env.TARO_ENV],
    // 应用内应用版本号
    appSubTypeVersion: process.env.DEPLOY_VERSION,
    // Taro3需要
    getElementById: document.getElementById,
    getUserId() {
      return new Promise((resolve) => {
        const userId = cacheGetSync('userId')
        resolve(userId || '')
      })
    },
    getGenderId() {
      return new Promise((resolve) => {
        resolve('')
      })
    },
    getLocation() {
      return new Promise((resolve) => {
        const location = cacheGetSync('location')
        resolve({
          gcs: EGcs.gcj02,
          latitude: location?.latitude || '',
          longitude: location?.longitude || '',
        })
      })
    },
    request(type /** log｜monitor */, data) {
      data = (data as any[])?.filter(
        (item) =>
          !/(redirectTo:fail)|(hideLoading:fail)|(cancel)/.test(item.d1),
      )
      if (process.env.API_ENV === 'real' && data?.length > 0) {
        console.info(type, data)
        //   const body = {
        //     __topic__: '1', // appId
        //     __logs__: data,
        //   }
        //   TaroRequest({
        //     url:
        //       type === 'log'
        //         ? 'https://logstorename.cn-hangzhou.log.aliyuncs.com/logstores/trace/track'
        //         : 'https://logstorename.cn-hangzhou.log.aliyuncs.com/logstores/monitor/track',
        //     method: 'POST',
        //     header: {
        //       'x-log-apiversion': '0.6.0',
        //       'x-log-bodyrawsize': `${utf8ToBytes(JSON.stringify(body)).length}`,
        //     },
        //     responseType: 'text',
        //     dataType: '其他',
        //     data: body,
        //     timeout: 10000,
        //     success() {},
        //     fail() {},
        //   })
      } else {
        console.info(type, data)
      }
    },
  },
  // 默认为0。为0的话request返回的data是对象，非0的话返回数组
  { interval: 3000 },
)

export { exposure, log, monitor }
