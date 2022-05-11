import type { DatetimePickerProps } from '@antmjs/vantui/types/datetime-picker'
import { View } from '@tarojs/components'
import { DatetimePicker, Popup } from '@antmjs/vantui'
import './datetimePicker.less'

export default function Index(props: DatetimePickerProps & { show: boolean }) {
  const { show, title, ...others } = props
  return (
    <Popup
      className="components-normal-datetimepicker"
      round
      position="bottom"
      show={show}
      safeAreaInsetBottom={false}
    >
      <DatetimePicker title={title || '请选择'} {...others} />
      <View className="datetimepicker-placehold" />
    </Popup>
  )
}
