import { atom, RecoilState } from 'recoil'

export interface IMenuButton {
  // 用来判断是否同时通过systemInfo+menuButton得出来的数据
  precise: boolean
  bottom: number
  width: number
  height: number
  left: number
  right: number
  marginRight: number
  top: number
  statusBarHeight: number
}

// 和UI有关的全局数据存储在这里，和UI无关的全局数据存储在cache.ts文件中

export const menuButtonStore = atom({
  key: 'menuButtonStore',
  default: undefined,
}) as RecoilState<IMenuButton | undefined>
