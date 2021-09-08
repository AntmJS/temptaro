import type GlobalState from '@antmjs/global-state'
import { View } from '@tarojs/components'

interface IProps {
  globalFetchError?: GlobalState.IError
  pageError?: { code: string; message: string }
  catchError?: { code: string; message: string }
  setPageError?: React.Dispatch<React.SetStateAction<undefined>>
  setCatchError?: React.Dispatch<React.SetStateAction<undefined>>
}

export default function Index(props: IProps) {
  // 点击之后下拉刷新 并且 有globalError调用globalFetch，clearGlobalError clearCatchError clearPageError
  console.log(props)
  return <View>error</View>
}
