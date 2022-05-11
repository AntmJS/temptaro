import { View, Image } from '@tarojs/components'
import { Empty } from '@antmjs/vantui'
import './pagination.less'
import { ReactNode } from 'react'

interface IPropsModel {
  complete: boolean
  data: any[]
  size: number
  children: ReactNode
}

function Index(props: IPropsModel): JSX.Element {
  return (
    <View className="components-pagination" style={{ height: '100%' }}>
      {props.children}
      {!props.complete && props.data && props.data.length >= props.size ? (
        <View className="components-mum">
          <Image
            className="image"
            src="https://g.18qjz.cn/img/static/124w_124h_63CAA1498816035.gif"
            mode="aspectFill"
          />
        </View>
      ) : props.data && props.data.length === 0 ? (
        <View className="no-data-search">
          <Empty image="search" description="空空如也" />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}

export default Index
