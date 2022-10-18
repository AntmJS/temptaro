import { PureComponent, ReactNode, useContext, useEffect } from 'react'
import {
  eventCenter,
  getCurrentInstance,
  showToast,
  useDidShow,
} from '@tarojs/taro'
import { View } from '@tarojs/components'
import { UniteContext } from '@antmjs/unite'
import { EMlf } from '@antmjs/trace'
import { useRecoilState } from 'recoil'
import { monitor } from '@/trace'
import { LOGIN_CODE } from '@/constants'
import { menuButtonStore } from '@/store'
import { setMenuButtonAsync } from '@/utils'
import Error from '../fullScreen/error'
import Login from '../fullScreen/login'
import Loading from '../fullScreen/loading'
import Navigation from './navigation'
import LeftBtns from './leftBtns'
import './index.less'
import PullDownRefresh from './pullDownRefresh'

const hackSyncWechatTitle = () => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = '/favicon.ico'
  iframe.onload = () => {
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 10)
  }
  document.body.appendChild(iframe)
}

class ErrorBoundary extends PureComponent<{ setError: any; children: any }> {
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
  useMenuBtns?: boolean
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

function Render(props: IProps & { ctx: any }): any {
  const { ctx, loading, ignoreError, className } = props

  // 组件把Login、JSError、BoundaryError报错抛到页面，由页面来处理
  useEffect(() => {
    const ins = getCurrentInstance()
    ins['insUniqueId'] = `${+new Date()}${Math.ceil(Math.random() * 10000)}`
    const onListenError = (e) => {
      ctx.setError(e)
    }
    if (ctx.uniteConfig.page) {
      eventCenter.on(ins['insUniqueId'], onListenError)
    }
    return () => {
      eventCenter.off(ins['insUniqueId'], onListenError)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 异常来自于三个部分 1: Request Code 2 JSError 3: BoundaryError
  // 有初始数据但是请求接口报错了，则toast。JSError BoundaryError Login 三个直接展示全屏错误
  useEffect(() => {
    if (
      !loading &&
      ctx.error &&
      ctx.error.code !== 'JSError' &&
      ctx.error.code !== 'BoundaryError' &&
      ctx.error.code !== LOGIN_CODE
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

  useEffect(() => {
    // Login、JSError、BoundaryError报错 直接传递给页面展示全屏错误
    if (
      ctx.error &&
      (ctx.error.code === LOGIN_CODE ||
        ctx.error.code === 'JSError' ||
        ctx.error.code === 'BoundaryError')
    ) {
      if (!ctx.uniteConfig.page) {
        const ins = getCurrentInstance()
        eventCenter.trigger(ins['insUniqueId'], { ...ctx.error })
      }
    }
  }, [ctx])

  if (ctx.error && ctx.error.code === LOGIN_CODE) {
    if (ctx.uniteConfig.page) {
      return <Login setError={ctx.setError as any} onRefresh={ctx.onRefresh} />
    } else {
      // 组件这里就直接不展示了，由页面处理
      return <></>
    }
  }

  // Login、JSError、BoundaryError报错 直接传递给页面展示全屏错误,组件里面就不用展示了
  if (
    ctx.error &&
    (ctx.error.code === 'JSError' || ctx.error.code === 'BoundaryError')
  ) {
    if (ctx.uniteConfig.page) {
      return (
        <Error
          setError={ctx.setError as any}
          onRefresh={ctx.onRefresh}
          error={ctx.error}
        />
      )
    } else {
      // 组件这里就直接不展示了，由页面处理
      return <></>
    }
  }
  // loading状态代表没有初始数据，那么没有初始数据且报错的情况需要全屏展示
  if (loading && ctx.error) {
    if (ignoreError) return <></>
    return (
      <Error
        setError={ctx.setError as any}
        onRefresh={ctx.onRefresh}
        error={ctx.error}
      />
    )
  }

  if (loading) return <Loading />
  return <View className={className}>{props.children}</View>
}

export default function Index(props: IProps) {
  const { navTitle, navClassName, renderPageTopHeader } = props

  const ctx = useContext(UniteContext)

  const [menuButton, setMenuButton]: any = useRecoilState(menuButtonStore)

  // 页面的初始化和组件的初始化要区分开来
  const enablePagePullDownRefresh =
    props.enablePagePullDownRefresh ?? (ctx.uniteConfig.page ? true : false)
  const useNav = props.useNav ?? (ctx.uniteConfig.page ? true : false)
  const useMenuBtns = props.useMenuBtns ?? (ctx.uniteConfig.page ? true : false)

  // 返回回来要重新设置，所以这里用useDidShow
  useDidShow(() => {
    // 设置title
    if (process.env.TARO_ENV === 'h5' && !useNav) {
      try {
        document.title = navTitle?.toString?.() || ''
      } catch {
        document.title = ''
      }
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        hackSyncWechatTitle()
      }
    }
  })
  // 设置导航栏位置
  useEffect(function () {
    if (!menuButton || !menuButton.precise) {
      setMenuButtonAsync(setMenuButton)
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      const ins = getCurrentInstance()
      if (ins.page?.config?.navigationBarTitleText)
        console.warn(
          'useNav为true的时候不要在配置文件设置navigationBarTitleText，默认为页面为true',
        )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusBarHeight = menuButton ? menuButton!.statusBarHeight : 0

  return (
    <ErrorBoundary setError={ctx.setError}>
      <>
        {useNav && ctx.error?.code !== LOGIN_CODE && (
          <Navigation
            navTitle={navTitle}
            navClassName={navClassName}
            renderHeader={renderPageTopHeader}
          />
        )}
        {useMenuBtns && ctx.error?.code !== LOGIN_CODE && (
          <LeftBtns homeUrl="pages/index/index" />
        )}
        {ctx.uniteConfig.page && enablePagePullDownRefresh ? (
          <PullDownRefresh
            onRefresh={ctx.onRefresh}
            statusBarHeight={statusBarHeight}
          >
            <Render ctx={ctx} {...props} />
          </PullDownRefresh>
        ) : (
          <Render ctx={ctx} {...props} />
        )}
      </>
    </ErrorBoundary>
  )
}
