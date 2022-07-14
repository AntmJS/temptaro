import { useEffect, useState, useCallback, ReactNode } from 'react'
import {
  getCurrentInstance,
  navigateBack,
  reLaunch,
  getCurrentPages,
  useDidShow,
} from '@tarojs/taro'
import { animated } from '@react-spring/web'
import { View } from '@tarojs/components'
import { Icon } from '@antmjs/vantui'
import { useRecoilState } from 'recoil'
import { menuButtonStore } from '@/store'
import { setMenuButtonAsync } from '@/utils'
import './navigation.less'

const hackSyncWechatTitle = () => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = '/favicon.ico'
  iframe.onload = () => {
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 10)
  }
  document.body.appendChild(iframe)
}

interface IMenuButtonProps {
  menuButton: any
  homeUrl: string
}

function MenuButton(props: IMenuButtonProps) {
  const { menuButton, homeUrl } = props

  const handleGoBack = useCallback(() => {
    navigateBack({
      delta: 1,
    })
  }, [])

  const handleGoHome = useCallback(() => {
    reLaunch({
      url: '/' + homeUrl,
    })
  }, [homeUrl])

  const [backButton, setBackButton] = useState(false)
  const [homeButton, setHomeButton] = useState(false)
  useEffect(
    function () {
      const pages = getCurrentPages()
      if (pages.length > 0) {
        const ins = pages[pages.length - 1]
        let url = ins?.route || ins?.['__route__']
        if (pages.length > 1) {
          setBackButton(true)
        }
        if (url[0] === '/') {
          url = url.substr(1)
        }
        if (url !== homeUrl) {
          setHomeButton(true)
        }
      }
    },
    [homeUrl],
  )

  return (
    <>
      <View
        className="navigation_minibar_left"
        style={{
          top: `${menuButton!.top}px`,
          left: `${menuButton!.marginRight}px`,
          width: `${menuButton!.width}px`,
          height: `${menuButton!.height}px`,
        }}
      >
        {backButton && (
          <View
            className="navigation_minibar_left_back"
            style={{
              width: `${menuButton!.height}px`,
              height: `${menuButton!.height}px`,
              marginRight: '10px',
            }}
            onClick={handleGoBack}
          >
            <Icon name="arrow-left" />
          </View>
        )}
        {homeButton && (
          <View
            className="navigation_minibar_left_home"
            style={{
              width: `${menuButton!.height}px`,
              height: `${menuButton!.height}px`,
            }}
            onClick={handleGoHome}
          >
            <Icon name="wap-home" />
          </View>
        )}
      </View>
    </>
  )
}

interface IH5PullDownRefresh {
  navClassName?: string
  springStyles: any
  enablePullDownRefresh?: boolean
  renderHeader?: (
    navHeight: number,
    statusBarHeight: number,
    safeRight: number,
  ) => void
  pullDownRefreshStatus?: 'pulling' | 'refreshing' | 'complete' | 'canRelease'
}

interface INavBarProps {
  useNav?: boolean
  title?: ReactNode
  menuButton: any
  navClassName?: string
  enablePullDownRefresh?: boolean
  pullDownRefreshStatus?: 'pulling' | 'refreshing' | 'complete' | 'canRelease'
  renderHeader?: (
    navHeight: number,
    statusBarHeight: number,
    safeRight: number,
  ) => void
  springStyles: any
}

function NavBar(props: INavBarProps) {
  const {
    useNav,
    title,
    menuButton,
    navClassName,
    enablePullDownRefresh,
    pullDownRefreshStatus,
    renderHeader,
    springStyles,
  } = props
  const navHeight =
    menuButton!.top +
    menuButton!.height +
    (menuButton!.top - menuButton!.statusBarHeight)
  const statusBarHeight = menuButton!.statusBarHeight
  const paddingLeftRight = menuButton!.width + menuButton!.marginRight * 2

  const renderStatusText = (): any => {
    if (pullDownRefreshStatus === 'pulling') return '下拉刷新'
    if (pullDownRefreshStatus === 'canRelease') return '释放立即刷新'
    if (pullDownRefreshStatus === 'refreshing')
      return <View className="navigation_minibar_loading" />
    if (pullDownRefreshStatus === 'complete') return '刷新成功'
  }
  const NView = animated(View)
  return (
    <>
      <View className={`navigation_minibar ${navClassName || ''}`}>
        {useNav && process.env.TARO_ENV !== 'h5' && (
          <View
            style={{
              height: `${navHeight}px`,
              paddingTop: `${statusBarHeight as number}px`,
            }}
          >
            <View
              className="navigation_minibar_center"
              style={{
                marginLeft: `${paddingLeftRight as number}px`,
                marginRight: `${paddingLeftRight as number}px`,
              }}
            >
              <View className="navigation_minibar_content van-ellipsis">
                {title}
              </View>
            </View>
          </View>
        )}
        {renderHeader?.(navHeight, statusBarHeight, paddingLeftRight)}
        {enablePullDownRefresh ? (
          <View className="navigation_minibar_pulldown">
            <NView
              className={'navigation_minibar_pulldown_bar'}
              style={{
                ...springStyles,
              }}
            >
              {renderStatusText()}
            </NView>
          </View>
        ) : (
          <></>
        )}
      </View>
      <View className="visibility-hidden">
        {useNav && (
          <View
            style={{
              height: `${navHeight}px`,
              width: '100%',
            }}
          />
        )}
        {renderHeader?.(navHeight, statusBarHeight, paddingLeftRight)}
      </View>
    </>
  )
}

