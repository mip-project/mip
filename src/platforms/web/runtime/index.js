/**
 * @file index.js
 * @author sfe-sy(sfe-sy@baidu.com)
 */

/* eslint-disable no-console */

import MIP from 'core/index';
import config from 'core/config';
import {extend, noop} from 'shared/util';
import {mountComponent} from 'core/instance/lifecycle';
import {
    devtools,
    inBrowser,
    isChrome
} from 'core/util/index';

import {
    query,
    mustUseProp,
    isReservedTag,
    isReservedAttr,
    getTagNamespace,
    isUnknownElement
} from 'web/util/index';

import {patch} from './patch';
import platformDirectives from './directives/index';
import platformComponents from './components/index';

// install platform specific utils
MIP.config.mustUseProp = mustUseProp;
MIP.config.isReservedTag = isReservedTag;
MIP.config.isReservedAttr = isReservedAttr;
MIP.config.getTagNamespace = getTagNamespace;
MIP.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(MIP.options.directives, platformDirectives);
extend(MIP.options.components, platformComponents);

// install platform patch function
MIP.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
MIP.prototype.$mount = function (el, hydrating) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating);
};

// devtools global hook

/* istanbul ignore next */
MIP.nextTick(() => {
    if (config.devtools) {
        if (devtools) {
            devtools.emit('init', MIP);
        }
        else if (process.env.NODE_ENV !== 'production' && isChrome) {
            // console[console.info ? 'info' : 'log'](
            //     'Download the MIP Devtools extension for a better development experience:\n'
            //     + 'https://github.com/vuejs/mip-devtools'
            // );
        }
    }

    if (process.env.NODE_ENV !== 'production'
        && config.productionTip !== false
        && inBrowser
        && typeof console !== 'undefined'
    ) {
        console[console.info ? 'info' : 'log'](
            'You are running MIP in development mode.\n'
            + 'Make sure to turn on production mode when deploying for production.\n'
            + 'See more tips at https://vuejs.org/guide/deployment.html\n'
        );
    }

}, 0);

export default MIP;
