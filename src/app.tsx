// apiFix放最上方，确保先更新一下
import './apiFix'
import { useDidShow, useDidHide, showToast } from '@tarojs/taro'
import { registerCatch } from '@antmjs/unite'
import React, { useEffect } from 'react'
import { EMlf } from '@antmjs/trace'
import COMMON from '@/constants'
import { Provider } from './store'
import './cache'
import './app.less'
import { monitor } from './trace'

// 使用这套模型的时候才需要Unite({}, ({}) => <View></View>)
registerCatch(function (res, setError) {
  // res.options的时候需要monitor js，这个时候的错误说明是脚本错误，因为请求抛出来的错误会有options参数
  if (res.options) {
    if (res.options?.rule?.proxy === 'state') {
      // monitor在请求侧已经上报过了
      setError({ code: res.code, message: res.message })
    } else {
      showToast({ title: res.message })
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.error('registerCatch', res)
    }
    setError({ code: COMMON.SCRIPT, message: '语法出现了小故障' })
    monitor(EMlf.js, {
      d1: 'registerCatch',
      d2: JSON.stringify(res),
    })
  }
})

interface IProps {
  children: React.ReactNode
}

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
