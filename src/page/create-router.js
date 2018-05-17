/**
 * @file create router
 * @author panyuqi@baidu.com (panyuqi)
 */

import sandbox from '../util/sandbox';
import * as util from './util';
import {
    MIP_ERROR_ROUTE_PATH,
    MIP_CONTAINER_ID
    // MIP_WATCH_FUNCTION_NAME
} from './const';
import ErrorPage from './vue-components/Error.vue';

const {window: sandWin, document: sandDoc} = sandbox;
const foo = function () {console.log('foo')};

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

    if (!shellConfig.header) {
        shellConfig.header = {};
    }
    if (!shellConfig.header.title) {
        shellConfig.header.title = util.getMIPTitle(rawHTML);
    }

    let MIPCustomScript = util.getMIPCustomScript(rawHTML);
    // let MIPWatchHandler;
    // if (MIPCustomScript) {
    //     MIPWatchHandler = () => MIPCustomScript(sandWin, sandDoc);
    // }
    let {MIPContent, scope} = util.getMIPContent(rawHTML);

    return Object.assign({
        component: {
            // data() {
            //     return {
            //         MIPCustomScript
            //     };
            // },
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

                    let shell = vm.$parent;
                    // Set title
                    shell = Object.assign(shell, shellConfig);
                    document.title = shell.header.title;

                    // Add custom script
                    if (MIPCustomScript) {
                        // console.log(MIPCustomScript.toString(), 'in beforeRouteEnter')
                        // window.addEventListener('ready-to-watch', MIPCustomScript);
                        window.addEventListener('ready-to-watch', foo)
                        // let script = document.createElement('script');
                        // script.id = 'mip-custom-script';
                        // script.type = 'text/javascript';
                        // script.innerHTML = vm.MIPCustomScript;
                        // document.body.appendChild(script);
                        // if (typeof window[MIP_WATCH_FUNCTION_NAME] === 'function') {
                        //     window[MIP_WATCH_FUNCTION_NAME](sandWin, sandDoc);
                        // }
                    }
                });
            },
            beforeRouteLeave(to, from, next) {
                let shell = this.$parent;

                // Set leave transition type
                shell.view.transition.effect = shell.view.transition.mode === 'slide'
                    ? (util.isForward(to, from) ? 'slide-left' : 'slide-right')
                    : shell.view.transition.mode;

                if (MIPCustomScript) {
                    console.log('run here')
                    // console.log(MIPCustomScript.toString(), 'in beforeRouteLeave');
                    // window.removeEventListener('ready-to-watch', MIPCustomScript);
                    window.removeEventListener('ready-to-watch', foo);
                }
                // Remove custom script
                // let customScript = document.querySelector('#mip-custom-script');
                // if (customScript) {
                //     customScript.remove();
                //     mip.unwatchAll();
                // }

                next();
            }
        }
    }, routeOptions);
};

export default function createRouter(Router) {
    let shellConfig = util.getMIPShellConfig();
    let view = shellConfig.view;

    // Build routes
    let routes = [
        getRoute(undefined, {
            path: window.location.pathname
        }, shellConfig),
        {
            path: MIP_ERROR_ROUTE_PATH,
            component: ErrorPage
        }
    ];

    // Create router instance and register onMatchMiss hook (add dynamic routes)
    const router = new Router({routes});

    if (view && view.transition && view.transition.mode === 'slide') {
        util.initHistory({base: router.options.base});

        if (view.transition.alwaysBackPages) {
            util.addAlwaysBackPage(view.transition.alwaysBackPages);
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
