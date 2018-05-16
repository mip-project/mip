/**
 * @file mip entry
 * @author sfe
 */

import Vue from 'vue';
import customElement from './custom-element/index';
import customElementBuildInComponents from './components';
import util from './util';

import './log/monitor';

// mip1 的兼容代码
// import './mip1-polyfill';

import Router from './router/index';
import {start} from './page/index';
import createRouter from './page/create-router';
import Vuex from './vuex/index';
import sandbox from './util/sandbox';
import viewer from './util/viewer';

// mip1 polyfill
import './mip1';

viewer.init();

Vue.use(Router);
Vue.use(Vuex);
/* global storeData */
let store = new Vuex.Store(window.storeData || {});

let mip = {
    Vue,
    customElement(tag, component) {
        Vue.customElement(tag, component);
    },
    util,
    // 当前是否在 iframe 中
    isIframed: window === top,
    standalone: window === top,
    Router,
    Store: Vuex,
    sandbox
};

const router = createRouter(Router);
start(mip, store, router);

Vue.use(customElement, store, router);
Vue.use(customElementBuildInComponents);

window.mip = mip;
export default MIP;
