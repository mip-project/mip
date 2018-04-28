/**
 * @file index.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import Vue from 'vue/dist/vue.esm';
import vueCustomElement from './custom-element';
import registerComponents from './components';

// install plugins
Vue.use(vueCustomElement);

Vue.filter('json', obj => JSON.stringify(obj));

registerComponents(Vue);

export function customElement(tag, componentDefinition, options = {}) {
    Vue.customElement(tag, componentDefinition, options);
}
