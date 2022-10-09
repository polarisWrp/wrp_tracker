// pv 即页面访问量（page view）,记录用户对网站的访问
/* 
  主要监听 history 和 hash
  1. history无法通过popstate监听页面的前进后退（pushstate,replacestate）,需要重写函数
  2. hash使用hashchange监听
*/

export const createHistoryEvent = <T extends keyof History>(type: T) => {
  // 获取原始方法
  const originMethod = history[type]

  // 定义入参声明this为any类型， 或者将tsconfig中的noImplicitThis设置为false
  return function (this: any) {
    const res = originMethod.apply(
      this,
      arguments
    )
    //重写函数 1.创建自定义事件
    const e = new Event(type)
    // 2.派发事件
    window.dispatchEvent(e)
    return res
  }
}
