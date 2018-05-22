/**
 * @file main entry
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import * as util from './util';
import * as constants from './const';
// import AppShell from './vue-components/AppShell.vue';

const CONTAINER_ID = constants.MIP_CONTAINER_ID;
let $container;

export function start({Vue}, router) {
    // Create mip container
    $container = util.createContainer(CONTAINER_ID);
    router.init();
};

export function updateRouterView({pageId, shellConfig}) {
    console.log(shellConfig, pageId)
}
