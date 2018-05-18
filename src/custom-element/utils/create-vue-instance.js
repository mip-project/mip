/**
 * @file create vue instance
 * @author sfe
 */

import {getPropsData, reactiveProps} from './props';
import {getSlots} from './slots';
import {customEmit} from './custom-event';
import viewer from '../../util/viewer';

export default function createVueInstance(
    element,
    {Vue, router},
    componentDefinition,
    props
) {
    // if (!element.vm && !element.hasAttribute('vce-ready')) {
    if (!element.vm) {
        let ComponentDefinition = Vue.util.extend({}, componentDefinition);
        let propsData = getPropsData(element, ComponentDefinition, props);

        // for mip-template syntax
        // @TODO: 这里有个 bug， 如果 Vue 不带 compiler，那这个 template 没法用，只能用 render 方法
        if (element && element.tagName.toLowerCase() === 'mip-template') {
            ComponentDefinition.template = `<div class="mip-template-wrap">${element.innerHTML}</div>`;
        }
        // for mip-data syntax
        if (element
            && element.tagName.toLowerCase() === 'mip-data'
            && element.getAttribute('src')
        ) {
            propsData.mipsrc = element.getAttribute('src');
            element.setAttribute('mipsrc', element.getAttribute('src'));
            element.removeAttribute('src');
        }

        // Auto event handling based on $emit
        function beforeCreate() { // eslint-disable-line no-inner-declarations
            this.$emit = function emit(...args) {
                customEmit(element, ...args);
                viewer.eventAction.execute(args[0], element, args[1]);
                this.__proto__ && this.__proto__.$emit.call(this, ...args); // eslint-disable-line no-proto
            };
        }
        ComponentDefinition.beforeCreate = [].concat(ComponentDefinition.beforeCreate || [], beforeCreate);

        let elementOriginalChildren = element.cloneNode(true).childNodes; // clone hack due to IE compatibility

        element.innerHTML = '<div></div>';

        let rootElement = {
            propsData,
            router,
            props: props.camelCase,
            el: element.children[0],
            computed: {
                reactiveProps() {
                    let reactivePropsList = {};
                    props.camelCase.forEach(prop => {
                        reactivePropsList[prop] = this[prop];
                    });

                    return reactivePropsList;
                }
            },

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
        };

        reactiveProps(element, props);

        element.vm = (new Vue(rootElement)).$children[0];
        element.props = props;

        element.removeAttribute('vce-cloak');
        element.setAttribute('vce-ready', '');

        element.children[0].setAttribute('data-server-rendered', '');
        customEmit(element, 'vce-ready');

        return element;
    }
}
