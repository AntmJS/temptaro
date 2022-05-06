/* eslint-disable react/prop-types */
import { animated, useSpring } from '@react-spring/web'

import { ReactNode, useRef, useState } from 'react'
import { View } from '@tarojs/components'
import { sleep, rubberbandIfOutOfBounds } from '@/utils'
import './pullDownRefresh.less'

const classPrefix = `class-prefix-pull-to-refresh`

export type PullStatus = 'pulling' | 'canRelease' | 'refreshing' | 'complete'

export type PullToRefreshProps = {
  children: ReactNode
  threshold?: number
  fixedStatus?: boolean
  navHeight?: number
  onRefresh: <T extends boolean>(
    catchRefresh?: T,
  ) => T extends true
    ? Promise<{ code: string; message: string; data: any }>
    : void
  renderText?: (status: PullStatus) => ReactNode
}

export const defaultProps = {
  pullingText: '下拉刷新',
  canReleaseText: '释放立即刷新',
  refreshingText: '加载中',
  completeText: '刷新成功',
  completeDelay: 500,
  headHeight: 40,
}

export default function PullDownRefresh(p: PullToRefreshProps) {
  const props = Object.assign({}, defaultProps, p)
  const headHeight = props.headHeight
  const threshold = props.threshold ?? 60
  const pullingRef = useRef(false)
  const yRef = useRef(0)
  const [status, setStatus] = useState<PullStatus>('pulling')
  const [springStyles, api] = useSpring(() => ({
    from: { transform: `scale(0)`, opacity: 0 },
    config: {
      tension: 300,
      friction: 30,
      clamp: true,
    },
  }))

  async function doRefresh() {
    api.start({ transform: `scale(1)`, opacity: 1 })
    setStatus('refreshing')
    try {
      await props.onRefresh()
      setStatus('complete')
    } catch {}
    if (props.completeDelay > 0) {
      await sleep(props.completeDelay)
    }
    api.start({
      to: async (next: any) => {
        return next({ transform: `scale(0)`, opacity: 0 })
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
        api.start({ transform: `scale(0)`, opacity: 0 })
      }
      return
    }

    if (state.first && y > 0) {
      pullingRef.current = true
    }

    if (!pullingRef.current) return

    event?.preventDefault?.()
    event?.stopPropagation?.()
    const height =
      Math.max(rubberbandIfOutOfBounds(y, 0, 0, headHeight * 5, 0.5), 0) / 1.1
    const rate = height / threshold
    api.start({
      transform: `scale(${rate > 1 ? 1 : rate})`,
      opacity: rate > 1 ? 1 : rate,
    })
    setStatus(height > threshold ? 'canRelease' : 'pulling')
  }

  const onStart = function (e: any) {
    yRef.current = e.changedTouches[0].pageY
    common({
      first: true,
      last: false,
      event: e.changedTouches[0],
    })
  }
  const onMove = function (e: any) {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    common({
      first: true,
      last: false,
      event: e.changedTouches[0],
    })
  }
  const onEnd = function (e: any) {
    common({
      first: false,
      last: true,
      event: e.changedTouches[0],
    })
    yRef.current = 0
  }

  const renderStatusText = (): any => {
    if (props.renderText) {
      return props.renderText?.(status)
    }

    if (status === 'pulling') return props.pullingText
    if (status === 'canRelease') return props.canReleaseText
    if (status === 'refreshing')
      return <View className="navigation_minibar_loading" />
    if (status === 'complete') return props.completeText
  }

  const NView = animated(View)

  return (
    <View
      // catchMove
      onTouchEnd={onEnd}
      onTouchMove={onMove}
      onTouchStart={onStart}
      className="class-prefix-pull-to-refresh"
    >
      <NView
        className={`${classPrefix}-head`}
        style={{
          position: props.fixedStatus ? 'fixed' : 'absolute',
          top: props.fixedStatus ? `${(props.navHeight ?? 0) + 20}px` : '20px',
          ...springStyles,
        }}
      >
        {renderStatusText()}
      </NView>
      {props.children}
    </View>
  )
}
