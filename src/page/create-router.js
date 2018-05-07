import axios from 'axios';
import * as util from './util';

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
                    // TODO: interact with appshell
                });
            }
        }
    }, routeOptions);
};

export default function createRouter({RouterConstructor}) {

    // Build routes
    let routes = [
        getRoute(undefined, {
            path: window.location.pathname
        })
    ];

    // Create router instance and register onMatchMiss hook (add dynamic routes)
    const router = new RouterConstructor({routes});
    router.onMatchMiss = async function(to, from, next) {
        // add current loaded components
        util.addLoadedComponents();

        try {
            let {data: targetHTML} = await axios.get(to.path);
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
        catch (err) {
            console.log(err, 'in onMatchMiss');
        }
    };

    return router;
}
