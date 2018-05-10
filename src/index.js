/**
 * @file mip entry
 * @author sfe
 */

import './styles/mip.less';
// import Vue from './vue/platforms/web/entry-runtime-with-compiler';
import Vue from './vue/platforms/web/entry-runtime';
import customElement from './custom-element/index';
import customElementBuildInComponents from './components';
import util from './util';

// fetch polyfill and fetch-jsonp
import 'fetch-jsonp';
import 'deps/fetch';

import Router from './router/index';
import page from './page/index';
import createRouter from './page/create-router';
import Vuex from './vuex/index';
import sandbox from './util/sandbox';
import viewer from './util/viewer';

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
page.start(mip, store, router);

Vue.use(customElement, store, router);
Vue.use(customElementBuildInComponents);

export default mip;
