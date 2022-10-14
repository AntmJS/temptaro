import { ReactNode } from 'react'
import { View } from '@tarojs/components'
import { useRecoilValue } from 'recoil'
import { menuButtonStore } from '@/store'
import './navigation.less'

interface INavBarProps {
  title?: ReactNode
  navClassName?: string
  menuButton: any
  renderHeader?: (
    navHeight: number,
    statusBarHeight: number,
    safeRight: number,
  ) => void
}

function NavBar(props: INavBarProps) {
  const { title, navClassName, renderHeader, menuButton } = props

  const navHeight =
    menuButton!.top +
    menuButton!.height +
    (menuButton!.top - menuButton!.statusBarHeight)
  const statusBarHeight = menuButton!.statusBarHeight
  const paddingLeftRight = menuButton!.width + menuButton!.marginRight * 2

  return (
    <>
      <View className={`navigation_minibar ${navClassName || ''}`}>
        <>
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
          {renderHeader &&
            renderHeader(navHeight, statusBarHeight, paddingLeftRight)}
        </>
      </View>
      <View className="visibility-hidden">
        <>
          <View
            style={{
              height: `${navHeight}px`,
              width: '100%',
            }}
          />
          {renderHeader?.(navHeight, statusBarHeight, paddingLeftRight)}
        </>
      </View>
    </>
  )
}

type IProps = {
  navTitle?: ReactNode
  navClassName?: string
  renderHeader?: (
    navHeight: number,
    statusBarHeight: number,
    safeRight: number,
  ) => void
}

export default function Index(props: IProps) {
  const { navTitle, navClassName, renderHeader } = props
  const menuButton: any = useRecoilValue(menuButtonStore)

  return (
    <>
      {menuButton && (
        <NavBar
          title={navTitle}
          menuButton={menuButton}
          navClassName={navClassName}
          renderHeader={renderHeader}
        />
      )}
    </>
  )
}
