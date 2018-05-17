/**
 * @file create vue instance
 * @author sfe
 */

import {getPropsData, reactiveProps} from './props';
import {getSlots} from './slots';
import {customEmit} from './custom-event';

export default function createVueInstance(
    element,
    {Vue, router},
    componentDefinition,
    props
) {
    if (!element.vm && !element.hasAttribute('vce-ready')) {
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
        customEmit(element, 'vce-ready');

        return element;
    }
}
