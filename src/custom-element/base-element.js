/**
 * @file mip2 base element
 * @author sekiyika(pengxing@baidu.com)
 */

class BaseElement extends HTMLElement{

    constructor() {
        super();

        /**
         * viewport state
         *
         * @private
         * @type {boolean}
         */
        this._inViewport = false;

        /**
         * whether the element is into the viewport
         *
         * @private
         * @type {boolean}
         */
        this._firstInViewport = false;

        /**
         * the resources object
         *
         * @private
         * @type {Object}
         */
        this._resources = resources;

    }

    static get observedAttributes() {
        return props.hyphenate || [];
    }

    connectedCallback() {
        // Subclasses may override.
    }

    disconnectedCallback() {
        // Subclasses may override.
    }

    inViewport() {
        return this._inViewport;
    }

    firstInviewCallback() {
        // Subclasses may override.
    }

    viewportCallback(inViewport) {
        this._inViewport = inViewport;
        if (!this._firstInViewport) {
            this._firstInViewport = true;
            this.firstInviewCallback();
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

}
