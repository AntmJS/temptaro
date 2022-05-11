import type { PickerProps } from '@antmjs/vantui/types/picker'
import { View } from '@tarojs/components'
import { Picker, Popup } from '@antmjs/vantui'
import './datetimePicker.less'

export default function Index(props: PickerProps & { show: boolean }) {
  const { show, title, ...others } = props
  return (
    <Popup
      className="components-normal-datetimepicker"
      round
      position="bottom"
      show={show}
      safeAreaInsetBottom={false}
    >
      <Picker title={title || '请选择'} {...others} />
      <View className="datetimepicker-placehold" />
    </Popup>
  )
}
