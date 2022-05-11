import { ReactNode } from 'react'
import { View } from '@tarojs/components'
import { Popup } from '@antmjs/vantui'
import './popup.less'

interface IProps {
  show: boolean
  closeable?: boolean
  title?: ReactNode
  children: ReactNode
  safeAreaInsetBottom?: boolean
  onClose?: () => void
}

export default function Index(props: IProps) {
  const {
    onClose,
    show,
    children,
    closeable = true,
    title,
    safeAreaInsetBottom = false,
  } = props
  return (
    <Popup
      show={show}
      round={true}
      closeOnClickOverlay
      safeAreaInsetBottom={safeAreaInsetBottom}
      position="bottom"
      style="min-height: 65vh; max-height: 85vh;"
      onClose={onClose}
      className="components-normal-popup"
      closeable={closeable}
      closeIcon="clear"
      lockScroll
    >
      {title && (
        <View className="popup-title-panel">
          <View className="popup-title van-ellipsis">{title}</View>
        </View>
      )}
      {title && <View className="block-placehold" />}
      <View className="popup-body-panel">{children}</View>
    </Popup>
  )
}
