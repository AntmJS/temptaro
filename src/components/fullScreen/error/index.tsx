import { View } from '@tarojs/components'
import { Button, Empty } from '@antmjs/vantui'
import './index.less'
interface IProps {
  error: {
    code: string
    message: string
    data?: any
  }
  onRefresh: () => void
  setError: React.Dispatch<
    | React.SetStateAction<{
        code: string
        message: string
        data?: any
      }>
    | undefined
  >
}

export default function Index(props: IProps) {
  const { error, onRefresh, setError } = props

  const clearError = async function () {
    setError(undefined)
    onRefresh()
  }

  return (
    <View className="components-fullScreen-error">
      <Empty image="error" description={`【${error?.code}】${error?.message}`}>
        <Button className="button" round type="primary" onClick={clearError}>
          刷新
        </Button>
      </Empty>
    </View>
  )
}
