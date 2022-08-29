import { useEffect } from 'react'
import { RecoilRoot } from 'recoil'
import {
  useDidShow,
  useDidHide,
  getUpdateManager,
  showModal,
  nextTick,
} from '@tarojs/taro'
import './cache'
import { setSysInfoAsync } from '@/utils'
import './app.less'

export default function App(props: any) {
  // 可以使用所有的 React Hooks
  useEffect(() => {
    console.log('app launch')
    // app 里面发起的请求只能用info，因为不在Unite里面，拦截不了。返回结果自己处理
    // 请求不需要catch，内部封装过了，都会resolve出来，具体看res的类型
    // doSomeFunction({}, 'info').then((res) => {})
    return function () {
      // 这个暂时不确定会不会触发
      console.log('app unlaunch')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 对应 onShow
  useDidShow(() => {
    nextTick(() => {
      setSysInfoAsync()
      if (process.env.TARO_ENV !== 'h5') {
        const updateManager: any = getUpdateManager()
        updateManager.onCheckForUpdate(async (res: any) => {
          if (res.hasUpdate) {
          }
        })
        updateManager.onUpdateReady(() => {
          showModal({
            title: '更新提示',
            content: '新版本已经准备好，立即重启应用？',
            confirmText: '我知道了',
            showCancel: false,
          }).then(function (mRes: any): void {
            if (mRes.confirm) {
              updateManager.applyUpdate()
            }
          })
        })

        updateManager.onUpdateFailed(() => {
          showModal({
            title: '更新失败',
            content: '请删除小程序后重新打开',
            confirmText: '我知道了',
            showCancel: false,
          }).then(function (): void {})
        })
      }
    })
  })

  // 对应 onHide
  useDidHide(() => {
    console.log('app hide')
  })

  return (
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    <RecoilRoot>{props.children}</RecoilRoot>
  )
}
