/**
 * @file index.js
 * @author sfe-sy(sfe-sy@baidu.com)
 */
import {initMixin} from './init';
import {stateMixin} from './state';
import {renderMixin} from './render';
import {eventsMixin} from './events';
import {lifecycleMixin} from './lifecycle';
import {warn} from '../util/index';

function MIP(options) {
    if (process.env.NODE_ENV !== 'production' && !(this instanceof MIP)) {
        warn('MIP is a constructor and should be called with the `new` keyword');
    }

    this._init(options);
}

initMixin(MIP);
stateMixin(MIP);
eventsMixin(MIP);
lifecycleMixin(MIP);
renderMixin(MIP);

export default MIP;
