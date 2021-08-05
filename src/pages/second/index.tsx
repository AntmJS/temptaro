import { View } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'

import { useEffect } from 'react'
import Com from './com/index'
import './index.less'

export default function Index() {
  useEffect(function () {
    console.info('second load')
    return function () {
      console.info('second page unload')
    }
  }, [])
  useDidShow(function () {
    console.info('second page show')
  })
  useDidHide(function () {
    console.info('second page hide')
  })
  return (
    <View className="pages-second-index">
      <View>Second Page!</View>
      <Com />
    </View>
  )
}
