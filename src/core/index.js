/**
 * @file index.js
 * @author sfe-sy(sfe-sy@baidu.com)
 */

/* eslint-disable fecs-valid-class-jsdoc */

import MIP from './instance/index';
import {initGlobalAPI} from './global-api/index';
import {isServerRendering} from 'core/util/env';
import registerCustomElement from '../custom-element/index';
import buildInComponents from '../componets/index';

initGlobalAPI(MIP);

Object.defineProperty(MIP.prototype, '$isServer', {
    get: isServerRendering
});

Object.defineProperty(MIP.prototype, '$ssrContext', {
    get() {
        /* istanbul ignore next */
        return this.$vnode && this.$vnode.ssrContext;
    }
});

MIP.version = '__VERSION__';

// 内置初始化 custom element 机制
MIP.use(registerCustomElement);

// 植入内置的 MIP 组件
buildInComponents(MIP);

export default MIP;
