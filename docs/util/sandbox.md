## Sandbox（沙盒）

> zhangzhiqiang(zhiqiangzhang37@163.com)

由于组件是开放的，任何开发者想要使用一个新的功能，都可以写一个新的组件出来。

为了方便管理，也为了 mip2.0 开发的站点的性能更优考虑，**我们在组件中使用了一个沙盒的机制**。事实上基于性能以及代码维护层面考虑，部分 `API` 是约定不应使用的，但约定无法从根本上杜绝使用，所以使用了沙盒这种强制的手段。

沙盒的机制一句话概括就是 —— 在沙盒的环境中运行指定的代码，这个环境限制了部分能力/API的使用


### 被限制的能力/API列表

* 限制访问全局 `window` 对象，沙盒环境中 `window` 对象是局部的
	* 限制使用 `alert`、`window.alert`
	* 限制使用 `close`、`window.close`
	* 限制使用 `confirm`、`window.confirm`
	* 限制使用 `prompt`、`window.prompt`
	* 限制使用 `eval`、`window.eval`
	* 限制使用 `opener`、`window.opener`
	* `parent` 对象如果指向当前页面 `window`、则被重写为指向局部的 `window` 对象
	* `top` 对象如果指向当前页面 `window`、则被重写为指向局部的 `window` 对象
	* `self` 被指向了局部的 `window` 对象
	* `setTimeout`、	`window.setTimeout` 被重写过，内部的this指向了局部的 `window` 对象
	* `setInterval`、`window.setInterval` 被重写过，内部的this指向了局部的 `window` 对象

* 限制访问全局 `document` 对象，沙盒中 `document` 对象是局部的
	* 限制使用 `document.createElement`
	* 限制使用 `document.createElementNS`
	* 限制使用 `document.write`
	* 限制使用 `document.writeln`
