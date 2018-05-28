## Page

> wangyisheng (wangyisheng@outlook.com)

熟悉 MIP 的开发者可能了解，MIP 全称 Mobile Instant Pages，因此是以 __页面 (Page)__ 为单位来运行的。开发者通过改造/提交一个个页面，继而被百度收录并展示。

但以页面为单位带来一个问题：当一个 MIP 页面中存在往其他页面跳转的链接时，就会使浏览器使用加载页面的默认行为来加载新页面。这“第二跳”的体验比起从搜索结果页到 MIP 页面的“第一跳”来说相去甚远。

新版本的 MIP 为了解决这个问题，引入了 Page 模块。它的作用是 __把多个页面以一定的形式组织起来，让它们互相切换时拥有和单页应用一样的切换效果__，而不是浏览器默认的切换效果。这个功能大部分对开发者是透明的，但也需要开发者遵守一些页面的编写规范，这也是本篇文档的主要内容。

### 页面结构

1. 所有页面 __必须__ 包含 `<html>`, `<head>`, `<body>`，组织方式和常规 HTML 相同：

    ```html
    <html>
        <head></head>
        <body></body>
    </html>
    ```

2. 所有页面 __必须__ 在 `<body>` 的 __最后__ 编写或引用 mip 相关的 js。其中顺序是：
    1. mip script (MIP.watch)
    2. mip.js
    3. 各组件的 js。如有相互依赖，把被依赖项写在前面。

    举例来说，一个页面引用了两个组件 `component-a` 和 `component-b`，并且 `component-b` 依赖 `component-a` （例如在 `component-b` 的模板中出现了 `<mip-component-a>`），那么这个页面的组织结构应该是：

    ```html
    <body>
        <!-- DOM or MIP Component -->

        <script type="application/mip-script">
            MIP.watch('something', () => console.log('something changed.'));
        </script>

        <script type="text/javascript" src="https://somecdn/mip.js">

        <script type="text/javascript" src="https://somecdn/mip-component-a.js">
        <script type="text/javascript" src="https://somecdn/mip-component-b.js">
    </body>
    ```

3. MIP 页面中的链接依然使用 `<a>`，具体如下：

    1. 如果跳转到其他 __同域名的 MIP 页面__，使用 `mip-link` 属性或者 `data-type="mip"`：
        ```html
        <a href="./anotherMIPPage.html" mip-link>xxx</a>
        <a href="./anotherMIPPage.html" data-type="mip">xxx</a>
        ```
        1. `href` 指向当前域名的页面，暂时不允许跨域
        2. 不允许使用 `target` 属性

    2. 如果跳转到其他页面 ，不添加 `mip-link` 属性或者 `data-type="mip"`，进行普通跳转：
        ```html
        <a href="https://www.another-site.com/">
        ```

4. 页面内元素的样式中 `z-index` 不能超过 10000，否则会引起页面切换时的样式遮盖问题。

### MIP Shell

在实际项目中，我们很可能会有一些独立于页面内容之外的相对固定的部分，我们称之为外壳 (Shell)。在页面切换时，Shell 部分一般不跟随页面内容进行过场动画。如果用 Vue 来描述的话，Shell 就是位于 `<router-view>` 之外的部分。

一个最典型的 Shell 的例子就是头部标题栏：

