/**
 * @file bind.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import Compile from './compile';
import Observer from './observer';
import Watcher from './watcher';
import util from '../../util';

/* global MIP */

class Bind {
    constructor() {
        let me = this;
        this._win = window;
        this._watchers = [];
        this._watcherIds = [];
        // require mip data extension runtime
        this._compile = new Compile();
        this._observer = new Observer();
        this._bindEvent();
        // from=0 called by html attributes
        // from=1 refers the method called by mip.js
        MIP.setData = function (action, from) {
            me._bindTarget(false, action, from);
        };
        MIP.$set = function (action, from) {
            me._bindTarget(true, action, from);
            me._eventEmit();
        };
        MIP.watch = function (target, cb) {
            if (target.constructor === Array) {
                for (let key of target) {
                    MIP.watch(key, cb);
                }
                return;
            }
            if (typeof target !== 'string') {
                return;
            }
            if (!cb || typeof cb !== 'function') {
                return;
            }

            // TODO 去重逻辑还需要修改
            let watcher = `${target}${cb.toString()}`.replace(/[\n\t\s]/g, '');
            if (me._watcherIds.indexOf(watcher) !== -1) {
                console.log(watcher);
                return;
            }
            me._watcherIds.push(watcher);
            me._watchers.push(new Watcher(
                null,
                me._win.m,
                '',
                target,
                cb // args: (dir, newVal, oldVal)
            ));
        };
        MIP.unwatchAll = function () {
            me._watchers.forEach(watcher => watcher.teardown());
            me._watcherIds = [];
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
            // let globals = this._normalize(data);
            // this._diff({
            //     globals: this._globals,
            //     data: window.m
            // }, {
            //     globals,
            //     data
            // });
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

    _diff({globals: oldGlobals, data: oldData}, {globals: newGlobals, data: newData}) {

    }

    _normalize(data) {
        let globals = this._normalizeGlobal(data).filter(attr => attr !== ',');

        for (let g of globals) {
            let paths = g.split('.');
            let obj = data;
            let lastAttr = paths.pop();
            for (let p of paths) {
                obj = obj[p];
            }
            obj[lastAttr] = obj[`#${lastAttr}`];
            delete obj[`#${lastAttr}`];
        }

        return globals;
    }

    _normalizeGlobal(data) {
        let path = [];

        for (let k of Object.keys(data)) {
            let stop = false;
            if (/^#/.test(k)) {
                stop = true;
                path.push(k.substr(1));
                path.push(',');
            }
            else {
                path.push(k);
            }

            if (Object.prototype.toString.call(data[k]) === '[object Object]' && !stop) {
                let tmp = this._normalizeGlobal(data[k]);
                tmp = tmp.slice(0, tmp.lastIndexOf(',') + 1);
                if (!tmp.length) {
                    path.pop();
                }
                else {
                    let parent = path.pop();
                    path = [...path, ...tmp.map(p => p !== ',' ? `${parent}.${p}` : ',')];
                }
            }
        }

        return path;
    }

    // Bind event for post message when fetch data returned, then compile dom again
    _bindEvent() {
        let me = this;

        window.addEventListener('message', function (event) {

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

    _eventEmit() {
        this._win.dispatchEvent(
            util.event.create('ready-to-watch')
        );
    }

    start() {
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

