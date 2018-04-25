/**
 * @file config.js
 * @author sfe-sy(sfe-sy@baidu.com)
 */

import {
    no,
    noop,
    identity
} from 'shared/util';

import {LIFECYCLE_HOOKS} from 'shared/constants';

export default ({

    /**
     * Option merge strategies (used in core/util/options)
     */
    optionMergeStrategies: Object.create(null),

    /**
   * Whether to suppress warnings.
   */
    silent: false,

    /**
   * Show production mode tip message on boot?
   */
    productionTip: process.env.NODE_ENV !== 'production',

    /**
   * Whether to enable devtools
   */
    devtools: process.env.NODE_ENV !== 'production',

    /**
   * Whether to record perf
   */
    performance: false,

    /**
   * Error handler for watcher errors
   */
    errorHandler: null,

    /**
   * Warn handler for watcher warns
   */
    warnHandler: null,

    /**
   * Ignore certain custom elements
   */
    ignoredElements: [],

    /**
   * Custom user key aliases for v-on
   */
    keyCodes: Object.create(null),

    /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
    isReservedTag: no,

    /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
    isReservedAttr: no,

    /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
    isUnknownElement: no,

    /**
   * Get the namespace of an element
   */
    getTagNamespace: noop,

    /**
   * Parse the real tag name for the specific platform.
   */
    parsePlatformTagName: identity,

    /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
    mustUseProp: no,

    /**
   * Exposed for legacy reasons
   */
    _lifecycleHooks: LIFECYCLE_HOOKS
})
