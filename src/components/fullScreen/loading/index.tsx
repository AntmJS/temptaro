import { View } from '@tarojs/components'
import { Loading } from '@antmjs/vantui'
import './index.less'
export default function Index() {
  return (
    <View className="loading-box">
      <Loading size="24px">加载中...</Loading>
    </View>
  )
}
