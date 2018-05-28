import {inBrowser} from './dom';

export const supportsPushState = inBrowser
    && window.history
    && 'pushState' in window.history;

// use User Timing api (if present) for more accurate key precision
const Time = inBrowser
    && window.performance
    && window.performance.now
    ? window.performance
    : Date;

let _key = genKey();

function genKey () {
    return Time.now().toFixed(3);
}

export function getStateKey () {
    return _key;
}

export function setStateKey (key) {
    _key = key;
}

export function pushState (url, replace) {
    // try...catch the pushState call to get around Safari
    // DOM Exception 18 where it limits to 100 pushState calls
    const history = window.history;
    try {
        if (replace) {
            history.replaceState({key: _key}, '', url);
        }
        else {
            _key = genKey();
            history.pushState({key: _key}, '', url);
        }
    }
    catch (e) {
        window.location[replace ? 'replace' : 'assign'](url);
    }
}

export function replaceState (url) {
    pushState(url, true);
}
