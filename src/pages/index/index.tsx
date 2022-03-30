import { navigateTo } from '@tarojs/taro'
import { Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Container from '@/components/container'
import { getRoleListCommon } from '@/actions/common'
import './index.less'

export default Unite(
  {
    state: {
      info: null,
    },
    async onLoad() {
      const data = await getRoleListCommon({})
      this.setState({
        info: data,
      })
    },
  },
  function ({ state }) {
    const { info } = state
    return (
      <Container navTitle="测试" loading={!info}>
        <View
          onClick={() => {
            navigateTo({
              url: '/pages/second/index',
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
