/**
 * @file main entry
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import * as util from './util';
import Router from '../router/index';
import createRouter from './create-router';
import '../styles/mip.less';

class Page {
    constructor() {
        this.pageId = util.getPath(window.location.href);
        this.isRootPage = false;
        this.children = [];
    }

    initRouter() {
        let router;
        // inside iframe
        if (window.parent && window.parent.MIP_ROUTER) {
            router = window.parent.MIP_ROUTER;
            router.rootPage.addChild(this);
        }
        // outside iframe
        else {
            router = createRouter(Router);
            router.rootPage = this;
            router.ROOT_PAGE_ID = this.pageId;
            router.init();
            router.history.listen(this.render.bind(this));

            window.MIP_ROUTER = router;

            this.isRootPage = true;
        }

        util.installMipLink(router);
    }

    start() {
        // Set global mark
        window.__MIP__ = 2;

        // Don't let browser restore scroll position.
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        this.initRouter();
        document.body.setAttribute('mip-ready', '');
    }

    hasChild(pageId) {
        return this.children.find(child => child.pageId === pageId);
    }

    addChild(page) {
        if (this.isRootPage) {
            this.children.push(page);
        }
    }

    render(route) {
        let toPageId = route.fullPath;
        if (!hasChild(toPageId)) {
            util.createIFrame(toPageId);
        }

        // this.children.forEach(child => {
        //     if (!child.pageId === toPageId) {
        //         child.hideIFrame();
        //     }
        //     else {
        //         child.showIFrame();
        //     }
        // });
    }

    showIFrame() {
        if (!this.$iframe) {
            this.$iframe = util.createIFrame(this.pageId);
        }
        else {
            this.$iframe.show();
        }
    }

    hideIFrame() {

    }
}

export default new Page();
