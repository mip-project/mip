/**
 * @file index.js
 * @author sfe-sy (sfe-sy@baidu.com)
 */

import createVueInstance from './utils/create-vue-instance';
import {getProps, convertAttributeValue} from './utils/props';
import {camelize} from './utils/helpers';
import resources from './utils/resources';
import layout from '../util/layout';

function install(Vue, router) {
    Vue.customElement = function vueCustomElement(tag, componentDefinition) {

        const props = getProps(componentDefinition);

        function callLifeCycle(ctx, name) {
            typeof componentDefinition[name] === 'function'
                && componentDefinition[name].apply(ctx, [].slice.call(arguments, 2));
        }

        class CustomElement extends HTMLElement {
            // Can define constructor arguments if you wish.
            constructor() {
                super();
                callLifeCycle(this, 'constructorCallback');

                /**
                 * Viewport state
                 * @private
                 * @type {boolean}
                 */
                this._inViewport = false;

                /**
                 * Whether the element is into the viewport.
                 * @private
                 * @type {boolean}
                 */
                this._firstInViewport = false;

                /**
                 * The resources object.
                 * @private
                 * @type {Object}
                 */
                this._resources = resources;

                // /**
                //  * Instantiated the custom element.
                //  * @type {Object}
                //  * @public
                //  */
                // var customElement = this.customElement = new CustomEle(this);

                // customElement.createdCallback();

                // // Add first-screen element to performance.
                // if (customElement.hasResources()) {
                //     performance.addFsElement(this);
                // }

            }

            connectedCallback() {
                if (!this.__detached__) {
                    this._resources.add(createVueInstance(
                        this, {
                            Vue,
                            router
                        },
                        componentDefinition,
                        props
                    ));
                }
                this.__detached__ = false;

                callLifeCycle(this, 'connectedCallback');

                // Apply layout for this.
                this._layout = layout.applyLayout(this, this.vm);

                // Add to resource manager.
                this._resources.add(this);
            }

            disconnectedCallback() {
                this.__detached__ = true;
                callLifeCycle(this, 'disconnectedCallback');

                setTimeout(() => {
                    if (this.__detached__ && this.vm) {
                        this.vm.$destroy(true);
                        delete this.vm;
                        delete this.props;
                    }
                }, 3000);
            }

            attributeChangedCallback(name, oldValue, value) {
                if (this.vm) {
                    callLifeCycle(this, 'attributeChangedCallback', name, oldValue, value);
                    const nameCamelCase = camelize(name);
                    const type = this.props.types[nameCamelCase];
                    try {
                        value = JSON.parse(value);
                    }
                    catch (e) {}
                    this.vm.$root[nameCamelCase] = convertAttributeValue(value, type);
                }
            }

            inViewport() {
                return this._inViewport;
            }

            firstInviewCallback() {
                callLifeCycle(this, 'firstInviewCallback');
            }

            viewportCallback(inViewport) {
                this._inViewport = inViewport;
                if (!this._firstInViewport) {
                    this._firstInViewport = true;
                    this.firstInviewCallback();
                }
            }

            applyFillContent(ele, isReplaced) {
                ele.classList.add('mip-fill-content');
                if (isReplaced) {
                    ele.classList.add('mip-replaced-content');
                }
            }

            static get observedAttributes() {
                return props.hyphenate || [];
            }
        }

        customElements.define(tag, CustomElement);
        return CustomElement;
    };
}

export default install;
