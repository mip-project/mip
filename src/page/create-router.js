import axios from 'axios';
import * as util from './util';
import {MIP_ERROR_ROUTE_PATH, MIP_CONTAINER_ID} from './const';
import ErrorPage from './vue-components/error-page';
// import RouterView from './vue-components/RouterView.vue';

/**
 * extract route object from current DOM tree or raw HTML.
 *
 * @param {string?} rawHTML raw HTML content
 * @param {Object?} routeOptions route's options
 * @return {Object} routeObject
 */
function getRoute(rawHTML, routeOptions = {}, initOptions) {
    let MIPRouterTitle = util.getMIPTitle(rawHTML);
    let {mipContent, scope} = util.getMIPContent(rawHTML);

    return Object.assign({
        component: {
            data() {
                return {
                    MIPRouterTitle
                };
            },
            render(createElement) {
                return createElement('div', {
                    domProps: {
                        innerHTML: mipContent
                    }
                });
            },
            beforeRouteEnter(to, from, next) {
                next(vm => {
                    vm.$el.setAttribute(scope, '');
                    let parent = vm.$parent;
                    document.title = parent.MIPRouterTitle = vm.MIPRouterTitle;

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
                parent.pageTransitionEffect = parent.pageTransitionType === 'slide'
                    ? (util.isForward(to, from) ? 'slide-left' : 'slide-right')
                    : parent.pageTransitionType;
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
            path: window.location.pathname
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

    // router.beforeEach((to, from, next) => {
    //     // Multiple apps here
    //     // Pick the main one
    //     if (router.app) {
    //         let effect = needSlideTransition ?
    //             (util.isForward(to, from) ? 'slide-left' : 'slide-right')
    //             : pageTransitionType;
    //         router.app.icon = icon;
    //         router.app.pageTransitionType = pageTransitionType;
    //         router.app.pageTransitionEffect = effect;
    //     }
    //     next();
    // });

    return router;
}
