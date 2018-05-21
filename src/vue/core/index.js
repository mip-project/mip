/**
 * @file index.js
 * @author sfe-sy(sfe-sy@baidu.com)
 */

/* eslint-disable fecs-valid-class-jsdoc */

import Vue from './instance/index';
import {initGlobalAPI} from './global-api/index';
import {isServerRendering} from 'core/util/env';

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
    get() {
        /* istanbul ignore next */
        return this.$vnode && this.$vnode.ssrContext;
    }
});

Vue.version = __VERSION__;

export default Vue;
