/* eslint-disable react-hooks/exhaustive-deps */
import { debounce, throttle } from 'lodash'
import { useCallback, useRef } from 'react'

// 两次点击相隔300ms内只执行最后一次
export function useDebounce(fn: any, ms?: number): any {
  const fRef: any = useRef()
  fRef.current = fn
  const result = useCallback(
    debounce((...args) => fRef.current(...args), ms ?? 300),
    [],
  )
  return result
}

// 每隔300ms执行一次
export function useThrottle(fn: any, ms?: number): any {
  const fRef: any = useRef()
  fRef.current = fn
  const result = useCallback(
    throttle((...args) => fRef.current(...args), ms ?? 300),
    [],
  )
  return result
}
