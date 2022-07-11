/* eslint-disable react/prop-types */

import { ReactNode, useRef } from 'react'
import { showToast } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { sleep, rubberbandIfOutOfBounds } from '@/utils'

export type PullStatus = 'pulling' | 'canRelease' | 'refreshing' | 'complete'

export type PullToRefreshProps = {
  canPull: boolean
  children: ReactNode
  threshold?: number
  onRefresh: <T extends boolean>(
    catchRefresh?: T,
  ) => T extends true
    ? Promise<{ code: string; message: string; data: any }>
    : void
  setStatus: any
  status: any
  api: any
}

export default function PullDownRefresh(props: PullToRefreshProps) {
  const setStatus = props.setStatus
  const status = props.status
  const api = props.api
  const headHeight = 40
  const completeDelay = 500
  const threshold = props.threshold ?? 60
  const pullingRef = useRef(false)
  const yRef = useRef(0)

  async function doRefresh() {
    api.start({ transform: `scale(1)`, opacity: 1 })
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

    // event?.preventDefault?.()
    // event?.stopPropagation?.()
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
