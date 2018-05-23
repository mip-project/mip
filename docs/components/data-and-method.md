## MIP 2.0 的数据和方法

关于 MIP 2.0 的数据设置、修改、规范，请查看 `mip-bind 升级` 章节，本节将介绍关于数据应用的实践。

----------

#### **mip2 要求开发者以类单向数据流的方式使用数据**
仅允许在 html 页面使用 m-bind 来绑定数据，数据以 `props` 的形式传递。
如果组件内部实现存在自定义标签嵌套的情况，传递数据时 `应` 按照 vue 父子组件的写法来传递数据。

组件内部 ***不允许*** 使用 m-bind: 语法来绑定全局数据。

组件内部可以通过调用 `MIP.setData` 来修改全局数据，以此触发重新渲染。

index.html：
```<mip-a m-bind:globaldata="globalState"></mip-a>```


mip-a 组件内部：
```javascript
template: `
     <div>
         <mip-b :globaldata="globaldata"></mip-b>
         <p></p>
     </div>
 `,
 props: {
     globaldata: {
         type: Object
     }
 }
```