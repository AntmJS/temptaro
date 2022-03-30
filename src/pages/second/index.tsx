import { navigateTo } from '@tarojs/taro'
import { Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Container from '@/components/container'
import { getRoleListCommon } from '@/actions/common'
import './index.less'

export default Unite(
  {
    state: {},
    async onLoad() {
      await getRoleListCommon({})
    },
  },
  function () {
    return (
      <Container navTitle="测试2">
        <View
          onClick={() => {
            navigateTo({
              url: '/pages/index/index',
            })
          }}
        >
          Hello world!111
        </View>
      </Container>
    )
  },
  { page: true, stopPullDownRefreshAfterPull: true },
)
