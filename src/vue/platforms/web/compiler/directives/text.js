/**
 * @file text.js
 * @author sfe-sy(sfe-sy@baidu.com)
 */

import {addProp} from 'compiler/helpers';

export default function text(el, dir) {
    if (dir.value) {
        addProp(el, 'textContent', `_s(${dir.value})`);
    }
}
