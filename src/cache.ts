import Cache from '@antmjs/cache'

const {
  cacheGetSync,
  cacheGet,
  cacheSetSync,
  cacheSet,
  cacheRemoveSync,
  cacheRemove,
} = Cache({
  ram: { token1: '存储在缓存中' }, // 默认值要先定义成undefined
  loc: { token2: '存储在缓存及localStorage中' }, //默认值要先定义成undefined
})

export {
  cacheGetSync,
  cacheGet,
  cacheSetSync,
  cacheSet,
  cacheRemoveSync,
  cacheRemove,
}
