import { useEffect, useState, useCallback, CSSProperties } from 'react'
import Taro from '@tarojs/taro'
import { ViewProps } from '@tarojs/components/types/View'
import { View, Image } from '@tarojs/components'
import './miniBar.less'

declare const getCurrentPages: any

interface ICacheNav {
  paddingLeft?: number
  paddingTop?: number
  statusBarHeight?: number
  navHeight?: number
}

interface IWeapp {
  homeUrl: string
  paddingLeft: number
  paddingTop: number
  buttonColor: 'white' | 'black'
}

export interface MiniBarProps extends ViewProps {
  title?: string | React.ReactNode
  fixed?: boolean
  fixedPlaceholder?: boolean
  border?: boolean
  buttonColor?: 'white' | 'black'
  homeUrl: string
  style?: CSSProperties
}

let needCallMenu = true
let menuData: any
let cacheNav: ICacheNav
const defaultNav = {
  paddingLeft: 7,
  paddingTop: 50,
  statusBarHeight: 40,
  navHeight: 90,
}

function WeappComponent(props: IWeapp): JSX.Element {
  const { homeUrl, paddingTop, paddingLeft, buttonColor } = props

  const handleGoBack = useCallback(() => {
    Taro.navigateBack({
      delta: 1,
    })
  }, [])

  const handleGoHome = useCallback(() => {
    Taro.reLaunch({
      url: homeUrl,
    })
  }, [homeUrl])

  const [backButton, setBackButton] = useState(false)
  const [homeButton, setHomeButton] = useState(false)
  useEffect(
    function () {
      const pages = getCurrentPages()
      const show = pages.length > 1
      if (show) {
        setBackButton(true)
        const ins = pages[pages.length - 1]
        const url = ins.route || ins.__route__
        if (url !== homeUrl) {
          setHomeButton(true)
        }
      }
    },
    [homeUrl],
  )

  return (
    <>
      <View
        className="minibar_left"
        style={{ top: `${paddingTop}px`, left: `${paddingLeft}px` }}
      >
        {backButton && (
          <View className="minibar_left_back" onClick={handleGoBack}>
            {buttonColor === 'black' ? (
              <Image
                className="minibar_left_back_bicon"
                style={{ width: '32px', height: '32px' }}
                src={
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAABdCAMAAADwr5rxAAAA21BMVEX///8AAAD9/f0+Pj7Pz8/S0tL4+Pjk5OTa2tro6Ojg4ODu7u7y8vLr6+uJiYnLy8vJycm2traoqKifn5/U1NQHBwcPDw8VFRXNzc3Nzc3Nzc3MzMzLy8vMzMzKysrHx8fHx8fGxsbCwsLBwcG+vr69vb2vr6+qqqqVlZWAgIACAgIiIiIqKipcXFwaGhpRUVHBwcHKysoKCgo2NjY7Ozt/f3+goKDOzs4+Pj5ISEhtbW11dXWOjo6urq4mJiY0NDRBQUFkZGS3t7ceHh4vLy+GhoaVlZX09PQAAADjZGUjAAAASHRSTlOZAJkFpaWbn6KeoZ2cnhOIfj8nIKT69fGamJORjouGfHFvZV9TTS8tGA796uXN7tKpp/jf3b+0otvWxsO6r+fg2cms7OK9t5tRZXPPAAADUElEQVRo3qzU6VIaQRSG4eP03rPPgOz7LqhxQRNLK6n84v6vKIQ2QRFmTs/w/uepqa6PAxeYSJDEo37UaTw3OlF/FCcBQf0O8uV0ElImtfBd1/M81/WFloyGk5SU1cm0Ryva5XAYd3WF9qakhJ4OqVQcTsWVpMO0oJ6ETHDIjgsWJgX0WZspB/JzFGvPLPUgYr6xEb7PosBCJ2MqjI30BR0TrD5vSg52cdmc4/SYKrBP0RihkwHzoEgeG5A8nXSlA8VyZJdk64uWNnghXrcWWXpQF1AmUQ9O64u6gnKp+uKUTloCyiZa5LhOuhrKp7vkqD5ArAWznMExPWYGL82z+Ks+px6cJ4/OD3XSVHCuVJMc6GMJ50uOP+sB5WfUOQ0+6ZGAcyaij/rMbi/rWvVRZ+9m9kFv+zb49WbbA2Tlt/d6YvPpzu3mb9Wc0Sf/9VDhcf59s2uVs8rwn55afLr30+CX3/L+sem7PsQPxl8ZvHaXO5uh0Ql+63pp8JsKYvNkp08lFq/cGHypIT853ek9hcTvagZfofarelsd/zC/Lw3+4CHPAdnqaQWHv90b/BfHvmO61ScaMD1VDX6LXq+ebPXQBUSvVwa/BnRueAG4Z1+/4y9Wd5hAwCC/F2NfrcEmFkAiMUfR4K9glUwg1pCT88Pg1SewS8cwEsijeP8GlokR9H30UbTN70OUPUi1P4rWuRF0MnWxP4oF9A40PMjo0eBLAQXyGvCcqVfNs/hQSP/TrLWkIAwD0RCklVZBF3YtihshKCj4CRTr9/43ctHALPtmyoNcoAxD+r5zGZi97WfvnG32gb0fm4Rdzrb3RQ0xxs2b3sx6jrHd+Wd579sSZOp3bfhXlxWqMtpSjTMIRs5O/edfUy1GQvhePBIcTJT4jnGTPwiUabgJ5dWQYPip4VVcE9zVFFLtRM+gxL36Oo2ekcVjomP/gdcuOlIhmKKDdaRoYFzsdQ7WwNhqcMiUxQDewwqZ5UbvmwQyPeCbtJ5PeDwCnk/rVwUyr7Bfxb22QGYEvLYpJyhC0wQP5AS0jIObz1CzJW4uRs30qHkkNUvl5sDUDJuav1O7A2rvQe1sqH0TsyvLoOczdpSZ9KvqbjizXhvu5DO9Jxh9C8G94/gDQXWIGvsPWa8AAAAASUVORK5CYII='
                }
              />
            ) : (
              <img
                className="minibar_left_back_icon"
                style={{ width: '32px', height: '32px' }}
                src={
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAABdCAMAAADwr5rxAAAAq1BMVEUAAAAAAAD///9dXV2YmJgnJyePj4+bm5t3d3dubm48PDxQUFCenp6goKCjo6O/v7/IyMiIiIjm5uaBgYGSkpKYmJirq6toaGj////9/f38/PypqamxsbG4uLjV1dXf39/+/v6ioqL5+fn19fXq6ur6+vrz8/Pc3Nz+/v739/f09PTv7+/j4+PT09PJycm9vb2vr6/39/f5+fnx8fHs7Ozm5ubh4eH6+vr////M9Gj5AAAAOHRSTlMZAAQkNBwxLysoHyItKycUEC8KLDMyHib66eAjGhkMCPQ6z7iP2axu78OynX1hVUpAxsqlloR207as/40AAAMgSURBVGjerNTZUuMwEIXhgyRbkhdZXgPZSYAw7Nzl/Z9sMhFTBSGxW7b/e32laqkaV5RYYeczk8pa1DI1s7ktGOkcumXbJKLK1YTHcRRFccwnKq9E0lg2VGdZKkIVBzgtiFUo0owN0K0ROQ9wqYDnwtieepZUOkB7ga6SrIeeyZCDEg9l5qkXqbOJflp46KwRGj5p0TCqvpRlAL+CUi5p+kJw+MfFgqAzE0boUxQa1qWzpETfyoS16yup0D8lV216UWsMSdfFZX1VTzCsSb26pDOpMTQt2XmdJQrDUwk7q5sSY1Sac/oixDiFi9/6UkQYp0gsT3UmOcaKS3aiNyXGq2x+6oUIMF6BKH7oqcaY6fS7noXwaTddPym0FWbfdL8nvdsf2nY8rNP9r/68/9ca3Zd3esJBLnjYH/tEazz5r9sK5KKtw29u0V5lv3SjQY1/OnzahUMbpzP6X1cbh9/nhD/PjnqWg1h47/CNQnd5dtRTDlq3U4f/IR3g6UGnD+bjxuHbiLgO2EG3IUi9Pzr8IaDO0R70RoHS29rhz6CmmoOexCD0eu3wO5CLkyvQxr77wl+89jBDUaG7F2df7+BTVcDmlKXo8Fd4lVvMFXEp7tdv8EvNMZsQl+LjOzybzGA4cSl+wDdukMbUpehdnEK26vpkKfrpEnWElp4cvtHoUVRDtOprNxaOXrr426y1pCAMQ8GAf2O1VbFWt8FarQhV6/1v5qKFLDsTGcgFwiMk830Dszfd7B8TOPvMIqj7NmH3nliIMV4hpyeD7z3r2e62DHnv5xxk6sryfxXAmVHVHd/kPM6kGayQvjsaI7d7XN2dxiS+g9x09/qO4SaUVx0Pw3aFa4KappD5gdAz5ZGkv2nKaLFHf3wJX7vXkYRgag2mI0kN/LwSkJltSP3uIRO6GNh78JC5WPO+yUOmAXwT6/k8j9eA52P9qofMC+BXWa/tIbPFvDZvtieuKBwwui7j0OYz0mxJm4tJMz1pHinNUrU5sDTDlubv0u5A2ntIOxtp36TsyiLo+QI7ykj6VbobjqzXhjv5SPcJ/t6F0O5x/ADAyWsv/BL4ZAAAAABJRU5ErkJggg=='
                }
              />
            )}
          </View>
        )}
        {homeButton && (
          <View className="minibar_left_home" onClick={handleGoHome}>
            {buttonColor === 'black' ? (
              <Image
                className="minibar_left_home_icon"
                style={{ width: '32px', height: '32px' }}
                src={
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAABdCAMAAADwr5rxAAAAvVBMVEX///8AAAAzMzPp6enPz8/u7u7T09MeHh7g4ODk5OSbm5sbGxtnZ2fz8/OJiYnR0dHX19fc3Nz39/f4+PjNzc3MzMzLy8vIyMjHx8e2trasrKyfn5+/v78hISHPz8/l5eXNzc3Nzc3KysrJycnCwsLBwcG+vr69vb2oqKioqKiVlZWAgIBgYGAkJCRDQ0NbW1uLi4uUlJRhYWGCgoKlpaWwsLDFxcXOzs5UVFRsbGxzc3MoKCh5eXm4uLgaGhrxY/exAAAAPnRSTlOZAAWepZ2k/KGfuf7QnBOlo6KbmpKNiH1wPy4grPqkn5qYhn9lX1NNKSYYDgj35NbAvNTEtrKqotrOy/XIr7lIt+4AAAM9SURBVGjerNIFduswEIXhicCV2prZbpihzKT9L+u57SsksSXZzr+A78yZc6GjE7KW6TSJw+HjMIyTabq0UEcnUMv5PCK2w/qYUtM0KcV95tgkmueorY6ymBiM+rCbT5lB4gy10PNJz8E+VOVjpzfJG+qLyOYeyPO4HS0a6FloYNAJG2FWU7fGBgXdqDG2auhoRjjUiZMZ0tVXgetBvTw3WOnpKcFQP0xSDR0lhglNMo0EqfTNyIWmuaONXF8HDJrHgrVMtwYc2sQHVrW+HmBoFx6sq/RNwKFtPNiU62jEoH1shEr1xIVD5CZlemrAYTLSfX1FzAPpJlnt6ijAcKhwgHb0mc7TyUX3gui8fratW8QDZQ+vQojXB1DmEWtLH3MN/Fx8dK7B8/FfPdPYy1mBf/FnGrvJ/ughBVXvBf7Nv4MqGv7qC/Xp913xW/deffziR4+wJq7P4+hbz21QdHcktju6A0V2/l+fcG1cn+eTLx31FFs/LvB9/lix+R761DMHpF2fiLJOrkGak33qMVbiTXgcf+iI+CDpqsCr+CuQ5BNU6Ll07LdC1q108nmhz5kcb8yzeaFHFCp7E6reoDIadUD29heh7kX2eLBsqOpZ6PQMVdkWLCvXfir0Oq1c/BJSBuXdCN1uKgSWwrQPpV0K/S7Lif4UEizB2/E4gbh0kE+iXk+lk4whpJLL211PQxiasF+3tt4tUcwhPJqyvbTajfmvWXPXQRAIougmhKeExYaHYCgUEwo3Whn9/w9TGmzI5epkkp0PONlsM/cxj/W3G9vPw/x+3M9jzfrbkdjIGTqSHaZWpNemCdToQWPGgaXH+T37zM2x9GE0bcLSlz3nSHrSmqlk6eGyakl6OZnCkvTdV9+QdFuA3UTS0W4Ce1VKDyugCVg61gRdpESPOqDFWDr4dqAjpfSgBhpYTC8PQL/TdKDfgfcQ0tMz8E1iuu2A55PSg2rTrz4J+hH4Vey1M4LukNfGOcHrukGPXQlyApBxSCY9gXwGD5XPgGxJOvuLbi6mmump5pHaWap+DqyfYevn7/rdgX7vIe9sVPsmza7Mg57vz47Sk371527Ys16b7uQ9vScQ30Lo3nG8AV3ZdgB69mIfAAAAAElFTkSuQmCC'
                }
              />
            ) : (
              <Image
                className="minibar_left_home_icon"
                style={{ width: '32px', height: '32px' }}
                src={
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAABdCAMAAADwr5rxAAAAkFBMVEUAAAAAAACYmJj4+PiQkJBjY2McHBzh4eFUVFSbm5tubm7CwsL///+enp53d3ehoaGlpaX////s7Ow8PDzV1dWKioqBgYGqqqosLCy1tbXMzMy0tLT+/v7+/v6wsLDd3d3S0tLw8PDv7+/q6urh4eGnp6f39/f39/fz8/PX19fm5ubLy8vIyMjCwsK+vr7///8tKsPHAAAAL3RSTlMZADMEMiUbCiIvKBL5LSspJf2WH2IvLCEdGQ9E9Owdbl6jnIt5O8O/rGaDWFNPSk+RkVUAAAMeSURBVGjezdrZdqsgFIDhnc0oRLHNMUabqek8+v5vd5KeNp62CBhlrfwP8F0gF7ARJiERoasyNwkiJiYvKy3IJCTwy/U6RSwyxaSczWZSMpUViOm6JkN1og3STHL4GZcZRaPJAL3OsWAcuuKswLw+TSc6pWoB7haKppr013VCGYTEaKJ76sJQCaFJakQPnZSoOITHFZYkVBfJfAH9WswTEaZXyKB/DKsAneR0Bqc0oznx6SSdczgtPk+JWxdJBqeXJcKlC1QwJIWiWxfIYFgMRZdOEgVDUwmx6yTNYHhZSqx6Pocxmuc2vaJ8FJ3T6rcucAbjNEPxUycJg7FiCfmhlyGLfne/vL8LWfryuy5wEYCvmqZZBfALFN90o8Db1R4/8FfgTZn/dU15EB7Kc6pbnSQSfL0vm69W7+BLJuSoawq+3pZN2/INfFF91FMGnl4/8JZ/BU8s/dJrCp5eps33pi/gidafeq7A3faIt/wW3Kn8n058e/3PHv/N//HtefKh6wKcPe1xG/8Ezgr9oRsGrjYXjb2LDbhi5qAT5D78JJ4jmYBnx9y2uIW/9ewamKwzF964c/HZeq+nEjp7bnw9Q2cynYBr2W8afzeuhQeBLnwQjwK6d/tlE9Zl946Hquuj7prQdl2ftYJSgbXrJrxrO6FKyBlY4i0exHMbwnIw0oY/Nv16tPHSQCIdyzJscWQC1iPYsre+tB7K7Pqut77roQNeHQpZ/enVIQS77jpsXIbormMHmIi6gZxF01kOpQrVp7un7b7NQ6iuSqiyUH0Dnz0E6lkFugjVjx9oE6gXGgQG6hft+SZQRwEEeSSdI4FJKiPpMnWcCUJ195mgppF0WrdnsdF1jqQ9R46uM3M8A0fQC92e30fXF0jau8fousqP96YIOq3bO9/oOksd99Vwfem4r7rv2tsA/cFx1/bMCW5WHn16j645QTvjGDNlHPOZoS1QOGZLQ5uXcediUWd6UeeRUWepcefAUWfYUefvUd8Oor57RH2zifreFPOt7Aze+U58ozyT99Xeb8Nn9q4d/CZ/pv8TDP4XIu5/HH8BnvUaYPSHt70AAAAASUVORK5CYII='
                }
              />
            )}
          </View>
        )}
      </View>
    </>
  )
}

