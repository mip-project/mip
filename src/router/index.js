import {START} from './util/route';
import {assert} from './util/warn';
import {inBrowser} from './util/dom';
import {cleanPath} from './util/path';
import {createMatcher} from './create-matcher';
import {normalizeLocation} from './util/location';
import {supportsPushState} from './util/push-state';
import {HTML5History} from './history/html5';

export default class MIPRouter {

    constructor(options) {
        this.app = null;
        options.base = '/';
        this.options = options;
        this.beforeHooks = [];
        this.resolveHooks = [];
        this.afterHooks = [];
        this.matcher = createMatcher(options.routes || [], this);

        this.mode = 'history';
        this.history = new HTML5History(this, '/');
    }

    match(raw, current, redirectedFrom) {
        return this.matcher.match(raw, current, redirectedFrom);
    }

    get currentRoute() {
        return this.history && this.history.current;
    }

    init() {
        const history = this.history;

        let currentLocation = history.getCurrentLocation();
        history.transitionTo(currentLocation);
    }

    beforeEach(fn) {
        return registerHook(this.beforeHooks, fn);
    }

    beforeResolve(fn) {
        return registerHook(this.resolveHooks, fn);
    }

    afterEach(fn) {
        return registerHook(this.afterHooks, fn);
    }

    onReady(cb, errorCb) {
        this.history.onReady(cb, errorCb);
    }

    onError(errorCb) {
        this.history.onError(errorCb);
    }

    push(location, onComplete, onAbort) {
        this.history.push(location, onComplete, onAbort);
    }

    replace(location, onComplete, onAbort) {
        this.history.replace(location, onComplete, onAbort);
    }

    go(n) {
        this.history.go(n);
    }

    back() {
        this.go(-1);
    }

    forward() {
        this.go(1);
    }

    getMatchedComponents(to) {
        const route = to
            ? to.matched
                ? to
                : this.resolve(to).route
            : this.currentRoute;
        if (!route) {
            return [];
        }

        return [].concat.apply([], route.matched.map(m => {
            return Object.keys(m.components).map(key => {
                return m.components[key];
            });
        }));
    }

    resolve(to, current, append) {
        const location = normalizeLocation(
            to,
            current || this.history.current,
            append,
            this
        );
        const route = this.match(location, current);
        const fullPath = route.redirectedFrom || route.fullPath;
        const base = this.history.base;
        const href = createHref(base, fullPath, this.mode);
        return {
            location,
            route,
            href,
            // for backwards compat
            normalizedTo: location,
            resolved: route
        };
    }

    addRoutes(routes) {
        this.matcher.addRoutes(routes);
        // if (this.history.current !== START) {
        //     this.history.transitionTo(this.history.getCurrentLocation());
        // }
    }
}

function registerHook(list, fn) {
    list.push(fn);
    return () => {
        const i = list.indexOf(fn);
        if (i > -1) {
            list.splice(i, 1);
        }

    };
}

function createHref(base, fullPath, mode) {
    var path = mode === 'hash' ? '#' + fullPath : fullPath;
    return base ? cleanPath(base + '/' + path) : path;
}
