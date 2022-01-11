import { View } from '@tarojs/components'
import { useEffect } from 'react'
import { navigateTo, useDidHide, useDidShow } from '@tarojs/taro'
import { Button } from '@antmjs/vantui'
import Container from '@/components/container'
// import Unite from '@antmjs/unite'
import Com from './com/index'

import './index.less'

export default function Index() {
  useEffect(function () {
    console.info('index page load.')
    return function () {
      console.info('index page unload.')
    }
  }, [])
  useDidShow(function () {
    console.info('index page show.')
  })
  useDidHide(function () {
    console.info('index page hide.')
  })

  return (
    <Container>
      <View className="pages-index-index">
        <Button type="primary">这个按钮的颜色已经通过主题定制过了</Button>
        <View>如何更新主题可打开‘src/style/index.less’文件修改</View>
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

// Unite写法，开发更加统一，对于团队成员经验不一致的的情况下，这种方式可能对代码的维护更加直观易懂，同时这种方式配合ts也能增加代码的准确性.
// export default Unite(
//   {
//     state: {},
//     onLoad() {
//       console.info('index page load')
//     },
//     onUnload() {
//       console.info('index page unload')
//     },
//     onShow() {
//       console.info('index page show')
//     },
//     onHide() {
//       console.info('index page hide')
//     },
//   },
//   function ({ state, events, loading, error }, props) {
//     return (
//       <Container>
//         <View className="pages-index-index">
//           <View
//             onClick={() => {
//               navigateTo({ url: '/pages/second/index' })
//             }}
//           >
//             Index Page!
//           </View>
//           <Com />
//         </View>
//       </Container>
//     )
//   },
// )
