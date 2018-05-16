/**
 * @file mip1 polyfill
 *
 * @author zhangzhiqiang(zhiqiangzhang37@163.com)
 */

'use strict';

import './deps/esl';
import './deps/zepto';
// 如果fetch-jsonp在mip2也要可以把这里的import去掉，在该mip1 polyfill之后import
import '../../deps/fetch-jsonp';
import util from '../util';
import naboo from './deps/naboo';
import customElement from './customElement';
import templates from './templates';
import registerElement from './element';
import fixedElement from './fixed-element';
import resources from './resources';
import performance from './performance';
import viewer from '../util/viewer';
import viewport from '../util/viewport';
import hash from '../util/hash';

let utilDefine = () => util;
let nabooDefine = () => naboo;
let customElementDefine = () => customElement;
let viewerDefine = () => viewer;
let fixedElementDefine = () => fixedElement;
let performanceDefine = () => performance;
let viewportDefine = () => viewport;
let templatesDefine = () => templates;

define('util', utilDefine);
define('naboo', nabooDefine);
define('customElement', customElementDefine);
define('viewer', viewerDefine);
define('fixed-element', fixedElementDefine);
define('performance', performanceDefine);
define('viewport', viewportDefine);
define('templates', templatesDefine);
define('zepto', () => window.$);

// The global variable of MIP
const Mip = {};

if (window.MIP) {
    let exts = window.MIP;
    window.MIP = Mip;
    MIP.extensions = exts;
}
else {
    window.MIP = Mip;
}

// before document ready
MIP.push = function (extensions) {
    if (!MIP.extensions) {
        MIP.extensions = [];
    }
    MIP.extensions.push(extensions);
};

MIP.css = {};
MIP.hash = hash;
MIP.viewer = viewer;
MIP.viewport = viewport;
MIP.prerenderElement = resources.prerenderElement;
MIP.registerMipElement = function (name, customClass, css) {
    if (templates.isTemplateClass(customClass)) {
        templates.register(name, customClass);
    }
    else {
        registerElement(name, customClass, css);
    }
};

require.config({
    paths: {
        'searchbox/openjs/aio': '//m.baidu.com/static/searchbox/openjs/aio.js?v=201606',
        'jquery': '//mipcache.bdstatic.com/static/v1/deps/jquery'
    }
});

