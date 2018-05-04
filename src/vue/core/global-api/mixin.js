/**
 * @file mixin.js
 * @author sfe-sy(sfe-sy@baidu.com)
 */

import {mergeOptions} from '../util/index';

export function initMixin(MIP) {
    MIP.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this;
    };
}
