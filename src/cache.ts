import Cache from '@antmjs/cache'

// 和UI无关的全局数据存储在这里，和UI相关的全局数据存储在store.ts文件中

const {
  cacheGetSync,
  cacheGet,
  cacheSetSync,
  cacheSet,
  cacheRemoveSync,
  cacheRemove,
} = Cache({
  ram: {},
  loc: {
    sysInfo: undefined,
    menuButton: undefined,
    token: '',
    userId: '',
    location: undefined,
  },
})

export {
  cacheGetSync,
  cacheGet,
  cacheSetSync,
  cacheSet,
  cacheRemoveSync,
  cacheRemove,
}
