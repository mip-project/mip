/**
 * @file mip entry
 * @author sfe
 */

import './styles/mip.less';
import Vue from './vue/platforms/web/entry-runtime-with-compiler';
import customElement from './custom-element/index';
import customElementBuildInComponents from './components/index';
// import util from './util';

// fetch polyfill and fetch-jsonp
import 'fetch-jsonp';
import 'deps/fetch';

import Router from './router/index';
import page from './page/index';
import Vuex from './vuex/index';

Vue.use(Vuex);
/* global storeData */
let store = new Vuex.Store(window.storeData || {});

Vue.use(Router);
Vue.use(customElement, store);
Vue.use(customElementBuildInComponents);

let mip = {
    Vue,
    customElement: Vue.customElement,
    // util,
    // 当前是否在 iframe 中
    isIframed: window === top,
    standalone: window === top,
    Router,
    Store: Vuex
};

page.start(mip, store);

export default mip;
