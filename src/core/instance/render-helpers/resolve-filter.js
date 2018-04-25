/**
 * @file resolve-filter.js
 * @author sfe-sy(sfe-sy@baidu.com)
 */

import {identity, resolveAsset} from 'core/util/index';

/**
 * Runtime helper for resolving filters
 */
export function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity;
}
