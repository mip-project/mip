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

    window.onload = function () {
        new Vue({
            ...AppShell,
            router,
            store,
            el: `#${CONTAINER_ID}`,
        });
    };
}

export default {
    util,
    const: constants,
    start
};
