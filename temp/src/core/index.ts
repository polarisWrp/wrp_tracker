import { createHistoryEvent } from './../utils/pv'
import {
  DefaultOptons,
  Options,
  TrackerConfig,
} from '../types/index'

const MouseEventList: string[] = [
  'click',
  'dblclick',
  'contextmenu',
  'mousedown',
  'mouseup',
  'mouseenter',
  'mouseout',
  'mouseover',
]

export default class Tracker {
  // 接收用户传入的值
  public data: Options

  constructor(options: Options) {
    this.data = Object.assign(
      this.initDef(),
      options
    )
    this.installTracker()
  }

  // 设置用户id
  public setUserId<
    T extends DefaultOptons['uuid']
  >(uuid: T) {
    this.data.uuid = uuid
  }

  // 用户自定义参数
  public setExtra<
    T extends DefaultOptons['extra']
  >(extra: T) {
    this.data.extra = extra
  }

  // 手动上报
  public sendTracker<T>(data: T) {
    this.reportTracker(data)
  }

  // Js报错
  private JsError() {
    this.errorEvent()
    this.promiseReject()
  }

  //  上报error事件
  private errorEvent() {
    window.addEventListener(
      'error',
      (e) => {
        this.reportTracker({
          event: 'error',
          targetKey: 'message',
          message: e.message,
        })
      }
    )
  }
  // 上报 promise报错
  private promiseReject() {
    window.addEventListener(
      'unhandledrejection',
      (e) => {
        e.promise.catch((err) => {
          this.reportTracker({
            event: 'promise',
            targetKey: 'message',
            message: err,
          })
        })
      }
    )
  }

  // dom事件监听，给需要监听的元素添加一个属性，用于区分是否需要监听target-key
  private targetKeyReport() {
    MouseEventList.forEach((mName) => {
      window.addEventListener(
        mName,
        (e) => {
          // 这里类型推断为Event;但是应该为MouseEvent,这样才能操作dom的api
          // 通过断言修正类型
          const target =
            e.target as HTMLElement
          const targetKey =
            target.getAttribute(
              'target-key'
            )
          if (targetKey) {
            this.reportTracker({
              eventName: mName,
              targetKey,
            })
          }
        }
      )
    })
  }

  /**
   * @description: 数据上报 navigator.sendBeacon
   * @description: navigator.sendBeacon第二个参数不支持json格式
   * @param {T} data 用户传递的数据
   */
  private reportTracker<T>(data: T) {
    // 请求参数整合用户输入的数据
    const param = Object.assign(
      this.data,
      data,
      { time: new Date().getTime() }
    )
    let headers = {
      type: 'application/x-www-form-urlencoded',
    }
    let blob = new Blob(
      [JSON.stringify(param)],
      headers
    )

    navigator.sendBeacon(
      this.data.requestUrl,
      blob
    )
  }

  // 初始化参数
  private initDef(): DefaultOptons {
    // 将重写的函数赋值给全局对象
    window.history['pushState'] =
      createHistoryEvent('pushState')
    window.history['replaceState'] =
      createHistoryEvent('replaceState')

    return <DefaultOptons>{
      sdkVersion: TrackerConfig.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false,
    }
  }

  /**
   * @description: 事件捕获
   * @param {string} mouseEvent 鼠标事件
   * @param {string} targetKey 标识传入的事件类型，例如history-pv
   * @param {T} data
   */
  private captureEvents<T>(
    mouseEvent: string[],
    targetKey: string,
    data?: T
  ) {
    mouseEvent.forEach((event) => {
      window.addEventListener(
        event,
        () => {
          console.log('监听到了。。。')
          this.reportTracker({
            event,
            targetKey,
            data,
          })
        }
      )
    })
  }

  private installTracker() {
    // 开启history监听
    if (this.data.historyTracker) {
      this.captureEvents(
        [
          'pushState',
          'replaceState',
          'popState',
        ],
        'history-pv'
      )
    }
    // 开启hash监听
    if (this.data.hashTracker) {
      this.captureEvents(
        ['hashchange'],
        'hash-pv'
      )
    }
    // 开启dom事件上报
    if (this.data.domTracker) {
      this.targetKeyReport()
    }
    // 开启js报错上报
    if (this.data.jsError) {
      this.JsError()
    }
  }
}
