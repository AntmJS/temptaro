import type GlobalState from '@antmjs/global-state'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Button, Empty } from '@antmjs/vantui'
import { stringify } from '@antmjs/utils'
import { useClearGlobalError, useGlobalError } from '@/store'
import './index.less'
interface IProps {
  globalFetchError?: GlobalState.IError
  pageError?: { code: string; message: string }
  catchError?: { code: string; message: string }
  setPageError?: React.Dispatch<React.SetStateAction<undefined>>
  setCatchError?: React.Dispatch<React.SetStateAction<undefined>>
}

export default function Index(props: IProps) {
  // 点击之后下拉刷新 并且 有globalError调用globalFetch，clearGlobalError clearCatchError clearPageError
  const {
    pageError,
    catchError,
    setPageError,
    setCatchError,
    globalFetchError,
  } = props

  const clearGlobalError = useClearGlobalError()
  const globalError = useGlobalError()

  const clearError = () => {
    // 清除页面数据
    if (pageError) setPageError?.(undefined)

    // 清除全局异常
    if (globalError) {
      for (const key in globalError) {
        clearGlobalError({ [key]: undefined })
      }
    }
    // 清除脚本异常
    if (catchError) {
      setCatchError?.(undefined)
    }
    const ins = Taro.getCurrentInstance()
    Taro.redirectTo({
      url: ins.router?.path
        ? ins.router?.path + '?' + stringify(ins.router?.params || {})
        : '/pages/index/index',
      fail: () => {
        Taro.reLaunch({
          url: ins.router?.path
            ? ins.router?.path + '?' + stringify(ins.router?.params || {})
            : '/page/index/index',
        })
      },
    })
  }
  return (
    <View className="components-fullScreen-error">
      <Empty
        image="error"
        description={`【${
          pageError?.code || globalFetchError?.code || catchError?.code
        }】${
          pageError?.message || globalFetchError?.message || catchError?.message
        }`}
      >
        <Button className="button" onClick={clearError}>
          刷新
        </Button>
      </Empty>
    </View>
  )
}
