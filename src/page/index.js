/**
 * @file main entry
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import * as util from './util';
// import * as constants from './const';
import AppShell from './vue-components/AppShell.vue';

// const CONTAINER_ID = constants.MIP_CONTAINER_ID;

function start() {
    // Don't let browser restore scroll position.
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }

    // Create mip container
    let $container = util.createContainer();

    // let app = new Vue({
    //     ...AppShell,
    //     router
    // });

    // if ($container.hasAttribute('data-server-rendered')) {
    //     router.onReady(() => {
    //         console.log('ssr ready...')
    //         app.$mount(`#${CONTAINER_ID}`);
    //     });
    // }
    // else {
    //     app.$mount(`#${CONTAINER_ID}`);
    // }

    util.installMipLink(router);
};

export default {start};
