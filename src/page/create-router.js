import axios from 'axios';
import * as util from './util';
import {MIP_ERROR_ROUTE_PATH} from './const';
import ErrorPage from './vue-components/error-page';

/**
 * extract route object from current DOM tree or raw HTML.
 *
 * @param {string?} rawHTML raw HTML content
 * @param {Object?} routeOptions route's options
 * @return {Object} routeObject
 */
function getRoute(rawHTML, routeOptions = {}) {
    let MIPRouterTitle = util.getMIPTitle(rawHTML);

    return Object.assign({
        component: {
            template: util.getMIPContent(rawHTML),
            data() {
                return {
                    MIPRouterTitle
                };
            },
            beforeRouteEnter(to, from, next) {
                next(vm => {
                    document.title = vm.$parent.MIPRouterTitle = vm.MIPRouterTitle;
                });
            }
        }
    }, routeOptions);
};

export default function createRouter({Router, pageTransitionType}) {
    const needSlideTransition = pageTransitionType === 'slide';

    // Build routes
    let routes = [
        getRoute(undefined, {
            path: window.location.pathname
        }),
        {
            path: MIP_ERROR_ROUTE_PATH,
            component: ErrorPage
        }
    ];

    // Create router instance and register onMatchMiss hook (add dynamic routes)
    const router = new Router({routes});

    if (needSlideTransition) {
        util.initHistory({base: router.options.base});
    }

    router.onMatchMiss = async function(to, from, next) {
        // add current loaded components
        util.addLoadedComponents();

        try {
            let {data: targetHTML} = await axios.get(to.path);

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
        }
        catch (error) {
            // redirect to error page
            next({
                path: MIP_ERROR_ROUTE_PATH,
                params: {
                    error
                },
                replace: true
            });
        }
    };

    router.beforeEach((to, from, next) => {
        if (router.app) {
            let effect = needSlideTransition ?
                (util.isForward(to, from) ? 'slide-left' : 'slide-right')
                : pageTransitionType;
            router.app.pageTransitionType = pageTransitionType;
            router.app.pageTransitionEffect = effect;
        }
        next();
    });

    return router;
}
