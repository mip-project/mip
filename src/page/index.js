/**
 * @file main entry
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import * as util from './util';
import * as constants from './const';

import createRouter from './create-router';
import createAppShell from './create-appshell';

const CONTAINER_ID = constants.MIP_CONTAINER_ID;

const start = function ({Vue, Router}, store) {
    // Configure mip
    Vue.config.ignoredElements = [
      /^mip-/
    ];

    // Create mip container
    util.createContainer(CONTAINER_ID);

    const router = createRouter({
        Router,
        pageTransitionType: 'slide'
    });

    createAppShell({
        Vue,
        router,
        store
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
