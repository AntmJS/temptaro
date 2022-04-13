import { useEffect, useState, useCallback, ReactNode } from 'react'
import {
  getCurrentInstance,
  navigateBack,
  reLaunch,
  getCurrentPages,
} from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Icon } from '@antmjs/vantui'
import { useRecoilState } from 'recoil'
import { menuButtonStore } from '@/store'
import { setMenuButtonAsync } from '@/utils'
import './navigation.less'

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
        const url = ins?.route || ins?.['__route__']
        if (pages.length > 1) {
          setBackButton(true)
        }
        console.log(url, homeUrl)
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

interface INavBarProps {
  title?: ReactNode
  menuButton: any
  navClassName?: string
}

function NavBar(props: INavBarProps) {
  const { title, menuButton, navClassName } = props
  const navHeight =
    menuButton!.top +
    menuButton!.height +
    (menuButton!.top - menuButton!.statusBarHeight)
  const statusBarHeight = menuButton!.statusBarHeight
  const paddingLeftRight = menuButton!.width + menuButton!.marginRight * 2
  return (
    <>
      <View
        className={`navigation_minibar ${navClassName || ''}`}
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
      <View
        style={{
          height: `${navHeight}px`,
          width: '100%',
        }}
      />
    </>
  )
}

type IProps = {
  homeUrl: string
  children: ReactNode
  useNav?: boolean
  navTitle?: ReactNode
  navClassName?: string
}

export default function Index(props: IProps) {
  const { useNav = true, navTitle, navClassName, homeUrl } = props
  const [menuButton, setMenuButton]: any = useRecoilState(menuButtonStore)

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
      {menuButton && useNav && process.env.TARO_ENV !== 'h5' && (
        <NavBar
          menuButton={menuButton}
          title={navTitle}
          navClassName={navClassName}
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