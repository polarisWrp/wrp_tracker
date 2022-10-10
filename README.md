## 埋点
### 埋点就是数据采集-数据处理分析和挖掘；如用户暂停时间，用户点击次数；以此分析用户喜好

## 技术架构 ts+rollup
### rollup打包相比于webpack更加干净

## navigator.sendBeacon 
- 相比于 Xml请求，它可以在页面关闭了也完成请求
- 使用 sendBeacon() 方法会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能;
- 数据是通过 HTTP POST请求发送的

## 发布到npm源 
### import 导入时，查找规则为 browser + mjs > module > browser + cjs > main