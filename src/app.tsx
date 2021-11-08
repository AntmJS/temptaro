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
  // 请求抛出来的异常会带上options
  if (res.options) {
    if (res.options?.proxy === 'error') {
      // monitor在请求侧已经上报过了
      setError({ code: res.code, message: res.message })
    } else {
      showToast({ title: res.message })
    }
  } else {
    // else代表的是语法错误的捕获
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
