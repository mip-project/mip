# mip2 命令行工具

mip2 CLI 是官方提供的命令行工具，它提供了脚手架、调试、预览、校验、构建等功能，方便开发者快速开发 MIP 页面及自定义组件。


## 1. 依赖环境

mip2 CLI 使用 NPM 安装，依赖 Node 环境，推荐

- [Node.js](https://nodejs.org/) (>=8.x)

- [Git](https://git-scm.com/)


## 2. 安装 mip2 CLI

打开命令行工具，输入：

``` bash
$ npm install -g mip2
```

输入 `mip2 -V`，若能正常显示版本号，说明已经安装成功。


## 3. mip2 CLI 使用

### 创建项目脚手架

``` bash
$ mip2 init [project-name]
```

示例：

``` bash
$ mip2 init myproject
```

生成项目结构如下

```
myproject
    ├── common                          // 组件公用代码，如 utils 等
    ├── components                      // 组件目录，编写组件代码
    │   └── mip-example
    │       ├── mip-example.md          // 组件功能、属性说明
    │       ├── mip-example.vue         // 组件本身
    │       └── test
    │           └── mip-example.html    // 单个组件测试、预览
    ├── mip.config.js                   // 调试服务器配置
    ├── package.json
    ├── static                          // 静态资源，如图片、字体
    └── test
        └── index.html                  // 页面测试预览
```

我们可以在项目的 `components` 目录中开发站点所需的自定义组件，然后依据 `test/index.html` 页面模板，引用官方或自定义组件来实现 MIP 页面。

通常情况下，官方提供的[通用组件库](https://github.com/mip-project/mip-components)已经能满足站点的基本需求。如果站点有使用复杂组件的场景，我们可以[编写自定义组件](./start-writing-first-mip.md)，并通过第三方组件仓库（TODO）进行提交，通过审核上线后，即能使用。

同时，我们也欢迎开发者向官方通用组件库[贡献优秀的组件](./contribute-to-official-repo.md)。

### 启动调试服务器

命令行工具内置了简单的调试服务器，方便开发者调试组件和页面。在项目根目录运行

``` bash
$ mip2 dev
```

默认会在 `8111` 端口启动服务器，并自动调起浏览器打开 `test/index.html` ，实现预览和调试。在修改组件和页面的代码时，无需手动重启和刷新，服务器内部已经帮我们实现了这一功能。

了解详细用法：[调试组件](./component-testing.md)

### 组件和页面校验

MIP 组件和页面都需要遵循特定的[开发规范](./xxx.md)，开发者提交站点 url 和组件代码时，系统会进行审核和校验。命令行工具提供了校验功能，方便我们在开发阶段就能按照相关规范进行开发和调整。

``` bash
# 校验 mip 组件，输入组件目录
$ mip2 validate -c ./components

# 校验 mip 页面，输入页面路径
$ mip2 validate -p page.html
```

我们可以根据校验结果，对不符合规范的组件/页面进行相应的改进，校验通过后再进行提交。

### 构建组件

自定义组件开发完成后，可以使用 `mip2 build` 命令将组件代码打包成为对应的 `mip-组件名.js` 文件，供发布使用。

在项目根目录运行

``` bash
$ mip2 build
```

默认将在 /dist 目录产出打包压缩后的组件资源。了解详细用法：[构建组件](./xxxx.md)
