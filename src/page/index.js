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

        // root page
        this.isRootPage = false;
        this.children = [];
        this.currentChildPageId = null;
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
        let targetPageId = route.fullPath;
        if (this.pageId !== targetPageId
            && !this.hasChild(targetPageId)) {
            let targetFrame = util.createIFrame(targetPageId);

            util.frameMoveIn(targetFrame, {
                newPage: true
            });
        }
        else {
            if (this.currentChildPageId) {
                util.frameMoveOut(this.currentChildPageId);
            }
            util.frameMoveIn(targetPageId);
        }
        this.currentChildPageId = targetPageId
    }
}

export default new Page();
