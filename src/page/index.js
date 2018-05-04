/**
 * @file main entry
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import axios from 'axios';

import * as util from './util';
import * as constants from './const';

const CONTAINER_ID = constants.MIP_CONTAINER_ID;
const template = `<div id="${CONTAINER_ID}">`
    + '<header id="mip-router__header">{{ MIPRouterTitle }}</header>'
    + '<mip-view></mip-view>'
    // + '<transition><div v-if="MIPRouterTitle">Hello</div></transition>'
+ '</div>';

const start = function (mip) {
    // Configure mip
    mip.Vue.config.ignoredElements = [
      /^mip-/
    ];

    // Create mip container
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
    const router = new mip.Router({routes});
    router.onMatchMiss = function (to, from, next) {
        // add current loaded components
        util.addLoadedComponents();

        const dealSuccess = () => {
            router.addRoutes([{
                path: to.path,
                component: {
                    template: util.getMIPContent(targetHTML)
                }
            }]);
            router.app.MIPRouterTitle = util.getMIPTitle(targetHTML);
            console.log(util.getMIPTitle(targetHTML))

            next();
        };
        const dealError = err => {
            // TODO
            console.log(err, 'in onMatchMiss');
        };

        axios.get(to.path).then(response => {
            let targetHTML = response.data;

            let newComponents = util.getNewComponents(targetHTML);
            if (newComponents.length !== 0) {
                util.loadScripts(newComponents).then(dealSuccess, dealError);
            }
            else {
                dealSuccess();
            }
        }, dealError);
    }

    // Create mip instance
    new mip.Vue({
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
