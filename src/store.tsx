import GlobalState from '@antmjs/global-state'

const {
  Provider,
  useGlobalState,
  useGlobalLoading,
  useGlobalError,
  useUpdate,
  useFetchAndUpdate,
} = GlobalState(
  { user: { name: 'always' } },
  {
    user: async function () {
      /** await getUser */
      // await getUser()
      // return的data会更新到对应的key，error会更新到全局的error，可以通过useGlobalError取到
      return { data: { name: 'always', age: 18 }, error: undefined }
    },
  },
)

export {
  Provider,
  useGlobalState,
  useGlobalLoading,
  useGlobalError,
  useUpdate,
  useFetchAndUpdate,
}
