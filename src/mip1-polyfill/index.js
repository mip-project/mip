/**
 * @file mip1-polyfill MIP2 兼容 MIP1 的方式之一
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

import 'script-loader!../../deps/fetch.js';
import 'script-loader!fetch-jsonp';
import 'script-loader!zepto';
import 'script-loader!document-register-element/build/document-register-element';
import 'script-loader!esljs';

import util from '../util';
import viewer from '../util/viewer';
import viewport from '../util/viewport';
import templates from '../util/templates';
import registerElement from './element';
import customElement from './customElement';
import performance from '../performance';
import fixedElement from '../fixed-element';

 // 将 jquery 配置为远程的，需要时才引入
 window.require.config({
    paths:{
        'searchbox/openjs/aio': '//m.baidu.com/static/searchbox/openjs/aio.js?v=201606',
        jquery: '//mipcache.bdstatic.com/static/v1/deps/jquery'
    }
});

window.define('util', () => util);
window.define('viewer', () => viewer);
window.define('viewport', () => viewport);
window.define('templates', () => templates);
window.define('customElement', () => customElement);
window.define('performance', () => performance);
window.define('customStorage', () => util.customStorage);
window.define('fetch-jsonp', () => window.fetchJsonp);
window.define('zepto', () => window.$);
window.define('fixed-element', () => fixedElement);

export default function install(mip) {

    mip.registerMipElement = function (name, customClass, css) {
        if (templates.isTemplateClass(customClass)) {
            templates.register(name, customClass);
        }
        else {
            registerElement(name, customClass, css);
        }
    };

}

// TODO by (zhangzhiqiang04)
// naboo
// fixed-element
