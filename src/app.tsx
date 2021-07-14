import { Component } from 'react'
import './app.less'

class App extends Component {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentDidMount() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentDidShow() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentDidHide() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    // eslint-disable-next-line react/prop-types
    return <>{this.props.children}</>
  }
}

export default App
