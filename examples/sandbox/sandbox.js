(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (factory());
}(this, (function () {
    'use strict';

    /**
     * @file sandbox.js 提供组件内部使用的沙盒环境，主要用于隔离全局环境和限制部分API能力
     * @author sfe-sy(sfe-sy@baidu.com)
     */

    /**
     * 1、镜像了window对象和document对象，且其值会跟原对象获取保持实时一致，确保不会直接访问原对象
     * 2、限制部分API如："documen.createElement"
     * 3、保持document.cookie的使用不受影响，setTimeout、setInterval功能不受影响但会改变其this指针的指向
     *
     * 使用示例（在局部环境中）：
     *
     * import sandbox from 'sandbox';
     * let {window, document} = sandbox;
     * let {
     *     alert,
     *     close,
     *     confirm,
     *     prompt,
     *     eval
     * } = window;
     *
     */

    /**
     * 拷贝时不考虑的window中的属性
     *
     * @type {Array}
     */
    const windowExcludeKey = [
        // 移除型
        'alert',
        'close',
        'confirm',
        'prompt',
        'eval',
        // 特殊型
        'document',
        'setTimeout',
        'setInterval'
    ];

    /**
     * 拷贝时不考虑的document中的属性
     *
     * @type {Array}
     */
    const documentExcludeKey = [
        // 移除型
        'createElement',
        'createElementNS',
        'write',
        'writeln',
        // 特殊型
        'cookie'
    ];

    /**
     * 是否为函数
     *
     * @param  {Function} fn 数据
     * @return {boolean}     是否为函数
     */
    function isFun(fn) {
        return Object.prototype.toString.call(fn).indexOf('Function') !== -1;
    }

    /**
     * 得到一个对象的拷贝，表面拷贝，值全都是通过getter拿原始的，同时过滤部分不要的
     *
     * @param  {Object}     obj 原始对象
     * @param  {Array}      exclude 排除项
     * @return {Object}     拷贝对象
     */
    function getSafeObjCopy(obj, exclude) {

        let newObj = {};
        let properties = {};

        /* eslint-disable fecs-use-for-of */
        for (let key in obj) {

            /* eslint-enable fecs-use-for-of */
            if (exclude.indexOf(key) === -1) {
                properties[key] = {
                    get() {
                        let value = obj[key];
                        if (isFun(value)) {
                            return value.bind(obj);
                        }

                        return value;
                    }
                };
            }

        }

        Object.defineProperties(newObj, properties);

        return newObj;
    }

    /**
     * 得到document拷贝对象之后的处理
     *
     * @param  {Object} doc 新document对象
     */
    function processDocumentObj(doc) {
        // 处理document.cookie
        Object.defineProperties(doc, {
            cookie: {
                get() {
                    return document.cookie;
                },
                set(val) {
                    document.cookie = val;
                }
            }
        });
    }

    /**
     * 创建延时函数体
     *
     * @param  {string} type 延时函数类型
     * @param  {Object} self 延时函数运行时环境，此处为自建window对象
     * @return {Function}    延时函数体
     */
    function timeoutFun(type, self) {
        return function (fn, delay, ...args) {

            if (!isFun(fn)) {

                /* eslint-disable no-console */
                console.warn(`${type}请使用函数作参数`);

                /* eslint-enable no-console */
                return;
            }

            return window[type](() => {
                fn.apply(self, args);
            }, delay);

        };
    }

    /**
     * 得到window拷贝对象之后的处理
     *
     * @param  {Object} win 新window对象
     */
    function processWindowObj(win) {
        // 将document对象指向自定义的document
        win.document = this.document;

        // 处理setTimeout
        win.setTimeout = timeoutFun('setTimeout', win);

        // 处理setInterval
        win.setInterval = timeoutFun('setInterval', win);
    }

    /**
     * 创建一个安全的对象
     *
     * @param  {Object} obj 原始对象
     * @param  {Object} opt 选项参数
     * @return {Object}     被创建的对象
     */
    function createSafeObj(obj, opt = {}) {

        let {exclude, cb} = opt;
        let newObj = getSafeObjCopy(obj, exclude);
        cb && cb(newObj);

        return newObj;
    }

    /**
     * Sandbox构造函数
     *
     * @class
     */
    class Sandbox {

        constructor() {
            // 沙盒document
            this.document = createSafeObj(
                document,
                {
                    exclude: documentExcludeKey,
                    cb: processDocumentObj
                }
            );

            // 沙盒window
            this.window = createSafeObj(
                window,
                {
                    exclude: windowExcludeKey,
                    cb: processWindowObj.bind(this)
                }
            );
        }

    }

    var sandbox = new Sandbox();

    // (function fn() {
    //     let sandbox = new Sandbox();
    //     let {window, document} = sandbox;
    //     let {
    //         alert,
    //         close,
    //         confirm,
    //         prompt,
    //         eval
    //     } = window;
    //     console.log(window, document, window.document, alert, close, confirm, prompt, eval)
    // })();

    let {window: window$1, document: document$1} = sandbox;
    let {
        alert,
        close,
        confirm,
        prompt,
        // eval // eval打包不给通过
    } = window$1;

    console.log(
        'window: ', window$1, '\n',
        'document: ', document$1, '\n',
        'window.document: ', window$1.document, '\n',
        'alert: ', alert, '\n',
        'close: ', close, '\n',
        'confirm: ', confirm, '\n',
        'prompt: ', prompt, '\n',
        'eval: ', window$1.eval, '\n',
        'document.createElement: ', document$1.createElement, '\n',
        'document.createElementNS: ', document$1.createElementNS, '\n',
        'document.write: ', document$1.write, '\n',
        'document.writeln: ', document$1.writeln
    );

})));
