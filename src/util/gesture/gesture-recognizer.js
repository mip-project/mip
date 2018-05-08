/**
 * @file gesture-recognizer
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

import fn from '../fn';

// Save native functions.
const create = Object.create;

/**
 * Mean recognizer is at the beginning of the state.
 *
 * @const
 * @inner
 * @type {number}
 */
const STATE_START = 1;

/**
 * Mean the recognizer is waitting timer or another recognizer.
 * @const
 * @inner
 * @type {number}
 */
const STATE_WAIT = 2;

/**
 * Mean the recognizer is pending. Need to wait a while.
 *
 * @const
 * @inner
 * @type {number}
 */
const STATE_PENDING = 3;

/**
 * Mean the recognizer can be emitted.
 *
 * @const
 * @inner
 * @type {number}
 */
const STATE_END = 4;

/**
 * The state is failed or ended. Need to wait next life circle.
 *
 * @const
 * @inner
 * @type {number}
 */
const STATE_HOLD = 5;

/**
 * This object is used to get state number fast.
 *
 * @const
 * @inner
 * @type {Object}
 */
const STATE_NUMBER = {
    start: STATE_START,
    wait: STATE_WAIT,
    pending: STATE_PENDING,
    end: STATE_END,
    hold: STATE_HOLD
};

/**
 * Save the direction string, we will use it to get direction by number.
 *
 * @const
 * @inner
 * @type {Object}
 */
const DIRECTION_STR = {
    0: '',
    1: 'up',
    2: 'right',
    3: 'down',
    4: 'left'
};


/**
 * Recognizer class.
 *
 * @class
 * @param {Gesture} gesture gesture
 */
function Recognizer(gesture) {
    /**
     * Sign the recognizer's state. Default is 'start'.
     *
     * @private
     * @type {number}
     */
    this._state = STATE_START;

    /**
     * The bound gesture.
     *
     * @type {Gesture}
     */
    this.gesture = gesture;

    /**
     * The conflicting list that records the conflicting recognizers in the same gesture object.
     *
     * @type {Object}
     */
    this.conflictList = {};
}

/* eslint-disable */
fn.extend(Recognizer.prototype, {
/* eslint-enable */
    /**
     * Recognizer name.
     * @type {string}
     */
    name: '',

    /**
     * The event list of current recognizer.
     *
     * @type {Array.<string>}
     */
    eventList: [],

    /**
     * Mark whether an automatic reset is required.
     *
     * @type {boolean}
     */
    needAutoReset: true,

    /**
     * The conflicting level. When the recognizer is conflicted by another,
     * use it to decision which one is to hold.
     *
     * @type {number}
     */
    level: 0,

    /**
     * Recognize event data.
     *
     * @param {Object} data data
     */
    recognize(data) {
        let eventState = data.eventState;
        if (eventState === 'start' && this._state === STATE_HOLD) {
            this._state = STATE_START;
            this.needAutoReset && this.reset();
        }
        if (this._state === STATE_HOLD) {
            return;
        }
        let state = this.process(data);
        if (this._state === STATE_HOLD) {
            return;
        }
        this._state = state;

        if (this.emitCheck()) {
            this.emit(data);
        }
    },

    /**
     * Determine that current recognizer is at [xxx] state or not.
     * Usage is isState(1, 5) or isState('start', 'hold'). It does not
     * limit the number of parameters.
     *
     * @return {boolean}
     */
    isState() {
        let args = arguments;
        for (let i = 0; i < args.length; i++) {
            let st = typeof args[i] === 'string' ? STATE_NUMBER[args[i]] : args[i];
            if (st === this._state) {
                return true;
            }
        }
        return false;
    },

    /**
     * Set state by string or number.
     *
     * @param {string|number} st st
     * @return {number}
     */
    setState(st) {
        st = typeof st === 'string' ? STATE_NUMBER[st] : st;
        if (st > 0 && st < 6) {
            this._state = st;
        }
        return this._state;
    },

    /**
     * Check whether the recognizer can be emitted.
     *
     * @return {boolean}
     */
    emitCheck() {
        if (this._state === STATE_START || this._state === STATE_HOLD) {
            return false;
        }
        for (let i in this.conflictList) {
            let conflictRecognizer = this.conflictList[i];
            if (conflictRecognizer.level > this.level && this.conflictList[i].state !== STATE_HOLD) {
                return false;
            }
        }

        return true;
    },

    /**
     * Process the event data. The main method of recognizer.
     * It needs to be overrode.
     *
     * @param {Object} data data
     * @return {number}
     */
    process(data) {
        return this._state;
    },

    /**
     * Emit with event data.
     *
     * @param {Object} data data
     */
    emit(data) {
        // emtting
    },

    /**
     * Reset the recognizer.
     */
    reset() {
    },

    /**
     * Put the state into hold.
     *
     * @return {number}
     */
    hold() {
        return this._state = STATE_HOLD;
    },

    /**
     * Trigger the gesture's event.
     *
     * @param {Object} data data
     */
    trigger(data) {
        this.gesture.trigger(data.type, data.event, data);
    }
});


