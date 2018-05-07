/**
 * @file env.js
 * @author sfe-sy(sfe-sy@baidu.com)
 */

/* globals MessageChannel, Symbol, Reflect, Set */

import {handleError} from './error';

// can we use __proto__?
export const hasProto = '__proto__' in {};

// Browser environment sniffing
export const inBrowser = typeof window !== 'undefined';
export const UA = inBrowser && window.navigator.userAgent.toLowerCase();
export const isIE = UA && /msie|trident/.test(UA);
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
export const isEdge = UA && UA.indexOf('edge/') > 0;
export const isAndroid = UA && UA.indexOf('android') > 0;
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
export const nativeWatch = ({}).watch;

export let supportsPassive = false;
if (inBrowser) {
    try {
        const opts = {};
        Object.defineProperty(opts, 'passive', ({
            get() {

                /* istanbul ignore next */
                supportsPassive = true;
            }
        })); // https://github.com/facebook/flow/issues/285
        window.addEventListener('test-passive', null, opts);
    }
    catch (e) {}
}

// this needs to be lazy-evaled because MIP may be required before
// mip-server-renderer can set MIP_ENV
let $isServer;
export const isServerRendering = () => {
    if ($isServer === undefined) {

        /* istanbul ignore if */
        if (!inBrowser && typeof global !== 'undefined') {
            // detect presence of mip-server-renderer and avoid
            // Webpack shimming the process
            $isServer = global.process.env.MIP_ENV === 'server';
        }
        else {
            $isServer = false;
        }
    }

    return $isServer;
};

// detect devtools
export const devtools = inBrowser && window.__MIP_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
export function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

export const hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol)
&& typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
export const nextTick = (function () {
    const callbacks = [];
    let pending = false;
    let timerFunc;

    function nextTickHandler() {
        pending = false;
        const copies = callbacks.slice(0);
        callbacks.length = 0;
        for (let i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }

    // An asynchronous deferring mechanism.
    // In pre 2.4, we used to use microtasks (Promise/MutationObserver)
    // but microtasks actually has too high a priority and fires in between
    // supposedly sequential events (e.g. #4521, #6690) or even between
    // bubbling of the same event (#6566). Technically setImmediate should be
    // the ideal choice, but it's not available everywhere; and the only polyfill
    // that consistently queues the callback after all DOM events triggered in the
    // same loop is by using MessageChannel.

    /* istanbul ignore if */
    if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
        timerFunc = () => {
            setImmediate(nextTickHandler);
        };
    }
    else if (typeof MessageChannel !== 'undefined'
        && (
            isNative(MessageChannel)
            // PhantomJS
            || MessageChannel.toString() === '[object MessageChannelConstructor]'
        )
    ) {
        const channel = new MessageChannel();
        const port = channel.port2;
        channel.port1.onmessage = nextTickHandler;
        timerFunc = () => {
            port.postMessage(1);
        };
    }
    else

    /* istanbul ignore next */
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
        // use microtask in non-DOM environments, e.g. Weex
        const p = Promise.resolve();
        timerFunc = () => {
            p.then(nextTickHandler);
        };
    }
    else {
        // fallback to setTimeout
        timerFunc = () => {
            setTimeout(nextTickHandler, 0);
        };
    }

    return function queueNextTick(cb, ctx) {
        let $resolve;
        callbacks.push(() => {
            if (cb) {
                try {
                    cb.call(ctx);
                }
                catch (e) {
                    handleError(e, ctx, 'nextTick');
                }
            }
            else if ($resolve) {
                $resolve(ctx);
            }

        });
        if (!pending) {
            pending = true;
            timerFunc();
        }

        // $flow-disable-line
        if (!cb && typeof Promise !== 'undefined') {
            return new Promise((resolve, reject) => {
                $resolve = resolve;
            });
        }

    };
})();

let $Set;

/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    $Set = Set;
}
else {
    // a non-standard Set polyfill that only works with primitive keys.
    $Set = class Set {

        constructor() {
            this.set = Object.create(null);
        }
        has(key) {
            return this.set[key] === true;
        }
        add(key) {
            this.set[key] = true;
        }
        clear() {
            this.set = Object.create(null);
        }
    };
}

export {$Set};