/**
 * @file index.js
 * @author sfe-sy(sfe-sy@baidu.com)
 */

import config from '../config';
import {initUse} from './use';
import {initMixin} from './mixin';
import {initExtend} from './extend';
import {initAssetRegisters} from './assets';
import {set, del} from '../observer/index';
import {ASSET_TYPES} from 'shared/constants';
import builtInComponents from '../components/index';

import {
    warn,
    extend,
    nextTick,
    mergeOptions,
    defineReactive
} from '../util/index';

export function initGlobalAPI(MIP) {
    // config
    const configDef = {
        get() {
            return config;
        }
    };
    // configDef.get = () => config;
    if (process.env.NODE_ENV !== 'production') {
        configDef.set = () => {
            warn(
                'Do not replace the MIP.config object, set individual fields instead.'
            );
        };
    }

    Object.defineProperty(MIP, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    MIP.util = {
        warn,
        extend,
        mergeOptions,
        defineReactive
    };

    MIP.set = set;
    MIP.delete = del;
    MIP.nextTick = nextTick;

    MIP.options = Object.create(null);
    ASSET_TYPES.forEach(type => {
        MIP.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    MIP.options._base = MIP;

    extend(MIP.options.components, builtInComponents);

    initUse(MIP);
    initMixin(MIP);
    initExtend(MIP);
    initAssetRegisters(MIP);
}
