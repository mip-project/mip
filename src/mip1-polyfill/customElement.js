/**
 * @file Custom Element
 *
 * @author xx
 */

'use strict';

import EventEmitter from '../util/event-emitter';

/**
 * The constructor of  base class of custom element
 *
 * @param {MIPElement} element element
 * @class
 */
function customElement(element) {
    /**
     * @type {MIPElement}
     * @public
     */
    this.element = element;
    if (this.init) {
        this.init();
    }
}

/**
 * Apply the fill content style to an element
 *
 * @param {HTMLElement} ele element
 * @param {boolean} isReplaced whether replaced or not
 */
customElement.prototype.applyFillContent = (ele, isReplaced) => {
    ele.classList.add('mip-fill-content');
    if (isReplaced) {
        ele.classList.add('mip-replaced-content');
    }
};

/**
 * Called when the MIPElement is created.
 */
customElement.prototype.createdCallback = () => {};

/**
 * Called when the MIPElement is inserted into the DOM.
 */
customElement.prototype.attachedCallback = () => {};

/**
 * Called when the MIPElement is removed from the DOM.
 */
customElement.prototype.detachedCallback = () => {};

/**
 * Called when the MIPElement's attribute is changed.
 */
customElement.prototype.attributeChangedCallback = () => {};

/**
 * Called when the MIPElement first enters the viewport.
 */
customElement.prototype.firstInviewCallback = () => {};

/**
 * Called when the MIPElement has entered or exited the viewport.
 */
customElement.prototype.viewportCallback = () => {};

/**
 * Control whether the MIPElement is rendred ahead.
 *
 * @return {boolean} If the result is TRUE, the element will be rendred ahead.
 */
customElement.prototype.prerenderAllowed = () => false;

/**
 * Return the current component containing resources.
 * If it returns true, complete should be called.
 *
 * @return {boolean} whether has resource or not
 */
customElement.prototype.hasResources = () => false;

/**
 * Called when the MIPElement is first inserted into the document.
 */
customElement.prototype.build = () => {};

/**
 * Expend current element's attributes which selected by attrs to an other object.
 *
 * @param {Array.<string>} attrs Attributes' name list
 * @param {Object} element The target element
 * @return {Object}
 */
customElement.prototype.expendAttr = (attrs, element) => {
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (this.element.hasAttribute(attr)) {
            let val = this.element.getAttribute(attr);
            element.setAttribute
                ? element.setAttribute(attr, val)
                : element[attr] = val;
        }
    }
    return element;
};

/**
 * Add event actions such as `this.addEventAction("default open", handler)`
 *
 * @param {string} name event name
 * @param {Function} handler event handler
 */
customElement.prototype.addEventAction = () => {
    let evt = this._actionEvent;
    if (!evt) {
        evt = this._actionEvent = new EventEmitter();
        evt.setEventContext(this);
    }

    evt.on.apply(evt, arguments);
};

/**
 * Trigger the handlers had been added by `addEventAction` of an action
 *
 * @param {string} action The action's name
 */
customElement.prototype.executeEventAction = action => {
    let eventObj = this._actionEvent;
    if (action && eventObj) {
        eventObj.trigger(action.handler, action.event, action.arg);
    }
};

/**
 * Notice that resources are loaded.
 */
customElement.prototype.resourcesComplete = () => {
    this.element.resourcesComplete();
};

export default {

    /**
     * Create a class of a new type mip element
     *
     * @return {Function}
     */
    create() {
        function impl(element) {
            customElement.call(this, element);
        }
        impl.prototype = Object.create(customElement.prototype);
        return impl;
    }
};
