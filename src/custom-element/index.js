/**
 * @file index.js
 * @author sfe-sy (sfe-sy@baidu.com)
 */

import createVueInstance from './utils/create-vue-instance';
import {getProps, convertAttributeValue} from './utils/props';
import {camelize} from './utils/helpers';
import resources from './utils/resources';
import layout from '../util/layout';
import EventEmitter from '../util/event-emitter';

const firstInviewCallbackLifeCircleName = 'firstInviewCallback';

function install(Vue, router) {
    Vue.customElement = (tag, componentDefinition) => {

        // 如果不设置 template 和 render 函数，默认设置 render 函数返回 null，避免 warning
        let {template, render} = componentDefinition;
        if (!template && typeof render !== 'function') {
            componentDefinition.render = () => null;
        }

        const props = getProps(componentDefinition);
        function callLifeCycle(ctx, name) {
            if (typeof componentDefinition[name] === 'function') {
                return componentDefinition[name].apply(ctx, [].slice.call(arguments, 2));
            }
        }

        class CustomElement extends HTMLElement {
            // Can define constructor arguments if you wish.
            constructor() {
                super();

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
            }

            connectedCallback() {
                if (!this.__detached__) {
                    createVueInstance(
                        this, {
                            Vue,
                            router
                        },
                        componentDefinition,
                        props
                    );

                    componentDefinition[firstInviewCallbackLifeCircleName] && this._resources.add(this);

                    // Apply layout for this.
                    this._layout = layout.applyLayout(this);
                }
                this.__detached__ = false;
            }

            disconnectedCallback() {
                this.__detached__ = true;

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
                if (this.vm) {
                    callLifeCycle(this.vm, firstInviewCallbackLifeCircleName, this);
                }
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

            addEventAction(/** name, handler */) {
                let evt = this._actionEvent;
                if (!evt) {
                    evt = this._actionEvent = new EventEmitter();
                    evt.setEventContext(this);
                }

                evt.on.apply(evt, arguments);
            }

            executeEventAction(action) {
                let eventObj = this._actionEvent;
                if (action && eventObj) {
                    eventObj.trigger(action.handler, action.event, action.arg);
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
