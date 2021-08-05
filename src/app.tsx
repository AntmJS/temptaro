import Trace, { EAppType, EAppSubType, EGcs } from '@antmjs/trace'
import { document } from '@tarojs/runtime'
import { useDidShow, useDidHide } from '@tarojs/taro'
import React, { useEffect } from 'react'
import { Provider } from './store'
import './cache'
import './app.less'

interface IProps {
  children: React.ReactNode
}

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

export default function App(props: IProps) {
  // 可以使用所有的 React Hooks
  useEffect(() => {
    console.log('app launch')
    return function () {
      // 这个暂时不确定会不会触发
      console.log('app unlaunch')
    }
  }, [])

  // 对应 onShow
  useDidShow(() => {
    console.log('app show')
  })

  // 对应 onHide
  useDidHide(() => {
    console.log('app hide')
  })

  return (
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    <Provider>
      {/* props.children 是将要被渲染的页面 */}
      {props.children}
    </Provider>
  )
}
