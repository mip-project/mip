/**
 * @file mip entry
 * @author sfe
 */

import Vue from './vue/platforms/web/entry-runtime-with-compiler';
import customElement from './custom-element/index';
import customElementBuildInComponents from './componets/index';
import util from './util';

// fetch polyfill and fetch-jsonp
import 'fetch-jsonp';
import 'deps/fetch';


Vue.use(customElement);
Vue.use(customElementBuildInComponents);

let mip = {
    Vue,
    customElement: Vue.customElement,
    util,
    // 当前是否在 iframe 中
    isIframed: window === top,
    standalone: window === top
};

export default mip;
