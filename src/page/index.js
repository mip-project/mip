/**
 * @file main entry
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import * as util from './util';
import * as constants from './const';
import AppShell from './vue-components/AppShell.vue';

const CONTAINER_ID = constants.MIP_CONTAINER_ID;

export function start({Vue}, router) {
    // Configure mip
    Vue.config.ignoredElements = [
      /^mip-/
    ];

    // Don't let browser restore scroll position.
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }

    // Create mip container
    util.createContainer(CONTAINER_ID);

    new Vue({
        ...AppShell,
        router,
        el: `#${CONTAINER_ID}`
    });

    util.installMipLink(router);
};
