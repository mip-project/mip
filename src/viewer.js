/**
 * @file viewer.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import EventEmitter from './util/event-emitter';
import EventAction from './util/event-action';
import Gesture from './util/gesture';
import fn from './util/fn';
import event from './util/dom/event';

let viewer = {
    init() {
        this._gesture = new Gesture(document, {
            preventX: false
        });
        this.setupEventAction();
    },

    setupEventAction() {
        let hasTouch = fn.hasTouch();
        let eventAction = this.eventAction = new EventAction();
        if (hasTouch) {
            // In mobile phone, bind Gesture-tap which listen to touchstart/touchend event
            /* istanbul ignore next */
            this._gesture.on('tap', function (event) {
                eventAction.execute('tap', event.target, event);
            });
        }
        else {
            // In personal computer, bind click event, then trigger event. eg. `on=tap:sidebar.open`, when click, trigger open() function of #sidebar
            document.addEventListener('click', function (event) {
                eventAction.execute('tap', event.target, event);
            }, false);
        }

        document.addEventListener('click', function (event) {
            eventAction.execute('click', event.target, event);
        }, false);

        /* istanbul ignore next */
        event.delegate(document, 'input', 'change', function (e) {
            eventAction.execute('change', e.target, e);
        });

    }

};

EventEmitter.mixin(viewer);

export default viewer;
