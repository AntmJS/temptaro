import {
  PureComponent,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from 'react'
import { showToast } from '@tarojs/taro'
import { UniteContext, Popup } from '@antmjs/vantui'
import { EMlf } from '@antmjs/trace'
import { monitor } from '@/trace'
import Navigation from './navigation'
import Error from './fullScreen/error'
import Login from './fullScreen/login'
import Loading from './fullScreen/loading'
import PullDownRefresh from './pullDownRefresh'
import './container.less'

const LOGIN_CODE = '206'
class ErrorBoundary extends PureComponent<{ setError: any }> {
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
      code: 'BoundaryError',
      message: '渲染出现了小故障',
      data: { error, errorInfo },
    }
    this.props.setError(showError)
  }

  clearError() {
    this.setState({
      error: null,
    })
  }

  render() {
    return this.props.children
  }
}

type IProps = {
  children: ReactNode
  useNav?: boolean
  // renderData?: Record<string, any> | any[] | null
  navTitle?: ReactNode
  navClassName?: string
  loading?: any
  ignoreError?: boolean
  enablePullDownRefresh?: boolean
}

export default function Index(props: IProps) {
  const {
    useNav,
    navTitle,
    navClassName,
    loading,
    ignoreError,
    enablePullDownRefresh = true,
  } = props
  const ctx = useContext(UniteContext)
  const [loginStatus, setLoginStatus] = useState(false)

  // 异常来自于三个部分 1: Request Code 2 JSError 3: BoundaryError
  useEffect(() => {
    if (!loading && ctx.error) {
      if (!ignoreError) {
        showToast({
          title: ctx.error.message,
          icon: 'none',
        })
      }
      ctx.setError(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.error, loading])

  useEffect(() => {
    if (loading && ctx.error && !ignoreError && ctx.error.code === LOGIN_CODE) {
      setLoginStatus(true)
    }
  }, [loading, ctx, ignoreError])

  function render() {
    if (loading) {
      if (ctx.error) {
        if (ignoreError) return <></>
        if (ctx.error.code !== LOGIN_CODE)
          return (
            <Error
              setError={ctx.setError as any}
              onRefresh={ctx.onRefresh}
              error={ctx.error}
            />
          )
      } else {
        return <Loading />
      }
    }
    return (
      <>
        {enablePullDownRefresh ? (
          <PullDownRefresh onRefresh={ctx.onRefresh}>
            {props.children}
          </PullDownRefresh>
        ) : (
          props.children
        )}
        <Popup
          show={loginStatus}
          className="popup-with-login"
          closeIconPosition="top-left"
          position="bottom"
          closeable
          safeAreaInsetTop
          style={{
            height: '100vh',
          }}
          onClose={() => {
            setLoginStatus(false)
            ctx.setError(undefined)
            ctx.onRefresh()
          }}
        >
          <Login
            setLoginStatus={setLoginStatus}
            setError={ctx.setError as any}
            onRefresh={ctx.onRefresh}
          />
        </Popup>
      </>
    )
  }

  return (
    <ErrorBoundary setError={ctx.setError}>
      {ctx.uniteConfig.page ? (
        <Navigation
          homeUrl="pages/index/index"
          navTitle={navTitle}
          navClassName={navClassName}
          useNav={useNav}
        >
          {render()}
        </Navigation>
      ) : (
        render()
      )}
    </ErrorBoundary>
  )
}
