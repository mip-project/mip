/**
 * @file Resource manager
 *
 * @author zhangzhiqiang37(zhiqiangzhang37@163.com)
 */
'use strict';

import viewport from '../../util/viewport';
import rect from '../../util/dom/rect';
import Gesture from '../../util/gesture';

const firstInviewPropName = 'firstInview';

/**
 * Store the resources.
 * @inner
 * @type {Object}
 */
let resources = {};

/**
 * MIP Elements's controller. It's use to manage all the elements's custom life circle and
 * provide the overall interfaces of the MIP Elements.
 *
 * @class
 */
class Resources {

    constructor() {

        /**
         * Element id
         * @private
         * @type {number}
         */
        this.eid = 0;

        this.firstInviewPropName = firstInviewPropName;

        this.gesture = new Gesture(document.body, {
            preventX: false
        });

        this.bindEvent();
    }

    /**
     * Bind the events of current object.
     */
    bindEvent() {
        let scrollLock = false;
        viewport.on('resize scroll', () => {

            if (scrollLock) {
                return;
            }

            setTimeout(() => {
                scrollLock = false;
            }, 30);
            scrollLock = true;
            this.updateState();

        });
        this.gesture.on('swipe', (e, data) => {
            // let delay = Math.round(data.velocity * 600);
            // delay < 100 && (delay = 100);
            // delay > 600 && (delay = 600);
            this.updateState();
        });

        this.updateState();
    }

    /**
     * Add an element for current object and update all the elements's state.
     *
     * @param {MIPElement} element A mip element
     */
    add(element) {

        if (!element) {
            return;
        }

        element.eid = this.eid++;
        resources[element.eid] = element;
        setTimeout(() => {
            this.updateState();
        });
    }

    /**
     * Remove element from current resources object.
     *
     * @param {MIPElement|string} element Mip element or eid of element
     * @return {boolean} the removed state of element
     */
    remove(element) {
        let id = element.eid || element;
        if (Number.isFinite(+id) && resources[id]) {
            /* eslint-disable */
            delete resources[id];
            /* eslint-enable */
            return true;
        }
        return false;
    }

    /**
     * Return an object of resources.
     *
     * @return {Array}
     */
    getResources() {
        return resources;
    }

    /**
     * Set an element's viewport state to 'true' or 'false'.
     *
     * @param {MIPElement} element element
     * @param {boolean} inViewport inViewport
     */
    setInViewport(element, inViewport) {
        if (element.inViewport !== inViewport) {
            element.inViewport = inViewport;
        }

        if (inViewport) {
            // 此处特殊处理元素属性
            element[firstInviewPropName] = 1;
        }
    }

    /**
     * Update elements's viewport state.
     *
     */
    updateState() {
        let resources = this.getResources();
        let viewportRect = viewport.getRect();
        for (let i in resources) {
            // Compute the viewport state of current element.
            // If current element`s prerenderAllowed returns `true` always set the state to be `true`.
            let inViewport = rect.overlapping(rect.getElementRect(resources[i]), viewportRect);
            this.setInViewport(resources[i], inViewport);
        }
    }

}

export default new Resources();
