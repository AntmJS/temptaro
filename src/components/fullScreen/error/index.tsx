import { View } from '@tarojs/components'
import type GlobalState from '@antmjs/global-state'

interface IProps {
  globalFetchError?: Record<string, GlobalState.IError>
  pageError?: { code: string; message: string }
  catchError?: { code: string; message: string }
  setPageError?: React.Dispatch<React.SetStateAction<undefined>>
  setCatchError?: React.Dispatch<React.SetStateAction<undefined>>
}

export default function Index(props: IProps) {
  console.log(props)
  // 点击之后下拉刷新 并且 有globalError调用globalFetch，clearGlobalError clearCatchError clearPageError
  return <View>error</View>
}