export default function Index(props: MiniBarProps): JSX.Element {
  const {
    homeUrl,
    buttonColor = 'black',
    border = true,
    title = '',
    fixed = true,
    fixedPlaceholder = true,
    style = {},
    className = '',
    ...others
  } = props

  // 设置按钮
  const [nav, setNav] = useState(cacheNav)

  // 设置按钮位置
  useEffect(function () {
    if (process.env.NODE_ENV === 'development') {
      const ins = Taro.getCurrentInstance()
      if (ins.page?.config?.navigationBarTitleText)
        console.warn(
          '使用miniBar组件后不要在配置文件设置navigationBarTitleText',
        )
    }
    const setCacheNav = function (cache: boolean): void {
      if (menuData) {
        const calculate = {
          paddingLeft: menuData.left,
          paddingTop: menuData.top,
          navHeight: menuData.bottom + 4,
          statusBarHeight: menuData.top - 4,
        }
        setNav(calculate)
        if (cache) {
          cacheNav = calculate
        }
      } else {
        setNav(defaultNav)
      }
    }

    const getMenuOption = function () {
      if (
        (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'tt') &&
        needCallMenu &&
        !menuData
      ) {
        try {
          menuData = Taro.getMenuButtonBoundingClientRect()
          needCallMenu = false
        } catch (error) {
          needCallMenu = false
        }
      }

      Taro.getSystemInfo({
        success(sysInfo: any) {
          if (sysInfo) {
            if (sysInfo.statusBarHeight) {
              let calculate: ICacheNav
              if (menuData) {
                calculate = {
                  paddingLeft: sysInfo.screenWidth - menuData.right,
                  paddingTop: menuData.top,
                  navHeight:
                    menuData.bottom + (menuData.top - sysInfo.statusBarHeight),
                  statusBarHeight: sysInfo.statusBarHeight,
                }
              } else {
                calculate = {
                  paddingLeft: defaultNav.paddingLeft,
                  paddingTop: defaultNav.paddingTop,
                  navHeight: sysInfo.statusBarHeight + 44,
                  statusBarHeight: sysInfo.statusBarHeight,
                }
              }
              setNav(calculate)
              cacheNav = calculate
            } else {
              setCacheNav(true)
            }
          } else {
            setCacheNav(true)
          }
        },
        fail() {
          setCacheNav(false)
        },
      })
    }

    if (!cacheNav?.statusBarHeight) {
      Taro.getStorage({
        key: '__nav',
        success(nav: any) {
          if (nav?.data) {
            setNav(nav.data)
            cacheNav = nav.data
          } else {
            getMenuOption()
          }
        },
        fail() {
          getMenuOption()
        },
      }).catch(() => {
        getMenuOption()
      })
    }
  }, [])

  const cls = `minibar ${fixed ? 'minibar_fixed' : ''} ${className}`

  return (
    <>
      {nav && (
        <>
          <View
            {...others}
            className={cls}
            style={{
              height: `${nav.navHeight}px`,
              ...style,
            }}
          >
            {(process.env.TARO_ENV === 'weapp' ||
              process.env.TARO_ENV === 'tt') && (
              <WeappComponent
                homeUrl={homeUrl}
                paddingLeft={nav.paddingLeft as number}
                paddingTop={nav.paddingTop as number}
                buttonColor={buttonColor}
              />
            )}
            <View
              className="minibar_center"
              style={{ paddingTop: `${nav.statusBarHeight as number}px` }}
            >
              {title}
            </View>
            {border && <View className="minibar_border" />}
          </View>
          {fixed && fixedPlaceholder && (
            <View style={{ height: `${nav.navHeight}px`, width: '100%' }} />
          )}
        </>
      )}
    </>
  )
}
