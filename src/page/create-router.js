/**
 * @file create router
 * @author panyuqi@baidu.com (panyuqi)
 */

import sandbox from '../util/sandbox';
import * as util from './util';
import {
    MIP_ERROR_ROUTE_PATH,
    MIP_CONTAINER_ID,
    MIP_WATCH_FUNCTION_NAME
} from './const';
import ErrorPage from './vue-components/Error.vue';

const {window: sandWin, document: sandDoc} = sandbox;

/**
 * extract route object from current DOM tree or raw HTML.
 *
 * @param {string?} rawHTML raw HTML content
 * @param {Object?} routeOptions route's options
 * @return {Object} routeObject
 */
function getRoute(rawHTML, routeOptions = {}, initOptions) {
    let MIPRouterTitle = util.getMIPTitle(rawHTML);
    let MIPCustomScript = util.getMIPCustomScript(rawHTML);
    let {MIPContent, scope} = util.getMIPContent(rawHTML);

    return Object.assign({
        component: {
            data() {
                return {
                    MIPRouterTitle,
                    MIPCustomScript
                };
            },
            render(createElement) {
                return createElement('div', {
                    domProps: {
                        innerHTML: MIPContent
                    }
                });
            },
            beforeRouteEnter(to, from, next) {
                next(vm => {
                    vm.$el.setAttribute(scope, '');
                    let parent = vm.$parent;

                    // Set title
                    document.title = parent.MIPRouterTitle = vm.MIPRouterTitle;

                    // Add custom script
                    if (vm.MIPCustomScript) {
                        let script = document.createElement('script');
                        script.id = 'mip-custom-script';
                        script.type = 'text/javascript';
                        script.innerHTML = vm.MIPCustomScript;
                        document.body.appendChild(script);
                        if (typeof window[MIP_WATCH_FUNCTION_NAME] === 'function') {
                            window[MIP_WATCH_FUNCTION_NAME](sandWin, sandDoc);
                        }
                    }

                    // Set initial config
                    if (initOptions) {
                        parent.MIPRouterIcon = initOptions.icon;
                        let pageTransitionType = initOptions.pageTransitionType || 'fade';
                        parent.pageTransitionType = pageTransitionType;
                        parent.pageTransitionEffect = parent.pageTransitionType === 'slide'
                            ? 'slide-left'
                            : pageTransitionType;
                    }
                });
            },
            beforeRouteLeave(to, from, next) {
                let parent = this.$parent;

                // Set leave transition type
                parent.pageTransitionEffect = parent.pageTransitionType === 'slide'
                    ? (util.isForward(to, from) ? 'slide-left' : 'slide-right')
                    : parent.pageTransitionType;

                // Remove custom script
                let customScript = document.querySelector('#mip-custom-script');
                if (customScript) {
                    customScript.remove();
                    // TODO call unWatchAll
                    console.log('mip.unWatchAll() from beforeRouteLeave');
                }

                next();
            }
        }
    }, routeOptions);
};

export default function createRouter(Router) {
    let MIPConfig = util.getMIPConfig();

    // Build routes
    let routes = [
        getRoute(undefined, {
            path: location.pathname + location.search
        }, {
            pageTransitionType: MIPConfig.pageTransitionType,
            icon: MIPConfig.icon
        }),
        {
            path: MIP_ERROR_ROUTE_PATH,
            component: ErrorPage
        }
    ];

    // Create router instance and register onMatchMiss hook (add dynamic routes)
    const router = new Router({routes});

    if (MIPConfig.pageTransitionType === 'slide') {
        util.initHistory({base: router.options.base});

        if (MIPConfig.pageTransitionAlwaysBackPages) {
            util.addAlwaysBackPage(MIPConfig.pageTransitionAlwaysBackPages);
        }
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
