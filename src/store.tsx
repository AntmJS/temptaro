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
