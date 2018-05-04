/**
 * @file MIP
 * @author sfe
 */

import Vue from './vue/platforms/web/entry-runtime-with-compiler';
import customElement from './custom-element/index';
import customElementBuildInComponents from './componets/index';

Vue.use(customElement);
Vue.use(customElementBuildInComponents);

let mip = {};

mip.Element = Vue;

// short name of customElement
mip.customElement = Vue.customElement;

export default mip;
