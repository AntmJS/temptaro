import type GlobalState from '@antmjs/global-state'
import { View } from '@tarojs/components'
import { useClearGlobalError, useGlobalError } from '@/store'

interface IProps {
  globalFetchError?: GlobalState.IError
  pageError?: { code: string; message: string }
  setPageError?: React.Dispatch<React.SetStateAction<undefined>>
}

export default function Index(props: IProps) {
  const { setPageError, pageError } = props
  const clearGlobalError = useClearGlobalError()
  const globalError = useGlobalError()
  // 成功之后调用clearError，并且下拉刷新或者刷新当前页面
  const clearError = () => {
    // 清除页面数据
    if (pageError) setPageError?.(undefined)

    // 清除全局异常
    if (globalError) {
      for (const key in globalError) {
        clearGlobalError({ [key]: undefined })
      }
    }
  }
  return <View onClick={clearError}>login</View>
}
