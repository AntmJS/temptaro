import type { AreaProps } from '@antmjs/vantui/types/area'
import type { IPickerInstance } from '@antmjs/vantui/types/picker'
import { View } from '@tarojs/components'
import { areaList } from '@vant/area-data'
import { Area, Popup } from '@antmjs/vantui'
import './datetimePicker.less'
import { useCallback } from 'react'

export default function Index(
  props: Omit<AreaProps, 'onChange'> & {
    show: boolean
    onChange?: (event: {
      detail: {
        values: number[] | string[]
        picker: IPickerInstance
        index: number
      }
    }) => void
  },
) {
  const { show, title, value, onChange, ...others } = props
  const _onChange = useCallback(() => {}, [])
  return (
    <Popup
      className="components-normal-datetimepicker"
      round
      position="bottom"
      show={show}
      safeAreaInsetBottom={false}
    >
      <Area
        onChange={onChange || _onChange}
        areaList={areaList}
        value={value || '330000'}
        title={title || '请选择'}
        {...others}
      />
      <View className="datetimepicker-placehold" />
    </Popup>
  )
}
