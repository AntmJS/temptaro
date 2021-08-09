import { document } from '@tarojs/runtime'
import Trace, { EAppType, EAppSubType, EGcs } from '@antmjs/trace'

Trace(
  {
    appId: '1',
    appType: process.env.TARO_ENV === 'h5' ? EAppType.browser : EAppType.mini,
    appSubType:
      process.env.TARO_ENV === 'h5'
        ? EAppSubType.browser
        : EAppSubType[process.env.TARO_ENV],
    // 应用内应用版本号
    appSubTypeVersion: '',
    // Taro3需要
    getElementById: document.getElementById,
    getUserId() {
      return new Promise((resolve) => {
        resolve('')
      })
    },
    getGenderId() {
      return new Promise((resolve) => {
        resolve('')
      })
    },
    getLocation() {
      return new Promise((resolve) => {
        resolve({
          gcs: EGcs.gcj02,
          latitude: '',
          longitude: '',
        })
      })
    },
    request(type /** log｜monitor */, data) {
      console.info(type, data)
    },
  },
  // 默认为0。为0的话request返回的data是对象，非0的话返回数组
  { interval: 3000 },
)
