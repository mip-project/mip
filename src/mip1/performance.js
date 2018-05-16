'use strict';

import util from '../util';
import viewer from '../util/viewer';

var EventEmitter = util.EventEmitter;


/**
 * Store first-screen elements.
 * @inner
 */
var fsElements = [];

/**
 * Locked flag of fsElements.
 * @inner
 */
var fsElementsLocked = false;

/**
 * Start flag. This will be runned only once.
 * @inner
 */
var isStart = false;

/**
 * Record time.
 * @inner
 */
var recorder = {};

/**
 * Event for updating timing.
 * @inner
 */
var performanceEvent = new EventEmitter();

/**
 * Add first-screen element.
 * @param {HTMLElement} element
 */
function addFsElement(element) {
    if (!fsElementsLocked) {
        fsElements.push(element);
    }
}

/**
 * Remove element from fsElements.
 * @param {HTMLElement} element
 */
function removeFsElement(element) {
    var index = fsElements.indexOf(element);
    if (index != -1) {
        fsElements.splice(index, 1);
    }
}

/**
 * Get the timings.
 * @return {Object}
 */
function getTiming() {
    var nativeTiming;
    var performance = window.performance;
    if (performance && performance.timing) {
        nativeTiming = performance.timing.toJSON ?
            performance.timing.toJSON() :
            util.fn.extend({}, performance.timing);
    } else {
        nativeTiming = {};
    }
    return util.fn.extend(nativeTiming, recorder);
}

/**
 * Record timing by name.
 * @param {string} name Name of the timing.
 * @param {?number} timing
 */
function recordTiming(name, timing) {
    recorder[name] = parseInt(timing, 10) || Date.now();
    performanceEvent.trigger('update', getTiming());
}

/**
 * Try recording first-screen loaded.
 */
function tryRecordFirstScreen() {
    if (recorder.MIPFirstScreen) {
        return;
    }
    if (fsElements.length === 0) {
        recordTiming('MIPFirstScreen');
    }
}

/**
 * Record dom loaded timing.
 */
function domLoaded() {
    recordTiming('MIPDomContentLoaded');
    setTimeout(function () {
        fsElements = fsElements.filter(function (ele) {
            return ele.inViewport();
        });
        // Lock the fsElements. No longer add fsElements.
        fsElementsLocked = true;
        tryRecordFirstScreen();
    }, 10);
}

/**
 * First-element loaded.
 * @param {HTMLElement} element
 */
function fsElementLoaded(element) {
    removeFsElement(element);
    tryRecordFirstScreen();
}

/**
 * Start.
 * @param {number} startTiming The MIP start timing.
 */
function start(startTiming) {
    if (isStart) {
        return;
    }
    isStart = true;
    recordTiming('MIPStart', startTiming);
    viewer.on('show', function (showTiming) {
        recordTiming('MIPPageShow', showTiming);
    });

    if (document.readyState === 'complete') {
        domLoaded();
    } else {
        document.addEventListener('DOMContentLoaded', domLoaded, false);
    }
}

export default {
    start: start,
    addFsElement: addFsElement,
    fsElementLoaded: fsElementLoaded,
    getTiming: getTiming,
    on: function () {
        performanceEvent.on.apply(performanceEvent, arguments);
    }
};

