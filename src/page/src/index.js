/**
 * @file main entry
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import MIP from 'mip';
import MIPRouter from '@/router/src/index';
import axios from 'axios';

import * as util from './util';
import * as constants from './const';

const CONTAINER_ID = constants.MIP_CONTAINER_ID;
const template = `<div id="${CONTAINER_ID}">`
    + '<header id="mip-router__header">{{ MIPRouterTitle }}</header>'
    + '<mip-view></mip-view>'
    // + '<transition><div v-if="MIPRouterTitle">Hello</div></transition>'
+ '</div>';

const start = function () {
    // Configure MIP
    MIP.use(MIPRouter);
    MIP.config.ignoredElements = [
      /^mip-/
    ];

    // Create MIP container
    util.createContainer(CONTAINER_ID);

    // Build routes
    let MIPRouterTitle = util.getMIPTitle();
    let routes = [{
        // TODO 参数？
        path: window.location.pathname,
        component: {
            template: util.getMIPContent()
        }
    }];

    // Create router instance and register onMatchMiss hook (add dynamic routes)
    const router = new MIPRouter({routes});
    router.onMatchMiss = async function (to, from, next) {
        // add current loaded components
        util.addLoadedComponents();

        let response = await axios.get(to.path);
        let targetHTML = response.data;

        let newComponents = util.getNewComponents(targetHTML);
        if (newComponents.length !== 0) {
            await util.loadScripts(newComponents);
        }

        router.addRoutes([{
            path: to.path,
            component: {
                template: util.getMIPContent(targetHTML)
            }
        }]);
        router.app.MIPRouterTitle = util.getMIPTitle(targetHTML);

        next();
    }

    // Create MIP instance
    new MIP({
        router,
        el: `#${CONTAINER_ID}`,
        template,
        data: {
            MIPRouterTitle
        }
    });
}

export default {
    util,
    const: constants,
    start
};
