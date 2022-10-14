import { View } from '@tarojs/components'
import Taro, { hideLoading, showLoading, showToast } from '@tarojs/taro'
import { MiniPhoneButton } from '@antmjs/vantui'
import { useEffect, useState } from 'react'
import { cacheSetSync } from '@/cache'
import { loginCommon } from '@/actions/simple/common'
import './index.less'
interface IProps {
  onRefresh: () => void
  setError: React.Dispatch<
    | React.SetStateAction<{
        code: string
        message: string
        data: any
      }>
    | undefined
  >
}

interface Params {
  jsCode: string
  iv: string
  userInfoEncryptedData: string
}

export default function Index(props: IProps) {
  const { onRefresh, setError } = props
  const [params, setParams] = useState<Params>({
    jsCode: '',
    iv: '',
    userInfoEncryptedData: '',
  })

  useEffect(() => {
    getCode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCode = () => {
    Taro.login({
      success: (res) => {
        if (res.code) {
          const jsCode = res.code
          const _params = { ...params, jsCode }
          setParams(_params)
        }
      },
    })
  }

  const handleLogin = async (_params: Params) => {
    showLoading({
      title: '登录中...',
    })
    const res = await loginCommon(_params)
    hideLoading()
    cacheSetSync('token', res.token)
    setError(undefined)
    onRefresh()
  }

  const onGetPhoneNumber = (res: any) => {
    const { iv, encryptedData } = res
    if (iv && encryptedData) {
      const _params = { ...params, iv, userInfoEncryptedData: encryptedData }
      setParams(_params)
      handleLogin(_params)
    } else {
      showToast({ title: '登陆失败,请重新登录', icon: 'none' })
      getCode()
    }
  }

  const onGetPhoneNumberFail = () => {
    getCode()
    showToast({ title: '登陆失败,请重新登录', icon: 'none' })
  }

  return (
    <View className="pages-login-index">
      <MiniPhoneButton
        className="login-btn"
        size="large"
        type={'primary'}
        openType="getPhoneNumber"
        onFail={onGetPhoneNumberFail}
        onGetPhone={(res) => {
          if (!/(deny)|(permission)/.test(res.errMsg)) {
            onGetPhoneNumber(res)
          } else {
            getCode()
            showToast({ title: '登陆失败,请重新登录', icon: 'none' })
          }
        }}
      >
        登录
      </MiniPhoneButton>
    </View>
  )
}
