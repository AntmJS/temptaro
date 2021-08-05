import { View } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import { useEffect } from 'react'

import './index.less'

export default function Index() {
  useEffect(function () {
    console.info('index com load')
    return function () {
      console.info('index com unload')
    }
  }, [])
  useDidShow(function () {
    console.info('index com show')
  })
  useDidHide(function () {
    console.info('index com hide')
  })
  return (
    <View className="pages-index-com-index">
      <View>Index Com</View>
    </View>
  )
}
