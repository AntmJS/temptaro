import { View } from '@tarojs/components'
import { navigateTo, useDidHide, useDidShow } from '@tarojs/taro'
import { useEffect } from 'react'
import Container from '@/components/container'
import Com from './com/index'

import './index.less'

export default function Index() {
  useEffect(function () {
    console.info('index page load')
    return function () {
      console.info('index page unload')
    }
  }, [])
  useDidShow(function () {
    console.info('index page show')
  })
  useDidHide(function () {
    console.info('index page hide')
  })

  return (
    <Container>
      <View className="pages-index-index">
        <View
          onClick={() => {
            navigateTo({ url: '/pages/second/index' })
          }}
        >
          Index Page!
        </View>
        <Com />
      </View>
    </Container>
  )
}
