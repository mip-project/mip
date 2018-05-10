/**
 * @file bind.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import Compile from './compile';
import Observer from './observer';
import debug from 'debug';
let log = debug('mip-bind');

/* global MIP */
window.MIP = {};

class Bind {
    constructor() {
        let me = this;
        this._win = window;
        // require mip data extension runtime
        this._compile = new Compile();
        this._observer = new Observer();
        this._bindEvent();
        // from=0 called by html attributes
        // from=1 refers the method called by mip.js
        MIP.setData = function (action, from) {
            log('MIP.setData ', action, from);

            me._bindTarget(false, action, from);
        };
        MIP.$set = function (action, from) {
            log('MIP.$set ', action, from);

            me._bindTarget(true, action, from);
        };
    }

    _bindTarget(compile, action, from) {
        let data = from ? action.arg : action;
        let evt = from ? action.event.target : {};
        if (typeof data === 'string') {
            data = (new Function('DOM', 'return ' + data))(evt);
        }

        if (typeof data === 'object') {
            let origin = JSON.stringify(window.m);
            this._compile.upadteData(JSON.parse(origin));
            // fn.extend(window.m, data);
            Object.assign(window.m, data);
            if (compile) {
                this._observer.start(this._win.m);
                this._compile.start(this._win.m);
            }
        }
        else {
            console.error('setData method must accept an object!');
        }
    }

    // Bind event for post message when fetch data returned, then compile dom again
    _bindEvent() {
        let me = this;
        log('addEventListener: message');

        window.addEventListener('message', function (event) {
            log('get event: message', event);

            let loc = me._win.location;
            let domain = loc.protocol + '//' + loc.host;
            if (event.origin === domain
                && event.source && event.data
                && event.data.type === 'bind'
                && event.source === me._win
            ) {
                MIP.$set(event.data.m);
            }
        });
    }

    start() {
        log('start.');

        // require mip data extension runtime
        // require('./mip-data');
        this._dataSource = {
            m: window.m ? window.m : {}
        };
        MIP.$set(this._dataSource.m);
    }

    _proxy() {
        let me = this;
        Object.keys(this._dataSource).forEach(function (key) {
            me._proxyData(key);
        });
    }

    _proxyData(key) {
        let me = this;
        Object.defineProperty(this._win, key, {
            configurable: false,
            enumerable: true,
            get() {
                return me._dataSource[key];
            },
            set(newVal) {
                me._dataSource[key] = newVal;
            }
        });
    }
}

export default Bind;

