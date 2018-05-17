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
    constructor(id) {
        let me = this;
        this._id = id;
        this._win = window;
        this._watchers = [];
        this._watcherIds = [];
        this._win.g = this._win.g || [];
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
            me._bindWatch(target, cb);
        };
        MIP.unwatchAll = function () {
            me._watchers.forEach(watcher => watcher.teardown());
            me._watcherIds = [];
            // 只保留 global 数据
            me._win.m = me._getGlobalData(me._win.g, me._win.m);
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
            let globals = this._normalize(data);
            let origin = JSON.stringify(window.m);
            this._compile.upadteData(JSON.parse(origin));
            // fn.extend(window.m, data);
            // Object.assign(window.m, data);
            if (compile) {
                this._diff({
                    globals: this._win.g,
                    data: window.m
                }, {
                    globals,
                    data
                });
                this._observer.start(this._win.m);
                this._compile.start(this._win.m);
            }
            else {
                this._win.g = this._win.g.concat(globals);
                this._assign(window.m, data);
            }
        }
        else {
            console.error('setData method must accept an object!');
        }
    }

    _normalize(data) {
        return this._normalizeGlobal(data).filter(attr => attr !== ',');
    }

    _normalizeGlobal(data) {
        let path = [];

        for (let k of Object.keys(data)) {
            let stop = false;
            let newKey = k;

            if (/^#/.test(k)) {
                stop = true;
                newKey = k.substr(1);
                path.push(newKey);
                path.push(',');
                data[newKey] = data[k];
                delete data[k];
            }
            else {
                path.push(k);
            }

            if (isObj(data[newKey]) && !stop) {
                let tmp = this._normalizeGlobal(data[newKey]);
                let parent = path.pop();
                if (tmp.length) {
                    path = [...path, ...tmp.map(p => p !== ',' ? `${parent}.${p}` : ',')];
                }
            }
        }

        path = path.join(' ')
            .replace(/([^,]*\s)([^,])/g, ' $2')
            .replace(/^\s*|\s*$/g, '')
            .split(' ');
        return path.slice(0, path.lastIndexOf(',') + 1);
    }

    _diff(
        { globals: oldGlobals, data: oldData },
        { globals: newGlobals, data: newData }
    ) {
        this._getGlobalData(oldGlobals, oldData, newData, function (globalPath, clone) {
            if (!~newGlobals.indexOf(globalPath)) {
                newGlobals.push(globalPath);
                clone();
            }
        });

        this._win.g = newGlobals;
        Object.assign(oldData, newData);
    }

    _getGlobalData(globals, srcData, target = {}, condition) {
        if (!condition) {
            condition = function (globalPath, clone) {
                clone();
            };
        }

        for (let r of globals) {
            condition(r, function () {
                let paths = r.split('.');
                let objSrc = srcData;
                let objData = target;
                let lastAttr = paths.pop();
                for (let p of paths) {
                    if (objData[p]) {
                        objData = objData[p];
                    }
                    else {
                        objData[p] = {};
                        objData = objData[p];
                    }
                    objSrc = objSrc[p];
                }
                objData[lastAttr] = objSrc[lastAttr];
            });
        }

        return target;
    }

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

    // start() {
    //     // require mip data extension runtime
    //     // require('./mip-data');
    //     this._dataSource = {
    //         m: window.m ? window.m : {}
    //     };
    //     MIP.$set(this._dataSource.m);
    // }

    // _proxy() {
    //     let me = this;
    //     Object.keys(this._dataSource).forEach(function (key) {
    //         me._proxyData(key);
    //     });
    // }

    // _proxyData(key) {
    //     let me = this;
    //     Object.defineProperty(this._win, key, {
    //         configurable: false,
    //         enumerable: true,
    //         get() {
    //             return me._dataSource[key];
    //         },
    //         set(newVal) {
    //             me._dataSource[key] = newVal;
    //         }
    //     });
    // }
}

function isObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

export default Bind;

