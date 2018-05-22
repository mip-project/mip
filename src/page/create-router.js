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
import fixedElement from '../fixed-element';
import {CURRENT_PAGE_ID} from './index';

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

    // use title in <title> tag if not provided
    let defaultTitle = util.getMIPTitle(rawHTML);
    if (!shellConfig.header.hidden && !shellConfig.header.title) {
        shellConfig.header.title = defaultTitle;
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

    // let MIPCustomScript = util.getMIPCustomScript(rawHTML);
    // let MIPWatchHandler;
    // let MIPWatchHandlerFlag = true;
    // if (MIPCustomScript) {
    //     MIPWatchHandler = () => MIPCustomScript(sandWin, sandDoc);
    // }
    // let {MIPContent, scope} = util.getMIPContent(rawHTML);

    return Object.assign({
        component: {
            beforeRouteEnter(to, from, next) {
                if (to.fullPath !== CURRENT_PAGE_ID) {
                    util.createIFrame(to.fullPath)
                };
                // Set title
                document.title = shellConfig.header.title || defaultTitle;
                next();
            },
            beforeRouteLeave(to, from, next) {
                // Set leave transition type
                shellConfig.view.transition.effect = shellConfig.view.transition.mode === 'slide'
                    ? (util.isForward(to, from) ? 'slide-left' : 'slide-right')
                    : shellConfig.view.transition.mode;

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
                handleError({message: '404'});
                return;
            }

            res.text().then(async function(targetHTML) {
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

    // register message handler
    window.addEventListener('message', (e) => {
        if (e.source.origin === window.location.origin) {
            let {type, data} = e.data;
            if (type === 'router-push') {
                router.push(data.location);
            }
            else if (type === 'router-replace') {
                router.replace(data.location);
            }
        }
    }, false);

    return router;
}
