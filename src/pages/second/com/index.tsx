import { View } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import { useEffect } from 'react'

import './index.less'

export default function Index() {
  useEffect(function () {
    console.info('second com load')
    return function () {
      console.info('second com unload')
    }
  }, [])
  useDidShow(function () {
    console.info('second com show')
  })
  useDidHide(function () {
    console.info('second com hide')
  })
  return (
    <View className="pages-second-com-index">
      <View>Second Com</View>
    </View>
  )
}
