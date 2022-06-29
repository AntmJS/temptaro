import {
  PureComponent,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from 'react'
import { showToast, usePageScroll } from '@tarojs/taro'
import { UniteContext, Popup } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { EMlf } from '@antmjs/trace'
import { useSpring } from '@react-spring/web'
import { monitor } from '@/trace'
import Error from '../fullScreen/error'
import Login from '../fullScreen/login'
import Loading from '../fullScreen/loading'
import PullDownRefresh from './pullDownRefresh'
import Navigation from './navigation'
import './index.less'

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
  className: string
  children: ReactNode
  useNav?: boolean
  navTitle?: ReactNode
  navClassName?: string
  loading?: any
  ignoreError?: boolean
  enablePagePullDownRefresh?: boolean
  renderPageTopHeader?: (
    navHeight: number,
    statusBarHeight: number,
    safeRight: number,
  ) => void
}

export default function Index(props: IProps) {
  const {
    useNav = true,
    navTitle,
    navClassName,
    className,
    loading,
    ignoreError,
    renderPageTopHeader,
    enablePagePullDownRefresh = true,
  } = props
  const ctx = useContext(UniteContext)
  const [canPull, setCanPull] = useState(true)
  const [springStyles, api] = useSpring(() => ({
    from: { transform: `scale(0)`, opacity: 0 },
    config: {
      tension: 300,
      friction: 30,
      clamp: true,
    },
  }))
  const [pullDownRefreshStatus, setPullDownRefreshStatus] = useState(
    'pulling',
  ) as [
    'pulling' | 'refreshing' | 'complete' | 'canRelease',
    React.Dispatch<
      React.SetStateAction<'pulling' | 'refreshing' | 'complete' | 'canRelease'>
    >,
  ]
  const [loginStatus, setLoginStatus] = useState(false)

  // 异常来自于三个部分 1: Request Code 2 JSError 3: BoundaryError
  useEffect(() => {
    if (
      !loading &&
      ctx.error &&
      ctx.error.code !== 'JSError' &&
      ctx.error.code !== 'BoundaryError'
    ) {
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

  usePageScroll((e) => {
    if (e.scrollTop > 0 && canPull) {
      setCanPull(false)
    }
    if (e.scrollTop <= 0 && !canPull) {
      setCanPull(true)
    }
  })

  useEffect(() => {
    if (loading && ctx.error && !ignoreError && ctx.error.code === LOGIN_CODE) {
      setLoginStatus(true)
    }
  }, [loading, ctx, ignoreError])

  function render() {
    if (
      loading ||
      ctx.error?.code === 'JSError' ||
      ctx.error?.code === 'BoundaryError'
    ) {
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
        <PullDownRefresh
          canPull={
            !!(ctx.uniteConfig.page && enablePagePullDownRefresh && canPull)
          }
          onRefresh={ctx.onRefresh}
          setStatus={setPullDownRefreshStatus}
          status={pullDownRefreshStatus}
          api={api}
        >
          <View className={className}>{props.children}</View>
        </PullDownRefresh>
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
          onClose={async () => {
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
          enablePullDownRefresh={enablePagePullDownRefresh}
          pullDownRefreshStatus={pullDownRefreshStatus}
          renderHeader={renderPageTopHeader}
          springStyles={springStyles}
        >
          {render()}
        </Navigation>
      ) : (
        render()
      )}
    </ErrorBoundary>
  )
}
