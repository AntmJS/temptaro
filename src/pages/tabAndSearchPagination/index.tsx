import { Search, Tabs, Tab } from '@antmjs/vantui'
import { Unite } from '@antmjs/unite'
import { View } from '@tarojs/components'
import { useReachBottom } from '@tarojs/taro'
import Container from '@/components/container'
import Pagination from '@/components/pagination'
import { getRoleListCommon } from '@/actions/simple/common'
import './index.less'

const PAGE_SIZE = 20

export default Unite(
  {
    state: {
      list: null,
      searchValue: '',
      tabs: [
        { id: 0, name: '卡片1' },
        { id: 1, name: '卡片2' },
        { id: 2, name: '卡片3' },
        { id: 3, name: '卡片4' },
        { id: 4, name: '卡片5' },
        { id: 5, name: '卡片6' },
        { id: 6, name: '卡片7' },
        { id: 7, name: '卡片8' },
      ],
      activeTabIndex: 0,
      complete: false,
    },
    loaded: false,
    async onLoad() {
      const inTab: string | number =
        this.location.params['tab'] ?? this.state.activeTabIndex
      if (!this.loaded) {
        this.loaded = true
        this.setState({ activeTabIndex: Number(inTab) })
        await this.loadList(true, { tabId: this.state.tabs[Number(inTab)]!.id })
      } else {
        await this.loadList(true)
      }
    },
    async loadList(refresh = false, params?: Record<string, any>) {
      if (refresh) this.setState({ list: null })
      const list = await getRoleListCommon({
        searchValue: this.state.searchValue,
        tabId: this.state.tabs[this.state.activeTabIndex]?.id,
        pageSize: PAGE_SIZE,
        offset: refresh ? 0 : this.state.list.length,
        ...(params || {}),
      })
      this.setState({
        list: refresh ? list : [].concat(this.state.list).concat(list as any),
        complete: list.length < PAGE_SIZE ? true : false,
      })
    },
    onChangeSearch(e: any) {
      this.setState({
        searchValue: e.detail,
      })
    },
    onChangeTab(e: any) {
      this.setState({ activeTabIndex: e.detail.index })
      this.loadList(true, {
        tabId: this.state.tabs[e.detail.index]?.id,
      })
    },
    onSearch() {
      this.loadList(true)
    },
  },
  function ({ state, events, loading }) {
    const { list, complete, searchValue, activeTabIndex, tabs } = state
    const { loadList, onSearch, onChangeSearch, onChangeTab } = events
    useReachBottom(() => {
      if (!loading.loadList && !complete) {
        loadList()
      }
    })
    return (
      <Container
        navTitle="SearchAndTab下拉上滑列表页面"
        enablePagePullDownRefresh={true}
        loading={!list}
        className="pages-tabandsearchpagination-index"
        renderPageTopHeader={() => {
          return (
            <>
              <Search
                value={searchValue}
                placeholder="请输入搜索关键词"
                onChange={onChangeSearch}
                onSearch={onSearch}
                background="#4fc08d"
                renderAction={<View onClick={onSearch}>搜索</View>}
              />
              <Tabs active={activeTabIndex} onChange={onChangeTab}>
                {tabs.map((item) => {
                  return <Tab key={item.name} title={item.name} />
                })}
              </Tabs>
            </>
          )
        }}
      >
        <Pagination complete={complete} size={PAGE_SIZE} data={list}>
          {list?.map((item: any, index: number) => {
            return (
              <View className="li" key={index}>
                {item.name}
              </View>
            )
          })}
        </Pagination>
      </Container>
    )
  },
  { page: true },
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: '',
})
