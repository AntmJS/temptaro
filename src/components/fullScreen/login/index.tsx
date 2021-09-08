import type GlobalState from '@antmjs/global-state'
import { View } from '@tarojs/components'

interface IProps {
  globalFetchError?: GlobalState.IError
  pageError?: { code: string; message: string }
  setPageError?: React.Dispatch<React.SetStateAction<undefined>>
}

export default function Index(props: IProps) {
  // 成功之后下拉刷新 并且 有globalError调用globalFetch clearGlobalError clearPageError
  console.log(props)
  return <View>login</View>
}