/**
 * For storing recognizers.
 *
 * @inner
 * @type {Object}
 */
let recognizerList = {};

/**
 * For storing the event names of recognizers.
 * @inner
 * @type {Object}
 */
let eventList = {};

/**
 * Register also as the control of recognizers.
 * Recognizer.xxx means the control's method.
 * This method is used to register Recognizer class.
 *
 * @param {Function} Rec recognizer
 * @param {string} name name
 */
Recognizer.register = function (Rec, name) {
    !Rec.conflictList && (Rec.conflictList = []);
    Rec.recName = Rec.prototype.recName = name;
    recognizerList[name] = Rec;
    let evlist = Rec.prototype.eventList;
    for (let i = 0; i < evlist.length; i++) {
        eventList[evlist[i]] = Rec;
    }
};

/**
 * Get the conflicting list of a recognizer class.
 *
 * @param {string} name name
 * @return {?Array.<Object>}
 */
Recognizer.getConflictList = function (name) {
    return recognizerList[name] && recognizerList[name].conflictList;
};

/**
 * Get recognizer class by name.
 *
 * @param {string} name name
 * @return {Function}
 */
Recognizer.get = function (name) {
    return recognizerList[name];
};

/**
 * Get recognizer class by event name.
 *
 * @param {string} event Event name
 * @return {Function}
 */
Recognizer.getByEventname = function (event) {
    return eventList[event];
};

/**
 * Conflict a and b.
 *
 * @param {Function} a a
 * @param {Function} b b
 */
Recognizer.conflict = function (a, b) {
    if (typeof a === 'string') {
        a = Recognizer.get(a);
        b = Recognizer.get(b);
    }
    if (!a || !b) {
        return;
    }
    a.conflictList.push(b.recName);
    b.conflictList.push(a.recName);
};



/**
 * Handler for holdTime.
 */
function holdTimeFn() {
    this._state = STATE_END;
    this.emit();
}

