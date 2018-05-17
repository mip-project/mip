/**
 * @file mip entry
 * @author sfe
 */

import Vue from 'vue';
import customElement from './custom-element/index';
import customElementBuildInComponents from './components';
import util from './util';
import sandbox from './util/sandbox';
import templates from './util/templates';
import hash from './util/hash';
import viewer from './util/viewer';
import viewport from './util/viewport';
import Router from './router/index';
import {start} from './page/index';
import createRouter from './page/create-router';
import Vuex from './vuex/index';

import sleepWakeModule from './sleepWakeModule';
import Resources from './resources';
import performance from './performance';

import './log/monitor';

// mip1 的兼容代码
// import mip1PolyfillInstall from './mip1-polyfill';
// import './polyfills';

Vue.use(Router);
Vue.use(Vuex);
/* global storeData */

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
    isIframed: window === top,
    standalone: window === top,
    Router,
    Store: Vuex,
    sandbox,
    css: {},
    prerenderElement: Resources.prerenderElement
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
// mip1PolyfillInstall(mip);

const store = new Vuex.Store(window.storeData || {});
const router = createRouter(Router);

Vue.use(customElement, store, router);
Vue.use(customElementBuildInComponents);

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
    hiddenElements.forEach(function (element) {
        if (element.tagName.search(mipTagReg) > -1) {
            layout.applyLayout(element);
        }
    });
    // Register builtin extensions
    // components.register();

    performance.start(window._mipStartTiming);

    performance.on('update', function (timing) {
        viewer.sendMessage('performance_update', timing);
    });

    // Show page
    viewer.show();

    start(mip, store, router);

    // clear cookie
    let storage = util.customStorage(2);
    storage.delExceedCookie();
});

export default mip;