![头部标题栏](http://boscdn.bpc.baidu.com/assets/mip2/mip-shell.png)

开发者可以在每个页面中使用 `<mip-shell>` 标签来定义 Shell 的各项配置。目前 MIP 仅提供头部 Shell，但后续会陆续提供多种类型，多种样式的 Shell 供开发者选择。

#### 配置方法

在页面的 `<body>` 标签内编写 `<mip-shell>` 标签，写法如下：

```html
<html>
    <head></head>
    <body>
        <mip-shell>
            <script type="application/json">
                {
                    key: value
                }
            </script>
        </mip-shell>

        <!-- mip script -->
    </body>
</html>
```

注意点：

1. 一个页面 __至多只允许存在一个__ `<mip-shell>` 配置项。可以不写则使用默认配置项。
2. `<mip-shell>` 的位置 __必须__ 位于 `<body>` 内部，并且 __必须__ 在 mip script，mip.js 和组件 js 文件(页面级别第二点)之前。
3. `<mip-shell>` 内部只允许存在一个 `<script>` 节点，并且 `type` 必须设置为 `application/json`。
4. `<script>`内部是一个合法的 JSON 对象。

#### 配置项

目前 `<mip-shell>` 支持的配置项包括：

1. `view` 对象。用以配置整站的一些数据。__每个页面都应当包含相同的 `view` 配置__
2. `header` 对象。用以配置头部标题栏的各项内容

* view.isIndex
    __boolean__，默认值：`false`

    指明当前页面是否为首页。站点首页在头部标题栏左边不出现后退按钮。

* header.show
    __boolean__，默认值：`false`

    指明当前页面是否需要展现头部标题栏。

* header.title
    __string__, 默认值：当前页面 `<title>` 中的内容

    配置头部中间的标题，这部分将显示在头部标题栏中，超长会自动截断。

    ![MIP Shell header title](http://boscdn.bpc.baidu.com/assets/mip2/mip-title.png)

* header.logo
    __string__, 默认值：无

    配置头部左侧的 LOGO 的 URL，建议是一个正方形的图片，长宽不小于 64px。如果不配置则不显示 LOGO，__不会留白__。

    ![MIP Shell header logo](http://boscdn.bpc.baidu.com/assets/mip2/mip-logo.png)

* header.buttonGroup
    __Array__, 默认值：`[]`

    配置头部右侧的按钮区域出什么样的按钮及其文字，点击行为等。这个配置项是一个由对象组成的数组。配置顺序从左到右。

    ![MIP Shell header button](http://boscdn.bpc.baidu.com/assets/mip2/mip-button.png)

    MIP 内置的按钮分为三种，分别是 `icon`, `button`, `dropdown`，用 `type` 进行区分。__如果不填写 `type`，则这个配置对象会被跳过，不进行渲染__。这三种的配置方法不尽相同，下面详细介绍。`buttonGroup` 内部所有的配置项均 __没有__ 默认值。

    1. icon

        `type` 为 `icon` 时需要额外提供 `name`，`text` 和 `link` 三个属性。

        * name: __string__。__必填__。标识按钮的名字。在点击按钮后，会向 __当前页面__ 触发名为 `appheader:click-[name]` 的事件供其他组件监听并处理。例如当 `name` 为 `search` 时，事件名称为 `appheader:click-search`。

        * text: __string__。__必填__。标识选用哪种图标。内部使用 material icons，开发者可以在 [这里](https://material.io/tools/icons/?style=baseline) 找到所有可用的图标。

        * link: __string__。__选填__。标识点击之后跳转页面的 URL。__只能跳往站内的 MIP 页面__。如果不填，则点击后不跳转。

        icon 正确配置示例：

        ```json
        {
            "buttonGroup": [
                {
                    "type": "icon",
                    "name": "search",
                    "text": "search",
                    "link": "/anotherMIPPage.html"
                }
            ]
        }
        ```

    2. button

        `type` 为 `button` 时需要额外提供 `name`, `text`, `link` 和 `outline` 四个属性。

        `name`,`link` 两个属性和 `icon` 的情况类似，不再重复。

        * text: __string__。__必填__。按钮中的文字内容。

        * outline: __boolean__。__选填__。默认值：`false`。可以用来配置按钮的两种样式，预览效果如下：（“关注”按钮 `outline` 为 `false`，“发消息”按钮 `outline` 为 `true`）

        ![MIP Shell header button outline](http://boscdn.bpc.baidu.com/assets/mip2/mip-button-outline.png)

        button 正确配置示例：

        ```json
        {
            "buttonGroup": [
                {
                    "type": "button",
                    "name": "chat",
                    "text": "发消息",
                    "link": "/anotherMIPPage.html",
                    "outline": true
                }
            ]
        }
        ```

    3. dropdown

        `type` 为 `dropdown` 时需要额外提供 `items` 属性。它又是一个数组，内部可以包裹的对象需要提供 `name`, `text`, `link` 三个属性，用以标明下拉菜单点开后包含哪些按钮。这三个属性和之前 `type` 等于 `button` 时完全相同，不再重复。效果预览如下：

        ![MIP Shell header button dropdown](http://boscdn.bpc.baidu.com/assets/mip2/mip-button-dropdown.png)

        dropdown 正确配置示例：

        ```json
        {
            "buttonGroup": [
                {
                    "type": "dropdown",
                    "items": [
                        {
                            "name": "subscribe",
                            "text": "关注",
                            "link": "/anotherMIPPage.html"
                        },
                        {
                            "name": "chat",
                            "text": "发消息"
                        }
                    ]
                }
            ]
        }
        ```

#### 完整示例

```html
<mip-shell>
    <script type="application/json">
        {
            "header": {
                "title": "Mip Index",
                "logo": "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3010417400,2137373730&fm=27&gp=0.jpg",
                "buttonGroup": [
                    {
                        "type": "button",
                        "name": "subscribe",
                        "text": "关注",
                        "link": "/anotherMIPPage.html"
                    },
                    {
                        "type": "button",
                        "name": "chat",
                        "text": "发消息",
                        "outline": true
                    },
                    {
                        "type": "icon",
                        "name": "search",
                        "text": "search",
                        "link": "/searchMIPPage.html"
                    },
                    {
                        "type": "dropdown",
                        "items": [
                            {
                                "name": "subscribe",
                                "text": "关注",
                                "link": "/anotherMIPPage.html"
                            },
                            {
                                "name": "chat",
                                "text": "发消息"
                            }
                        ]
                    }
                ]
            },
            "view": {
                "isIndex": true
            }
        }
    </script>
</mip-shell>
```

#### 默认配置

如果开发者没有在页面中编写 `<mip-shell>`，那么一套默认配置会被应用。默认配置如下：

```json
{
    header: {
        show: false,
        title: '',
        logo: '',
        buttonGroup: []
    },
    view: {
        isIndex: false
    }
};
```

### 页面切换方案 (扩展)

*这一部分为扩展阅读，仅供开发者了解 MIP 内部的运行机制所用。跳过这部分并不影响 MIP 的正常使用*

Page 最大的工作在于将多个独立的页面融合在一起，让它们拥有像单页应用(SPA)那样的切换效果和使用体验，解决“第二跳”的问题。这一部分简单讨论一下它的实现方案。

方案核心主要有以下几点：

1. MIP Page 借助 iframe 实现了页面之间的互相隔离
2. 通过 iframe 和外界的通讯来实现页面之间的通讯和传递数据
3. 为了加载性能考虑，第一个页面维持原状，不放入 iframe 之中。

在页面结构上，除了首个页面的 DOM 全部保留之外，后续页面均以 iframe 的形式存在。因为 DOM 结构的原因，在后续说明中，__首个页面__ 等价于 __外部页面__ 或者 __外部__，__后续页面__ 等价于 __内部页面__ 或者 __内部__，这里的“内外”指的就是代码执行于 iframe 的内部或者外部。

我们以第一个页面和后续页面两种情况来分开讨论一下 Page 的工作机理。

#### 首个页面

因为 MIP 页面是由普通 HTML 标签(如 `<div>`, `<span>` 等)和自定义标签(主要是各类 MIP 组件，如 `<mip-data>`, `<mip-img>` 等)组成，因此两者都具有 __加载到 DOM 树中立刻能够由浏览器渲染__ 的能力（即无需等待其他 JS 执行。与之相对的如 Vue 的容器 `<div id="app"></div>` 在 Vue 生命周期执行之前只是一个空节点）。

正因为这种能力，在 Page 实际运行之前页面已经渲染成功了，因此如果 Page 再将内容放入 iframe 或者重新加载一个 iframe 只会减慢或者重复请求数据，影响页面性能。所以 MIP 采取了第一个页面不在 iframe 中的方案。

Page 在首个页面加载时，主要做了如下的工作：

1. 初始化路由相关的内容。这其中可分为几个步骤：
    1. 绑定路由变化时的回调函数。在回调函数中，先判断目标页面 iframe 是否存在，如不存在则创建。之后进行切换页面的动画效果。
    2. 监听 iframe 内部发出的 `message` 事件，根据事件内容选择 `history.push`, `history.replace` 和 `location.href` 的某一种进行操作。
    3. 为所有含有 `mip-link` 或者 `data-type="mip"`属性的 `<a>` 链接绑定事件，在回调中根据属性来决定使用 `router.push`, `router.replace` 或者 `location.href` 直接跳转。

2. 初始化 Shell 相关的内容。这里又分为两步：
    1. 读取 `<mip-shell>` 的配置，渲染头部标题栏，插入为 `<body>` 的第一个子节点
    2. 监听 iframe 内部发出的 `message` 事件，读取内部的配置更新头部导航栏

3. 执行 MIP 自定义脚本 (`MIP.watch`)

4. 在 `<body>` 上设置 `mip-ready` 属性，以表示初始化完成

#### 后续页面

在首个页面执行的 Page 会在检测到路由变化时，创建一个 iframe 以加载目标页面。目标页面同时也是一个 MIP 页面，因此也有 Page 代码在其内部执行。在 iframe 内部的 Page 主要做了如下的工作：

1. 将当前页面信息添加到外部(首个页面)的路由信息中。`<a>` 链接的注册和首个页面类似，差别在于不是用 `router.push`, `router.replace` 或者 `location.href`，而是直接通过 `postMessage` 向外部通讯，请求外部处理路由变化。

2. 读取 `<mip-shell>` 的配置，将配置通过 `postMessage` 传递到外部，供外部更新头部标题栏

3. 执行 MIP 自定义脚本 (`MIP.watch`)

4. 在 `<body>` 上设置 `mip-ready` 属性，以表示初始化完成




