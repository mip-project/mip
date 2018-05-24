/**
 * @file mip entry
 * @author sfe
 */

import Vue from 'vue';
import customElement from './custom-element/index';
// import customElementBuildInComponents from './components';
import util from './util';
import sandbox from './util/sandbox';
import layout from './layout';
import hash from './util/hash';
import viewer from './viewer';
import viewport from './viewport';
import Router from './router/index';
import {start} from './page/index';
import createRouter from './page/create-router';
import builtinComponents from './custom-element-components';

import sleepWakeModule from './sleepWakeModule';
import performance from './performance';

import './log/monitor';

import 'script-loader!deps/fetch.js';
import 'script-loader!fetch-jsonp';
import 'script-loader!document-register-element/build/document-register-element';

// mip1 的兼容代码
import mip1PolyfillInstall from './mip1-polyfill';

import './polyfills';

Vue.use(Router);

let mip = {
    Vue,
    customElement(tag, component) {
        Vue.customElement(tag, component);
    },
    util,
    viewer,
    viewport,
    hash,
    // 当前是否在 iframe 中
    isIframed: window !== top,
    standalone: window === top,
    sandbox,
    css: {}
};

if (window.MIP) {
    let exts = window.MIP;
    mip.extensions = exts;
}

window.MIP = window.mip = mip;

// before document ready
mip.push = function (extensions) {
    if (!mip.extensions) {
        mip.extensions = [];
    }

    mip.extensions.push(extensions);
};

// install mip1 polyfill
mip1PolyfillInstall(mip);

const router = createRouter(Router);

Vue.use(customElement, router);
// Vue.use(customElementBuildInComponents);
builtinComponents.register();

util.dom.waitDocumentReady(() => {
    // Initialize sleepWakeModule
    sleepWakeModule.init();

    // Initialize viewer
    viewer.init();

    // Find the default-hidden elements.
    let hiddenElements = Array.prototype.slice.call(document.getElementsByClassName('mip-hidden'));

    // Regular for checking mip elements.
    let mipTagReg = /mip-/i;

    // Apply layout for default-hidden elements.
    hiddenElements.forEach(element => element.tagName.search(mipTagReg) > -1 && layout.applyLayout(element));

    // Register builtin extensions
    // components.register();

    performance.start(window._mipStartTiming);
    performance.on('update', timing => viewer.sendMessage('performance_update', timing));

    // Show page
    viewer.show();

    start(mip, router);

    // clear cookie
    let storage = util.customStorage(2);
    storage.delExceedCookie();
});

export default mip;
