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
}

export default {
    util,
    const: constants,
    start
};
