/**
 * @file index.js
 * @author sfe-sy(sfe-sy@baidu.com)
 */
import MIP from './instance/index';
import {initGlobalAPI} from './global-api/index';
import {isServerRendering} from 'core/util/env';

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

export default MIP;
