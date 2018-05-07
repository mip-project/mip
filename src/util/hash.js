/**
 * @file Hash Function. Support hash get function
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

import rect from './dom/rect';

/**
 * Hash class
 *
 * @class
 */
function Hash() {
    // init sessionStorage status
    this.ssEnabled = ssEnabled();
    this.pageId = window.location.href.split('#').shift();
    let hash = window.location.hash;
    if (this.ssEnabled) {
        let ssHash = window.sessionStorage.getItem(this.pageId) || '';
        // add the window.location.hash
        hash = ssHash + hash;
    }
    this.hashTree = this._getHashObj(hash);
    // if hash is exist, try storage the value into sessionStroage
    if (hash) {
        let curHash = this._getHashValue();
        if (this.ssEnabled) {
            window.sessionStorage.setItem(this.pageId, curHash);
        }
        window.location.hash = curHash;
    }
    this.bindAnchor();
}

/**
 * get hash value of specific key
 *
 * @param  {string} key key
 * @return {value}     [description]
 */
Hash.prototype.get = function (key) {
    let hv = this.hashTree[key];
    return hv && hv.value ? hv.value : '';
};

/**
 * If there has anchor, Scroll to it
 *
 */
Hash.prototype.bindAnchor = function () {
    let anchor = this.hashTree.mipanchor;
    if (anchor && anchor.value) {
        if (document.readyState !== 'loading') {
            this.scrollToAnchor(anchor);
        }
        else {
            let handle = this.scrollToAnchor.bind(null, anchor);
            document.addEventListener('DOMContentLoaded', handle, false);
        }
    }
};

/**
 * Scroll to anchor
 *
 * @param {Object} anchor anchor object
 */
Hash.prototype.scrollToAnchor = function (anchor) {
    let ele = document.getElementById(anchor.value);
    if (ele) {
        let rt = rect.getElementOffset(ele);
        ele && rt.top && rect.setScrollTop(rt.top);
    }
};

/**
 * refresh hash object
 */
Hash.prototype.refreshHashTree = function () {
    let originalHash = window.location.hash;
    this.hashTree = this._getHashObj(originalHash);
};

/**
 * get hash object from hash
 *
 * @param  {string} originalHash originalHash
 * @return {Object} object of each hash
 */
Hash.prototype._getHashObj = function (originalHash) {
    let hashObj = {};
    if (!originalHash) {
        return hashObj;
    }
    let hashString = originalHash.slice(originalHash.indexOf('#') + 1);
    let hashs = hashString.split('&');
    for (let key in hashs) {
        if (hashs.hasOwnProperty(key)) {
            let item = hashs[key];
            let hk = item;
            let hv = '';
            let idx = item.indexOf('=');
            // key invalid
            if (idx === 0) {
                continue;
            }
            // key valid
            if (idx !== -1) {
                hk = item.substring(0, idx);
                hv = item.slice(idx + 1);
            }
            hashObj[hk] = {
                value: hv,
                sep: idx !== -1 ? '=' : ''
            };
        }
    }
    return hashObj;
};

/**
 * get hash value from hash tree
 *
 * @return {string} hash
 */
Hash.prototype._getHashValue = function () {
    let hash = [];
    let hashTree = this.hashTree;
    for (let key in hashTree) {
        if (hashTree.hasOwnProperty(key)) {
            let val = hashTree[key].value;
            let sep = hashTree[key].sep;
            val = key + sep + val;
            hash.push(val);
        }
    }
    return hash.join('&');
};

/**
 * test ss is available
 *
 * @return {boolean} whether enabled or not
 */
function ssEnabled() {
    let support = false;
    try {
        window.sessionStorage.setItem('_t', 1);
        window.sessionStorage.removeItem('_t');
        support = true;
    }
    catch (e) {
    }
    return support;
}

export default new Hash();