/**
 * Tap
 *
 * @class
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);
    this.boundHoldTimeFn = holdTimeFn.bind(this);
}

TapRecognizer.prototype = fn.extend(create(Recognizer.prototype), {
    /**
     * @override
     */
    eventList: ['tap'],

    /**
     * The count of tap.
     *
     * @type {number}
     */
    taps: 1,

    /**
     * The count of user tap.
     *
     * @type {number}
     */
    count: 0,

    /**
     * If the gesture has several tap recognizer,
     * we need to wait some time to recognize.
     *
     * @type {number}
     */
    holdTime: 300,

    /**
     * The tap time. It will failed when the time is over this.
     *
     * @type {number}
     */
    time: 250,

    /**
     * The move range of finger.
     *
     * @type {number}
     */
    moveRange: 10,

    /**
     * @override
     */
    level: 1,

    /**
     * @override
     */
    needAutoReset: false,

    /**
     * Process the event data. The processing result are determined based on the data.
     * And return the result.
     *
     * @override
     * @param {*} data data
     */
    process(data) {
        if (data.deltaTime > this.time || data.distance > this.moveRange || data.pointers.length > 1) {
            this.reset();
            return this.hold();
        }
        if (data.eventState === 'start') {
            clearTimeout(this.holdTimer);
        }
        if (data.eventState !== 'end') {
            return STATE_WAIT;
        }
        let holdTime = this.preTime && (data.timeStamp - this.preTime);
        this.preTime = data.timeStamp;

        if (holdTime < this.holdTime) {
            this.count++;
        }
        else {
            this.count = 1;
        }
        this._data = data;

        if (this.count === this.taps) {
            if (this.emitCheck()) {
                return STATE_END;
            }

            this.holdTimer = setTimeout(this.boundHoldTimeFn, this.holdTime);
            return STATE_WAIT;
        }
    },

    /**
     * @override
     */
    reset() {
        this.preTime = null;
        this.count = 0;
        this._state = STATE_START;
        clearTimeout(this.holdTimer);
    },

    /**
     * @override
     */
    emit() {
        if (this._state === STATE_END) {
            let data = this._data;
            let eventData = create(data);
            eventData.type = this.eventList[0];
            this._data = null;
            this.trigger(eventData);
            this.reset();
        }
    }
});


/**
 * The double-tap-recognizer. It inherits from TapRecognizer.
 *
 * @class
 */
function DoubleTapRecognizer() {
    TapRecognizer.apply(this, arguments);
}

DoubleTapRecognizer.prototype = fn.extend(create(TapRecognizer.prototype), {
    /**
     * The tap number is 2.
     *
     * @override
     */
    taps: 2,

    /**
     * @override
     */
    eventList: ['doubletap'],

    /**
     * The level is 2. Then, if a gesture has tap and doubletap, the doubletap is high level.
     *
     * @override
     */
    level: 2
});


/**
 * Swipe recognizer.
 *
 * @class
 */
function SwipeRecognizer() {
    Recognizer.apply(this, arguments);
}

SwipeRecognizer.prototype = fn.extend(create(Recognizer.prototype), {
    /**
     * Swipe has 5 events. Swipe and another event will be triggered every time.
     * @override
     */
    eventList: ['swipe', 'swipeup', 'swiperight', 'swipeleft', 'swipedown'],

    /**
     * The speed of finger.
     *
     * @type {number}
     */
    velocity: 0.03,

    /**
     * Minimum distance.
     *
     * @type {number}
     */
    distance: 30,

    /**
     * Time limit.
     *
     * @type {number}
     */
    duration: 1000,

    /**
     * @override
     */
    process(data) {
        if (data.pointers.length > 1 || data.deltaTime > this.duration) {
            return STATE_HOLD;
        }
        if (data.eventState === 'end') {
            if (data.velocity >= this.velocity && data.distance > this.distance) {
                return STATE_END;
            }
        }
    },

    /**
     * @override
     */
    emit(data) {
        if (this._state === STATE_END) {
            let dataSwipe = create(data);
            dataSwipe.type = 'swipe';
            dataSwipe.swipeDirection = DIRECTION_STR[data.direction];
            this.trigger(dataSwipe);

            let dataSwipeDir = create(data);
            dataSwipeDir.type = 'swipe' + DIRECTION_STR[data.direction];
            dataSwipeDir.swipeDirection = DIRECTION_STR[data.direction];
            this.trigger(dataSwipeDir);
        }
    }
});

Recognizer.register(TapRecognizer, 'tap');
Recognizer.register(DoubleTapRecognizer, 'doubletap');
Recognizer.register(SwipeRecognizer, 'swipe');

Recognizer.conflict(DoubleTapRecognizer, TapRecognizer);

export default Recognizer;
