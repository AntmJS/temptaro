import { PureComponent, useState, useEffect } from 'react'
import { EMlf } from '@antmjs/trace'
import { Popup } from '@antmjs/vantui'
import { monitor } from '@/trace'
import COMMON from '@/constants'
import { useGlobalError } from '@/store'
import FullScreenError from '@/components/fullScreen/error'
import FullScreenLogin from '@/components/fullScreen/login'
import Loading from '@/components/fullScreen/loading'
import MiniBar from './miniBar'

class ErrorBoundary extends PureComponent<{
  setError: any
}> {
  constructor(props: any) {
    super(props)
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('componentDidCatch', error, errorInfo)
    }
    monitor(EMlf.js, {
      d1: 'componentDidCatch',
      d2: JSON.stringify(error || ''),
      d3: JSON.stringify(errorInfo || ''),
    })
    const showError = {
      code: COMMON.SCRIPT,
      message: '渲染出现了小故障',
    }
    this.props.setError(showError)
  }

  render() {
    return this.props.children
  }
}

type IProps = {
  loading?: boolean
  children: React.ReactNode
  buttonColor?: 'white' | 'black'
  title?: React.ReactNode
  border?: boolean
  fixed?: boolean
  customNav?: boolean
  pageError?: { code: string; message: string }
  setPageError?: React.Dispatch<React.SetStateAction<any>>
}

function InnerCom(props: {
  children: React.ReactNode
  loading?: boolean
  pageError?: { code: string; message: string }
  catchError?: { code: string; message: string }
  setPageError?: React.Dispatch<React.SetStateAction<any>>
  setCatchError?: React.Dispatch<React.SetStateAction<any>>
}) {
  const [togglePage, setTogglePage] = useState(false)
  const globalError = useGlobalError()

  let globalKey = ''
  let needLogin = false
  for (const key in globalError) {
    if (globalError[key as keyof typeof globalError]) {
      if (globalError[key as keyof typeof globalError]?.code === COMMON.LOGIN) {
        needLogin = true
        globalKey = key
        break
      }
      globalKey = key
    }
  }

  useEffect(
    function () {
      if (props.pageError || props.catchError || globalKey) {
        setTogglePage(true)
      } else {
        setTogglePage(false)
      }
    },
    [props.pageError, props.catchError, globalKey],
  )

  return (
    <>
      <Popup
        show={togglePage}
        closeIconPosition="top-left"
        position="bottom"
        style={`height: 100%; background-color: ${
          props?.pageError?.code === COMMON.LOGIN || needLogin
            ? 'red'
            : '#ffffff'
        };`}
        onClose={() => {
          setTogglePage(false)
        }}
      >
        {props?.pageError?.code === COMMON.LOGIN || needLogin ? (
          <FullScreenLogin
            pageError={props.pageError}
            setPageError={props.setPageError}
          />
        ) : (
          (props.pageError || props.catchError || globalKey) && (
            <FullScreenError
              globalFetchError={
                globalError[globalKey as keyof typeof globalError]
              }
              catchError={props.catchError}
              pageError={props.pageError}
              setPageError={props.setPageError}
              setCatchError={props.setCatchError}
            />
          )
        )}
      </Popup>
      {props.pageError || props.catchError || globalKey || props.loading ? (
        <Loading />
      ) : (
        props.children
      )}
    </>
  )
}

// 提供给页面使用
export default function Index(props: IProps) {
  const {
    customNav = true,
    buttonColor,
    border,
    fixed,
    title,
    pageError,
    setPageError,
  } = props

  // 收集componentDidCatch错误并在全屏展示错误
  const [catchError, setCatchError] = useState(undefined)
  return (
    <>
      {customNav && process.env.TARO_ENV !== 'h5' && (
        <MiniBar
          homeUrl="/pages/index/index"
          fixed={fixed}
          buttonColor={buttonColor}
          title={title}
          border={border}
        />
      )}
      <ErrorBoundary setError={setCatchError}>
        <InnerCom
          loading={props.loading}
          pageError={pageError}
          catchError={catchError}
          setPageError={setPageError}
          setCatchError={setCatchError}
        >
          {props.children}
        </InnerCom>
      </ErrorBoundary>
    </>
  )
}
