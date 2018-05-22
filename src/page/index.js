/**
 * @file main entry
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import * as util from './util';
import Router from '../router/index';
import createRouter from './create-router';
import '../styles/mip.less';

export const CURRENT_PAGE_ID = util.getPath(window.location.href);

function start() {
    // Don't let browser restore scroll position.
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }

    let router;
    if (window.parent && window.parent.MIP_ROUTER) {
        router = window.parent.MIP_ROUTER;
    }
    else {
        router = createRouter(Router);
        router.init();
        router.ROOT_PAGE_ID = CURRENT_PAGE_ID;
        window.MIP_ROUTER = router;
    }
    document.body.setAttribute('mip-ready', '');
    util.installMipLink(router);
};

export default {start};
