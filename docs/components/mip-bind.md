## mid-bind 升级

开发者仍然可以使用 [mip1](https://www.mipengine.org/examples/mip-extensions/mip-bind.html) 提供的语法，使用 `mip-data` 来设置初始数据、使用 `m-bind` 和 `m-text` 来绑定数据、使用全局方法 `MIP.setData(data)` 来修改数据。

----------

####**升级点：**

1. 使用 `MIP.setData(data)` 设置数据时，支持多层级的复杂对象的数据源覆盖。

2. 新增 `MIP.watch(value, cb)` 方法来实现观察数据变化，并执行相应的操作。 `value` 为数据源中的属性名，多层数据可以以 `.` 连接，允许是单个字符串或字符串数组。`cb` 接收三个参数，分别是`directive` (默认为 null )， `oldVal`，`newVal`。

3. 支持开发者在 MIP 页面中编写 JS 操作 state，要求使用以下 type 作为标识：

    `<script type="application/mip-script"></script>`

	在这个特殊 type 的 script 中仅允许操作 state。建议操作有 `MIP.watch` 和 `MIP.setData`

4. 支持多页共享 state：
	
	在 mip2 的环境里，我们提供整站沉浸式的体验，如果要打造复杂的业务场景，页面与页面之间共享数据是必不可少的

	6. 在原 `mip-data` 的基础上，mip2 有整站共享数据的概念。设置数据时，在需要共享的数据前添加 # 标识（仅检测数据第一层），该数据将被提升成共享态：
```javascript
<mip-data>
    <script type="application/json">
        {
            "#globalState": {},
            "pageState": []
        }
     </script>
 </mip-data>
 ```
 7. 提升为共享态的数据源将在每个页面都能读取和使用到：**如果**页面使用到某个数据而页面自身的初始数据中不存在该数据，将查找共享数据；**如果**页面自身有与共享数据冲突的字段
		8. 页面自身的数据没有 `#` 标识，将优先读取页面数据，不影响共享数据
		9. 页面自身的数据带有 `#` 标识，提升为共享数据，覆盖之前同样字段的共享数据

    3. 调用 MIP.setData 修改数据时
	    4. 如果需要指定修改共享数据，则在数据前添加 `#` 标识，如 `MIP.setData({'#global': 1})`
	    5. 其余情况，mip2 会自行判断该数据是共享数据还是当前页面的数据，如果要修改的数据字段既存在于共享也存在于页面的数据源，将优先修改页面的数据源