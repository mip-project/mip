/**
 * @file set-prototype-of.js
 * @author huanghuiquan(huanghuiquan@baidu.com)
 * ES6 Object.getPrototypeOf Polyfill
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
 */

Object.setPrototypeOf = Object.setPrototypeOf || setPrototypeOf;

function setPrototypeOf(obj, proto) {
    /* eslint-disable */
    obj.__proto__ = proto;
    /* eslint-disable */
    return obj;
}

setPrototypeOf.bind(Object);
