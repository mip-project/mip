/**
 * @file mip entry
 * @author sfe
 */

import './styles/mip.less';
import Vue from './vue/platforms/web/entry-runtime-with-compiler';
import customElement from './custom-element/index';
import customElementBuildInComponents from './components/index';
import util from './util';

// fetch polyfill and fetch-jsonp
import 'fetch-jsonp';
import 'deps/fetch';

import Router from './router/index';
import page from './page/index';
import createRouter from './page/create-router';
import Vuex from './vuex/index';
import sandbox from './util/sandbox';

Vue.use(Router);
Vue.use(Vuex);
/* global storeData */
let store = new Vuex.Store(window.storeData || {});

let mip = {
    Vue,
    customElement(tag, component) {
        Vue.__customElements__.push({tag, component});
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
