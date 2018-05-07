/**
 * @file MIP
 * @author sfe
 */

import Vue from './vue/platforms/web/entry-runtime-with-compiler';
import customElement from './custom-element/index';
import customElementBuildInComponents from './componets/index';
import './styles/mip.less';

Vue.use(customElement);
Vue.use(customElementBuildInComponents);

let mip = {
    Vue,
    customElement: Vue.customElement
};

export default mip;
