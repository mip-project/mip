/**
 * @file main entry
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import * as util from './util';
import Router from './router';
import AppShell from './appshell';
import '../styles/mip.less';

class Page {
    constructor() {
        this.pageId = util.getPath(window.location.href);
        if (window.parent && window.parent.MIP_ROOT_PAGE) {
            this.isRootPage = false;
        }
        else {
            window.MIP_ROOT_PAGE = true;
            this.isRootPage = true;
        }
        this.data = {
            appshell: {}
        };

        // root page
        this.appshell = null;
        this.children = [];
        this.currentChildPageId = null;
        this.messageHandlers = [];
    }

    initRouter() {
        let router;
        // outside iframe
        if (this.isRootPage) {
            router = new Router({
                routes: [
                    {
                        path: window.location.pathname
                    }
                ]
            });
            router.rootPage = this;
            router.init();
            router.listen(this.render.bind(this));

            window.MIP_ROUTER = router;

            this.messageHandlers.push((type, data) => {
                if (type === 'router-push') {
                    router.push(data.location);
                }
                else if (type === 'router-replace') {
                    router.replace(data.location);
                }
                else if (type === 'router-force') {
                    window.location.href = data.location.fullpath;
                }
            });
        }
        // inside iframe
        else {
            router = window.parent.MIP_ROUTER;
            router.addRoute({
                path: window.location.pathname
            });
            router.rootPage.addChild(this);
        }

        util.installMipLink(router, this);
    }

    initAppShell() {
        this.data.appshell = util.getMIPShellConfig();
        if (this.isRootPage) {
            this.messageHandlers.push((type, data) => {
                if (type === 'appshell-refresh') {
                    this.refreshAppShell(data);
                }
            });
            this.refreshAppShell(this.data.appshell);
        }
        else {
            this.postMessage({
                type: 'appshell-refresh',
                data: this.data.appshell
            });
        }
    }

    postMessage(data) {
        parent.postMessage(data, window.location.origin);
    }

    start() {
        // Set global mark
        window.__MIP__ = 2;
        mip.MIP_ROOT_PAGE = window.MIP_ROOT_PAGE;

        // Don't let browser restore scroll position.
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        this.initRouter();
        this.initAppShell();
        util.addMIPCustomScript();
        document.body.setAttribute('mip-ready', '');

        if (this.isRootPage) {
            // listen message from iframes
            window.addEventListener('message', (e) => {
                if (e.source.origin === window.location.origin) {
                    this.messageHandlers.forEach(handler => {
                        handler.call(this, e.data.type, e.data.data || {});
                    });
                }
            }, false);
        }
    }

    /**** Root Page methods ****/

    refreshAppShell(appshellData) {
        if (!this.appshell) {
            this.appshell = new AppShell({
                data: appshellData
            });
        }
        else {
            this.appshell.refresh(appshellData);
        }
    }

    applyTransition(targetPageId) {
        if (this.currentChildPageId) {
            util.frameMoveOut(this.currentChildPageId, {
                onComplete: () => {
                    // 没有引用 mip.js 的错误页
                    if (!this.getPageById(this.currentChildPageId)) {
                        util.removeIFrame(this.currentChildPageId);
                    }
                    this.currentChildPageId = targetPageId;
                }
            });
        }

        util.frameMoveIn(targetPageId, {
            onComplete: () => {
                this.currentChildPageId = targetPageId;
            }
        });
    }

    addChild(page) {
        if (this.isRootPage) {
            this.children.push(page);
        }
    }

    getPageById(pageId) {
        return pageId === this.pageId ?
            this : this.children.find(child => child.pageId === pageId);
    }

    render(route) {
        let targetPageId = route.fullPath;
        let targetPage = this.getPageById(targetPageId);

        if (!targetPage) {
            let me = this;
            let targetFrame = util.createIFrame(targetPageId, {
                onLoad: () => me.applyTransition(targetPageId)
            });

            if (this.data.appshell
                && this.data.appshell.header
                && !this.data.appshell.header.hidden) {
                targetFrame.classList.add('mip-page__iframe-with-header');
            }
        }
        else {
            this.refreshAppShell(targetPage.data.appshell);
            this.applyTransition(targetPageId);
        }

    }
}

export default new Page();
