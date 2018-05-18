/**
 * @file create router
 * @author panyuqi@baidu.com (panyuqi)
 */

import sandbox from '../util/sandbox';
import * as util from './util';
import {
    MIP_ERROR_ROUTE_PATH,
    MIP_CONTAINER_ID
} from './const';
import ErrorPage from './vue-components/Error.vue';

const {window: sandWin, document: sandDoc} = sandbox;

/**
 * extract route object from current DOM tree or raw HTML.
 *
 * @param {string?} rawHTML raw HTML content
 * @param {Object?} shellConfig route's options
 * @return {Object} routeObject
 */
function getRoute(rawHTML, routeOptions = {}, shellConfig) {
    if (!shellConfig) {
        shellConfig = util.getMIPShellConfig(rawHTML);
    }

    if (!shellConfig.header.title) {
        shellConfig.header.title = util.getMIPTitle(rawHTML);
    }

    if (shellConfig.view
        && shellConfig.view.transition
        && shellConfig.view.transition.mode === 'slide') {
        if (shellConfig.view.transition.alwaysBackPages) {
            util.addAlwaysBackPage(shellConfig.view.transition.alwaysBackPages);
        }
        // add index page
        if (shellConfig.view.isIndex) {
            util.addAlwaysBackPage(routeOptions.path);
        }
    }

    let MIPCustomScript = util.getMIPCustomScript(rawHTML);
    let MIPWatchHandler;
    if (MIPCustomScript) {
        MIPWatchHandler = () => MIPCustomScript(sandWin, sandDoc);
    }
    let {MIPContent, scope} = util.getMIPContent(rawHTML);

    return Object.assign({
        component: {
            render(createElement) {
                return createElement('div', {
                    attrs: {
                        [scope]: ''
                    },
                    domProps: {
                        innerHTML: MIPContent
                    }
                });
            },
            beforeRouteEnter(to, from, next) {
                next(vm => {
                    let shell = vm.$parent;

                    // Set title
                    shell = Object.assign(shell, shellConfig);
                    document.title = shell.header.title;

                    // Add custom script
                    if (MIPWatchHandler) {
                        window.addEventListener('ready-to-watch', MIPWatchHandler);
                    }
                });
            },
            beforeRouteLeave(to, from, next) {
                let shell = this.$parent;

                // Set leave transition type
                shell.view.transition.effect = shell.view.transition.mode === 'slide'
                    ? (util.isForward(to, from) ? 'slide-left' : 'slide-right')
                    : shell.view.transition.mode;

                // Unwatch & unregister
                if (MIPWatchHandler) {
                    window.removeEventListener('ready-to-watch', MIPWatchHandler);
                    mip.unwatchAll()
                }

                next();
            }
        }
    }, routeOptions);
};

function getErrorRoute() {
    return {
        path: MIP_ERROR_ROUTE_PATH,
        component: ErrorPage,
        beforeRouteEnter(to, from, next) {
            next(vm => {
                let shell = vm.$parent;

                // Set title
                let title = 'Mip Error';
                shell = Object.assign(shell, DEFAULT_SHELL_CONFIG, {
                    header: {
                        title
                    }
                });
                document.title = title;
            });
        },
        beforeRouteLeave(to, from, next) {
            let shell = this.$parent;

            // Set leave transition type
            shell.view.transition.effect = shell.view.transition.mode === 'slide'
                ? (util.isForward(to, from) ? 'slide-left' : 'slide-right')
                : shell.view.transition.mode;

            next();
        }
    }
}

export default function createRouter(Router) {
    let shellConfig = util.getMIPShellConfig();
    let view = shellConfig.view;

    // Build routes
    let routes = [
        getRoute(undefined, {
            path: window.location.pathname
        }, shellConfig),
        getErrorRoute()
    ];

    // Create router instance and register onMatchMiss hook (add dynamic routes)
    const router = new Router({routes});

    if (view && view.transition && view.transition.mode === 'slide') {
        util.initHistory({base: router.options.base});
    }

    router.onMatchMiss = function(to, from, next) {
        // add current loaded components
        util.addLoadedComponents();

        let handleError = error => next({
            path: MIP_ERROR_ROUTE_PATH,
            params: {
                error
            }
        });

        fetch(to.path).then(res => {
            if (!res.ok) {
                handleError();
                return;
            }

            res.text().then(async function(targetHTML) {
                // see whether it's a MIP page
                if (!util.isMIP(targetHTML)) {
                    window.location.href = to.path;
                    return;
                }

                let newComponents = util.getNewComponents(targetHTML);
                if (newComponents.length !== 0) {
                    await util.loadScripts(newComponents);
                }
                router.addRoutes([
                    getRoute(targetHTML, {
                        path: to.path
                    })
                ]);

                next();
            });
        }, handleError);

    };

    return router;
}
