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
import Vuex from './vuex/index';
import sandbox from './util/sandbox';

Vue.use(Vuex);
/* global storeData */
let store = new Vuex.Store(window.storeData || {});

Vue.use(customElement, store);
Vue.use(customElementBuildInComponents);
Vue.use(Router);

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

page.start(mip, store);

export default mip;
