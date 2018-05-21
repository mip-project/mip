/**
 * @file bind.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import Compile from './compile';
import Observer from './observer';
import Watcher from './watcher';
import util from '../../util';
import {
    setGlobalState, setPageState,
    destroyPageScope, assign
} from './scope';

/* global MIP */
class Bind {
    constructor(id) {
        let me = this;
        this._id = id;
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
            console.log('from MIP.watch', target, cb)
            me._bindWatch(target, cb);
        };
        MIP.unwatchAll = function () {
            me._watchers.forEach(watcher => watcher.teardown());
            me._watcherIds = [];
            // 只保留 global 数据，并去掉 __ob__
            destroyPageScope();
            me._win.m = JSON.parse(
                JSON.stringify(m).replace(/,"__ob__":\{\}/g, '')
            );
        };
    }

    // Bind event for post message when fetch data returned, then compile dom again
    _bindEvent() {
        let me = this;

        window.addEventListener('message', function (event) {
            let loc = me._win.location;
            let domain = loc.protocol + '//' + loc.host;
            if (event.origin === domain
                && event.source && event.data
                && event.data.type === 'bind' + me._id
                && event.source === me._win
            ) {
                MIP.$set(event.data.m);
            }
        });
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
            let classified = this._normalize(data);
            if (compile) {
                setGlobalState(classified.globalData);
                setPageState(classified.pageData);
                this._observer.start(this._win.m);
                this._compile.start(this._win.m);
            }
            else {
                this._assign(window.m, data);
            }
        }
        else {
            console.error('setData method must accept an object!');
        }
    }

    _normalize(data) {
        let globalData = {};
        let pageData = {};

        for (let k of Object.keys(data)) {
            if (/^#/.test(k)) {
                globalData[k.substr(1)] = data[k];
            }
            else {
                pageData[k] = data[k];
            }
        }

        return {
            globalData,
            pageData: pageData || {}
        }
    }

    // deepClone
    _assign(oldData, newData) {
        for (let k of Object.keys(newData)) {
            if (isObj(newData[k]) && oldData[k]) {
                this._assign(oldData[k], newData[k]);
            }
            else {
                oldData[k] = newData[k];
            }
        }
    }

    _bindWatch(target, cb) {
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

        // TODO 去重
        let reg = target.split('.').reduce((total, current) => {
            if (total) {
                total += '\{("[^\{\}:]+":\{[^\{\}]+\},)*';
            }
            return total + `"${current}":`;
        }, '');
        if (!JSON.stringify(this._win.m).match(new RegExp(reg))) {
            return;
        }

        let watcherId = `${target}${cb.toString()}`.replace(/[\n\t\s]/g, '');
        if (this._watcherIds.indexOf(watcherId) !== -1) {
            return;
        }

        this._watcherIds.push(watcherId);
        this._watchers.push(new Watcher(
            null,
            this._win.m,
            '',
            target,
            cb // args: (dir, newVal, oldVal)
        ));
    }

    _eventEmit() {
        this._win.dispatchEvent(
            util.event.create('ready-to-watch')
        );
    }
}

function isObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

export default Bind;