function H5PullDownRefresh(props: IH5PullDownRefresh) {
  const {
    navClassName,
    pullDownRefreshStatus,
    springStyles,
    renderHeader,
    enablePullDownRefresh,
  } = props

  const renderStatusText = (): any => {
    if (pullDownRefreshStatus === 'pulling') return '下拉刷新'
    if (pullDownRefreshStatus === 'canRelease') return '释放立即刷新'
    if (pullDownRefreshStatus === 'refreshing')
      return <View className="navigation_minibar_loading" />
    if (pullDownRefreshStatus === 'complete') return '刷新成功'
  }
  const NView = animated(View)
  return (
    <>
      <View className={`navigation_minibar ${navClassName || ''}`}>
        {renderHeader?.(0, 0, 0)}
        {enablePullDownRefresh ? (
          <View className="navigation_minibar_pulldown">
            <NView
              className={'navigation_minibar_pulldown_bar'}
              style={{
                ...springStyles,
              }}
            >
              {renderStatusText()}
            </NView>
          </View>
        ) : (
          <></>
        )}
      </View>
      <View className="visibility-hidden">
        <View
          style={{
            height: `0px`,
            width: '100%',
          }}
        />
        {renderHeader?.(0, 0, 0)}
      </View>
    </>
  )
}

type IProps = {
  homeUrl: string
  children: ReactNode
  useNav?: boolean
  navTitle?: ReactNode
  navClassName?: string
  enablePullDownRefresh?: boolean
  pullDownRefreshStatus?: 'pulling' | 'refreshing' | 'complete' | 'canRelease'
  renderHeader?: (
    navHeight: number,
    statusBarHeight: number,
    safeRight: number,
  ) => void
  springStyles: any
}

export default function Index(props: IProps) {
  const {
    useNav = true,
    navTitle,
    navClassName,
    homeUrl,
    renderHeader,
    enablePullDownRefresh,
    pullDownRefreshStatus,
    springStyles,
  } = props
  const [menuButton, setMenuButton]: any = useRecoilState(menuButtonStore)

  useDidShow(() => {
    // 设置title
    if (process.env.TARO_ENV === 'h5' && navTitle) {
      document.title = navTitle.toString()
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        hackSyncWechatTitle()
      }
    }
  })
  // 设置导航栏位置
  useEffect(function () {
    if (process.env.TARO_ENV !== 'h5' && (!menuButton || !menuButton.precise)) {
      setMenuButtonAsync(setMenuButton)
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      const ins = getCurrentInstance()
      if (ins.page?.config?.navigationBarTitleText)
        console.warn(
          '使用Navigation组件后不要在配置文件设置navigationBarTitleText',
        )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {process.env.TARO_ENV === 'h5' ? (
        <H5PullDownRefresh
          navClassName={navClassName}
          renderHeader={renderHeader}
          enablePullDownRefresh={enablePullDownRefresh}
          pullDownRefreshStatus={pullDownRefreshStatus}
          springStyles={springStyles}
        />
      ) : (
        <></>
      )}
      {menuButton && (
        <NavBar
          menuButton={menuButton}
          title={navTitle}
          navClassName={navClassName}
          renderHeader={renderHeader}
          enablePullDownRefresh={enablePullDownRefresh}
          pullDownRefreshStatus={pullDownRefreshStatus}
          springStyles={springStyles}
          useNav={useNav}
        />
      )}
      {menuButton &&
        process.env.TARO_ENV !== 'h5' &&
        process.env.TARO_ENV !== 'alipay' && (
          <MenuButton menuButton={menuButton} homeUrl={homeUrl} />
        )}
      {props.children}
    </>
  )
}
