/**
 * @file is-es2015.js
 * @author sfe-sy (sfe-sy@baidu.com)
 */

function isES2015() {
    if (typeof Symbol === 'undefined' || typeof Reflect === 'undefined') {
        return false;
    }

    return true;
}

export default isES2015();
