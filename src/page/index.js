/**
 * @file main entry
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import * as util from './util';
import * as constants from './const';
import AppShell from './vue-components/AppShell.vue';

const CONTAINER_ID = constants.MIP_CONTAINER_ID;

const start = function ({Vue}, store, router) {
    // Configure mip
    Vue.config.ignoredElements = [
      /^mip-/
    ];

    // Create mip container
    util.createContainer(CONTAINER_ID);

    new Vue({
        ...AppShell,
        router,
        store,
        el: `#${CONTAINER_ID}`,
    });

    window.onload = function () {
        // Register all customElements after page(Vue) load
        Vue.__customElements__.forEach(element => Vue.customElement(element.tag, element.component));
        // Make proceeding registery directly
        mip.customElement = Vue.customElement;
    };
}

export default {
    util,
    const: constants,
    start
};
