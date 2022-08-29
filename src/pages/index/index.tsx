import type { ActionSheetItem } from '@antmjs/vantui/types/action-sheet'
import { useRecoilState } from 'recoil'
import { Button, ActionSheet, CellGroup, Field } from '@antmjs/vantui'
import { Unite } from '@antmjs/unite'
import { View } from '@tarojs/components'
import { useReachBottom, showModal, navigateTo } from '@tarojs/taro'
import Container from '@/components/container'
import DatetimePicker from '@/components/datetimePicker'
import Picker from '@/components/picker'
import Popup from '@/components/popup'
import Area from '@/components/area'
import { getRoleListCommon } from '@/actions/simple/common'
import { menuButtonStore } from '@/store'
import './index.less'

export default Unite(
  {
    state: {
      info: null,
      popShow: false,
      pickerShow: false,
      datepickerShow: false,
      areaShow: false,
      actionsheetShow: false,
      actions: [
        {
          name: '选项',
        },
        {
          name: '选项',
        },
        {
          name: '选项',
          subname: '描述信息',
          openType: 'share',
        },
      ],
    },
    async onShow() {
      console.log(111)
    },
    async onHide() {
      console.log(222)
    },
    async onLoad() {
      // const datap = await petClient.addPet({
      //   body: { name: 'xx', photoUrls: ['xxx'] },
      // })
      const data = await getRoleListCommon({})
      this.setState({
        info: data,
      })
    },
  },
  function ({ state, events }) {
    useReachBottom(() => {
      console.log(999)
    })
    const { setHooks, setState } = events
    const {
      info,
      popShow,
      pickerShow,
      datepickerShow,
      areaShow,
      actionsheetShow,
      actions,
    } = state
    const [menuButton, setMenuButton]: any = useRecoilState(menuButtonStore)
    // 可以将hooks的数据传递到实例上面，可以通过this.hooks['xxx']获取到，不过hooks是异步的，所以在不同的阶段取值有可能取不到，这是由业务决定的
    setHooks({
      xxx: menuButton,
      yyy: setMenuButton,
    })
    return (
      <Container
        navTitle="常规页面"
        className="pages-index-index"
        enablePagePullDownRefresh={true}
        loading={!info}
        renderPageTopHeader={() => {
          return (
            <View style={{ height: '30px', backgroundColor: 'red' }}>
              固定在顶部的内容
            </View>
          )
        }}
      >
        <CellGroup>
          <Field
            required
            clearable
            label="用户名"
            icon="questionO"
            placeholder="请输入用户名"
          />
          <Field
            type="password"
            label="密码"
            placeholder="请输入密码"
            required
            border
          />
        </CellGroup>
        {info && (
          <>
            <View className="btn-panel">
              <Button
                type="primary"
                size="normal"
                onClick={() => navigateTo({ url: '/pages/pagination/index' })}
              >
                分页模版页
              </Button>
            </View>
            <View className="btn-panel">
              <Button
                type="primary"
                size="normal"
                onClick={() =>
                  navigateTo({ url: '/pages/tabAndSearchPagination/index' })
                }
              >
                带tab和search的分页模版页
              </Button>
            </View>
            <View className="btn-panel">
              <Button
                type="primary"
                size="normal"
                onClick={() => setState({ datepickerShow: true })}
              >
                DateTimerPicker组件
              </Button>
            </View>
            <View className="btn-panel">
              <Button
                type="primary"
                size="normal"
                onClick={() => setState({ pickerShow: true })}
              >
                Picker组件
              </Button>
            </View>
            <View className="btn-panel">
              <Button
                type="primary"
                size="normal"
                onClick={() => setState({ popShow: true })}
              >
                Popup组件
              </Button>
            </View>
            <View className="btn-panel">
              <Button
                type="primary"
                size="normal"
                onClick={() => setState({ areaShow: true })}
              >
                Area组件
              </Button>
            </View>
            <View className="btn-panel">
              <Button
                type="primary"
                size="normal"
                onClick={() => setState({ actionsheetShow: true })}
              >
                ActionSheet组件
              </Button>
            </View>
            <View className="btn-panel">
              <Button
                type="primary"
                size="normal"
                onClick={() => {
                  showModal({
                    title: '标题',
                    content: '内容',
                    confirmText: '确认',
                    cancelText: '取消',
                  })
                }}
              >
                确认组件
              </Button>
            </View>
          </>
        )}

        <Popup
          show={popShow}
          title={'查看'}
          onClose={() => {
            setState({ popShow: false })
          }}
        >
          <View>Hello world!1112</View>
          <View>Hello world!1112</View>
        </Popup>
        <DatetimePicker
          show={datepickerShow}
          onConfirm={(e) => {
            console.log(e)
            setState({ datepickerShow: false })
          }}
          onCancel={() => {
            setState({ datepickerShow: false })
          }}
        />
        <Picker
          show={pickerShow}
          columns={['杭州', '宁波', '温州', '嘉兴', '湖州']}
          onConfirm={(e) => {
            console.log(e)
            setState({ pickerShow: false })
          }}
          onCancel={() => {
            setState({ pickerShow: false })
          }}
        />
        <Area
          show={areaShow}
          onConfirm={(e) => {
            console.log(e)
            setState({ areaShow: false })
          }}
          onCancel={() => {
            setState({ areaShow: false })
          }}
        />
        <ActionSheet
          show={actionsheetShow}
          // 可以不加
          title="标题"
          // 可以不加
          cancelText="取消"
          actions={actions as ActionSheetItem[]}
          onClose={() => setState({ actionsheetShow: false })}
          onCancel={() => setState({ actionsheetShow: false })}
          onSelect={(e) => console.log(e)}
        />
      </Container>
    )
  },
  { page: true },
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: '',
})
