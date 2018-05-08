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

    // @TODO 看看还有啥好办法控制 mip 和 组件的执行顺序不。
    window.onload = function () {
        Vue.__customElements__.forEach(element => {
            console.log(element);
            Vue.customElement(element.tag, element.component);
        });
    };
}

export default {
    util,
    const: constants,
    start
};
