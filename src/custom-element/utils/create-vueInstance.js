/**
 * @file create vue instance
 * @author sfe
 */

import {getPropsData, reactiveProps} from './props';
import {getSlots} from './slots';
import {customEmit} from './custom-event';

export default function createVueInstance(
    element,
    {Vue, store, router},
    componentDefinition,
    props,
    options
) {
    if (!element.__vue_custom_element__ && !element.hasAttribute('vce-ready')) {
        let ComponentDefinition = Vue.util.extend({}, componentDefinition);
        let propsData = getPropsData(element, ComponentDefinition, props);

        // for mip-template syntax
        // @TODO: 这里有个 bug， 如果 Vue 不带 compiler，那这个 template 没法用，只能用 render 方法
        if (element && element.tagName.toLowerCase() === 'mip-template') {
            ComponentDefinition.template = `<div class="mip-template-wrap">${element.innerHTML}</div>`;
        }

        // Auto event handling based on $emit
        function beforeCreate() { // eslint-disable-line no-inner-declarations
            this.$emit = function emit(...args) {
                customEmit(element, ...args);
                this.__proto__ && this.__proto__.$emit.call(this, ...args); // eslint-disable-line no-proto
            };
        }
        ComponentDefinition.beforeCreate = [].concat(ComponentDefinition.beforeCreate || [], beforeCreate);

        if (ComponentDefinition._compiled) { // eslint-disable-line no-underscore-dangle
            let ctorOptions = {}; // adjust vue-loader cache object if necessary - https://github.com/vuejs/vue-loader/issues/83
            if (ComponentDefinition._Ctor) { // eslint-disable-line no-underscore-dangle
                ctorOptions = ComponentDefinition._Ctor[0].options; // eslint-disable-line no-underscore-dangle
            }

            ctorOptions.beforeCreate = ComponentDefinition.beforeCreate;
        }

        let rootElement;
        let elementOriginalChildren = element.cloneNode(true).childNodes; // clone hack due to IE compatibility

        rootElement = {
            propsData,
            props: props.camelCase,
            computed: {
                reactiveProps() {
                    let reactivePropsList = {};
                    props.camelCase.forEach(prop => {
                        reactivePropsList[prop] = this[prop];
                    });

                    return reactivePropsList;
                }
            },

            /* eslint-disable */
            render(createElement) {
                let data = {
                    props: this.reactiveProps
                };

                return createElement(
                    ComponentDefinition,
                    data,
                    getSlots(elementOriginalChildren, createElement)
                );
            }
            /* eslint-enable */
        };
        let elementInnerHtml = '<div></div>';

        if (options.shadow && element.shadowRoot) {
            element.shadowRoot.innerHTML = elementInnerHtml;
            rootElement.el = element.shadowRoot.children[0];
        }
        else {
            element.innerHTML = elementInnerHtml;
            rootElement.el = element.children[0];
        }

        reactiveProps(element, props);

        if (typeof options.beforeCreateVueInstance === 'function') {
            rootElement = options.beforeCreateVueInstance(rootElement) || rootElement;
        }

        rootElement.store = store;
        rootElement.router = router;

        /* eslint-disable */
        // Define the Vue constructor to manage the element
        element.__vue_custom_element__ = new Vue(rootElement);
        element.__vue_custom_element_props__ = props;
        /* eslint-enable */

        if (options.shadow && options.shadowCss && element.shadowRoot) {
            let style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(options.shadowCss));

            element.shadowRoot.appendChild(style);
        }

        element.removeAttribute('vce-cloak');
        element.setAttribute('vce-ready', '');
        // element.children[0].setAttribute('data-server-rendered', '');
        customEmit(element, 'vce-ready');

        return element;
    }
}
