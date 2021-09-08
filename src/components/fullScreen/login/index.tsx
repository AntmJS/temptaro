import type GlobalState from '@antmjs/global-state'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useEffect, useState } from 'react'

interface IProps {
  globalFetchError?: Record<string, GlobalState.IError>
  pageError?: { code: string; message: string }
  setPageError?: React.Dispatch<React.SetStateAction<undefined>>
}

export default function Index(props: IProps) {
  // 成功之后下拉刷新 并且 有globalError调用globalFetch clearGlobalError clearPageError
  console.log(props)
  const [isShowMask, setShowMask] = useState(false)
  useEffect(function () {
    Taro.nextTick(function () {
      setShowMask(true)
    })
  }, [])
  return (
    <View
      id="fullscreen"
      className={`fullscreen ${isShowMask ? 'fullscreen-slideup-show' : ''}`}
      onClick={() => {
        setShowMask(false)
        // 触发注释的部分
      }}
    >
      login
    </View>
  )
}
