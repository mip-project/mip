/**
 * @file scope.js
 * @author qiusiqi
 */

let pageScope;

class Scope {
    constructor(data, parent) {
        this._parent = parent;
        this.addDataToScope(data);
    }

    addDataToScope(data) {
        let _data = {};

        Object.keys(data).forEach(function (key) {
            _data[key] = Object.getOwnPropertyDescriptor(data, key);
        });
        _data = Object.create(this._parent, _data);

        this.data = Object.assign(this.data || {}, data);
    }
}

function setGlobalState(data) {
    Object.assign(window.m, data);
}

function setPageState(data) {
    if (!pageScope) {
        pageScope = new Scope(data, window.m);
    }
    else {
        pageScope.addDataToScope(data);
    }
    Object.assign(window.m, pageScope.data);
}

function destroyPageScope() {
    if (!pageScope) {
        return;
    }

    for (let v in pageScope.data) {
        if (pageScope.data.hasOwnProperty(v)) {
            delete window.m[v];
        }
    }
    pageScope = null;
}

export {
    setGlobalState,
    setPageState,
    destroyPageScope
};
