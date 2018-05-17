/**
 * @file main entry
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import * as util from './util';
import * as constants from './const';
import AppShell from './vue-components/AppShell.vue';

const CONTAINER_ID = constants.MIP_CONTAINER_ID;

export function start({Vue}, store, router) {
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
        el: `#${CONTAINER_ID}`
    });

    // new Vue({
    //     template: `
    //         <mip-img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3010417400,2137373730&fm=27&gp=0.jpg" width="300" height="300"></mip-img>
    //     `,
    //     // router,
    //     store,
    //     el: `#${CONTAINER_ID}`
    // });
};
