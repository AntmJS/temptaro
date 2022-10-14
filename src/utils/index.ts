import { getSystemInfo, getMenuButtonBoundingClientRect } from '@tarojs/taro'
import { SetterOrUpdater } from 'recoil'
import { cacheGet, cacheSet } from '@/cache'
import { IMenuButton } from '@/store'

function _setMenuButton(sysInfo: any, setStore: SetterOrUpdater<IMenuButton>) {
  try {
    let menuButton: any
    if (process.env.TARO_ENV === 'h5') {
      menuButton = {
        bottom: 36,
        height: 32,
        left: document.body.clientWidth - 7 - 87,
        right: document.body.clientWidth - 7,
        top: 4,
        width: 87,
      }
    } else {
      menuButton = getMenuButtonBoundingClientRect()
    }
    if (menuButton) {
      if (sysInfo) {
        setStore({
          precise: true,
          bottom: menuButton.bottom,
          height: menuButton.height,
          width: menuButton.width,
          left: menuButton.left,
          right: menuButton.right,
          marginRight: sysInfo.screenWidth - menuButton.right,
          top: menuButton.top,
          statusBarHeight: sysInfo.statusBarHeight ?? menuButton.top - 4,
        })
        cacheSet({
          key: 'menuButton',
          data: {
            ...menuButton,
            marginRight: sysInfo.screenWidth - menuButton.right,
          },
        })
      } else {
        setStore({
          precise: false,
          bottom: menuButton.bottom,
          height: menuButton.height,
          width: menuButton.width,
          left: menuButton.left,
          right: menuButton.right,
          marginRight: 7,
          top: menuButton.top,
          statusBarHeight: menuButton.top - 4,
        })
        cacheSet({
          key: 'menuButton',
          data: menuButton,
        })
      }
    } else {
      setStore({
        precise: false,
        bottom: 80,
        height: 32,
        width: 87,
        left: 281,
        right: 368,
        marginRight: 7,
        top: 48,
        statusBarHeight: sysInfo?.statusBarHeight ?? 48 - 4,
      })
    }
  } catch (error) {
    setStore({
      precise: false,
      bottom: 80,
      height: 32,
      width: 87,
      left: 281,
      right: 368,
      marginRight: 7,
      top: 48,
      statusBarHeight: sysInfo?.statusBarHeight ?? 48 - 4,
    })
  }
}

function _setSysInfo(
  menuButton: any,
  setStore: SetterOrUpdater<IMenuButton>,
  setMenuButton?: any,
) {
  getSystemInfo({
    success(sysInfo) {
      if (process.env.TARO_ENV === 'h5') {
        sysInfo.statusBarHeight = 0
      }
      if (menuButton) {
        setStore({
          precise: true,
          bottom: menuButton.bottom,
          height: menuButton.height,
          width: menuButton.width,
          left: menuButton.left,
          right: menuButton.right,
          marginRight: sysInfo.screenWidth - menuButton.right,
          top: menuButton.top,
          statusBarHeight: sysInfo.statusBarHeight ?? menuButton.top - 4,
        })
      } else {
        setMenuButton(sysInfo, setStore)
      }
      cacheSet({
        key: 'sysInfo',
        data: sysInfo,
      })
    },
    fail() {
      if (menuButton) {
        setStore({
          precise: false,
          bottom: menuButton.bottom,
          height: menuButton.height,
          width: menuButton.width,
          left: menuButton.left,
          right: menuButton.right,
          marginRight: 7,
          top: menuButton.top,
          statusBarHeight:
            process.env.TARO_ENV === 'h5' ? 0 : menuButton.top - 4,
        })
      } else {
        setMenuButton(null, setStore)
      }
    },
  })
}

export function setMenuButtonAsync(setStore: SetterOrUpdater<IMenuButton>) {
  cacheGet({ key: 'menuButton' }).then((mb) => {
    cacheGet({ key: 'sysInfo' }).then((si) => {
      if (mb && si) {
        setStore({
          precise: true,
          bottom: mb.bottom,
          height: mb.height,
          width: mb.width,
          left: mb.left,
          right: mb.right,
          marginRight: mb.marginRight ?? si.screenWidth - mb.right,
          top: mb.top,
          statusBarHeight: si.statusBarHeight ?? mb.top - 4,
        })
      } else if (mb) {
        _setSysInfo(mb, setStore)
      } else if (si) {
        _setMenuButton(si, setStore)
      } else {
        _setSysInfo(null, setStore, _setMenuButton)
      }
    })
  })
}

export function setSysInfoAsync(force = false) {
  if (force) {
    getSystemInfo({
      success(sysInfo) {
        cacheSet({
          key: 'sysInfo',
          data: sysInfo,
        })
      },
    })
  } else {
    cacheGet({ key: 'sysInfo' }).then((si) => {
      if (!si) {
        getSystemInfo({
          success(sysInfo) {
            cacheSet({
              key: 'sysInfo',
              data: sysInfo,
            })
          },
        })
      }
    })
  }
}

export function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

export function bound(
  position: number,
  min: number | undefined,
  max: number | undefined,
) {
  let ret = position
  if (min !== undefined) {
    ret = Math.max(position, min)
  }
  if (max !== undefined) {
    ret = Math.min(ret, max)
  }
  return ret
}

export function rubberband(
  distance: number,
  dimension: number,
  constant: number,
) {
  return (distance * dimension * constant) / (dimension + constant * distance)
}

export function rubberbandIfOutOfBounds(
  position: number,
  min: number,
  max: number,
  dimension: number,
  constant = 0.15,
) {
  if (constant === 0) return bound(position, min, max)
  if (position < min)
    return -rubberband(min - position, dimension, constant) + min
  if (position > max)
    return +rubberband(position - max, dimension, constant) + max
  return position
}

export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))
