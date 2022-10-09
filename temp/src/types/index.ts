/** 
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带Tracker-key点击事件上报
 * @sdkVersion sdk版本
 * @extra 透传字段 
 * @jsError js和 promise报错异常上报 
*/
export interface DefaultOptons {
  uuid: string | undefined,
  requestUrl: string | undefined,
  historyTracker: boolean,
  hashTracker: boolean,
  domTracker: boolean,
  sdkVersion: string | number,
  extra: Record<string,any> | undefined,
  jsError:boolean
}

// 用户入参
export interface Options extends Partial<DefaultOptons> {
  requestUrl:string //必传参数
}

// 版本枚举
export enum TrackerConfig {
  version = '1.0.0'
}