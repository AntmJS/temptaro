/* eslint-disable react/prop-types */

import { ReactNode, useRef, useState } from 'react'
import { showToast, usePageScroll } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { animated, useSpring } from '@react-spring/web'
import { sleep, rubberbandIfOutOfBounds } from '@/utils'
import './pullDownRefresh.less'

export type PullStatus = 'pulling' | 'canRelease' | 'refreshing' | 'complete'

export type PullToRefreshProps = {
  children: ReactNode
  threshold?: number
  statusBarHeight: number
  onRefresh: <T extends boolean>(
    catchRefresh?: T,
  ) => T extends true
    ? Promise<{ code: string; message: string; data?: any }>
    : void
}

function PullDownRefresh(
  props: PullToRefreshProps & {
    setStatus: any
    api: any
    status: any
    canPull: boolean
  },
) {
  const setStatus = props.setStatus
  const status = props.status
  const api = props.api
  const headHeight = 40
  const completeDelay = 500
  const threshold = props.threshold ?? 60
  const pullingRef = useRef(false)
  const yRef = useRef(0)

  async function doRefresh() {
    api.start({ transform: `translateX(-50%) scale(1)`, opacity: 1 })
    setStatus('refreshing')
    try {
      const res = await props.onRefresh(true)
      if (res.code !== '200') {
        showToast({
          title: res.message,
          icon: 'none',
        })
      }
      setStatus('complete')
    } catch {}
    if (completeDelay > 0) {
      await sleep(completeDelay)
    }
    api.start({
      to: async (next: any) => {
        return next({ transform: `translateX(-50%) scale(0)`, opacity: 0 })
          .then(() => {
            setStatus('pulling')
          })
          .catch(() => {
            setStatus('pulling')
          })
      },
    })
  }

  const common = function (state: any) {
    if (status === 'refreshing' || status === 'complete') return

    const { event } = state
    const y = event.pageY - yRef.current

    if (state.last) {
      pullingRef.current = false
      if (status === 'canRelease') {
        doRefresh()
      } else {
        api.start({ transform: `translateX(-50%) scale(0)`, opacity: 0 })
      }
      return
    }

    if (state.first && y > 0) {
      pullingRef.current = true
    }

    if (!pullingRef.current) return

    // event?.preventDefault?.()
    // event?.stopPropagation?.()
    const height =
      Math.max(rubberbandIfOutOfBounds(y, 0, 0, headHeight * 5, 0.5), 0) / 1.1
    const rate = height / threshold
    api.start({
      transform: `translateX(-50%) scale(${rate > 1 ? 1 : rate})`,
      opacity: rate > 1 ? 1 : rate,
    })
    setStatus(height > threshold ? 'canRelease' : 'pulling')
  }

  const onStart = function (e: any) {
    if (props.canPull) {
      yRef.current = e.changedTouches[0].pageY
      common({
        first: true,
        last: false,
        event: e.changedTouches[0],
      })
    }
  }
  const onMove = function (e: any) {
    if (props.canPull) {
      // e?.preventDefault?.()
      // e?.stopPropagation?.()
      common({
        first: true,
        last: false,
        event: e.changedTouches[0],
      })
    }
  }
  const onEnd = function (e: any) {
    if (props.canPull) {
      common({
        first: false,
        last: true,
        event: e.changedTouches[0],
      })
      yRef.current = 0
    }
  }
  return (
    <View onTouchEnd={onEnd} onTouchMove={onMove} onTouchStart={onStart}>
      {props.children}
    </View>
  )
}

export default function Index(props: PullToRefreshProps) {
  const [canPull, setCanPull] = useState(true)
  const [springStyles, api] = useSpring(() => ({
    from: { transform: `translateX(-50%) scale(0)`, opacity: 0 },
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

  usePageScroll((e) => {
    if (e.scrollTop > 0 && canPull) {
      setCanPull(false)
    }
    if (e.scrollTop <= 0 && !canPull) {
      setCanPull(true)
    }
  })
  const renderStatusText = (): any => {
    if (pullDownRefreshStatus === 'pulling') return '下拉刷新'
    if (pullDownRefreshStatus === 'canRelease') return '释放立即刷新'
    if (pullDownRefreshStatus === 'refreshing')
      return <View className="navigation_minibar_loading" />
    if (pullDownRefreshStatus === 'complete') return '刷新成功'
  }
  const NView = animated(View)
  return (
    <>
      <PullDownRefresh
        {...props}
        api={api}
        canPull={canPull}
        status={pullDownRefreshStatus}
        setStatus={setPullDownRefreshStatus}
      />
      <NView
        className={'navigation_minibar_pulldown'}
        style={{
          top: `${props.statusBarHeight + 4}px`,
          ...springStyles,
        }}
      >
        {renderStatusText()}
      </NView>
    </>
  )
}
