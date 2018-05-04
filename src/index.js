/**
 * @file MIP
 * @author sfe
 */

import Vue from './vue/platforms/web/entry-runtime-with-compiler';
import customElement from './custom-element/index';
import customElementBuildInComponents from './componets/index';
import Router from './router/index'
import page from './page/index'

Vue.use(Router);
Vue.use(customElement);
Vue.use(customElementBuildInComponents);

let mip = {
    Vue,
    customElement: Vue.customElement,
    Router
};

// page.start(mip);

export default mip;
